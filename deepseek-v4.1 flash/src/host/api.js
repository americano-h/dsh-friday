import { cleanupRetention } from './inbox.js'
import { INBOX_DIR } from './paths.js'
import { effectiveDefaultModel, listModelOptions, readConfig, saveConfig, supportsImages } from './config.js'
import { isInboxSessionId, listInbox, readAttachment, readConversation } from './sessions.js'
import { upgradeConversation } from './upgrade.js'

const PREFIX = '/dsh-friday/api/v1'

function json(res, status, value) {
  if (res.writableEnded) return
  const body = JSON.stringify(value)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  })
  res.end(body)
}

function fail(res, status, message) {
  json(res, status, { error: message })
}

async function readJson(req, limit = 64 * 1024 * 1024) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > limit) throw new Error('Request body is too large')
    chunks.push(chunk)
  }
  if (chunks.length === 0) return {}
  const text = Buffer.concat(chunks).toString('utf8')
  if (!text.trim()) return {}
  return JSON.parse(text)
}

function isAllowedRequest(ctx, req) {
  if (req.headers['x-dsh-friday'] !== '1') return false
  try {
    if (ctx.connection !== undefined && ctx.connection.requestRejection(req) !== undefined) return false
  } catch {
    return false
  }
  return true
}

function decodeId(value) {
  try { return decodeURIComponent(value) } catch { return value }
}

export function createApi(ctx, { configStore, store, indexer, chat, logger }) {
  async function handleConfig(_req, res) {
    const config = await readConfig(configStore)
    const models = await listModelOptions(ctx)
    const defaultModel = effectiveDefaultModel(ctx, config)
    const defaultSupportsImages = await supportsImages(ctx, defaultModel)
    const index = store.get().sessions || {}
    const recent = Object.entries(index)
      .filter(([, entry]) => !entry.deletedAt)
      .map(([id, entry]) => ({ id, title: entry.title || entry.firstPrompt || '', updatedAt: entry.updatedAt || 0 }))
      .sort((a, b) => b.updatedAt - a.updatedAt)[0] || null
    json(res, 200, {
      config: {
        ...config,
        defaultModel: defaultModel || config.defaultModel,
      },
      models,
      defaultSupportsImages,
      visionAvailable: Boolean(config.visionModel),
      inboxDir: INBOX_DIR,
      recent,
    })
  }

  async function handleSaveConfig(req, res) {
    const body = await readJson(req)
    const config = await saveConfig(configStore, body)
    json(res, 200, { config })
  }

  async function handleInbox(req, res, url) {
    const query = url.searchParams.get('q') || ''
    const status = url.searchParams.get('status') || 'active'
    const limit = Number(url.searchParams.get('limit')) || 100
    const items = await listInbox(ctx, store, { query, status, limit })
    json(res, 200, { items })
  }

  async function handleConversation(_req, res, id) {
    const conversation = await readConversation(ctx, store, id)
    if (!conversation) return fail(res, 404, 'Conversation not found')
    try {
      await store.update((current) => {
        const sessions = { ...(current.sessions || {}) }
        sessions[id] = {
          ...(sessions[id] || {}),
          title: conversation.title,
          firstPrompt: conversation.firstPrompt,
          hasImage: conversation.hasImage,
          model: conversation.model,
          updatedAt: conversation.updatedAt,
        }
        return { ...current, version: 1, sessions }
      })
    } catch {}
    const entry = store.get().sessions?.[id]
    const groups = new Map()
    for (const item of entry?.imageRefs || []) {
      const key = String(item.at || 0)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(item)
    }
    for (const [at, items] of groups) {
      const candidate = conversation.messages
        .filter((message) => message.role === 'user' && !message.images?.length)
        .sort((a, b) => Math.abs((a.at || 0) - Number(at)) - Math.abs((b.at || 0) - Number(at)))[0]
      if (candidate) candidate.images = items.map((item) => ({ attachment: item.attachment }))
    }
    json(res, 200, { conversation })
  }

  async function handleArchive(req, res, id) {
    if (!await isInboxSessionId(ctx, id)) return fail(res, 404, 'Conversation not found')
    const body = await readJson(req)
    const archived = Boolean(body.archived)
    if (!archived && store.get().sessions?.[id]?.upgradedSessionId) {
      return fail(res, 409, 'An upgraded conversation cannot be restored to the active Inbox')
    }
    if (archived) await ctx.workspaceRegistry.archiveSession(id, { stopActivity: true })
    else await ctx.workspaceRegistry.unarchiveSession(id)
    indexer.markArchived(id, archived)
    await indexer.flushNow()
    json(res, 200, { archived })
  }

  async function handleDelete(_req, res, id) {
    if (!await isInboxSessionId(ctx, id)) return fail(res, 404, 'Conversation not found')
    try {
      await ctx.workspaceRegistry.archiveSession(id, { stopActivity: true })
    } catch {}
    indexer.markDeleted(id)
    await indexer.flushNow()
    json(res, 200, { deleted: true })
  }

  async function handleClear(_req, res) {
    const items = await listInbox(ctx, store, { status: 'active', limit: 5000 })
    let count = 0
    for (const item of items) {
      try {
        await ctx.workspaceRegistry.archiveSession(item.id, { stopActivity: true })
        indexer.markDeleted(item.id)
        count += 1
      } catch (error) {
        logger.warn(`dsh-friday: clear failed for ${item.id}: ${String(error)}`)
      }
    }
    await indexer.flushNow()
    json(res, 200, { count })
  }

  async function handleCleanup(_req, res) {
    const config = await readConfig(configStore)
    const count = await cleanupRetention(ctx, store, config, logger)
    await indexer.flushNow()
    json(res, 200, { count })
  }

  async function handleWorkspaces(_req, res) {
    const workspaces = ctx.workspaceRegistry.list().map((workspace) => ({
      id: workspace.id,
      title: workspace.title,
      path: workspace.path,
      sessionCount: workspace.sessionIds.length,
    }))
    json(res, 200, { workspaces })
  }

  async function handleUpgrade(req, res) {
    const body = await readJson(req)
    if (typeof body.sessionId !== 'string' || typeof body.workspaceId !== 'string') {
      return fail(res, 400, 'sessionId and workspaceId are required')
    }
    const result = await upgradeConversation(ctx, store, indexer, body.sessionId, body.workspaceId, logger)
    json(res, 200, result)
  }

  async function handleAttachment(_req, res, sessionId, attachmentId) {
    if (!await isInboxSessionId(ctx, sessionId)) return fail(res, 404, 'Attachment not found')
    let value = await readAttachment(ctx, sessionId, attachmentId)
    if (!value) {
      const ref = (store.get().sessions?.[sessionId]?.imageRefs || []).find((item) => item.attachment?.attachmentId === attachmentId)
      if (ref) {
        try {
          const stored = await ctx.attachments.readImage(ref.attachment)
          value = { dataUrl: `data:${stored.ref.mediaType};base64,${Buffer.from(stored.data).toString('base64')}`, attachment: stored.ref }
        } catch {}
      }
    }
    if (!value) return fail(res, 404, 'Attachment not found')
    json(res, 200, value)
  }

  async function handle(req, res) {
    const url = new URL(req.url || '/', 'http://127.0.0.1')
    const path = url.pathname.slice(PREFIX.length)
    try {
      if (!isAllowedRequest(ctx, req)) return fail(res, 403, 'Forbidden')
      if (req.method === 'POST' && !String(req.headers['content-type'] || '').includes('application/json')) {
        return fail(res, 415, 'Content-Type must be application/json')
      }
      if (req.method === 'OPTIONS') {
        res.writeHead(204, { Allow: 'GET, POST, DELETE, OPTIONS' })
        res.end()
        return
      }
      if (path === '/config' || path === '') {
        if (req.method === 'GET') return await handleConfig(req, res)
        if (req.method === 'POST') return await handleSaveConfig(req, res)
      }
      if (path === '/inbox') {
        if (req.method === 'GET') return await handleInbox(req, res, url)
      }
      if (path === '/inbox/clear' && req.method === 'POST') return await handleClear(req, res)
      if (path === '/inbox/cleanup' && req.method === 'POST') return await handleCleanup(req, res)
      const inboxMatch = /^\/inbox\/([^/]+)(\/archive)?$/.exec(path)
      if (inboxMatch) {
        const id = decodeId(inboxMatch[1])
        if (inboxMatch[2]) {
          if (req.method === 'POST') return await handleArchive(req, res, id)
        } else {
          if (req.method === 'GET') return await handleConversation(req, res, id)
          if (req.method === 'DELETE') return await handleDelete(req, res, id)
        }
      }
      if (path === '/workspaces' && req.method === 'GET') return await handleWorkspaces(req, res)
      if (path === '/upgrade' && req.method === 'POST') return await handleUpgrade(req, res)
      if (path === '/chat' && req.method === 'POST') {
        const body = await readJson(req)
        const config = await readConfig(configStore)
        await chat.streamChat(req, res, body, config)
        return
      }
      if (path === '/chat/cancel' && req.method === 'POST') {
        const body = await readJson(req)
        if (!await isInboxSessionId(ctx, body.sessionId)) return fail(res, 404, 'Conversation not found')
        const cancelled = chat.cancel(body.sessionId)
        return json(res, 200, { cancelled })
      }
      const attachmentMatch = /^\/attachment\/([^/]+)\/([^/]+)$/.exec(path)
      if (attachmentMatch && req.method === 'GET') {
        return await handleAttachment(req, res, decodeId(attachmentMatch[1]), decodeId(attachmentMatch[2]))
      }
      if (path === '/health') return json(res, 200, { ok: true })
      fail(res, 404, 'Not found')
    } catch (error) {
      logger.warn(`dsh-friday: API ${req.method} ${path} failed: ${String(error)}`)
      if (!res.headersSent) fail(res, 400, error?.message || 'Request failed')
      else if (!res.writableEnded) res.end()
    }
  }

  return ctx.effect(() => ctx.webServer.register({ kind: 'prefix', path: PREFIX, handler: handle }), 'dsh-friday: api routes')
}
