import test from 'node:test'
import assert from 'node:assert/strict'
import { formatShortcut, matchesHotkey, parseHotkey } from '../src/client/hotkey.js'
import { defaultHotkey, defaultShortcuts, recordedShortcut } from '../src/shared/preferences.js'

const base = { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false }

test('Option+Space uses physical Space code rather than NBSP event.key', () => {
  const hotkey = parseHotkey('Alt+Space')
  assert.equal(matchesHotkey({ ...base, altKey: true, key: ' ', code: 'Space' }, hotkey), true)
  assert.equal(matchesHotkey({ ...base, altKey: true, key: 'Space', code: 'KeyA' }, hotkey), false)
})

test('custom modifiers must match exactly', () => {
  const hotkey = parseHotkey('Meta+Shift+K')
  assert.equal(matchesHotkey({ ...base, metaKey: true, shiftKey: true, key: 'k', code: 'KeyK' }, hotkey), true)
  assert.equal(matchesHotkey({ ...base, metaKey: true, key: 'k', code: 'KeyK' }, hotkey), false)
  assert.equal(matchesHotkey({ ...base, metaKey: true, shiftKey: true, altKey: true, key: 'k', code: 'KeyK' }, hotkey), false)
})

test('macOS Option+N matches the physical key even for dead-key input', () => {
  const spec = parseHotkey('Alt+N')
  assert.ok(matchesHotkey({ ...base, key: 'Dead', code: 'KeyN', altKey: true }, spec))
  assert.ok(!matchesHotkey({ ...base, key: 'n', code: 'KeyN' }, spec))
})

test('default shortcuts use macOS key names in both Chromium and WebKit', () => {
  const specs = [defaultHotkey, ...Object.values(defaultShortcuts)]
  const expected = ['Option + Space', 'Option + N', 'Esc', 'Return', 'Shift + Return']
  for (const platform of ['macOS', 'MacIntel']) {
    assert.deepEqual(specs.map((spec) => formatShortcut(spec, platform)), expected)
  }
})

test('recorded and legacy shortcuts display according to the client platform', () => {
  const spec = recordedShortcut({ ...base, code: 'KeyK', metaKey: true, altKey: true })
  assert.equal(spec, 'Alt+Meta+K')
  assert.equal(formatShortcut(spec, 'MacIntel'), 'Option + Command + K')
  assert.equal(formatShortcut(spec, 'Win32'), 'Alt + Windows + K')
  assert.equal(formatShortcut(spec, 'Linux x86_64'), 'Alt + Super + K')
  assert.equal(formatShortcut('Option+Ctrl+Backspace', 'macOS'), 'Control + Option + Delete')
  assert.equal(formatShortcut('Cmd+Delete', 'macOS'), 'Command + Forward Delete')
})
