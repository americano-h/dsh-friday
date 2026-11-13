import { readConfig, saveConfig } from './config.js'
import { normalizeOrb } from '../shared/preferences.js'
import { publicConfig } from './config-view.js'
import { isFridayId } from './policy.js'

const PREFIX = '/dsh-friday/api/v1'
const JSON_LIMIT = 64 * 1024 * 1024

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function json(res, status, value) {
  if (res.writableEnded) return
  const body = JSON.stringify(value)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  })
  res.end(body)
}

async function bodyJson(req) {
  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    throw new HttpError(415, 'Content-Type must be application/json')
  }
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > JSON_LIMIT) throw new HttpError(413, 'Request body exceeds 64 MiB')
    chunks.push(chunk)
  }
  if (!chunks.length) return {}
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('not an object')
    return value
  } catch {
    throw new HttpError(400, 'Request body must be a JSON object')
  }
}

function idOf(value) {
  let id
  try { id = decodeURIComponent(value) } catch { throw new HttpError(400, 'Invalid session id') }
  if (!isFridayId(id)) throw new HttpError(404, 'Conversation not found')
  return id
}

function timestamp(value, name) {
  if (value == null || value === '') return undefined
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) throw new HttpError(400, `${name} must be a timestamp in milliseconds`)
  return parsed
}

export function createApi(ctx, { repository, configStore, chat, upgrades, nativeWindow }) {
  async function handle(req, res) {
    const url = new URL(req.url || '/', 'http://127.0.0.1')
    const path = url.pathname.slice(PREFIX.length)
    try {
      if (req.headers['x-dsh-friday'] !== '1') throw new HttpError(403, 'Missing Friday request header')
      const rejection = ctx.connection.requestRejection(req)
      if (rejection !== undefined) throw new HttpError(rejection, 'Request was rejected by DSH Connection')

      if (path === '/health' && req.method === 'GET') return json(res, 200, { ok: true, version: '1.1.4' })

      if (path === '/config') {
        if (req.method === 'GET') return json(res, 200, await publicConfig(ctx, repository, configStore, nativeWindow))
        if (req.method === 'PUT') {
          const config = await saveConfig(configStore, await bodyJson(req), nativeWindow?.configure)
          return json(res, 200, { config })
        }
        throw new HttpError(405, 'Method not allowed')
      }

      if (path === '/shortcut-recording' && req.method === 'POST') {
        const { id, active } = await bodyJson(req)
        if (typeof id !== 'string' || id.length > 64 || typeof active !== 'boolean') throw new HttpError(400, 'Invalid recording')
        nativeWindow.recordShortcut(id, active)
        return json(res, 200, { accepted: true })
      }

      if (path === '/orb-preview' && req.method === 'POST') {
        return json(res, 200, await nativeWindow.previewOrb(normalizeOrb(await bodyJson(req))))
      }

      if (path === '/native/show' && req.method === 'POST') {
        const body = await bodyJson(req)
        const id = body.sessionId ? idOf(body.sessionId) : null
        if (id && !await repository.get(id)) throw new HttpError(404, 'Conversation not found')
        nativeWindow.show(id)
        return json(res, 200, { accepted: true })
      }

      if (path === '/native/task-ack' && req.method === 'POST') {
        const body = await bodyJson(req)
        nativeWindow?.ackTask(body.sessionId)
        return json(res, 200, { accepted: true })
      }

      if (path === '/inbox' && req.method === 'GET') {
        const items = await repository.list({
          query: url.searchParams.get('q') || '',
          status: url.searchParams.get('status') || 'active',
          from: timestamp(url.searchParams.get('from'), 'from'),
          to: timestamp(url.searchParams.get('to'), 'to'),
          limit: url.searchParams.get('limit') || 200,
        })
        return json(res, 200, { items })
      }

      if (path === '/inbox/clear' && req.method === 'POST') {
        await bodyJson(req)
        return json(res, 200, { count: await repository.clear() })
      }
      if (path === '/inbox/cleanup' && req.method === 'POST') {
        await bodyJson(req)
        const config = await readConfig(configStore)
        return json(res, 200, { count: await repository.cleanup(config.retentionDays) })
      }

      const conversation = /^\/inbox\/([^/]+)$/.exec(path)
      if (conversation) {
        const id = idOf(conversation[1])
        if (req.method === 'GET') {
          const value = await repository.get(id)
          if (!value || value.deleted) throw new HttpError(404, 'Conversation not found')
          value.liveText = chat.active.get(value.id)?.liveText || ''
          value.running ||= chat.busy(value.id)
          const { upgradeSummary, ...publicConversation } = value
          return json(res, 200, { conversation: publicConversation })
        }
        if (req.method === 'DELETE') {
          await bodyJson(req)
          await repository.archive(id)
          return json(res, 200, { deleted: true })
        }
        throw new HttpError(405, 'Method not allowed')
      }

      if (path === '/chat' && req.method === 'POST') {
        const body = await bodyJson(req)
        return await chat.start({ req, res, body })
      }
      if (path === '/chat/regenerate' && req.method === 'POST') {
        const body = await bodyJson(req)
        return await chat.start({ req, res, body, regenerate: true })
      }
      if (path === '/chat/cancel' && req.method === 'POST') {
        const body = await bodyJson(req)
        const id = idOf(body.sessionId)
        const value = await repository.get(id)
        if (!value || value.deleted) throw new HttpError(404, 'Conversation not found')
        return json(res, 200, { accepted: chat.cancel(id) })
      }

      if (path === '/workspaces' && req.method === 'GET') {
        const workspaces = ctx.workspaceRegistry.list().map((workspace) => ({
          id: workspace.id,
          title: workspace.title,
          path: workspace.path,
          sessionCount: workspace.sessionIds.length,
        }))
        return json(res, 200, { workspaces })
      }

      if (path === '/upgrade/preview' && req.method === 'POST') {
        const body = await bodyJson(req)
        return json(res, 200, await upgrades.preview(idOf(body.sessionId)))
      }
      if (path === '/upgrade' && req.method === 'POST') {
        const body = await bodyJson(req)
        const sessionId = idOf(body.sessionId)
        if (typeof body.workspaceId !== 'string' || !body.workspaceId) throw new HttpError(400, 'workspaceId is required')
        return json(res, 200, await upgrades.upgrade(sessionId, body.workspaceId, body.summary, body.revision))
      }

      const attachment = /^\/attachment\/([^/]+)\/([^/]+)$/.exec(path)
      if (attachment && req.method === 'GET') {
        const sessionId = idOf(attachment[1])
        const attachmentId = decodeURIComponent(attachment[2])
        const value = await repository.attachment(sessionId, attachmentId)
        if (!value) throw new HttpError(404, 'Attachment not found')
        return json(res, 200, value)
      }

      throw new HttpError(404, 'Not found')
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 400
      if (status >= 500 || !(error instanceof HttpError)) {
        ctx.logger.warn(`dsh-friday: ${req.method} ${path} failed: ${String(error)}`)
      }
      if (!res.headersSent) json(res, status, { error: error?.message || 'Request failed' })
      else if (!res.writableEnded) res.end()
    }
  }

  ctx.effect(() => ctx.webServer.register({ kind: 'prefix', path: PREFIX, handler: handle }), 'dsh-friday: authenticated API')
}
