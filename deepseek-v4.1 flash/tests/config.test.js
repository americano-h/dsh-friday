import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const home = await mkdtemp(join(tmpdir(), 'dsh-friday-config-'))
process.env.DSH_HOME = home

const { ensureDirs } = await import('../src/host/paths.js')
const { createConfigStore, readConfig, saveConfig } = await import('../src/host/config.js')
await ensureDirs()

test('readConfig applies defaults', async () => {
  const store = createConfigStore()
  const config = await readConfig(store)
  assert.equal(config.hotkey, 'Alt+Space')
  assert.equal(config.retentionDays, 30)
  assert.equal(config.defaultModel, null)
})

test('saveConfig normalizes and validates a model selection', async () => {
  const store = createConfigStore()
  const config = await saveConfig(store, {
    defaultModel: { provider: 'p', model: 'm' },
    visionModel: { provider: 'v', model: 'vm' },
    hotkey: 'Meta+Shift+K',
    retentionDays: 999,
  })
  assert.deepEqual(config.defaultModel, { provider: 'p', model: 'm' })
  assert.deepEqual(config.visionModel, { provider: 'v', model: 'vm' })
  assert.equal(config.hotkey, 'Meta+Shift+K')
  assert.equal(config.retentionDays, 365)
})

test('saveConfig rejects malformed hotkeys', async () => {
  const store = createConfigStore()
  await assert.rejects(() => saveConfig(store, { hotkey: 'Space' }), /hotkey/)
})
