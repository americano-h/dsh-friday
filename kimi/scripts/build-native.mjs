import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
await build({
  absWorkingDir: root,
  entryPoints: ['src/client/native.jsx'],
  bundle: true,
  outfile: 'native/window.js',
  format: 'iife',
  platform: 'browser',
  target: ['chrome120'],
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  legalComments: 'none',
  logLevel: 'warning',
})
console.log('built native/window.js')
