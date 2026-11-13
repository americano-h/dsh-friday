import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const home = await mkdtemp(join(tmpdir(), 'dsh-friday-kimi-list-'))
process.env.DSH_HOME = home
const { createRepository } = await import('../src/host/sessions.js')

after(async () => { await rm(home, { recursive: true, force: true }) })

function userEvent(seq = 1) {
  return {
    type: 'user/message',
    seq,
    time: 1000 + seq,
    data: {
      id: `user-${seq}`,
      role: 'user',
      source: { kind: 'user' },
      content: [{ type: 'text', text: 'What is Friday Inbox?' }],
    },
    surfaceOp: 'append',
  }
}

function assistantEvent(seq = 2) {
  return {
    type: 'assistant/message',
    seq,
    time: 1000 + seq,
    data: {
      turn: 1,
      step: 1,
      message: {
        id: `assistant-${seq}`,
        role: 'assistant',
        source: { kind: 'model', provider: 'p', model: 'm' },
        content: [{ type: 'text', text: 'A lightweight Inbox for quick answers.' }],
      },
      stream: [],
    },
    surfaceOp: 'append',
  }
}

function fixture(records) {
  const surfaceEvents = [userEvent(1), assistantEvent(2)]
  const ctx = {
    sessionPersistence: {
      list: async () => records,
      open: async () => { throw new Error('rawSnapshot is not used by list') },
    },
    sessionQuery: {
      readSession: async (id) => ({
        session: { id, createdAt: 1000, isSeeded: false },
        events: surfaceEvents,
      }),
      readSurface: async () => ({ events: surfaceEvents }),
    },
    agents: { get: () => undefined },
    on: () => () => {},
    effect: () => () => {},
    logger: { warn: () => {} },
  }
  return { repository: createRepository(ctx, { prepare: () => {} }) }
}

test('Inbox list resolves after a Friday conversation exists and excludes non-Inbox sessions', async () => {
  const records = [
    { header: { id: 'friday-active', createdAt: 1000 } },
    { header: { id: 'friday-in-workspace', cwd: '/tmp/project', createdAt: 1001 } },
    { header: { id: 'task-ordinary', createdAt: 1002 } },
  ]
  const { repository } = fixture(records)
  await assert.doesNotReject(() => repository.list())
  const items = await repository.list()
  assert.deepEqual(items.map((item) => item.id), ['friday-active'])
  assert.equal(items[0].title, 'What is Friday Inbox?')
  assert.equal(items[0].messages, undefined)
})

test('Inbox list tolerates malformed persistence snapshots', async () => {
  const records = [
    { header: undefined },
    { header: { id: 'friday-no-header-fields' } },
    null,
    { header: { id: 'friday-valid', createdAt: 1000 } },
  ]
  const { repository } = fixture(records)
  const items = await repository.list()
  assert.deepEqual(items.map((item) => item.id), ['friday-no-header-fields', 'friday-valid'])
})

test('Inbox keyword search still matches question and answer text', async () => {
  const { repository } = fixture([{ header: { id: 'friday-search', createdAt: 1000 } }])
  const byQuestion = await repository.list({ query: 'Friday Inbox' })
  const byAnswer = await repository.list({ query: 'lightweight' })
  assert.equal(byQuestion.length, 1)
  assert.equal(byAnswer.length, 1)
  assert.match(byAnswer[0].snippet, /lightweight/)
})
