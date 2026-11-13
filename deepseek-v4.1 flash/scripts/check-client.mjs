import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

const root = new URL('..', import.meta.url)
const source = await readFile(new URL('client.js', root), 'utf8')
let loaded = null
const sandbox = {
  window: {
    __ModuleLoader__: {
      load(definition) {
        loaded = definition
      },
    },
  },
  console,
}
vm.runInNewContext(source, sandbox, { filename: 'client.js' })
if (!loaded || loaded.id !== 'dsh-friday' || typeof loaded.factory !== 'function') {
  throw new Error('client.js does not register the dsh-friday factory')
}
const fakeRequire = (name) => {
  if (name === 'react') {
    return {
      createElement: () => null,
      Fragment: Symbol('Fragment'),
      useState: () => [undefined, () => {}],
      useEffect: () => {},
      useRef: () => ({ current: null }),
      useMemo: (fn) => fn(),
      useSyncExternalStore: () => undefined,
      Component: class {},
    }
  }
  throw new Error(`unexpected external module: ${name}`)
}
const plugin = loaded.factory(fakeRequire)
if (!plugin || !Array.isArray(plugin.inject) || typeof plugin.apply !== 'function') {
  throw new Error('client factory did not return a Cordis plugin')
}
if (!plugin.inject.includes('slots') || !plugin.inject.includes('locale')) {
  throw new Error('client plugin is missing required injections')
}
for (const locale of ['en', 'zh']) {
  const dict = JSON.parse(await readFile(new URL(`locale/${locale}.json`, root), 'utf8'))
  if (!dict.meta?.title || !dict.inbox?.title || !dict.overlay?.title) {
    throw new Error(`locale/${locale}.json is missing required keys`)
  }
}
console.log('client bundle and locale resources look valid')
