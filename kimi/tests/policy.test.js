import test from 'node:test'
import assert from 'node:assert/strict'
import { installFridayPolicy, isFridayAgent, isFridayId, restrictFridayAgent } from '../src/host/policy.js'

function fakeAgent(id = 'friday-1', cwd) {
  return { id, session: { header: { cwd } } }
}

test('Friday identity requires the prefix and no workspace cwd', () => {
  assert.equal(isFridayId('friday-abc'), true)
  assert.equal(isFridayId('task-abc'), false)
  assert.equal(isFridayAgent(fakeAgent()), true)
  assert.equal(isFridayAgent(fakeAgent('friday-abc', '/tmp/project')), false)
  assert.equal(isFridayAgent(fakeAgent('task-abc')), false)
})

test('agent policy uses both schema restriction and execution guard', () => {
  const calls = []
  let toolProviders = 0
  const agentCtx = {
    tools: {
      restrict: (filter) => calls.push(['restrict', filter]),
      guard: (guard) => calls.push(['guard', guard]),
      schemas: (agent, toolSet) => { calls.push(['schemas', agent, toolSet]); return [{ name: 'web_search' }, { name: 'bash' }] },
      definitions: () => [{ name: 'web_search' }, { name: 'bash' }],
      get: (name) => ({ name }),
    },
    systemPrompt: {
      section: (section) => calls.push(['section', section]),
      tools: (provider) => { toolProviders += 1; calls.push(['tools', provider]) },
    },
  }
  const agent = fakeAgent()
  restrictFridayAgent(agentCtx, agent)
  assert.deepEqual(calls[0], ['restrict', { allow: ['web_search'] }])
  const guard = calls[1][1]
  assert.equal(guard({ name: 'web_search' }), undefined)
  for (const name of ['bash', 'read', 'write', 'workflow', 'skill', 'schedule_create', 'create_goal', 'mcp_search']) {
    assert.match(guard({ name }), /permits web_search only/)
  }
  assert.equal(calls[2][0], 'section')
  assert.equal(toolProviders, 0, 'systemPrompt.tools must not be called: the tools service already supplies schemas')
  assert.equal(calls.some((call) => call[0] === 'tools'), false)
  assert.equal(calls.some((call) => call[0] === 'schemas'), false)
})

test('missing global web_search gets a scoped search tool and denies known globals', async () => {
  const calls = []
  const searches = []
  let toolProviders = 0
  const agentCtx = {
    tools: {
      get: () => undefined,
      definitions: () => ['load_workspace_dependencies', 'sidebar_open', 'working_directory'].map((name) => ({ name })),
      register: (definition, options) => { calls.push(['register', definition, options]); return () => {} },
      restrict: (filter) => { calls.push(['restrict', filter]); return () => {} },
      guard: (guard) => { calls.push(['guard', guard]); return () => {} },
      schemas: () => [],
    },
    systemPrompt: {
      section: () => () => {},
      tools: (provider) => { toolProviders += 1; calls.push(['tools', provider]); return () => {} },
    },
    web: {
      searchReady: async (provider) => { calls.push(['ready', provider]); return false },
      search: async (request) => {
        searches.push(request)
        return {
          content: 'Search answer',
          sources: [{ url: 'https://example.com', title: 'Example', snippet: 'Snippet' }],
          truncated: false,
        }
      },
    },
  }
  restrictFridayAgent(agentCtx, fakeAgent())
  assert.deepEqual(calls.find((call) => call[0] === 'restrict'), ['restrict', {
    deny: ['load_workspace_dependencies', 'sidebar_open', 'working_directory'],
  }])
  const registration = calls.find((call) => call[0] === 'register')
  assert.equal(registration[1].name, 'web_search')
  assert.equal(registration[1].name === 'web_fetch', false)
  assert.equal(await registration[2].when({ modelSelection: { provider: 'deepseek' } }), false)
  const value = await registration[1].execute({ queries: ['DSH'] })
  assert.equal(searches.length, 1)
  assert.deepEqual(searches[0], { query: 'DSH', maxResults: 8 })
  assert.equal(value.content, 'Search answer')
  assert.deepEqual(registration[1].output.presentationMeta({}, value).sources, [
    { url: 'https://example.com', title: 'Example', snippet: 'Snippet' },
  ])
  assert.equal(toolProviders, 0, 'the scoped fallback must not register a second systemPrompt.tools provider')
  assert.equal(calls.some((call) => call[0] === 'tools'), false)
})

test('global guard never restricts ordinary workspace tasks', () => {
  let registered
  const ctx = {
    effect: (callback) => { callback(); return () => {} },
    on: () => () => {},
    tools: { guard: (guard) => { registered = guard; return () => {} } },
  }
  installFridayPolicy(ctx)
  assert.equal(registered({ agent: fakeAgent('task-1'), name: 'bash' }), undefined)
  assert.match(registered({ agent: fakeAgent(), name: 'bash' }), /web_search only/)
})
