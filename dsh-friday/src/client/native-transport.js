const pending = new Map()
const streams = new Map()
let sequence = 0

function channel() {
  const value = window.webkit?.messageHandlers?.fridayBridge
  if (!value) throw new Error('Friday native bridge is unavailable')
  return value
}

function nextId(prefix) {
  sequence += 1
  return `${prefix}-${Date.now()}-${sequence}`
}

export function isNativeWindow() {
  return Boolean(window.__DSH_FRIDAY_NATIVE__)
}

export function nativeCommand(command, params = {}) {
  channel().postMessage({ type: 'command', command, params })
}

export function nativeBridge(method, params = {}) {
  const id = nextId('request')
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject })
    channel().postMessage({ type: 'request', id, method, params })
  })
}

function parseBody(options) {
  if (!options.body) return {}
  return typeof options.body === 'string' ? JSON.parse(options.body) : options.body
}

export async function nativeRequest(path, options = {}) {
  const method = options.method || 'GET'
  const body = parseBody(options)
  if (path === '/config') return nativeBridge(method === 'PUT' ? 'saveConfig' : 'config', method === 'PUT' ? body : {})
  if (path === '/inbox/clear') return nativeBridge('clear')
  if (path === '/inbox/cleanup') return nativeBridge('cleanup')
  if (path === '/chat/cancel') return nativeBridge('cancel', body)
  if (path === '/workspaces') return nativeBridge('workspaces')
  if (path === '/upgrade/preview') return nativeBridge('upgradePreview', body)
  if (path === '/upgrade') return nativeBridge('upgrade', body)
  if (path === '/native/task-ack') return nativeBridge('ackTask', body)
  if (path.startsWith('/inbox?')) {
    const query = new URL(path, 'file:///native/').searchParams
    return nativeBridge('inbox', Object.fromEntries(query.entries()))
  }
  const attachment = /^\/attachment\/([^/]+)\/([^/]+)$/.exec(path)
  if (attachment) return nativeBridge('attachment', { sessionId: decodeURIComponent(attachment[1]), attachmentId: decodeURIComponent(attachment[2]) })
  const conversation = /^\/inbox\/([^/]+)$/.exec(path)
  if (conversation) {
    const sessionId = decodeURIComponent(conversation[1])
    return nativeBridge(method === 'DELETE' ? 'remove' : 'conversation', { sessionId })
  }
  throw new Error(`Unsupported Friday native request: ${method} ${path}`)
}

export function nativeStreamChat({ body, regenerate = false, signal, onEvent }) {
  const id = nextId('stream')
  return new Promise((resolve, reject) => {
    const finish = (error) => {
      if (!streams.has(id)) return
      streams.delete(id)
      signal?.removeEventListener('abort', abort)
      if (error) reject(error)
      else resolve()
    }
    const abort = () => {
      channel().postMessage({ type: 'abort', id })
      finish(new DOMException('Friday native stream was aborted', 'AbortError'))
    }
    streams.set(id, { onEvent, finish })
    signal?.addEventListener('abort', abort, { once: true })
    if (signal?.aborted) { abort(); return }
    try {
      channel().postMessage({ type: 'request', id, method: 'chat', params: { body, regenerate } })
    } catch (error) {
      finish(error)
    }
  })
}

export async function openNativeTask(sessionId) {
  const result = await nativeBridge('openTask', { sessionId })
  if (result?.url) nativeCommand('openURL', { url: result.url })
  return result
}

function syncAppearance() {
  const root = document.documentElement
  const preference = root.dataset.appearance || 'system'
  root.toggleAttribute('data-dark', preference === 'dark' || (preference === 'system' && systemAppearance?.matches))
}
const systemAppearance = window.matchMedia?.('(prefers-color-scheme: dark)')
systemAppearance?.addEventListener('change', syncAppearance)
if (systemAppearance) syncAppearance()

window.FridayNative = {
  fontSizes(text, code, preference = 'system') {
    document.documentElement.dataset.appearance = preference
    syncAppearance()
    document.body.style.setProperty('--dsh-content-font-size', `${text}px`)
    document.body.style.setProperty('--dsh-code-font-size', `${code}px`)
  },
  shortcuts(value) {
    window.dispatchEvent(new CustomEvent('dsh-friday:shortcuts', { detail: value }))
  },
  resolve(id, ok, value) {
    const request = pending.get(id)
    if (!request) return
    pending.delete(id)
    if (ok) request.resolve(value)
    else request.reject(new Error(value?.message || String(value || 'Friday native request failed')))
  },
  stream(id, event) {
    streams.get(id)?.onEvent?.(event)
  },
  streamEnd(id, message) {
    const stream = streams.get(id)
    if (!stream) return
    stream.finish(message ? new Error(message) : null)
  },
  visibility(visible, sessionId) {
    window.dispatchEvent(new CustomEvent('dsh-friday:native-visibility', { detail: { visible: Boolean(visible), sessionId } }))
  },
}
