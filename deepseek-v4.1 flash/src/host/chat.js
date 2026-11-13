import { INBOX_DIR, isInboxCwd } from './paths.js'
import {
  citationsOf,
  createInboxSession,
  describeImages,
  ensureAgent,
  listInbox,
  readConversation,
  readTitle,
  saveImages,
  selectModel,
  sendPrompt,
  textOf,
} from './sessions.js'
import { effectiveDefaultModel, supportsImages } from './config.js'

function writeEvent(res, payload) {
  if (res.writableEnded) return
  res.write(`data: ${JSON.stringify(payload)}\n\n`)
}

function modelOf(ctx, agent, config) {
  try {
    const current = agent.model?.current?.()
    if (current?.provider && current?.model) return current
  } catch {}
  return effectiveDefaultModel(ctx, config)
}

export function createChatRuntime(ctx, configStore, store, indexer, logger) {
  const active = new Map()

  ctx.effect(() => () => {
    for (const entry of active.values()) {
      try {
        entry.fail?.('plugin unloaded')
        entry.abort.abort()
      } catch {}
    }
    active.clear()
  }, 'dsh-friday: chat teardown')

  async function streamChat(req, res, body, config) {
    if (body.regenerate) {
      throw new Error('Regenerate is not available in this version')
    }
    const text = typeof body.text === 'string' ? body.text.trim() : ''
    const images = Array.isArray(body.images) ? body.images : []
    if (!text && images.length === 0) throw new Error('Message is empty')

    let sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''
    let agent
    if (!sessionId) {
      const created = await createInboxSession(ctx, config, logger)
      sessionId = created.sessionId
      agent = created.agent
    } else {
      agent = await ensureAgent(ctx, sessionId)
      if (!isInboxCwd(agent.session?.header?.cwd)) throw new Error('Session is not an Inbox conversation')
    }
    if (active.has(sessionId)) throw new Error('This conversation is already generating')
    if (agent.status === 'running') throw new Error('This conversation is still running')
    const existing = await readConversation(ctx, store, sessionId)
    if (existing?.archived) throw new Error('This conversation is archived and cannot be continued')
    if (existing?.upgraded) throw new Error('This conversation was upgraded to a task and cannot be continued')

    const selection = modelOf(ctx, agent, config) || effectiveDefaultModel(ctx, config)
    selectModel(agent, selection)
    if (selection) {
      try {
        await store.update((current) => {
          const sessions = { ...(current.sessions || {}) }
          sessions[sessionId] = { ...(sessions[sessionId] || {}), model: selection, updatedAt: Date.now() }
          return { ...current, version: 1, sessions }
        })
      } catch {}
    }

    const controller = new AbortController()
    const entry = { abort: controller, sessionId }
    active.set(sessionId, entry)

    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    })
    res.write('retry: 1000\n\n')

    let finished = false
    let closed = false
    let streamedText = ''
    let citations = []
    let keepAlive = null
    let disposers = []

    const cleanup = () => {
      if (keepAlive) clearInterval(keepAlive)
      keepAlive = null
      for (const dispose of disposers) {
        try { dispose() } catch {}
      }
      disposers = []
      active.delete(sessionId)
    }

    const finish = async (extra = {}) => {
      if (finished) return
      finished = true
      cleanup()
      let title = ''
      try { title = await readTitle(ctx, sessionId) } catch {}
      if (!title) {
        const conv = await readConversation(ctx, store, sessionId).catch(() => null)
        title = conv?.title || ''
      }
      if (title || selection) {
        try {
          await store.update((current) => {
            const sessions = { ...(current.sessions || {}) }
            const prev = sessions[sessionId] || {}
            sessions[sessionId] = { ...prev, ...(title ? { title } : {}), ...(selection ? { model: selection } : {}), updatedAt: Date.now() }
            return { ...current, version: 1, sessions }
          })
        } catch {}
      }
      writeEvent(res, { type: 'title', title })
      writeEvent(res, { type: 'done', sessionId, title, text: streamedText, citations, ...extra })
      if (!res.writableEnded) res.end()
    }

    const fail = async (message) => {
      if (finished) return
      finished = true
      cleanup()
      writeEvent(res, { type: 'error', sessionId, message })
      if (!res.writableEnded) res.end()
    }
    entry.fail = fail

    const onStream = ({ agent: eventAgent, frame }) => {
      if (closed || !eventAgent || eventAgent.id !== sessionId || !frame) return
      if (frame.type === 'chunk') {
        const chunk = frame.chunk
        if (!chunk) return
        if (chunk.type === 'text-delta' && chunk.text) {
          streamedText += chunk.text
          writeEvent(res, { type: 'delta', text: chunk.text })
        } else if (chunk.type === 'reasoning-delta' && chunk.text) {
          writeEvent(res, { type: 'reasoning', text: chunk.text })
        } else if (chunk.type === 'tool-call-delta' && chunk.name) {
          writeEvent(res, { type: 'tool', name: chunk.name })
        }
      }
    }

    const onEvent = (session, event) => {
      if (closed || !session || session.id !== sessionId) return
      if (event.type === 'tool/result') {
        const next = citationsOf(event.data?.meta)
        if (next.length) {
          const merged = new Map([...citations, ...next].map((value) => [value.url, value]))
          citations = [...merged.values()]
          writeEvent(res, { type: 'citations', sources: citations })
        }
        return
      }
      if (event.type === 'turn/end') {
        const reason = event.data?.reason
        if (reason?.kind === 'error') {
          fail(reason.error?.message || 'Model request failed')
        } else if (reason?.kind === 'aborted') {
          finish({ aborted: true })
        } else {
          finish()
        }
      }
    }

    try {
      const disposer1 = agent.ctx.on('agent/assistant-stream', onStream)
      const disposer2 = ctx.on('session/event', onEvent)
      const disposer3 = ctx.on('agent/error', (payload) => {
        if (payload?.agent?.id === sessionId) fail(payload.error?.message || 'Agent failed')
      })
      disposers = [disposer1, disposer2, disposer3]
    } catch (error) {
      await fail(String(error))
      return
    }

    keepAlive = setInterval(() => {
      if (!res.writableEnded) res.write(': keepalive\n\n')
    }, 15000)

    res.on('close', () => {
      // Generation continues and persists even when the overlay is collapsed.
      closed = true
      cleanup()
    })

    writeEvent(res, {
      type: 'meta',
      sessionId,
      title: (store.get().sessions?.[sessionId]?.title) || '',
      model: selection || null,
    })

    try {
      const refs = await saveImages(ctx, images)
      if (closed || res.destroyed) return
      let promptText = text
      let promptImages = refs
      const supports = await supportsImages(ctx, selection)
      if (refs.length && !supports) {
        if (!config.visionModel) throw new Error('No vision model is configured. Add one in Inbox settings.')
        const descriptions = await describeImages(ctx, config, refs)
        promptText = `${promptText}\n\n${descriptions}`.trim()
        promptImages = []
        await store.update((current) => {
          const sessions = { ...(current.sessions || {}) }
          const prev = sessions[sessionId] || {}
          sessions[sessionId] = {
            ...prev,
            hasImage: true,
            imageRefs: [...(prev.imageRefs || []), ...refs.map((attachment) => ({ attachment, at: Date.now() }))].slice(-20),
          }
          return { ...current, version: 1, sessions }
        })
      }
      if (!promptText) promptText = 'Describe the attached image.'
      const content = [
        { type: 'text', text: promptText },
        ...promptImages.map((attachment) => ({ type: 'image', attachment, encodedBytes: attachment.bytes })),
      ]
      await sendPrompt(ctx, sessionId, content, body.clientTimeZone)
    } catch (error) {
      logger.warn(`dsh-friday: chat failed: ${String(error)}`)
      await fail(error?.message || 'Chat failed')
    }
  }

  function cancel(sessionId) {
    const agent = ctx.agents.get(sessionId)
    if (!agent) return false
    try {
      ctx.sessionController.cancel({ sessionId })
      return true
    } catch {
      try {
        agent.cancel({ kind: 'user' }, { keepInbox: true })
        return true
      } catch {
        return false
      }
    }
  }

  return { streamChat, cancel, active }
}

export { INBOX_DIR }
