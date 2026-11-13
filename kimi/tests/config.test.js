import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeConfig, normalizeModel, validateHotkey } from '../src/host/config.js'

test('configuration defaults to 30 days and Option+Space', () => {
  assert.deepEqual(normalizeConfig(), {
    version: 1,
    defaultModel: null,
    visionModel: null,
    hotkey: 'Alt+Space',
    retentionDays: 30,
  })
})

test('configuration validates model routes and retention', () => {
  assert.deepEqual(normalizeModel({ provider: ' deepseek ', model: ' chat ' }), { provider: 'deepseek', model: 'chat' })
  assert.equal(normalizeModel({ provider: 'deepseek' }), null)
  assert.throws(() => normalizeConfig({ retentionDays: 0 }), /1 to 365/)
  assert.throws(() => normalizeConfig({ retentionDays: 30.5 }), /integer/)
  assert.throws(() => normalizeConfig({ retentionDays: 366 }), /1 to 365/)
})

test('hotkeys require a primary modifier and a single supported key', () => {
  assert.equal(validateHotkey('Option+Space'), 'Option+Space')
  assert.equal(validateHotkey('Meta+Shift+K'), 'Meta+Shift+K')
  assert.throws(() => validateHotkey('Space'), /Hotkey must include/)
  assert.throws(() => validateHotkey('Alt+A+B'), /Hotkey must include/)
  assert.throws(() => validateHotkey('Alt+Space;rm'), /Hotkey must include/)
})
