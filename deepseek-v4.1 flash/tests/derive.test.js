import test from 'node:test'
import assert from 'node:assert/strict'
import { deriveMessages, textOf } from '../src/host/sessions.js'

const user = (seq, content) => ({
  seq,
  type: 'user/message',
  time: seq * 10,
  data: { id: `u-${seq}`, content, source: { kind: 'user' } },
})
const assistant = (seq, content) => ({
  seq,
  type: 'assistant/message',
  time: seq * 10,
  data: { message: { id: `a-${seq}`, content } },
})
const toolResult = (seq, sources) => ({
  seq,
  type: 'tool/result',
  time: seq * 10,
  data: { meta: { sources, truncated: false } },
})

test('textOf joins text blocks only', () => {
  assert.equal(textOf([{ type: 'text', text: 'a' }, { type: 'image', attachment: { attachmentId: 'x' } }, { type: 'text', text: 'b' }]), 'a\nb')
  assert.equal(textOf(undefined), '')
})

test('deriveMessages keeps user/assistant turns and attaches citations', () => {
  const events = [
    user(1, [{ type: 'text', text: 'hello' }]),
    toolResult(2, [{ url: 'https://example.com/a', title: 'A' }]),
    toolResult(3, [{ url: 'https://example.com/b', title: 'B' }]),
    assistant(4, [{ type: 'text', text: 'answer' }]),
  ]
  const messages = deriveMessages(events)
  assert.equal(messages.length, 2)
  assert.equal(messages[0].role, 'user')
  assert.equal(messages[1].citationCount, undefined)
  assert.deepEqual(messages[1].citations.map((c) => c.url), ['https://example.com/a', 'https://example.com/b'])
  assert.equal(messages[1].text, 'answer')
})

test('deriveMessages skips runtime context and keeps image refs', () => {
  const events = [
    {
      seq: 1,
      type: 'user/message',
      time: 1,
      data: { id: 'ctx', content: [{ type: 'text', text: 'runtime context' }], source: { kind: 'runtime-context' } },
    },
    user(2, [
      { type: 'text', text: 'what is this?' },
      { type: 'image', attachment: { attachmentId: 'sha256:abc', mediaType: 'image/png', width: 2, height: 2, bytes: 10 } },
    ]),
  ]
  const messages = deriveMessages(events)
  assert.equal(messages.length, 1)
  assert.equal(messages[0].images.length, 1)
  assert.equal(messages[0].images[0].attachment.attachmentId, 'sha256:abc')
})

test('deriveMessages ignores malformed tool metadata', () => {
  const events = [
    { seq: 1, type: 'tool/result', time: 1, data: { meta: { sources: 'not-an-array' } } },
    user(2, [{ type: 'text', text: 'q' }]),
    assistant(3, [{ type: 'text', text: 'a' }]),
  ]
  const messages = deriveMessages(events)
  assert.equal(messages.length, 2)
  assert.equal(messages[1].citations, undefined)
})
