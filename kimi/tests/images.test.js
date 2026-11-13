import test from 'node:test'
import assert from 'node:assert/strict'
import { decodeImage, saveImages } from '../src/host/images.js'

const png = `data:image/png;base64,${Buffer.from([1, 2, 3]).toString('base64')}`

test('image data URLs are strict and decoded without tools', () => {
  const value = decodeImage(png)
  assert.equal(value.mediaType, 'image/png')
  assert.deepEqual([...value.data], [1, 2, 3])
  assert.throws(() => decodeImage('data:text/plain;base64,AQID'), /Only PNG/)
  assert.throws(() => decodeImage('file:///tmp/image.png'), /data URL/)
})

test('image batches use authoritative DSH limits and attachment storage', async () => {
  const calls = []
  const ctx = {
    attachments: {
      imageLimits: { maxImagesPerMessage: 2 },
      saveImages: async (inputs) => { calls.push(inputs); return [{ attachmentId: 'saved' }] },
    },
  }
  assert.deepEqual(await saveImages(ctx, [{ dataUrl: png }]), [{ attachmentId: 'saved' }])
  assert.equal(calls.length, 1)
  await assert.rejects(() => saveImages(ctx, [{ dataUrl: png }, { dataUrl: png }, { dataUrl: png }]), /at most 2/)
  assert.equal(calls.length, 1)
})
