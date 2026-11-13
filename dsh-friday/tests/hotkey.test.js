import test from 'node:test'
import assert from 'node:assert/strict'
import { matchesHotkey, parseHotkey } from '../src/client/hotkey.js'

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
