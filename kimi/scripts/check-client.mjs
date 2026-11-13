import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')
new vm.Script(source, { filename: 'client.js' })
const registrations = []
const context = {
  window: {
    __ModuleLoader__: {
      load(definition) { registrations.push(definition) },
    },
  },
}
vm.runInNewContext(source, context)
if (registrations.length !== 1 || registrations[0].id !== 'dsh-friday') {
  throw new Error('client.js must register exactly one dsh-friday factory')
}
if (typeof registrations[0].factory !== 'function') throw new Error('Client factory is missing')
if (/\brequire\(["']@deepseek-ai\//.test(source)) throw new Error('Client imports a Harness package at runtime')
console.log('client.js syntax and module wrapper are valid')
