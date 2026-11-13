import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
await build({
  absWorkingDir: root,
  entryPoints: ['src/client/native.jsx'],
  bundle: true,
  outfile: 'native/window.js',
  format: 'iife',
  define: { 'process.env.NODE_ENV': '"production"' },
  minify: true,
  platform: 'browser',
  target: ['chrome120'],
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  legalComments: 'none',
  logLevel: 'warning',
})
const require = createRequire(import.meta.url)
const licenses = []
for (const dependency of ['react', 'react-dom', 'scheduler']) {
  const from = dependency === 'scheduler' ? createRequire(require.resolve('react-dom')) : require
  const directory = dirname(from.resolve(dependency + '/package.json'))
  licenses.push(dependency + '\n' + await readFile(resolve(directory, 'LICENSE'), 'utf8'))
}
await writeFile(resolve(root, 'native/THIRD-PARTY-LICENSES.txt'), licenses.join('\n'))
console.log('built native/window.js')
