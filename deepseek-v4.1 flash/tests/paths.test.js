import test from 'node:test'
import assert from 'node:assert/strict'
import { INBOX_DIR, isInboxCwd } from '../src/host/paths.js'

test('isInboxCwd accepts only the dedicated Inbox directory', () => {
  assert.equal(isInboxCwd(INBOX_DIR), true)
  assert.equal(isInboxCwd(INBOX_DIR + '/'), true)
  assert.equal(isInboxCwd('/Users/mac/d/dsh-friday'), false)
  assert.equal(isInboxCwd(''), false)
  assert.equal(isInboxCwd(undefined), false)
})
