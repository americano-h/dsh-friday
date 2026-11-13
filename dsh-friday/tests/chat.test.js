import test from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { createChatRuntime } from '../src/host/chat.js'

function response() {
  const res = new EventEmitter()
  res.body = ''
  res.writableEnded = false
  res.destroyed = false
  res.writeHead = () => {}
  res.write = (chunk) => { res.body += chunk; return true }
  res.end = () => { res.writableEnded = true; res.emit('close') }
  return res
}

function fixture(autoComplete = true, messages = []) {
  const listeners = {}
  const agent = {
    id: 'friday-1',
    status: 'idle',
    session: { id: 'friday-1', header: {} },
    model: { select: () => {} },
    ctx: { on: (name, handler) => { listeners[name] = handler; return () => {} } },
    followups: [],
    followup: (message) => {
      agent.followups.push(message)
      listeners['agent/assistant-stream']({ agent, frame: { type: 'chunk', chunk: { type: 'text-delta', text: 'Hello' } } })
      if (autoComplete) listeners['session/event']({ id: 'friday-1', header: {} }, { type: 'turn/end', data: { reason: { kind: 'completed' } } })
    },
    cancel: () => { agent.cancelled = true },
  }
  const conversation = { id: 'friday-1', messages, defaultModel: { provider: 'p', model: 'm' } }
  const repository = {
    create: async () => agent,
    ensureAgent: async () => agent,
    get: async () => conversation,
    update: async () => {},
    refresh: async () => conversation,
    reserve: () => () => {},
  }
  const ctx = {
    agents: { get: () => agent },
    sessions: { flush: async () => { ctx.flushed = true } },
    on: (name, handler) => { listeners[name] = handler; return () => {} },
    effect: () => () => {},
    logger: { warn: () => {} },
  }
  const chat = createChatRuntime(ctx, repository, {}, async () => ({ defaultModel: { provider: 'p', model: 'm' } }))
  return { chat, agent, listeners, ctx }
}

function eventsOf(res) {
  return res.body.split('\n\n').filter((frame) => frame.startsWith('data:')).map((frame) => JSON.parse(frame.slice(5).trim()))
}

test('chat streams SSE and flushes the native Session before done', async () => {
  const { chat, ctx } = fixture()
  const req = new EventEmitter()
  const res = response()
  await chat.start({ req, res, body: { text: 'Question' } })
  await new Promise((resolve) => setImmediate(resolve))
  const events = eventsOf(res)
  assert.deepEqual(events.map((event) => event.type), ['meta', 'delta', 'done'])
  assert.equal(events[1].text, 'Hello')
  assert.equal(ctx.flushed, true)
})

test('closing the SSE response removes the subscriber without cancelling generation', async () => {
  const { chat, agent } = fixture(false)
  const req = new EventEmitter()
  const res = response()
  const pending = chat.start({ req, res, body: { text: 'Question' } })
  await pending
  res.emit('close')
  assert.equal(agent.cancelled, undefined)
  assert.equal(chat.active.size, 1)
  assert.equal(chat.active.get(agent.id).liveText, 'Hello')
  assert.equal(eventsOf(res).some((event) => event.type === 'done'), false)
})

test('chat submits a complete UserMessage so the persisted log remains replayable', async () => {
  const { chat, agent } = fixture()
  const req = new EventEmitter()
  const res = response()
  await chat.start({ req, res, body: { text: 'Question' } })
  assert.equal(agent.followups.length, 1)
  const [message] = agent.followups
  assert.equal(message.role, 'user')
  assert.match(message.id, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
  assert.deepEqual(message.source, { kind: 'user' })
  assert.deepEqual(message.content, [{ type: 'text', text: 'Question' }])
})

test('regenerate also submits a complete UserMessage with its own source', async () => {
  const { chat, agent } = fixture(true, [{ role: 'assistant', text: 'Earlier answer' }])
  const req = new EventEmitter()
  const res = response()
  await chat.start({ req, res, body: { sessionId: 'friday-1' }, regenerate: true })
  assert.equal(agent.followups.length, 1)
  const [message] = agent.followups
  assert.equal(message.role, 'user')
  assert.equal(typeof message.id, 'string')
  assert.deepEqual(message.source, { kind: 'dsh-friday.regenerate' })
  assert.match(message.content[0].text, /Regenerate the answer/)
})
