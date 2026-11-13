import { randomUUID } from 'node:crypto'

function transcriptOf(conversation) {
  return conversation.messages.map((message) => {
    const images = message.images?.length ? `\n[${message.images.length} image attachment(s) were supplied in this turn.]` : ''
    const citations = message.citations?.length
      ? `\nSources:\n${message.citations.map((source) => `- ${source.title || source.url}: ${source.url}`).join('\n')}`
      : ''
    return `## ${message.role === 'user' ? 'User' : 'Assistant'}\n${message.text || '[No text]'}${images}${citations}`
  }).join('\n\n')
}

async function generate(ctx, selection, prompt, maxTokens = 1800) {
  let text = ''
  let failure
  for await (const chunk of ctx.llm.stream({
    provider: selection.provider,
    model: selection.model,
    messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
    maxTokens,
  })) {
    if (chunk.type === 'text-delta') text += chunk.text
    if (chunk.type === 'finish' && ['error', 'aborted'].includes(chunk.reason.kind)) {
      failure = chunk.reason.failure?.message || `Summary request ${chunk.reason.kind}`
    }
  }
  if (failure) throw new Error(failure)
  if (!text.trim()) throw new Error('The model returned an empty task summary')
  return text.trim()
}

export async function compressConversation(ctx, conversation, selection) {
  if (!selection?.provider || !selection?.model) throw new Error('No model is available for context compression')
  const transcript = transcriptOf(conversation)
  if (!transcript.trim()) throw new Error('This conversation has no content to upgrade')
  const instructions = `Compress this quick-answer conversation into reusable context for a full DSH workspace task.
Write in the user's language. Preserve the actual goal, constraints, decisions, important facts, source URLs, and unfinished next steps.
Do not invent repository facts or claim that any files or commands were accessed. Distinguish established facts from suggestions.
Return only a concise, self-contained Markdown brief titled "Task brief"; do not answer the original question again or start the task.

CONVERSATION:
`
  if (transcript.length <= 36000) return generate(ctx, selection, instructions + transcript)
  const chunks = []
  for (let offset = 0; offset < transcript.length; offset += 24000) chunks.push(transcript.slice(offset, offset + 24000))
  const partials = []
  for (let index = 0; index < chunks.length; index += 1) {
    partials.push(await generate(ctx, selection, `${instructions}\nThis is part ${index + 1} of ${chunks.length}; retain its unique facts for a later merge.\n\n${chunks[index]}`, 1200))
  }
  return generate(ctx, selection, `${instructions}\nMerge these partial briefs without duplication:\n\n${partials.join('\n\n---\n\n')}`)
}

function normalizeSummary(value) {
  if (typeof value !== 'string' || !value.trim()) throw new Error('Compressed context is required. Generate and review it before creating the task.')
  const summary = value.trim()
  if (summary.length > 100000) throw new Error('Compressed context is limited to 100,000 characters')
  return summary
}

export const CONTEXT_PREFIX = 'Context carried over from a Friday Inbox conversation. Treat it as background for this workspace task, and wait for my next instruction before acting.'

/**
 * One completed, model-free turn carrying the reviewed brief. A seeded turn
 * makes the task non-blank (visible in its Workspace, rendered as the first
 * user message, part of model history) without waking the Agent, unlike
 * Agent.inject (pending next-step input, blank Session) or followup/prompt.
 * @param {string} brief reviewed compressed context.
 * @param {number} now event timestamp.
 * @returns {Array<object>} contiguous seed events starting at seq 0.
 */
export function taskSeed(brief, now = Date.now()) {
  return [
    { type: 'turn/start', seq: 0, time: now, data: { turn: 1 } },
    {
      type: 'user/message',
      seq: 1,
      time: now,
      data: {
        id: randomUUID(),
        role: 'user',
        content: [{ type: 'text', text: `${CONTEXT_PREFIX}\n\n${brief}` }],
        source: { kind: 'user' },
      },
      surfaceOp: 'append',
    },
    { type: 'turn/end', seq: 2, time: now, data: { turn: 1, reason: { kind: 'completed' } } },
  ]
}

async function sessionExists(ctx, id) {
  try {
    await ctx.sessionQuery.readSession(id)
    return true
  } catch {
    return false
  }
}

/** Write the seeded task Session in the Workspace directory, then release Friday's temporary Agent. */
async function createTaskSession(ctx, { taskId, workspace, brief, selection }) {
  const presets = typeof ctx.get === 'function' ? ctx.get('agentPresets') : undefined
  const agentPreset = presets ? (await presets.resolve()).id : undefined
  const handle = await ctx.agents.create({
    sessionId: taskId,
    seed: taskSeed(brief),
    agentOptions: selection || {},
    meta: { cwd: workspace.path, ...(agentPreset ? { agentPreset } : {}) },
  })
  try {
    await ctx.sessions.flush(handle.agent.session)
  } finally {
    // DSH's session controller resumes it with the full preset below.
    await handle.dispose()
  }
}

/** Attach the task to its Workspace and hand it to DSH's session controller. */
async function publishTask(ctx, { taskId, workspace, title }) {
  await workspace.attachSession(taskId)
  const resolved = await ctx.sessionController.resolveAgent(taskId)
  if (!resolved?.agent) throw new Error(resolved?.error?.message || 'The new task could not be opened')
  const titles = typeof ctx.get === 'function' ? ctx.get('sessionTitle') : undefined
  if (title && titles) {
    try { titles.rename(resolved.agent.session, title) } catch (error) {
      ctx.logger?.warn?.(`dsh-friday: task title was not set: ${String(error)}`)
    }
  }
  return resolved.agent
}

export function createUpgradeService(ctx, repository, readConfig, configStore, defaultSelection) {
  const locks = new Map()

  async function preview(sessionId) {
    const source = await repository.get(sessionId)
    if (!source || source.deleted) throw new Error('Conversation not found')
    if (source.upgradedSessionId) {
      if (source.upgradeState === 'creating' && source.upgradeSummary) return { summary: source.upgradeSummary }
      throw new Error('This conversation was already upgraded and cannot be upgraded again')
    }
    if (source.archived) throw new Error('An archived conversation cannot be upgraded again')
    const sourceAgent = ctx.agents.get(sessionId)
    if (sourceAgent?.status === 'running') throw new Error('Stop generation before upgrading this conversation')
    const config = await readConfig(configStore)
    const selection = source.defaultModel || defaultSelection(ctx, config)
    return { summary: await compressConversation(ctx, source, selection) }
  }

  async function archiveSource(sessionId, source, taskId) {
    if (!source.archived) {
      try {
        await ctx.workspaceRegistry.archiveSession(sessionId, { stopActivity: true })
      } catch (error) {
        // Keep the mapping: the next request finishes archival instead of creating a duplicate task.
        throw new Error(`Task ${taskId} was created, but source archival failed: ${String(error)}`)
      }
      await repository.update(sessionId, { archivedAt: source.archivedAt || Date.now() })
    }
    // A loaded Friday Session would stay listed in DSH's Ungrouped bucket and block deletion.
    await repository.release?.(sessionId, { force: true })
  }

  async function upgrade(sessionId, workspaceId, summary) {
    if (locks.has(sessionId)) return locks.get(sessionId)
    const operation = (async () => {
      const source = await repository.get(sessionId)
      if (!source || source.deleted) throw new Error('Conversation not found')
      const workspace = ctx.workspaceRegistry.get(source.upgradedWorkspaceId || workspaceId)
      if (!workspace) throw new Error('The selected workspace no longer exists')
      if (await workspace.status() !== 'ok') throw new Error('The selected workspace directory is unavailable')

      if (source.upgradedSessionId) {
        // Finished upgrades are final; only an interrupted one is resumed.
        if (source.archived && source.upgradeState === 'published') {
          throw new Error('This conversation was already upgraded and cannot be upgraded again')
        }
        const taskId = source.upgradedSessionId
        if (!await sessionExists(ctx, taskId)) {
          if (source.upgradeState !== 'creating') throw new Error('The upgraded task no longer exists')
          const brief = normalizeSummary(summary || source.upgradeSummary)
          await createTaskSession(ctx, { taskId, workspace, brief, selection: ctx.agentDefaultModel?.currentSelection?.() })
        }
        await publishTask(ctx, { taskId, workspace, title: source.title })
        await repository.update(sessionId, { upgradeState: 'published', upgradeSummary: '' })
        await archiveSource(sessionId, source, taskId)
        return { sessionId: taskId, workspaceId: workspace.id || workspaceId, existing: true }
      }
      if (source.archived) throw new Error('An archived conversation cannot be upgraded again')
      const sourceAgent = ctx.agents.get(sessionId)
      if (sourceAgent?.status === 'running') throw new Error('Stop generation before upgrading this conversation')
      const brief = normalizeSummary(summary || source.upgradeSummary)

      const taskId = `session-${randomUUID()}`
      await repository.update(sessionId, {
        upgradedSessionId: taskId,
        upgradedWorkspaceId: workspaceId,
        upgradedAt: Date.now(),
        upgradeState: 'creating',
        upgradeSummary: brief,
        upgradeSummaryBytes: brief.length,
      })
      await createTaskSession(ctx, { taskId, workspace, brief, selection: ctx.agentDefaultModel?.currentSelection?.() })
      await publishTask(ctx, { taskId, workspace, title: source.title })
      await repository.update(sessionId, { upgradeState: 'published', upgradeSummary: '' })
      await archiveSource(sessionId, source, taskId)
      await repository.refresh(sessionId)
      return { sessionId: taskId, workspaceId, summary: brief, existing: false }
    })()
    locks.set(sessionId, operation)
    try {
      return await operation
    } finally {
      locks.delete(sessionId)
    }
  }

  return { preview, upgrade, locks }
}
