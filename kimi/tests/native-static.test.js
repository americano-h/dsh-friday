import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'

const text = (path) => readFile(new URL(path, import.meta.url), 'utf8')

test('native executable, local HTML, and bundled window client are present', async () => {
  const binary = await stat(new URL('../native/friday-native', import.meta.url))
  assert.ok(binary.isFile())
  assert.ok(binary.mode & 0o111)
  const html = await text('../native/window.html')
  assert.match(html, /Content-Security-Policy/)
  assert.match(html, /connect-src 'none'/)
  assert.match(html, /src="\.\/window\.js"/)
  assert.doesNotMatch(html, /https?:\/\//)
  const bundle = await text('../native/window.js')
  assert.ok(bundle.length > 100000)
  assert.doesNotMatch(bundle, /__ModuleLoader__/)
})

test('AppKit helper uses global hotkeys, native glass, and free window dragging', async () => {
  const source = await text('../native/FridayNative.swift')
  assert.match(source, /RegisterEventHotKey/)
  assert.match(source, /NSGlassEffectView/)
  assert.match(source, /performDrag\(with:/)
  assert.match(source, /canJoinAllSpaces/)
  assert.match(source, /runOpenPanelWith/)
})

test('quick composer has the requested plus-input-send order and exact placeholder', async () => {
  const composer = await text('../src/client/composer.jsx')
  const plus = composer.indexOf('name="plus"')
  const input = composer.indexOf('<textarea')
  const send = composer.indexOf('className="df-send"')
  assert.ok(plus >= 0 && plus < input && input < send)
  const zh = JSON.parse(await text('../locale/zh.json'))
  assert.equal(zh.quick.placeholder, '向 Friday 提问')
  assert.equal(zh.inbox.upgrade, '升级')
})

test('Inbox continues in its fixed inline composer instead of opening the quick overlay', async () => {
  const inbox = await text('../src/client/inbox.jsx')
  const styles = await text('../src/client/styles.js')
  assert.match(inbox, /<ConversationComposer/)
  assert.match(inbox, /streamChat\(/)
  assert.match(inbox, /df-inline-chat/)
  assert.doesNotMatch(inbox, /openOverlay\(detail\.id\)/)
  assert.match(styles, /\.df-inline-chat \{ flex: 0 0 auto;/)
  assert.match(styles, /\.df-native \.df-quick/)
})

test('all new quick panels share one minimal white composer without helper text', async () => {
  const overlay = await text('../src/client/overlay.jsx')
  const styles = await text('../src/client/styles.js')
  const native = await text('../native/FridayNative.swift')
  assert.doesNotMatch(overlay, /df-quick-empty|df-quick-foot|Web Search only|Friday Inbox/)
  assert.match(overlay, /runtime\.native\.resize/)
  assert.match(styles, /\.df-quick \{ --dsw-alias-bg-layer-1: #fff/)
  assert.match(styles, /0 0 0 8px color-mix/)
  assert.match(native, /width: 736, height: 78/)
  assert.match(native, /case "resize"/)
})

test('plugin metadata uses Friday outside the Inbox page', async () => {
  const zh = JSON.parse(await text('../locale/zh.json'))
  const en = JSON.parse(await text('../locale/en.json'))
  const main = await text('../src/client/main.jsx')
  assert.equal(zh.meta.title, 'Friday')
  assert.equal(en.meta.title, 'Friday')
  assert.equal(zh.inbox.title, 'Inbox')
  assert.doesNotMatch(main, /Friday Inbox/)
})

test('upgrade dialog edits context and shows a quiet workspace path', async () => {
  const dialog = await text('../src/client/upgrade.jsx')
  const styles = await text('../src/client/styles.js')
  const zh = JSON.parse(await text('../locale/zh.json'))
  assert.match(dialog, /df-upgrade-summary/)
  assert.match(dialog, /api\.previewUpgrade/)
  assert.match(dialog, /api\.upgrade\(sessionId, state\.selected, state\.summary\.trim\(\)\)/)
  assert.match(dialog, /df-workspace-path/)
  assert.match(styles, /\.df-workspace-path .*var\(--dsw-alias-label-secondary\)/)
  assert.equal(zh.dialog.confirm, '压缩并新建')
})
