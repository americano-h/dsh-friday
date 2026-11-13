import { randomUUID } from 'node:crypto'
import { defaultSelection, supportsImages } from './config.js'
import { saveImages } from './images.js'
import { citationsOf } from './sessions.js'

function sse(res, value) {
  if (!res.writableEnded && !res.destroyed) res.write(`data: ${JSON.stringify(value)}\n\n`)
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error || 'Unknown error')
}

/** Build one complete UserMessage; Agent.followup persists the input verbatim. */
export function userMessage(content, source) {
  return { id: randomUUID(), role: 'user', content, source }
}

export function createChatRuntime(ctx, repository, configStore, readConfig, isPublishing = () => false) {
  const active = new Map()

  const starting = new Set()
  function busy(id) { return starting.has(id) || active.has(id) }

  async function start(request) {
    const id = request.body.sessionId
    if (id && (busy(id) || isPublishing(id))) throw new Error('This conversation is already generating or upgrading')
    if (id) starting.add(id)
    try { return await prepare(request) }
    finally { if (id) starting.delete(id) }
  }

  async function prepare({ res, body, regenerate = false }) {
    let sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''
    const config = await readConfig(configStore)
    let conversation = sessionId ? await repository.get(sessionId) : null
    if (sessionId && !conversation) throw new Error('Conversation not found')
    if (conversation?.deleted) throw new Error('Conversation was deleted')
    if (conversation?.archived || conversation?.upgraded) throw new Error('An archived conversation cannot be continued')
    if (regenerate && !conversation?.messages.some((message) => message.role === 'assistant')) {
      throw new Error('There is no answer to regenerate')
    }
    const text = regenerate ? '' : typeof body.text === 'string' ? body.text.trim() : ''
    const images = regenerate ? [] : Array.isArray(body.images) ? body.images : []
    if (!regenerate && !text && !images.length) throw new Error('Write a question or attach an image')
    if (text.length > 32000) throw new Error('A quick question is limited to 32,000 characters')

    let selection = conversation?.defaultModel || defaultSelection(ctx, config)
    if (!selection) throw new Error('No default model is available. Choose one in the Friday plugin settings.')
    // Reserve before resuming so idle release cannot dispose the Agent under this request.
    let unreserve = sessionId ? repository.reserve(sessionId) : null
    let agent
    try {
      agent = sessionId ? await repository.ensureAgent(sessionId) : await repository.create(selection)
    } catch (error) {
      unreserve?.()
      throw error
    }
    sessionId = agent.id
    unreserve ||= repository.reserve(sessionId)
    try {
      return await serve({ res, agent, sessionId, conversation, config, selection, text, images, regenerate, unreserve })
    } catch (error) {
      unreserve()
      throw error
    }
  }

  async function serve({ res, agent, sessionId, conversation, config, selection, text, images, regenerate, unreserve }) {
    if (active.has(sessionId) || agent.status === 'running') throw new Error('This conversation is already generating')
    conversation = await repository.get(sessionId)

    const refs = await saveImages(ctx, images)
    if (refs.length && !await supportsImages(ctx, selection)) {
      if (!config.visionModel || !await supportsImages(ctx, config.visionModel)) {
        throw new Error('This model cannot read images. Configure a working vision model in the Friday plugin settings.')
      }
      selection = config.visionModel
    }
    agent.model.select(selection)
    await repository.update(sessionId, { model: selection, hasImage: Boolean(conversation?.hasImage || refs.length) })

    const controller = new AbortController()
    const state = { sessionId, controller, fail: null }
    active.set(sessionId, state)
    let settled = false
    state.liveText = ''
    let streamedText = ''
    let citations = []
    let disposers = []
    let keepAlive

    const cleanup = () => {
      clearInterval(keepAlive)
      for (const dispose of disposers.splice(0)) {
        try { dispose() } catch {}
      }
      if (active.get(sessionId) === state) active.delete(sessionId)
      // The Agent is released by the repository once it is idle.
      unreserve()
    }

    const finish = async (extra = {}) => {
      if (settled) return
      settled = true
      cleanup()
      try {
        await ctx.sessions.flush(agent.session)
        conversation = await repository.refresh(sessionId)
      } catch (error) {
        ctx.logger.warn(`dsh-friday: completion flush failed for ${sessionId}: ${errorMessage(error)}`)
      }
      sse(res, {
        type: 'done',
        sessionId,
        title: conversation?.title || '',
        text: streamedText,
        citations,
        conversation,
        ...extra,
      })
      if (!res.writableEnded) res.end()
    }

    const fail = async (error) => {
      if (settled) return
      settled = true
      cleanup()
      try { await repository.refresh(sessionId) } catch {}
      sse(res, { type: 'error', sessionId, message: errorMessage(error) })
      if (!res.writableEnded) res.end()
    }
    state.fail = fail

    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    })
    res.write('retry: 1500\n\n')

    disposers = [
      agent.ctx.on('agent/assistant-stream', ({ agent: source, frame }) => {
        if (source?.id !== sessionId || frame?.type !== 'chunk') return
        const chunk = frame.chunk
        if (chunk?.type === 'text-delta' && chunk.text) {
          streamedText += chunk.text
          state.liveText = streamedText
          sse(res, { type: 'delta', text: chunk.text })
        } else if (chunk?.type === 'reasoning-delta' && chunk.text) {
          sse(res, { type: 'reasoning', text: chunk.text })
        } else if (chunk?.type === 'tool-call-delta' && chunk.name) {
          sse(res, { type: 'tool', name: chunk.name })
        }
      }),
      ctx.on('session/event', (session, event) => {
        if (session?.id !== sessionId) return
        if (event.type === 'tool/result') {
          const next = citationsOf(event.data?.meta)
          if (next.length) {
            citations = [...new Map([...citations, ...next].map((item) => [item.url, item])).values()]
            sse(res, { type: 'citations', sources: citations })
          }
        } else if (event.type === 'turn/end') {
          const reason = event.data?.reason
          if (reason?.kind === 'error') void fail(reason.error?.message || 'Model request failed')
          else if (reason?.kind === 'aborted') void finish({ aborted: true })
          else void finish()
        }
      }),
      agent.ctx.on('agent/error', ({ agent: source, error }) => {
        if (source?.id === sessionId) void fail(error)
      }),
    ]

    keepAlive = setInterval(() => {
      if (!res.writableEnded && !res.destroyed) res.write(': keepalive\n\n')
    }, 15000)
    if (typeof keepAlive.unref === 'function') keepAlive.unref()

    // The host owns generation until turn/end, even when both views disconnect.

    sse(res, { type: 'meta', sessionId, model: selection, regenerate })
    try {
      if (regenerate) {
        agent.followup(userMessage(
          [{ type: 'text', text: 'Regenerate the answer to the most recent user question. Improve accuracy and clarity, and do not mention this regeneration instruction.' }],
          { kind: 'dsh-friday.regenerate' },
        ))
      } else {
        const content = [
          { type: 'text', text: text || 'Describe the attached image or images and answer any evident question about them.' },
          ...refs.map((attachment) => ({ type: 'image', attachment })),
        ]
        agent.followup(userMessage(content, { kind: 'user' }))
      }
    } catch (error) {
      await fail(error)
    }
  }

  function cancel(sessionId) {
    const agent = ctx.agents.get(sessionId)
    if (!agent) return false
    agent.cancel({ kind: 'user' })
    return true
  }

  ctx.effect(() => () => {
    for (const state of active.values()) {
      try { state.fail?.('Friday plugin is reloading') } catch {}
      state.controller.abort()
    }
    active.clear()
  }, 'dsh-friday: chat teardown')

  return { start, cancel, active, busy }
}
