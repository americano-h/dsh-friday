import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const home = await mkdtemp(join(tmpdir(), 'dsh-friday-kimi-corrupt-'))
process.env.DSH_HOME = home
const { createRepository, isSeedValidationError } = await import('../src/host/sessions.js')

after(async () => { await rm(home, { recursive: true, force: true }) })

const CORRUPT = 'friday-corrupt'
const GOOD = 'friday-good'
const STORED_ERROR = `stored session "${CORRUPT}" failed validation: Error: session event at seq 10 message must have role "user"`

function legalEvents() {
  return [{
    type: 'user/message',
    seq: 1,
    time: 1001,
    data: {
      id: 'u1',
      role: 'user',
      source: { kind: 'user' },
      content: [{ type: 'text', text: 'Hello Friday' }],
    },
    surfaceOp: 'append',
  }]
}

async function fixture() {
  const calls = { corruptReads: 0, open: 0 }
  const ctx = {
    sessionPersistence: {
      list: async () => [
        { header: { id: GOOD, createdAt: 1000 } },
        { header: { id: CORRUPT, createdAt: 1001 } },
        { header: { id: 'task-other', createdAt: 1002 } },
      ],
      open: async (id) => {
        calls.open += 1
        if (id === CORRUPT) throw new Error(STORED_ERROR)
        return {
          header: { version: 4, id, createdAt: 1000, isSeeded: false },
          inheritedEventCount: 0,
          read: async () => ({ events: legalEvents() }),
          close: async () => {},
        }
      },
    },
    sessionQuery: {
      readSession: async (id) => {
        if (id === CORRUPT) {
          calls.corruptReads += 1
          throw new Error(STORED_ERROR)
        }
        return { session: { id, createdAt: 1000 }, events: legalEvents() }
      },
      readSurface: async (id) => {
        if (id === CORRUPT) throw new Error(STORED_ERROR)
        return { events: legalEvents() }
      },
    },
    agents: {
      get: () => undefined,
      resume: async () => { throw new Error('resume should not be called for an isolated session') },
      create: async () => { throw new Error('create should not be called') },
    },
    on: () => () => {},
    effect: () => () => {},
    logger: { warn: () => {} },
  }
  const repository = createRepository(ctx, { prepare: () => {} })
  await repository.store.load()
  await repository.store.write({ version: 1, sessions: {} })
  return { repository, calls }
}

test('isSeedValidationError recognizes persistence-layer stored-session validation', () => {
  assert.equal(isSeedValidationError(new Error(STORED_ERROR)), true)
  assert.equal(isSeedValidationError(new Error('seed user/message at index 10 message must have role "user"')), true)
  assert.equal(isSeedValidationError(new Error('Conversation not found')), false)
})

test('Inbox list skips a stored session rejected by persistence validation', async () => {
  const { repository } = await fixture()
  const items = await repository.list()
  assert.deepEqual(items.map((item) => item.id), [GOOD])
})

test('a rejected stored session is isolated and not re-read on later listings', async () => {
  const { repository, calls } = await fixture()
  await repository.list()
  assert.equal(calls.corruptReads, 1)
  await repository.list()
  assert.equal(calls.corruptReads, 1)
  assert.ok(repository.store.get().sessions[CORRUPT].corruptedAt > 0)
})

test('conversation detail and continuation return friendly outcomes, not the DSH error', async () => {
  const { repository } = await fixture()
  assert.equal(await repository.get(CORRUPT), null)
  await assert.rejects(() => repository.ensureAgent(CORRUPT), /unreadable stored history/)
})
