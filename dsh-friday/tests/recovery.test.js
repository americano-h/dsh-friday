import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const home = await mkdtemp(join(tmpdir(), 'dsh-friday-kimi-recovery-'))
process.env.DSH_HOME = home
const { createRepository, isSeedValidationError, normalizeSessionSeed } = await import('../src/host/sessions.js')

after(async () => { await rm(home, { recursive: true, force: true }) })

const SEED_ERROR = 'seed user/message at index 10 message must have role "user"'

function brokenEvents() {
  return [
    { type: 'permission/preset', seq: 0, time: 1, data: { preset: 'workspace-write' } },
    { type: 'agent/inbox/spliced', seq: 1, time: 1, data: { target: 'next-turn', start: 0, inserted: [{ content: [{ type: 'text', text: 'test' }], source: { kind: 'user' } }] } },
    { type: 'turn/start', seq: 2, time: 1, data: { turn: 1 } },
    { type: 'agent/inbox/spliced', seq: 3, time: 1, data: { target: 'next-turn', start: 0, removedCount: 1, inserted: [] } },
    { type: 'system/message', seq: 4, time: 1, data: { turn: 1, step: 1, message: { id: 'system-1', role: 'system', content: [], source: { kind: 'system-prompt' } } }, surfaceOp: 'append' },
    { type: 'user/message', seq: 5, time: 1, data: { content: [{ type: 'text', text: 'test' }], source: { kind: 'user' }, id: 'dshctx-broken' }, surfaceOp: 'append' },
    { type: 'assistant/message', seq: 6, time: 1, data: { turn: 1, step: 1, message: { id: 'assistant-1', role: 'assistant', content: [{ type: 'text', text: 'Test received' }], source: { kind: 'model', provider: 'p', model: 'm' } }, stream: [] }, surfaceOp: 'append' },
    { type: 'turn/end', seq: 7, time: 1, data: { turn: 1, reason: { kind: 'completed' } } },
  ]
}

function messageOf(event) {
  return event.type === 'user/message' ? event.data : event.data?.message
}

test('normalizeSessionSeed adds missing ids and roles without mutating the source log', () => {
  const events = brokenEvents()
  const result = normalizeSessionSeed(events)
  assert.equal(result.changed, true)
  assert.equal(result.events.length, events.length)
  const user = result.events.find((event) => event.type === 'user/message')
  assert.equal(user.data.role, 'user')
  assert.equal(user.data.id, 'dshctx-broken')
  const inserted = result.events[1].data.inserted[0]
  assert.equal(inserted.role, 'user')
  assert.equal(typeof inserted.id, 'string')
  assert.equal(messageOf(events.find((event) => event.type === 'user/message')).role, undefined)
  assert.equal(events[1].data.inserted[0].id, undefined)
  for (const event of result.events.filter((item) => ['system/message', 'assistant/message'].includes(item.type))) {
    assert.equal(typeof messageOf(event).id, 'string')
  }
  assert.equal(result.events[0], events[0])
})

test('normalizeSessionSeed leaves an already valid log untouched', () => {
  const events = brokenEvents()
  const normalized = normalizeSessionSeed(events).events
  const second = normalizeSessionSeed(normalized)
  assert.equal(second.changed, false)
  for (const [index, event] of second.events.entries()) assert.equal(event, normalized[index])
})

test('seed validation detection accepts the DSH replay error and rejects unrelated failures', () => {
  assert.equal(isSeedValidationError(new Error(SEED_ERROR)), true)
  assert.equal(isSeedValidationError(new Error('seed event at index 0 has an invalid event envelope')), true)
  assert.equal(isSeedValidationError(new Error('seed user/message at index 10 lacks an identified message')), true)
  assert.equal(isSeedValidationError(new Error('Conversation not found')), false)
  assert.equal(isSeedValidationError(new Error('session event "user/message" at seq 3 is invalid')), false)
})

function makeAgent(id) {
  return {
    id,
    status: 'idle',
    session: { id, header: { createdAt: 7 } },
    model: { select() {} },
    ctx: { on: () => () => {} },
    followup() {},
  }
}

function repositoryFixture() {
  const events = brokenEvents()
  const created = []
  const resumed = []
  const ctx = {
    sessionQuery: {
      readSession: async (id) => {
        if (id === 'friday-broken') throw new Error(SEED_ERROR)
        return { session: { id, createdAt: 5 }, events: [] }
      },
      readSurface: async () => ({ events }),
    },
    sessionPersistence: {
      open: async (id) => ({
        header: { version: 4, id, createdAt: 3, isSeeded: false },
        inheritedEventCount: 0,
        read: async () => ({ events: structuredClone(events) }),
        close: async () => {},
      }),
    },
    agents: {
      get: () => undefined,
      resume: async (options) => {
        resumed.push(options)
        if (options.resumeSessionId === 'friday-broken') throw new Error(SEED_ERROR)
        return { agent: makeAgent(options.resumeSessionId), dispose: async () => {} }
      },
      create: async (options) => {
        created.push(options)
        const agent = makeAgent(options.sessionId)
        return { agent, dispose: async () => {} }
      },
    },
    effect: () => () => {},
    logger: { warn: () => {} },
  }
  const repository = createRepository(ctx, { prepare: () => {} })
  return { repository, created, resumed }
}

test('a conversation with an incomplete persisted seed is recovered into a replayable native session', async () => {
  const { repository, created, resumed } = repositoryFixture()
  await repository.store.load()
  await repository.update('friday-broken', {
    defaultModel: { provider: 'p', model: 'm' },
    model: { provider: 'p', model: 'm' },
  })

  const before = await repository.get('friday-broken')
  assert.equal(before.messages[0].text, 'test')
  assert.equal(before.messages[1].text, 'Test received')

  const agent = await repository.ensureAgent('friday-broken')
  assert.equal(resumed.length, 1)
  assert.equal(created.length, 1)
  assert.equal(agent.id, created[0].sessionId)
  assert.notEqual(agent.id, 'friday-broken')
  const seedUser = created[0].seed.find((event) => event.type === 'user/message')
  assert.equal(seedUser.data.role, 'user')
  assert.equal(seedUser.data.id, 'dshctx-broken')
  const seedInsert = created[0].seed[1].data.inserted[0]
  assert.equal(seedInsert.role, 'user')
  assert.equal(typeof seedInsert.id, 'string')

  const sessions = repository.store.get().sessions
  assert.equal(sessions['friday-broken'].recoveredSessionId, agent.id)
  assert.ok(sessions['friday-broken'].deletedAt > 0)
  assert.equal(sessions[agent.id].recoveredFrom, 'friday-broken')

  const again = await repository.ensureAgent('friday-broken')
  assert.equal(again.id, agent.id)
  assert.equal(created.length, 1)
})
