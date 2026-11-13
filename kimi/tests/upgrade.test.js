import test from 'node:test'
import assert from 'node:assert/strict'
import { compressConversation } from '../src/host/upgrade.js'

test('upgrade compression sends no tools and produces a standalone task brief', async () => {
  const requests = []
  const ctx = {
    llm: {
      stream(options) {
        requests.push(options)
        return (async function * () {
          yield { type: 'text-delta', text: '# Task brief\nContinue the work.' }
          yield { type: 'finish', reason: { kind: 'stop' } }
        })()
      },
    },
  }
  const conversation = {
    messages: [
      { role: 'user', text: 'Build an integration', images: [{ attachment: { attachmentId: 'a1' } }] },
      { role: 'assistant', text: 'Use the official API.', citations: [{ url: 'https://example.com', title: 'Docs' }] },
    ],
  }
  const result = await compressConversation(ctx, conversation, { provider: 'deepseek', model: 'chat' })
  assert.match(result, /Task brief/)
  assert.equal(requests.length, 1)
  assert.equal(requests[0].tools, undefined)
  assert.match(requests[0].messages[0].content[0].text, /image attachment/)
  assert.match(requests[0].messages[0].content[0].text, /https:\/\/example.com/)
})

test('compression propagates provider failures instead of creating an empty task', async () => {
  const ctx = {
    llm: {
      stream() {
        return (async function * () {
          yield { type: 'finish', reason: { kind: 'error', failure: { message: 'rate limited' } } }
        })()
      },
    },
  }
  await assert.rejects(() => compressConversation(ctx, { messages: [{ role: 'user', text: 'Hello' }] }, { provider: 'p', model: 'm' }), /rate limited/)
})
