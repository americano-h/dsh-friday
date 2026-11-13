import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
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
const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
const wrapped = `window.__ModuleLoader__.load({
  id: ${JSON.stringify(manifest.name)},
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
await writeFile(resolve(root, 'client.js'), wrapped)
console.log(`built client.js (${(wrapped.length / 1024).toFixed(1)} KiB)`)
