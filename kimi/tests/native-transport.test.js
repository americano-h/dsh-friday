import test from 'node:test'
import assert from 'node:assert/strict'

const messages = []
const listeners = new Map()
globalThis.window = {
  webkit: { messageHandlers: { fridayBridge: { postMessage: (message) => messages.push(message) } } },
  addEventListener: (name, listener) => listeners.set(name, listener),
  dispatchEvent: () => {},
}

const transport = await import('../src/client/native-transport.js')

test('native request maps configuration and Inbox operations to the local Host bridge', async () => {
  const promise = transport.nativeRequest('/config', { method: 'PUT', body: JSON.stringify({ hotkey: 'Meta+Shift+K' }) })
  const request = messages.at(-1)
  assert.equal(request.method, 'saveConfig')
  assert.deepEqual(request.params, { hotkey: 'Meta+Shift+K' })
  window.FridayNative.resolve(request.id, true, { config: { hotkey: 'Meta+Shift+K' } })
  assert.deepEqual(await promise, { config: { hotkey: 'Meta+Shift+K' } })

  const inbox = transport.nativeRequest('/inbox?status=active&q=friday&limit=20')
  const inboxRequest = messages.at(-1)
  assert.equal(inboxRequest.method, 'inbox')
  assert.deepEqual(inboxRequest.params, { status: 'active', q: 'friday', limit: '20' })
  window.FridayNative.resolve(inboxRequest.id, true, { items: [] })
  assert.deepEqual(await inbox, { items: [] })
})

test('native upgrade preview and confirmation preserve the edited summary', async () => {
  const preview = transport.nativeRequest('/upgrade/preview', { method: 'POST', body: JSON.stringify({ sessionId: 'friday-1' }) })
  const previewRequest = messages.at(-1)
  assert.equal(previewRequest.method, 'upgradePreview')
  window.FridayNative.resolve(previewRequest.id, true, { summary: 'draft' })
  assert.deepEqual(await preview, { summary: 'draft' })

  const upgrade = transport.nativeRequest('/upgrade', { method: 'POST', body: JSON.stringify({ sessionId: 'friday-1', workspaceId: 'w1', summary: 'edited' }) })
  const upgradeRequest = messages.at(-1)
  assert.equal(upgradeRequest.method, 'upgrade')
  assert.equal(upgradeRequest.params.summary, 'edited')
  window.FridayNative.resolve(upgradeRequest.id, true, { sessionId: 'task-1' })
  assert.deepEqual(await upgrade, { sessionId: 'task-1' })
})

test('native bridge rejects with the Host error message', async () => {
  const promise = transport.nativeBridge('conversation', { sessionId: 'friday-missing' })
  const request = messages.at(-1)
  window.FridayNative.resolve(request.id, false, { message: 'Conversation not found' })
  await assert.rejects(promise, /Conversation not found/)
})

test('native chat forwards stream events and completes at streamEnd', async () => {
  const events = []
  const promise = transport.nativeStreamChat({ body: { text: 'Question' }, onEvent: (event) => events.push(event) })
  const request = messages.at(-1)
  assert.equal(request.method, 'chat')
  assert.equal(request.params.regenerate, false)
  window.FridayNative.stream(request.id, { type: 'meta', sessionId: 'friday-1' })
  window.FridayNative.stream(request.id, { type: 'delta', text: 'Hello' })
  window.FridayNative.streamEnd(request.id, null)
  await promise
  assert.deepEqual(events.map((event) => event.type), ['meta', 'delta'])
})

test('aborting a native chat only closes the local subscription', async () => {
  const controller = new AbortController()
  const events = []
  const promise = transport.nativeStreamChat({ body: { text: 'Question' }, signal: controller.signal, onEvent: (event) => events.push(event) })
  const request = messages.at(-1)
  controller.abort()
  assert.equal(messages.at(-1).type, 'abort')
  assert.equal(messages.at(-1).id, request.id)
  await assert.rejects(promise, (error) => error.name === 'AbortError')
  window.FridayNative.stream(request.id, { type: 'delta', text: 'late' })
  window.FridayNative.streamEnd(request.id, null)
  assert.equal(events.length, 0)
})
