import { isNativeWindow, nativeBridge, nativeRequest, nativeStreamChat } from './native-transport.js'

const BASE = '/dsh-friday/api/v1'

export async function request(path, options = {}) {
  if (isNativeWindow()) return nativeRequest(path, options)
  const response = await fetch(BASE + path, {
    credentials: 'same-origin',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-DSH-Friday': '1',
      ...(options.headers || {}),
    },
  })
  if (!response.ok) {
    let message = `HTTP ${response.status}`
    try {
      const body = await response.json()
      if (body.error) message = body.error
    } catch {}
    throw new Error(message)
  }
  return response.json()
}

export const api = {
  recordShortcut: (id, active) => request('/shortcut-recording', { method: 'POST', body: JSON.stringify({ id, active }) }),
  previewOrb: (orb) => request('/orb-preview', { method: 'POST', body: JSON.stringify(orb) }),
  showNative: (sessionId) => request('/native/show', { method: 'POST', body: JSON.stringify({ sessionId }) }),
  config: () => request('/config'),
  saveConfig: (config) => request('/config', { method: 'PUT', body: JSON.stringify(config) }),
  inbox: ({ query = '', status = 'active', from, to, limit = 200 } = {}) => {
    const params = new URLSearchParams({ status, limit: String(limit) })
    if (query) params.set('q', query)
    if (from != null) params.set('from', String(from))
    if (to != null) params.set('to', String(to))
    return request(`/inbox?${params}`)
  },
  conversation: (id) => request(`/inbox/${encodeURIComponent(id)}`),
  remove: (id) => request(`/inbox/${encodeURIComponent(id)}`, { method: 'DELETE', body: '{}' }),
  clear: () => request('/inbox/clear', { method: 'POST', body: '{}' }),
  cleanup: () => request('/inbox/cleanup', { method: 'POST', body: '{}' }),
  cancel: (sessionId) => request('/chat/cancel', { method: 'POST', body: JSON.stringify({ sessionId }) }),
  workspaces: () => request('/workspaces'),
  previewUpgrade: (sessionId) => request('/upgrade/preview', { method: 'POST', body: JSON.stringify({ sessionId }) }),
  upgrade: (sessionId, workspaceId, summary, revision) => request('/upgrade', { method: 'POST', body: JSON.stringify({ sessionId, workspaceId, summary, revision }) }),
  attachment: (sessionId, attachmentId) => request(`/attachment/${encodeURIComponent(sessionId)}/${encodeURIComponent(attachmentId)}`),
  pickDirectory: () => nativeBridge('pickDirectory'),
  createWorkspace: (path) => nativeBridge('createWorkspace', { path }),
  ackNativeTask: (sessionId) => request('/native/task-ack', { method: 'POST', body: JSON.stringify({ sessionId }) }),
}

export async function streamChat({ body, regenerate = false, signal, onEvent }) {
  if (isNativeWindow()) return nativeStreamChat({ body, regenerate, signal, onEvent })
  const response = await fetch(`${BASE}${regenerate ? '/chat/regenerate' : '/chat'}`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'X-DSH-Friday': '1' },
    body: JSON.stringify(body),
    signal,
  })
  if (!response.ok || !response.body) {
    let message = `HTTP ${response.status}`
    try {
      const data = await response.json()
      if (data.error) message = data.error
    } catch {}
    throw new Error(message)
  }
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let boundary
    while ((boundary = buffer.indexOf('\n\n')) >= 0) {
      const frame = buffer.slice(0, boundary)
      buffer = buffer.slice(boundary + 2)
      const data = frame.split('\n').filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trimStart()).join('\n')
      if (!data) continue
      try { onEvent?.(JSON.parse(data)) } catch {}
    }
  }
}
