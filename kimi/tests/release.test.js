import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

// DATA_DIR is computed while src/host/config.js is imported, so DSH_HOME must
// be set before the first dynamic import of the repository module.
const home = await mkdtemp(join(tmpdir(), 'dsh-friday-kimi-release-'))
process.env.DSH_HOME = home
const { createRepository } = await import('../src/host/sessions.js')

const cleanups = []
const selection = { provider: 'p', model: 'm' }
const idleDelayWait = 1700

after(async () => {
  for (const cleanup of cleanups.reverse()) {
    try { await cleanup() } catch {}
  }
  await rm(home, { recursive: true, force: true })
})

function fixture() {
  const disposers = []
  const listeners = new Map()
  const agents = new Map()
  const calls = { disposes: [], flushes: [], archives: [], warnings: [] }
  const ctx = {
    effect: (callback) => {
      const dispose = callback()
      disposers.push(dispose)
      return dispose
    },
    on: (name, handler) => {
      listeners.set(name, handler)
      return () => {}
    },
    agents: {
      create: async (options) => {
        const agent = {
          id: options.sessionId,
          status: 'idle',
          session: { header: { createdAt: 1 } },
        }
        agents.set(agent.id, agent)
        return {
          agent,
          dispose: async () => { calls.disposes.push(agent.id) },
        }
      },
      get: (id) => agents.get(id),
    },
    sessions: {
      flush: async (session) => { calls.flushes.push(session) },
    },
    logger: {
      warn: (...args) => { calls.warnings.push(args) },
    },
    workspaceRegistry: {
      archiveSession: async (id, options) => { calls.archives.push([id, options]) },
    },
    sessionQuery: {
      readSession: async (id) => ({
        session: { id, createdAt: 1 },
        events: [
          {
            seq: 0,
            time: 1,
            type: 'user/message',
            data: { id: 'u1', role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: 'Question' }] },
          },
          {
            seq: 1,
            time: 2,
            type: 'assistant/message',
            data: { message: { id: 'a1', role: 'assistant', content: [{ type: 'text', text: 'Answer' }] } },
          },
        ],
      }),
      readSurface: async () => ({ events: [] }),
    },
    sessionPersistence: {
      list: async () => [],
    },
  }
  const repository = createRepository(ctx, { prepare: () => {} })
  cleanups.push(async () => {
    for (const dispose of disposers.reverse()) {
      try { await dispose?.() } catch {}
    }
  })
  return { repository, listeners, calls }
}

test('release disposes an idle handle once and reports whether it released', async () => {
  const { repository, calls } = fixture()
  const agent = await repository.create(selection)

  assert.equal(await repository.release(agent.id), true)
  assert.deepEqual(calls.disposes, [agent.id])
  assert.equal(calls.flushes.length, 1)

  assert.equal(await repository.release(agent.id), false)
  assert.deepEqual(calls.disposes, [agent.id])
})

test('release skips a running agent unless forced', async () => {
  const { repository, calls } = fixture()
  const agent = await repository.create(selection)
  agent.status = 'running'

  assert.equal(await repository.release(agent.id), false)
  assert.deepEqual(calls.disposes, [])

  assert.equal(await repository.release(agent.id, { force: true }), true)
  assert.deepEqual(calls.disposes, [agent.id])
})

test('release leaves a reserved conversation loaded until unreserved', async () => {
  const { repository, calls } = fixture()
  const agent = await repository.create(selection)
  const unreserve = repository.reserve(agent.id)

  assert.equal(await repository.release(agent.id), false)
  assert.deepEqual(calls.disposes, [])

  unreserve()
  assert.equal(await repository.release(agent.id), true)
  assert.deepEqual(calls.disposes, [agent.id])
})

test('an idle status event releases an owned agent after the idle delay', async () => {
  const { repository, listeners, calls } = fixture()
  const agent = await repository.create(selection)

  const listener = listeners.get('agent/status')
  assert.equal(typeof listener, 'function')
  listener({ agent, status: 'idle' })
  assert.deepEqual(calls.disposes, [])

  await new Promise((resolve) => setTimeout(resolve, idleDelayWait))
  assert.deepEqual(calls.disposes, [agent.id])
})

test('archive accepts an already archived upgraded conversation and releases its handle', async () => {
  const { repository, calls } = fixture()
  const agent = await repository.create(selection)
  await repository.update(agent.id, { upgradedSessionId: 'session-upgraded', archivedAt: 111 })

  await assert.doesNotReject(() => repository.archive(agent.id))

  const entry = repository.store.get().sessions[agent.id]
  assert.ok(entry.deletedAt > 0)
  assert.equal(entry.archivedAt, 111)
  assert.equal(entry.upgradedSessionId, 'session-upgraded')
  assert.deepEqual(calls.disposes, [agent.id])
  assert.deepEqual(calls.archives, [])
})
