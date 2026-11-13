import test from 'node:test'
import assert from 'node:assert/strict'
import { CONTEXT_PREFIX, createUpgradeService, taskSeed } from '../src/host/upgrade.js'

const source = {
  id: 'friday-1',
  title: 'Upgrade this conversation',
  deleted: false,
  archived: false,
  defaultModel: { provider: 'p', model: 'm' },
  messages: [{ role: 'user', text: 'Continue this task' }],
}

function fixture(initial, { readSession } = {}) {
  const state = { ...initial }
  const calls = {
    create: 0,
    prompt: 0,
    inject: 0,
    followup: 0,
    archive: 0,
    release: 0,
    flush: 0,
    dispose: 0,
    llm: 0,
    attach: 0,
    resolve: 0,
    rename: 0,
    order: [],
    createOptions: [],
    releaseOptions: [],
    releaseCalls: [],
    archiveCalls: [],
    attached: [],
    resolved: [],
    renamed: [],
    updates: [],
  }
  const taskAgent = {
    id: 'resolved-task-agent',
    session: { id: 'resolved-task-agent', header: {} },
    followup: () => { calls.followup += 1 },
    inject: () => { calls.inject += 1 },
  }
  const repository = {
    get: async () => ({ ...state, archived: Boolean(state.archivedAt) }),
    update: async (id, patch) => { Object.assign(state, patch); calls.updates.push([id, patch]) },
    release: async (id, options) => {
      calls.release += 1
      calls.releaseOptions.push(options)
      calls.releaseCalls.push([id, options])
    },
    refresh: async () => ({ ...state }),
  }
  const workspace = {
    id: 'workspace-1',
    path: '/tmp/friday-workspace',
    status: async () => 'ok',
    attachSession: async (id) => {
      calls.attach += 1
      calls.attached.push(id)
      calls.order.push('attach')
    },
  }
  const ctx = {
    agents: {
      get: () => undefined,
      create: async (options) => {
        calls.create += 1
        calls.createOptions.push(options)
        const agent = {
          id: options.sessionId,
          status: 'idle',
          session: { id: options.sessionId, header: {} },
          followup: () => { calls.followup += 1 },
          inject: () => { calls.inject += 1 },
        }
        return {
          agent,
          dispose: async () => { calls.dispose += 1; calls.order.push('dispose') },
        }
      },
    },
    sessions: { flush: async () => { calls.flush += 1; calls.order.push('flush') } },
    workspaceRegistry: {
      get: () => workspace,
      archiveSession: async (id, options) => {
        calls.archive += 1
        calls.archiveOptions = options
        calls.archiveCalls.push([id, options])
        calls.order.push('archive')
      },
    },
    sessionController: {
      prompt: async () => { calls.prompt += 1 },
      resolveAgent: async (id) => {
        calls.resolve += 1
        calls.resolved.push(id)
        calls.order.push('resolve')
        return { agent: taskAgent }
      },
    },
    sessionQuery: {
      readSession: readSession || (async () => ({ session: { id: 'session-existing' }, events: [] })),
    },
    agentDefaultModel: { currentSelection: () => ({ provider: 'p', model: 'm' }) },
    get: (name) => {
      if (name === 'agentPresets') return { resolve: async () => ({ id: 'standard' }) }
      if (name === 'sessionTitle') {
        return {
          rename: (session, title) => {
            calls.rename += 1
            calls.renamed.push([session, title])
          },
        }
      }
      return undefined
    },
    llm: {
      stream: () => {
        calls.llm += 1
        return (async function * () {
          yield { type: 'text-delta', text: '# Task brief\nSummary' }
          yield { type: 'finish', reason: { kind: 'stop' } }
        })()
      },
    },
    logger: { warn: () => {} },
  }
  const service = createUpgradeService(ctx, repository, async () => ({}), {}, () => ({ provider: 'p', model: 'm' }))
  return { service, calls, state, taskAgent }
}

test('preview compresses once and creates nothing', async () => {
  const { service, calls } = fixture(source)
  const result = await service.preview('friday-1')
  assert.equal(result.summary, '# Task brief\nSummary')
  assert.equal(calls.llm, 1)
  assert.equal(calls.create, 0)
  assert.equal(calls.flush, 0)
  assert.equal(calls.dispose, 0)
  assert.equal(calls.attach, 0)
  assert.equal(calls.resolve, 0)
  assert.equal(calls.archive, 0)
  assert.equal(calls.release, 0)
})

test('upgrade seeds one completed turn, publishes it, and rejects a second attempt', async () => {
  const { service, calls, state, taskAgent } = fixture(source)
  const { revision } = await service.preview('friday-1')
  const edited = '# Task brief\nEdited by the user'
  const first = await service.upgrade('friday-1', 'workspace-1', edited, revision)
  await assert.rejects(() => service.upgrade('friday-1', 'workspace-1', edited, revision), /already upgraded/)

  assert.equal(calls.llm, 1, 'confirmation and a repeat must not compress again')
  assert.equal(calls.create, 1)
  assert.equal(calls.prompt, 0)
  assert.equal(calls.followup, 0)
  assert.equal(calls.inject, 0)
  assert.equal(calls.flush, 1)
  assert.equal(calls.dispose, 1)
  assert.equal(calls.attach, 1)
  assert.equal(calls.resolve, 1)
  assert.equal(calls.archive, 1)
  assert.equal(calls.release, 1)
  assert.deepEqual(calls.archiveCalls, [['friday-1', { stopActivity: true }]])
  assert.deepEqual(calls.releaseCalls, [['friday-1', { force: true }]])
  assert.deepEqual(calls.order, ['flush', 'dispose', 'attach', 'resolve', 'archive'])

  assert.ok(first.sessionId.startsWith('session-'))
  assert.equal(first.existing, false)
  assert.equal(state.upgradeState, 'published')
  assert.equal(state.upgradeSummary, '')
  assert.equal(state.upgradedSessionId, first.sessionId)
  assert.ok(state.archivedAt)

  const [options] = calls.createOptions
  assert.equal(options.sessionId, first.sessionId)
  assert.equal(options.meta.cwd, '/tmp/friday-workspace')
  assert.equal(options.meta.agentPreset, 'standard')
  assert.deepEqual(options.agentOptions, { provider: 'p', model: 'm' })

  const seed = options.seed
  assert.deepEqual(seed.map((event) => event.seq), [0, 1, 2])
  assert.deepEqual(seed.map((event) => event.type), ['turn/start', 'user/message', 'turn/end'])
  assert.equal(seed.every((event) => event.time === seed[0].time), true)
  assert.equal(seed[0].data.turn, 1)
  assert.equal(seed[1].data.role, 'user')
  assert.equal(seed[1].data.source.kind, 'user')
  assert.ok(seed[1].data.content[0].text.includes(CONTEXT_PREFIX))
  assert.ok(seed[1].data.content[0].text.includes(edited))
  assert.equal(seed[2].data.turn, 1)
  assert.equal(seed[2].data.reason.kind, 'completed')

  assert.deepEqual(calls.attached, [first.sessionId])
  assert.deepEqual(calls.resolved, [first.sessionId])
  assert.equal(calls.rename, 1)
  assert.deepEqual(calls.renamed, [[taskAgent.session, 'Upgrade this conversation']])
})

test('recovery re-publishes an existing task session without creating an agent', async () => {
  const { service, calls, state } = fixture({
    ...source,
    upgradedSessionId: 'session-existing',
    upgradedWorkspaceId: 'workspace-1',
    upgradeState: 'creating',
    upgradeSummary: '# Task brief\nSummary',
  })
  const result = await service.upgrade('friday-1', 'workspace-1')

  assert.equal(result.sessionId, 'session-existing')
  assert.equal(result.existing, true)
  assert.equal(calls.create, 0)
  assert.equal(calls.flush, 0)
  assert.equal(calls.dispose, 0)
  assert.equal(calls.attach, 1)
  assert.deepEqual(calls.attached, ['session-existing'])
  assert.equal(calls.resolve, 1)
  assert.deepEqual(calls.resolved, ['session-existing'])
  assert.equal(calls.archive, 1)
  assert.equal(calls.release, 1)
  assert.equal(state.upgradeState, 'published')
  assert.equal(state.upgradeSummary, '')
})

test('recovery creates a missing task session from the stored upgrade summary', async () => {
  const storedBrief = '# Task brief\nRecovered summary'
  const { service, calls, state } = fixture({
    ...source,
    upgradedSessionId: 'session-missing',
    upgradedWorkspaceId: 'workspace-1',
    upgradeState: 'creating',
    upgradeSummary: storedBrief,
  }, {
    readSession: async () => { throw new Error('Session not found') },
  })
  const result = await service.upgrade('friday-1', 'workspace-1')

  assert.equal(result.sessionId, 'session-missing')
  assert.equal(calls.create, 1)
  assert.equal(calls.flush, 1)
  assert.equal(calls.dispose, 1)
  const [options] = calls.createOptions
  assert.equal(options.sessionId, 'session-missing')
  assert.equal(options.meta.cwd, '/tmp/friday-workspace')
  assert.equal(options.meta.agentPreset, 'standard')
  assert.ok(options.seed[1].data.content[0].text.includes(CONTEXT_PREFIX))
  assert.ok(options.seed[1].data.content[0].text.includes(storedBrief))
  assert.equal(calls.attach, 1)
  assert.equal(calls.resolve, 1)
  assert.equal(calls.archive, 1)
  assert.equal(state.upgradeState, 'published')
})

test('an empty brief is rejected before anything is created', async () => {
  const { service, calls } = fixture(source)
  await assert.rejects(() => service.upgrade('friday-1', 'workspace-1', '   '), /Compressed context is required/)
  assert.equal(calls.create, 0)
  assert.equal(calls.flush, 0)
  assert.equal(calls.dispose, 0)
  assert.equal(calls.attach, 0)
  assert.equal(calls.resolve, 0)
  assert.equal(calls.archive, 0)
  assert.equal(calls.release, 0)
  assert.equal(calls.updates.length, 0)
})

test('taskSeed is a contiguous completed turn at the supplied timestamp', () => {
  const brief = '# Task brief\nSeed context'
  const events = taskSeed(brief, 123)
  assert.deepEqual(events.map((event) => event.seq), [0, 1, 2])
  assert.deepEqual(events.map((event) => event.time), [123, 123, 123])
  assert.deepEqual(events.map((event) => event.type), ['turn/start', 'user/message', 'turn/end'])
  assert.equal(events[1].data.role, 'user')
  assert.equal(events[1].data.source.kind, 'user')
  assert.ok(events[1].data.content[0].text.includes(CONTEXT_PREFIX))
  assert.ok(events[1].data.content[0].text.includes(brief))
  assert.equal(events[2].data.reason.kind, 'completed')
})

test('a new turn invalidates a reviewed preview before a task can be created', async () => {
  const { service, calls, state } = fixture(source)
  const { summary, revision } = await service.preview(source.id)
  state.messages = [...state.messages, { role: 'user', text: 'The constraints changed' }]
  await assert.rejects(service.upgrade(source.id, 'workspace-1', summary, revision), /Refresh the summary/)
  assert.equal(calls.create, 0)
  assert.equal(calls.archive, 0)
})

test('two confirmations share one published task; recovery after publication only archives', async () => {
  const { service, calls } = fixture(source)
  const { summary, revision } = await service.preview(source.id)
  const [first, second] = await Promise.all([
    service.upgrade(source.id, 'workspace-1', summary, revision),
    service.upgrade(source.id, 'workspace-1', summary, revision),
  ])
  assert.equal(first.sessionId, second.sessionId)
  assert.equal(calls.create, 1)
  const recovery = fixture({ ...source, upgradeState: 'published', upgradedSessionId: first.sessionId, upgradedWorkspaceId: 'workspace-1' })
  await recovery.service.upgrade(source.id, 'workspace-1')
  assert.equal(recovery.calls.archive, 1)
  assert.equal(recovery.calls.attach, 0)
  assert.equal(recovery.calls.create, 0)
})
