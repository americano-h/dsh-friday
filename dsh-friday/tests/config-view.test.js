import test from 'node:test'
import assert from 'node:assert/strict'
import { publicConfig } from '../src/host/config-view.js'

test('settings remain available when recent Inbox history fails to load', async () => {
  const warnings = []
  const ctx = {
    agentDefaultModel: { currentSelection: () => ({ provider: 'p', model: 'default-model' }) },
    attachments: { imageLimits: { maxImagesPerMessage: 4 } },
    sessionController: {
      modelCatalog: async () => ({ groups: [{ id: 'p', name: 'Provider', models: [{ id: 'm', name: 'Model' }] }] }),
    },
    llm: {
      resolveModelInfo: async () => ({ inputModalities: ['text', 'image'] }),
      listProviders: () => [],
    },
    logger: { warn: (message) => warnings.push(message) },
  }
  const configStore = {
    load: async () => {},
    get: () => ({ version: 1, defaultModel: null, visionModel: null, hotkey: 'Alt+Space', retentionDays: 14 }),
  }
  const result = await publicConfig(ctx, { list: async () => { throw new Error('bad history') } }, configStore, null)
  assert.equal(result.config.retentionDays, 14)
  assert.equal(result.models.length, 1)
  assert.equal(result.effectiveDefaultModel.model, 'default-model')
  assert.equal(result.recent, null)
  assert.equal(warnings.length, 1)
})

test('settings source exposes default model, vision model, hotkey, and retention controls', async () => {
  const { readFile } = await import('node:fs/promises')
  const source = await readFile(new URL('../src/client/settings.jsx', import.meta.url), 'utf8')
  for (const field of ['df-default-model', 'df-vision-model', 'df-hotkey', 'df-retention']) assert.ok(source.includes(field))
  assert.match(source, /retentionDays: 30/)
  assert.match(source, /api\.saveConfig/)
})
