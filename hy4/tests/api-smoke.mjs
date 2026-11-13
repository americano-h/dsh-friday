/**
 * dsh-friday-hy4 0.1.0 — end-to-end smoke test against a dsh web profile.
 *
 * Usage:
 *   node tests/api-smoke.mjs <baseUrl> <token>
 * Example:
 *   node tests/api-smoke.mjs http://127.0.0.1:51777 <token>
 *
 * It authenticates exactly like the browser (token -> 303 + HttpOnly cookie),
 * then exercises the plugin's Host API. It never touches the desktop profile.
 */

import { writeFileSync } from 'node:fs'

const base = (process.argv[2] || 'http://127.0.0.1:51777').replace(/\/$/, '')
const token = process.argv[3] || process.env.DSH_WEB_TOKEN || ''
const ROUTE = `${base}/plugins/dsh-friday-hy4/api`
const results = []
let cookie = ''

function record(name, ok, detail) {
  results.push({ name, ok: Boolean(ok), detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

async function authenticate() {
  const response = await fetch(`${base}/?token=${encodeURIComponent(token)}`, { redirect: 'manual' })
  const cookies = typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie()
    : [response.headers.get('set-cookie')].filter(Boolean)
  if (!cookies.length) throw new Error('no set-cookie from web entry')
  cookie = cookies.map(c => c.split(';')[0]).join('; ')
  record('authenticate', response.status === 303 || response.status === 200, `status=${response.status}`)
}

async function api(action, payload = {}) {
  const response = await fetch(ROUTE, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ action, payload }),
  })
  const text = await response.text()
  let json
  try { json = JSON.parse(text) } catch { throw new Error(`${action}: non-JSON response ${response.status}: ${text.slice(0, 200)}`) }
  return { status: response.status, ...json }
}

function assert(condition, message) { if (!condition) throw new Error(message) }

async function main() {
  assert(token, 'a web token is required')
  await authenticate()

  const health = await api('health')
  record('health', health.ok && health.value.version === '0.1.0', `v=${health.value?.version} profile=${health.value?.profile}`)
  record('profile isolation', health.value?.profile === 'web' && /dsh-friday-hy4\/web$/.test(health.value?.dataDir || ''), health.value?.dataDir)

  const state = await api('state')
  record('state', state.ok && Array.isArray(state.value.conversations), `conversations=${state.value?.conversations?.length}`)
  record('default retention = 30', state.value?.settings?.retentionDays === 30, `retentionDays=${state.value?.settings?.retentionDays}`)
  record('capabilities', state.value?.capabilities?.globalHotkey === false && state.value?.capabilities?.hotkeyScope === 'in-app', JSON.stringify(state.value?.capabilities))

  const models = await api('models.list')
  record('models.list', models.ok && Array.isArray(models.value.routes), `routes=${models.value?.routes?.length}`)

  const settings = await api('settings.update', { settings: { ...state.value.settings, retentionDays: 30, hotkey: 'Alt+Space' } })
  record('settings.update', settings.ok && settings.value.settings.retentionDays === 30, `hotkey=${settings.value?.settings?.hotkey}`)

  const created = await api('conversation.create', { forceNew: true })
  assert(created.ok, 'conversation.create failed')
  const id = created.value.id
  record('conversation.create', Boolean(id), id)

  const question = '用一句话说明 Inbox 快捷问答插件是什么？'
  const asked = await api('ask', { id, text: question, images: [] })
  record('ask accepted', asked.ok && asked.value.started === true, JSON.stringify(asked.error || ''))

  let poll
  const deadline = Date.now() + 60_000
  do {
    await new Promise(resolve => setTimeout(resolve, 400))
    poll = await api('poll', { id })
  } while (poll.ok && poll.value.generating && Date.now() < deadline)
  record('poll settles', poll.ok && !poll.value.generating, `messages=${poll.value?.messages?.length}`)

  const messages = poll.value?.messages || []
  const user = messages.find(m => m.role === 'user')
  const assistant = messages.find(m => m.role === 'assistant')
  record('user turn persisted', user?.text === question, user?.text?.slice(0, 40))
  record('assistant turn created', Boolean(assistant), `status=${assistant?.status}`)
  const modelOutcome = assistant?.status === 'done'
    ? `done (${assistant.text.length} chars)`
    : `not completed: ${assistant?.status || 'none'} ${assistant?.error || ''}`
  record('streaming model call', assistant?.status === 'done', modelOutcome)

  const found = await api('search', { query: 'Inbox' })
  record('search hits question and answer', found.ok && found.value.items.some(item => item.id === id), `hits=${found.value?.items?.length}`)

  const detail = await api('conversation.get', { id })
  record('conversation.get', detail.ok && detail.value.conversation.messages.length === messages.length, `messages=${detail.value?.conversation?.messages?.length}`)

  const image = await api('image.get', { id: 'does-not-exist' })
  record('image.get rejects unknown', !image.ok, image.error)

  const prepared = await api('promote.prepare', { id })
  record('promote.prepare compresses', prepared.ok && typeof prepared.value.compressed === 'string' && prepared.value.compressed.length > 20,
    `compressed=${prepared.value?.compressed?.length} workspaces=${prepared.value?.workspaces?.length}`)

  const begin = await api('promote.begin', { id })
  const again = await api('promote.begin', { id })
  record('promote is idempotent (no double promotion)', begin.ok && !again.ok, `second=${again.error}`)

  const commit = await api('promote.commit', { id, sessionId: 'smoke-session', workspaceId: 'smoke-workspace' })
  const after = await api('conversation.get', { id })
  record('promote.commit archives', commit.ok && after.value.conversation.status === 'archived' && Boolean(after.value.conversation.promotedTo?.sessionId),
    `status=${after.value?.conversation?.status}`)

  const blocked = await api('ask', { id, text: 'again', images: [] })
  record('archived conversation rejects new asks', !blocked.ok, blocked.error)

  const removed = await api('conversation.delete', { id })
  const finalState = await api('state')
  record('conversation.delete', removed.ok && !finalState.value.conversations.some(c => c.id === id), `remaining=${finalState.value?.conversations?.length}`)

  const cleanup = await api('cleanup')
  record('retention cleanup', cleanup.ok, `removed=${cleanup.value?.removed}`)

  const passed = results.filter(r => r.ok).length
  const report = {
    at: new Date().toISOString(),
    base,
    profile: health.value?.profile,
    dataDir: health.value?.dataDir,
    passed,
    total: results.length,
    results,
  }
  writeFileSync(new URL('./results.json', import.meta.url), `${JSON.stringify(report, null, 2)}\n`)
  console.log(`\n${passed}/${results.length} passed. Report: tests/results.json`)
  if (passed !== results.length) process.exitCode = 1
}

main().catch(error => {
  console.error('SMOKE FAILED:', error?.stack || error)
  process.exitCode = 1
})
