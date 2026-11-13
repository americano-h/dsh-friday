import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('client avoids raw HTML injection and Harness Client package imports', async () => {
  const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')
  assert.equal(source.includes('dangerouslySetInnerHTML'), false)
  assert.equal(/require\(["']@deepseek-ai\/dsh-client/.test(source), false)
})

test('manifest, row id, and settings slot key are aligned', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  const patch = await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8')
  const main = await readFile(new URL('../src/client/main.jsx', import.meta.url), 'utf8')
  assert.equal(manifest.name, 'dsh-friday')
  assert.match(patch, /id: friday/)
  assert.ok(main.includes("key: 'dsh-friday#friday'"))
  assert.equal(manifest.version, '0.2.10')
})
