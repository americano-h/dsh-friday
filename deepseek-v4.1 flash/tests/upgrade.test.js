import test from 'node:test'
import assert from 'node:assert/strict'
import { localSummary } from '../src/host/upgrade.js'
import { isExpired } from '../src/host/inbox.js'

test('localSummary keeps a bounded recent transcript', () => {
  const messages = Array.from({ length: 40 }, (_, index) => ({
    role: index % 2 === 0 ? 'user' : 'assistant',
    text: `message-${index}`,
    citations: index === 30 ? [{ url: 'https://example.com' }] : undefined,
  }))
  const summary = localSummary({
    title: 'Demo',
    firstPrompt: 'first',
    createdAt: 0,
    messages,
  })
  assert.match(summary, /Inbox conversation: Demo/)
  assert.doesNotMatch(summary, /message-0\n/)
  assert.match(summary, /message-39/)
  assert.match(summary, /Sources: https:\/\/example.com/)
})

test('localSummary truncates long messages', () => {
  const summary = localSummary({
    title: '',
    firstPrompt: '',
    createdAt: 0,
    messages: [{ role: 'user', text: 'x'.repeat(3000) }],
  })
  assert.ok(summary.includes('…'))
  assert.ok(summary.length < 3000)
})

test('isExpired handles boundaries and missing timestamps', () => {
  const now = 100 * 24 * 60 * 60 * 1000
  assert.equal(isExpired(now - 29 * 24 * 60 * 60 * 1000, now, 30), false)
  assert.equal(isExpired(now - 31 * 24 * 60 * 60 * 1000, now, 30), true)
  assert.equal(isExpired(0, now, 30), false)
})
