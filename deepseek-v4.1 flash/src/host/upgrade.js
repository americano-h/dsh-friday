import { randomUUID } from 'node:crypto'
import { readConversation, textOf } from './sessions.js'

const locks = new Set()

export function localSummary(conversation) {
  const messages = conversation.messages || []
  const recent = messages.slice(-24)
  const lines = [
    `Inbox conversation: ${conversation.title || conversation.firstPrompt || '(untitled)'}`,
    `Started: ${new Date(conversation.createdAt).toISOString()}`,
    '',
  ]
  for (const message of recent) {
    const role = message.role === 'assistant' ? 'Assistant' : 'User'
    let text = message.text || ''
    if (text.length > 1600) text = `${text.slice(0, 1600)}…`
    if (text) lines.push(`${role}: ${text}`)
    if (message.images?.length) lines.push(`(${message.images.length} image${message.images.length > 1 ? 's' : ''} attached)`)
    if (message.citations?.length) lines.push(`Sources: ${message.citations.slice(0, 6).map((citation) => citation.url).join(', ')}`)
    lines.push('')
  }
  return lines.join('\n').trim()
}

function transcriptOf(conversation) {
  const lines = []
  for (const message of conversation.messages || []) {
    const role = message.role === 'assistant' ? 'Assistant' : 'User'
    const text = (message.text || '').slice(0, 4000)
    if (text) lines.push(`${role}: ${text}`)
    if (message.images?.length) lines.push(`(${message.images.length} image${message.images.length > 1 ? 's' : ''} attached)`)
    if (message.citations?.length) lines.push(`Sources: ${message.citations.slice(0, 6).map((citation) => citation.url).join(', ')}`)
  }
  return lines.join('\n').slice(-16000)
}

async function summarizeWithModel(ctx, conversation, logger) {
  const selection = conversation.model || ctx.get('agentDefaultModel')?.currentSelection()
  if (!selection?.provider || !selection?.model) return ''
  const transcript = transcriptOf(conversation)
  if (!transcript) return ''
  let text = ''
  try {
    for await (const chunk of ctx.llm.stream({
      provider: selection.provider,
      model: selection.model,
      system: 'Compress the following Inbox conversation into a dense handoff brief. Preserve the user goal, decisions, constraints, unresolved questions, important facts, and source URLs. Omit pleasantries and repeated formatting. Use short sections.',
      messages: [{ role: 'user', content: [{ type: 'text', text: transcript }] }],
      maxTokens: 2000,
    })) {
      if (chunk.type === 'text-delta') text += chunk.text
      if (chunk.type === 'finish' && (chunk.reason.kind === 'error' || chunk.reason.kind === 'aborted')) {
        throw new Error(chunk.reason.failure?.message || 'summarization failed')
      }
    }
  } catch (error) {
    logger.warn(`dsh-friday: model summarization failed, using local summary: ${String(error)}`)
    return ''
  }
  return text.trim()
}

async function compressConversation(ctx, conversation, logger) {
  const text = await summarizeWithModel(ctx, conversation, logger)
  if (text) return { text, method: 'model' }
  return { text: localSummary(conversation), method: 'local' }
}

function upgradePrompt(summary, conversation) {
  return [
    'A lightweight Inbox conversation was upgraded into this workspace task.',
    'Use the compressed context below as the starting point. It may omit details; do not invent facts that are not present.',
    'Continue the work with the full toolset. First restate the concrete goal in one sentence, then proceed.',
    '',
    '--- compressed Inbox context ---',
    summary,
    '--- end compressed context ---',
    '',
    conversation.title ? `Original title: ${conversation.title}` : '',
  ].filter(Boolean).join('\n')
}

export async function upgradeConversation(ctx, store, indexer, sessionId, workspaceId, logger) {
  if (locks.has(sessionId)) throw new Error('This conversation is already being upgraded')
  locks.add(sessionId)
  try {
    const conv = await readConversation(ctx, store, sessionId)
    if (!conv) throw new Error('Conversation not found in Inbox')
    if (conv.archived) throw new Error('This conversation is archived and cannot be upgraded again')
    const entry = store.get().sessions?.[sessionId]
    if (entry?.upgradedSessionId) {
      try {
        await ctx.sessionQuery.readSession(entry.upgradedSessionId)
        await ctx.workspaceRegistry.archiveSession(sessionId, { stopActivity: true }).catch(() => {})
        return { sessionId: entry.upgradedSessionId, workspaceId: entry.upgradedWorkspaceId || workspaceId, method: 'existing' }
      } catch {
        // The recorded task disappeared; clear the stale marker and upgrade again.
      }
    }
    const workspace = ctx.workspaceRegistry.get(workspaceId)
    if (!workspace) throw new Error('Workspace not found')

    const summary = await compressConversation(ctx, conv, logger)
    if (!summary.text) throw new Error('Could not build a compressed context')

    const created = await ctx.sessionController.create({ workspaceId })
    const taskSessionId = created.sessionId
    try {
      // Record the association before the task starts so a crash cannot produce an
      // untracked duplicate on retry.
      await store.update((current) => {
        const sessions = { ...(current.sessions || {}) }
        sessions[sessionId] = {
          ...(sessions[sessionId] || {}),
          upgradedSessionId: taskSessionId,
          upgradedWorkspaceId: workspaceId,
          upgradedAt: Date.now(),
        }
        return { ...current, version: 1, sessions }
      })
      await indexer.flushNow()

      const requestId = randomUUID()
      await ctx.sessionController.prompt({
        sessionId: taskSessionId,
        requestId,
        mode: 'queue',
        content: [{ type: 'text', text: upgradePrompt(summary.text, conv) }],
      }, new AbortController().signal)
      await ctx.workspaceRegistry.archiveSession(sessionId, { stopActivity: true })
      indexer.markArchived(sessionId, true)
      await indexer.flushNow()
      return { sessionId: taskSessionId, workspaceId, method: summary.method }
    } catch (error) {
      logger.warn(`dsh-friday: upgrade failed after creating task ${taskSessionId}: ${String(error)}`)
      try {
        await store.update((current) => {
          const sessions = { ...(current.sessions || {}) }
          if (sessions[sessionId]?.upgradedSessionId === taskSessionId) {
            const { upgradedSessionId, upgradedWorkspaceId, upgradedAt, ...rest } = sessions[sessionId]
            sessions[sessionId] = rest
          }
          return { ...current, version: 1, sessions }
        })
      } catch {}
      throw error
    }
  } finally {
    locks.delete(sessionId)
  }
}
