import { spawn } from 'node:child_process'
import { EventEmitter } from 'node:events'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline'
import { publicConfig } from './config-view.js'
import { readConfig, saveConfig } from './config.js'
import { isFridayId } from './policy.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const BINARY = join(ROOT, 'native/friday-native')
const HTML = join(ROOT, 'native/window.html')

function fridayId(value) {
  if (typeof value !== 'string' || !isFridayId(value)) throw new Error('Conversation not found')
  return value
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error || 'Friday native request failed')
}

export function createNativeWindow(ctx, { repository, configStore, chat, upgrades }, initialHotkey) {
  const available = process.platform === 'darwin' && existsSync(BINARY) && existsSync(HTML)
  const streams = new Map()
  let child = null
  let disposed = false
  let hotkey = initialHotkey
  let pageReady = false
  let visible = false
  let hotkeyError = null
  let lastError = null
  let pendingTask = null

  function send(message) {
    if (!child?.stdin.writable) throw new Error('Friday native helper is not running')
    child.stdin.write(`${JSON.stringify(message)}\n`)
  }

  function reply(id, ok, value) {
    try { send({ type: 'response', id, ok, value }) } catch (error) { lastError = errorMessage(error) }
  }

  function streamResponse(id) {
    const res = new EventEmitter()
    let buffer = ''
    res.writableEnded = false
    res.destroyed = false
    res.writeHead = () => res
    res.write = (chunk) => {
      if (res.writableEnded || res.destroyed) return false
      buffer += String(chunk)
      let boundary
      while ((boundary = buffer.indexOf('\n\n')) >= 0) {
        const frame = buffer.slice(0, boundary)
        buffer = buffer.slice(boundary + 2)
        const data = frame.split('\n').filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).trimStart()).join('\n')
        if (!data) continue
        try { send({ type: 'stream', id, event: JSON.parse(data) }) } catch (error) { lastError = errorMessage(error) }
      }
      return true
    }
    res.end = () => {
      if (res.writableEnded) return
      res.writableEnded = true
      streams.delete(id)
      try { send({ type: 'streamEnd', id }) } catch {}
    }
    return res
  }

  async function startChat(id, params) {
    const res = streamResponse(id)
    streams.set(id, res)
    try {
      await chat.start({ req: new EventEmitter(), res, body: params?.body || {}, regenerate: Boolean(params?.regenerate) })
    } catch (error) {
      streams.delete(id)
      try { send({ type: 'streamEnd', id, message: errorMessage(error) }) } catch {}
    }
  }

  async function dispatch(id, method, params = {}) {
    if (method === 'chat') return startChat(id, params)
    try {
      let result
      if (method === 'config') result = await publicConfig(ctx, repository, configStore, api)
      else if (method === 'saveConfig') {
        const config = await saveConfig(configStore, params)
        hotkey = config.hotkey
        send({ type: 'hotkey', hotkey })
        result = { config }
      } else if (method === 'inbox') {
        result = { items: await repository.list({
          query: typeof params.q === 'string' ? params.q : '',
          status: params.status === 'archived' ? 'archived' : 'active',
          from: Number.isFinite(Number(params.from)) && params.from != null ? Number(params.from) : undefined,
          to: Number.isFinite(Number(params.to)) && params.to != null ? Number(params.to) : undefined,
          limit: params.limit || 200,
        }) }
      } else if (method === 'conversation') {
        const value = await repository.get(fridayId(params.sessionId))
        if (!value || value.deleted) throw new Error('Conversation not found')
        const { upgradeSummary, ...conversation } = value
        result = { conversation }
      } else if (method === 'remove') {
        await repository.archive(fridayId(params.sessionId))
        result = { deleted: true }
      } else if (method === 'clear') result = { count: await repository.clear() }
      else if (method === 'cleanup') result = { count: await repository.cleanup((await readConfig(configStore)).retentionDays) }
      else if (method === 'cancel') result = { accepted: chat.cancel(fridayId(params.sessionId)) }
      else if (method === 'workspaces') {
        result = { workspaces: ctx.workspaceRegistry.list().map((workspace) => ({ id: workspace.id, title: workspace.title, path: workspace.path, sessionCount: workspace.sessionIds.length })) }
      } else if (method === 'upgradePreview') {
        result = await upgrades.preview(fridayId(params.sessionId))
      } else if (method === 'upgrade') {
        if (typeof params.workspaceId !== 'string' || !params.workspaceId) throw new Error('workspaceId is required')
        result = await upgrades.upgrade(fridayId(params.sessionId), params.workspaceId, params.summary)
      } else if (method === 'attachment') {
        const value = await repository.attachment(fridayId(params.sessionId), String(params.attachmentId || ''))
        if (!value) throw new Error('Attachment not found')
        result = value
      } else if (method === 'createWorkspace') {
        if (typeof params.path !== 'string' || !params.path) throw new Error('A directory is required')
        result = await ctx.workspaceRegistry.create(params.path)
      } else if (method === 'openTask') {
        if (typeof params.sessionId !== 'string' || !params.sessionId) throw new Error('Task session id is required')
        pendingTask = params.sessionId
        const base = ctx.webApp?.getAdvertisedUrl() || ctx.webServer.getOrigin()
        result = { accepted: true, url: ctx.connection.authenticatedUrl(base) }
      } else if (method === 'ackTask') {
        if (pendingTask === params.sessionId) pendingTask = null
        result = { accepted: true }
      } else throw new Error('Unsupported Friday native method')
      reply(id, true, result)
    } catch (error) {
      reply(id, false, { message: errorMessage(error) })
    }
  }

  function onLine(line) {
    let message
    try { message = JSON.parse(line) } catch { return }
    if (message.type === 'status') {
      if (typeof message.pageReady === 'boolean') pageReady = message.pageReady
      if (typeof message.visible === 'boolean') visible = message.visible
      if (Object.hasOwn(message, 'hotkeyError')) hotkeyError = message.hotkeyError || null
      if (message.message) lastError = String(message.message)
      return
    }
    if (message.type === 'abort') {
      const res = streams.get(message.id)
      if (!res) return
      res.destroyed = true
      res.emit('close')
      res.end()
      return
    }
    if (message.type !== 'request' || typeof message.id !== 'string' || typeof message.method !== 'string') return
    void dispatch(message.id.slice(0, 160), message.method, message.params)
  }

  async function start() {
    if (!available || disposed || child) return
    lastError = null
    try {
      child = spawn(BINARY, [], { stdio: ['pipe', 'pipe', 'pipe'] })
      const process = child
      pageReady = false
      createInterface({ input: process.stdout }).on('line', onLine)
      createInterface({ input: process.stderr }).on('line', (line) => {
        if (line.trim()) ctx.logger.warn(`dsh-friday: native helper: ${line}`)
      })
      process.once('error', (error) => { lastError = errorMessage(error) })
      process.once('exit', (code) => {
        if (child === process) child = null
        pageReady = false
        visible = false
        for (const res of streams.values()) { res.destroyed = true; res.emit('close') }
        streams.clear()
        if (!disposed && code) {
          lastError = `Friday native helper exited with code ${code}`
          ctx.logger.warn(`dsh-friday: ${lastError}`)
        }
      })
      send({ type: 'configure', htmlPath: HTML, hotkey })
    } catch (error) {
      child = null
      lastError = errorMessage(error)
      ctx.logger.warn(`dsh-friday: could not start native helper: ${lastError}`)
    }
  }

  async function configure(nextHotkey) {
    hotkey = nextHotkey || hotkey
    hotkeyError = null
    await start()
    if (child) send({ type: 'hotkey', hotkey })
  }

  function snapshot() {
    return {
      available,
      running: Boolean(child && child.exitCode == null),
      pageReady,
      visible,
      hotkey,
      hotkeyError,
      lastError,
    }
  }

  const api = {
    pendingTask: null,
    start,
    configure,
    snapshot,
    ackTask(sessionId) { if (pendingTask === sessionId) pendingTask = null },
  }
  Object.defineProperty(api, 'pendingTask', { get: () => pendingTask })

  ctx.effect(() => () => {
    disposed = true
    for (const res of streams.values()) { res.destroyed = true; res.emit('close') }
    streams.clear()
    if (!child) return
    try { send({ type: 'terminate' }) } catch {}
    const process = child
    const timer = setTimeout(() => { try { process.kill('SIGTERM') } catch {} }, 500)
    timer.unref()
  }, 'dsh-friday: native window')

  return api
}
