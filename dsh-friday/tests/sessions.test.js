import test from 'node:test'
import assert from 'node:assert/strict'
import { citationsOf, deriveMessages, imagesOf, textOf } from '../src/host/sessions.js'

const image = { attachmentId: 'a1', mediaType: 'image/png', bytes: 10, width: 1, height: 1 }

test('message text, images, and citations derive from native content blocks', () => {
  assert.equal(textOf([{ type: 'text', text: 'hello' }, { type: 'image', attachment: image }, { type: 'text', text: 'world' }]), 'hello\nworld')
  assert.deepEqual(imagesOf([{ type: 'image', attachment: image }]), [image])
  assert.deepEqual(citationsOf({ sources: [{ url: 'https://example.com', title: 'Example' }] }), [{ url: 'https://example.com', title: 'Example' }])
  assert.deepEqual(citationsOf({ sources: [{ url: 'javascript:alert(1)' }] }), [])
})

test('surface derivation retains questions, answers, images, and source URLs', () => {
  const events = [
    { seq: 1, time: 10, type: 'user/message', data: { id: 'u1', source: { kind: 'user' }, content: [{ type: 'text', text: 'Question' }, { type: 'image', attachment: image }] } },
    { seq: 2, time: 11, type: 'tool/result', data: { meta: { sources: [{ url: 'https://example.com', title: 'Example' }] } } },
    { seq: 3, time: 12, type: 'assistant/message', data: { message: { id: 'a1', content: [{ type: 'text', text: 'Answer' }] } } },
    { seq: 4, time: 13, type: 'user/message', data: { id: 'hidden', source: { kind: 'dsh-friday.regenerate' }, content: [{ type: 'text', text: 'Hidden instruction' }] } },
  ]
  const messages = deriveMessages(events)
  assert.equal(messages.length, 2)
  assert.equal(messages[0].text, 'Question')
  assert.equal(messages[0].images[0].attachment, image)
  assert.deepEqual(messages[1].citations, [{ url: 'https://example.com', title: 'Example' }])
  assert.equal(messages.some((message) => message.text === 'Hidden instruction'), false)
})

test('empty assistant tool steps do not discard citations for the final answer', () => {
  const events = [
    { seq: 1, time: 1, type: 'tool/result', data: { meta: { sources: [{ url: 'https://example.com' }] } } },
    { seq: 2, time: 2, type: 'assistant/message', data: { message: { content: [] } } },
    { seq: 3, time: 3, type: 'assistant/message', data: { message: { content: [{ type: 'text', text: 'Done' }] } } },
  ]
  assert.deepEqual(deriveMessages(events)[0].citations, [{ url: 'https://example.com' }])
})
