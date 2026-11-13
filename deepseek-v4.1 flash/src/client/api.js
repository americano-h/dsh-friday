const BASE = '/dsh-friday/api/v1'

async function request(path, options = {}) {
  const response = await fetch(BASE + path, {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-DSH-Friday': '1',
      ...(options.headers || {}),
    },
    ...options,
  })
  if (!response.ok) {
    let message = `HTTP ${response.status}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {}
    throw new Error(message)
  }
  if (response.status === 204) return null
  return response.json()
}

export const api = {
  config: () => request('/config'),
  saveConfig: (config) => request('/config', { method: 'POST', body: JSON.stringify(config) }),
  inbox: (query = {}) => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) if (value != null && value !== '') params.set(key, value)
    return request(`/inbox${params.size ? `?${params}` : ''}`)
  },
  conversation: (id) => request(`/inbox/${encodeURIComponent(id)}`),
  remove: (id) => request(`/inbox/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  setArchived: (id, archived) => request(`/inbox/${encodeURIComponent(id)}/archive`, { method: 'POST', body: JSON.stringify({ archived }) }),
  clear: () => request('/inbox/clear', { method: 'POST', body: '{}' }),
  cleanup: () => request('/inbox/cleanup', { method: 'POST', body: '{}' }),
  workspaces: () => request('/workspaces'),
  upgrade: (body) => request('/upgrade', { method: 'POST', body: JSON.stringify(body) }),
  cancel: (sessionId) => request('/chat/cancel', { method: 'POST', body: JSON.stringify({ sessionId }) }),
}

export async function streamChat(body, handlers, signal) {
  const response = await fetch(BASE + '/chat', {
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
      if (data?.error) message = data.error
    } catch {}
    throw new Error(message)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let split
    while ((split = buffer.indexOf('\n\n')) >= 0) {
      const frame = buffer.slice(0, split)
      buffer = buffer.slice(split + 2)
      const data = frame
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trimStart())
        .join('\n')
      if (!data) continue
      let payload
      try {
        payload = JSON.parse(data)
      } catch {
        continue
      }
      handlers.onEvent?.(payload)
      if (payload.type && handlers[payload.type]) handlers[payload.type](payload)
    }
  }
}
