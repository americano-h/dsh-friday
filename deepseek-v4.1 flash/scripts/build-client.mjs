import { createRequire } from 'node:module'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outfile = resolve(root, 'client.js')

let build
try {
  const requireTool = createRequire(resolve(root, '../tools/build/package.json'))
  build = requireTool('esbuild').build
} catch {
  build = (await import('esbuild')).build
}

const result = await build({
  absWorkingDir: root,
  entryPoints: ['src/client/main.jsx'],
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'browser',
  target: ['chrome120'],
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  external: ['react'],
  legalComments: 'none',
  logLevel: 'warning',
})

const code = result.outputFiles[0].text
const wrapped = `window.__ModuleLoader__.load({
  id: 'dsh-friday',
  factory(require) {
    var module = { exports: {} };
    var exports = module.exports;
    (function (module, exports, require) {
${code}
    })(module, exports, require);
    return module.exports;
  },
});
`
await writeFile(outfile, wrapped)
console.log(`built client.js (${(wrapped.length / 1024).toFixed(1)} KiB)`)
