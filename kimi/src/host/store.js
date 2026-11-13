import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { randomUUID } from 'node:crypto'

/** Small serialized JSON store used only for derived metadata and settings. */
export class JsonStore {
  constructor(file, initial) {
    this.file = file
    this.initial = initial
    this.value = undefined
    this.loading = null
    this.queue = Promise.resolve()
  }

  async load() {
    if (this.value !== undefined) return this.value
    if (this.loading) return this.loading
    this.loading = (async () => {
      try {
        const parsed = JSON.parse(await readFile(this.file, 'utf8'))
        this.value = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
          ? parsed
          : this.initial()
      } catch (error) {
        if (error?.code !== 'ENOENT') {
          try {
            await rename(this.file, `${this.file}.corrupt-${Date.now()}-${randomUUID()}`)
          } catch (backupError) {
            if (backupError?.code !== 'ENOENT') throw backupError
          }
        }
        this.value = this.initial()
      }
      return this.value
    })()
    try {
      return await this.loading
    } finally {
      this.loading = null
    }
  }

  get() {
    if (this.value === undefined) throw new Error(`Store is not loaded: ${this.file}`)
    return this.value
  }

  async write(next) {
    await mkdir(dirname(this.file), { recursive: true })
    const temporary = `${this.file}.${process.pid}-${randomUUID()}.tmp`
    await writeFile(temporary, `${JSON.stringify(next, null, 2)}\n`, { mode: 0o600 })
    await rename(temporary, this.file)
    this.value = next
    return next
  }

  update(mutator) {
    const operation = this.queue.then(async () => {
      await this.load()
      const draft = structuredClone(this.value)
      const next = await mutator(draft)
      return this.write(next === undefined ? draft : next)
    })
    this.queue = operation.catch(() => {})
    return operation
  }

  async flush() {
    await this.queue
  }
}
