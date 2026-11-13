import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const home = await mkdtemp(join(tmpdir(), 'dsh-friday-kimi-cleanup-'))
process.env.DSH_HOME = home
const { createRepository } = await import('../src/host/sessions.js')
after(async () => { await rm(home, { recursive: true, force: true }) })

const OLD = Date.now() - 90 * 24 * 60 * 60 * 1000
const EXPIRED = 'friday-expired'
const INTERRUPTED_UPGRADE = 'friday-interrupted-upgrade'

function events() {
  return [{
    type: 'user/message', seq: 1, time: OLD + 1, surfaceOp: 'append',
    data: { id: 'u1', role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: 'Old question' }] },
  }]
}

async function fixture() {
  const archived = []
  const ctx = {
    sessionPersistence: {
      list: async () => [
        { header: { id: EXPIRED, createdAt: OLD } },
        { header: { id: INTERRUPTED_UPGRADE, createdAt: OLD } },
      ],
      open: async () => { throw new Error('not needed') },
    },
    sessionQuery: {
      readSession: async (id) => ({ session: { id, createdAt: OLD }, events: events() }),
      readSurface: async () => ({ events: events() }),
    },
    agents: { get: () => undefined },
    workspaceRegistry: {
      archiveSession: async (id) => {
        if (id === INTERRUPTED_UPGRADE) throw new Error('An upgraded conversation cannot be deleted')
        archived.push(id)
      },
    },
    on: () => () => {},
    effect: () => () => {},
    logger: { warn: () => {} },
  }
  const repository = createRepository(ctx, { prepare: () => {} })
  await repository.store.load()
  await repository.store.write({
    version: 1,
    sessions: {
      [INTERRUPTED_UPGRADE]: {
        upgradedSessionId: 'task-created-before-failure',
        upgradedWorkspaceId: 'workspace-1',
        upgradeState: 'created',
        upgradeSummary: '# Task brief\nKept for recovery',
      },
    },
  })
  return { repository, archived }
}

test('an interrupted upgrade is not an active conversation and cannot break clear or retention cleanup', async () => {
  const { repository, archived } = await fixture()
  const active = await repository.list({ status: 'active' })
  assert.deepEqual(active.map((item) => item.id), [EXPIRED])
  const recovered = await repository.list({ status: 'archived' })
  assert.deepEqual(recovered.map((item) => item.id), [INTERRUPTED_UPGRADE])

  assert.equal(await repository.cleanup(30), 1)
  assert.deepEqual(archived, [EXPIRED])
  await assert.doesNotReject(() => repository.clear())
  assert.equal(repository.store.get().sessions[INTERRUPTED_UPGRADE].upgradedSessionId, 'task-created-before-failure')
  assert.equal(repository.store.get().sessions[INTERRUPTED_UPGRADE].upgradeSummary, '# Task brief\nKept for recovery')
})
