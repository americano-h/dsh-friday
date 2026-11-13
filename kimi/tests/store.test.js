import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { JsonStore } from '../src/host/store.js'

test('JSON store serializes updates and recovers corrupt data with a backup', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-friday-kimi-store-'))
  t.after(async () => { await rm(directory, { recursive: true, force: true }) })
  const file = join(directory, 'index.json')
  const store = new JsonStore(file, () => ({ version: 1, sessions: {} }))
  await store.load()
  await Promise.all([
    store.update((draft) => { draft.sessions.a = { order: 1 } }),
    store.update((draft) => { draft.sessions.b = { order: 2 } }),
  ])
  await store.flush()
  const persisted = JSON.parse(await readFile(file, 'utf8'))
  assert.deepEqual(Object.keys(persisted.sessions).sort(), ['a', 'b'])

  await writeFile(file, '{broken')
  const recovered = new JsonStore(file, () => ({ version: 1, sessions: {} }))
  await recovered.load()
  assert.deepEqual(recovered.get(), { version: 1, sessions: {} })
  const backups = (await readdir(directory)).filter((name) => name.includes('.corrupt-'))
  assert.equal(backups.length, 1)
})
