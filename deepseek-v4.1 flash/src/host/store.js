import { readFile, rename, writeFile } from 'node:fs/promises'

function emptyIndex() {
  return { version: 1, sessions: {} }
}

export class JsonStore {
  constructor(file, fallback) {
    this.file = file
    this.fallback = fallback
    this.value = fallback()
    this.queue = Promise.resolve()
    this.loaded = false
  }

  async load() {
    if (this.loaded) return this.value
    try {
      const text = await readFile(this.file, 'utf8')
      const parsed = JSON.parse(text)
      if (parsed && typeof parsed === 'object') {
        this.value = { ...this.fallback(), ...parsed }
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        this.value = this.fallback()
        try {
          await rename(this.file, `${this.file}.corrupt-${Date.now()}`)
        } catch {}
      }
    }
    this.loaded = true
    return this.value
  }

  get() {
    return this.value
  }

  async update(mutator) {
    const run = async () => {
      await this.load()
      const next = await mutator(this.value)
      if (next !== undefined) this.value = next
      await this.flush()
      return this.value
    }
    const result = this.queue.then(run, run)
    this.queue = result.then(() => undefined, () => undefined)
    return result
  }

  async flush() {
    const tmp = `${this.file}.${process.pid}.tmp`
    await writeFile(tmp, JSON.stringify(this.value, null, 2), 'utf8')
    await rename(tmp, this.file)
  }
}

export function createIndexStore(file) {
  return new JsonStore(file, emptyIndex)
}
