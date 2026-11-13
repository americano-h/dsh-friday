import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { DATA_DIR } from './config.js'
import { isFridayAgent, isFridayId } from './policy.js'
import { JsonStore } from './store.js'

export function textOf(content) {
  if (!Array.isArray(content)) return ''
  return content
    .filter((block) => block?.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text)
    .join('\n')
    .trim()
}

export function imagesOf(content) {
  if (!Array.isArray(content)) return []
  return content.filter((block) => block?.type === 'image' && block.attachment).map((block) => block.attachment)
}

export function citationsOf(meta) {
  if (!meta || typeof meta !== 'object') return []
  const candidates = [meta.sources, meta.result?.sources, meta.value?.sources]
  const sources = candidates.find(Array.isArray) || []
  return sources.filter((source) => source && typeof source.url === 'string' && /^https?:\/\//i.test(source.url)).map((source) => ({
    url: source.url,
    ...(typeof source.title === 'string' ? { title: source.title } : {}),
    ...(typeof source.snippet === 'string' ? { snippet: source.snippet } : {}),
    ...(typeof source.publishedAt === 'string' ? { publishedAt: source.publishedAt } : {}),
  }))
}

const MESSAGE_ROLE_BY_EVENT = {
  'system/message': 'system',
  'developer/message': 'developer',
  'user/message': 'user',
  'assistant/message': 'assistant',
  'tool/result': 'tool',
}

function repairedMessage(message, role) {
  if (!message || typeof message !== 'object' || Array.isArray(message)) return message
  const missingId = typeof message.id !== 'string' || message.id.length === 0
  if (!missingId && message.role === role) return message
  return {
    ...message,
    ...(missingId ? { id: randomUUID() } : {}),
    role,
  }
}

/**
 * Repair pre-0.1.2 Friday log records that reached persistence without the
 * complete message identity required by DSH's seed validator. The original
 * events are returned unchanged unless a field is actually missing.
 * @param {Array<object>} events raw persisted session events.
 * @returns {{ events: Array<object>, changed: boolean }} repaired copy and whether anything changed.
 */
export function normalizeSessionSeed(events) {
  if (!Array.isArray(events)) return { events: [], changed: false }
  let changed = false
  const next = events.map((event) => {
    if (!event || typeof event !== 'object' || Array.isArray(event)) return event
    if (event.type === 'agent/inbox/spliced' && Array.isArray(event.data?.inserted)) {
      let spliceChanged = false
      const inserted = event.data.inserted.map((message) => {
        const role = typeof message?.role === 'string' && message.role ? message.role : 'user'
        const repaired = repairedMessage(message, role)
        if (repaired !== message) spliceChanged = true
        return repaired
      })
      if (!spliceChanged) return event
      changed = true
      return { ...event, data: { ...event.data, inserted } }
    }
    const role = MESSAGE_ROLE_BY_EVENT[event.type]
    if (role === undefined) return event
    if (event.type === 'user/message') {
      const repaired = repairedMessage(event.data, role)
      if (repaired === event.data) return event
      changed = true
      return { ...event, data: repaired }
    }
    const message = event.data?.message
    const repaired = repairedMessage(message, role)
    if (repaired === message) return event
    changed = true
    return { ...event, data: { ...event.data, message: repaired } }
  })
  return { events: next, changed }
}

/** Whether an error is DSH refusing a persisted log whose message shape is incomplete. */
export function isSeedValidationError(error) {
  const message = error instanceof Error ? error.message : String(error || '')
  return (message.startsWith('seed ') && /at index \d+/.test(message))
    || (message.includes('stored session') && message.includes('failed validation'))
    || message.includes('session event at seq')
    || message.includes('message must have role')
    || message.includes('lacks an identified message')
}


export function deriveMessages(events) {
  const messages = []
  let citations = []
  for (const event of events || []) {
    if (event.type === 'tool/result') {
      const next = citationsOf(event.data?.meta)
      if (next.length) citations = [...new Map([...citations, ...next].map((item) => [item.url, item])).values()]
      continue
    }
    if (event.type === 'user/message') {
      const message = event.data
      if (message?.source?.kind !== 'user') continue
      const text = textOf(message.content)
      const images = imagesOf(message.content)
      if (!text && !images.length) continue
      messages.push({
        id: message.id || `user-${event.seq}`,
        role: 'user',
        text,
        ...(images.length ? { images: images.map((attachment) => ({ attachment })) } : {}),
        at: event.time,
        seq: event.seq,
      })
      continue
    }
    if (event.type === 'assistant/message') {
      const message = event.data?.message
      const text = textOf(message?.content)
      if (!text) continue
      messages.push({
        id: message?.id || `assistant-${event.seq}`,
        role: 'assistant',
        text,
        ...(citations.length ? { citations } : {}),
        at: event.time,
        seq: event.seq,
        ...(event.data?.interrupted ? { interrupted: true } : {}),
      })
      citations = []
    }
  }
  return messages
}

function summaryFromSnapshot(snapshot, surface, entry = {}) {
  const events = snapshot.events || []
  const messages = deriveMessages(surface.events || [])
  let title = ''
  let model = entry.model || null
  let updatedAt = snapshot.session.createdAt || entry.createdAt || 0
  let firstPrompt = ''
  let hasImage = false
  for (const event of events) {
    if (event.time > updatedAt) updatedAt = event.time
    if (event.type === 'session/title' && typeof event.data?.title === 'string') title = event.data.title
    if (event.type === 'request/header' && event.data?.header?.config) {
      model = {
        provider: event.data.header.config.provider,
        model: event.data.header.config.model,
      }
    }
    if (event.type === 'user/message' && event.data?.source?.kind === 'user') {
      if (!firstPrompt) firstPrompt = textOf(event.data.content).slice(0, 180)
      if (imagesOf(event.data.content).length) hasImage = true
    }
  }
  return {
    id: snapshot.session.id,
    title: title || (entry.title && entry.title !== 'New conversation' ? entry.title : '') || firstPrompt.slice(0, 56) || 'Untitled conversation',
    firstPrompt: firstPrompt || entry.firstPrompt || '',
    createdAt: snapshot.session.createdAt,
    updatedAt,
    model,
    defaultModel: entry.defaultModel || model,
    hasImage: hasImage || messages.some((message) => message.images?.length),
    archived: Boolean(entry.archivedAt),
    archivedAt: entry.archivedAt || null,
    upgraded: Boolean(entry.upgradedSessionId),
    upgradedSessionId: entry.upgradedSessionId || null,
    upgradedWorkspaceId: entry.upgradedWorkspaceId || null,
    upgradeState: entry.upgradeState || null,
    upgradeSummary: entry.upgradeSummary || '',
    deleted: Boolean(entry.deletedAt),
    messages,
  }
}

const RELEASE_DELAY = 1500

export function createRepository(ctx, policy) {
  const store = new JsonStore(join(DATA_DIR, 'index.json'), () => ({ version: 1, sessions: {} }))
  const handles = new Map()
  const refreshTimers = new Map()
  const releaseTimers = new Map()
  const reserved = new Map()
  let disposed = false

  const entry = (id) => store.get().sessions?.[id] || {}

  const prepareAgent = (agentCtx, agent) => policy.prepare(agentCtx, agent)

  async function rawSnapshot(id) {
    if (typeof ctx.sessionPersistence?.open !== 'function') return null
    const handle = await ctx.sessionPersistence.open(id, 'read')
    try {
      const cold = await handle.read(0, undefined)
      return {
        session: structuredClone(handle.header),
        inheritedEventCount: handle.inheritedEventCount,
        events: Array.isArray(cold?.events) ? cold.events : [],
      }
    } finally {
      try { await handle.close() } catch {}
    }
  }

  async function snapshot(id) {
    if (!isFridayId(id)) return null
    await store.load()
    if (entry(id).corruptedAt) return null
    try {
      const value = await ctx.sessionQuery.readSession(id)
      if (value.session?.cwd) return null
      return value
    } catch (error) {
      if (!isSeedValidationError(error)) throw error
      // The persistence backend validates stored events on every read, so a
      // pre-0.1.2 log with an incomplete message is unreadable through DSH APIs.
      let value = null
      try { value = await rawSnapshot(id) } catch { value = null }
      if (!value || !normalizeSessionSeed(value.events).changed) {
        await update(id, { corruptedAt: entry(id).corruptedAt || Date.now() })
        ctx.logger.warn(`dsh-friday: stored history for ${id} failed validation; isolated from Inbox`)
        return null
      }
      if (value.session?.cwd) return null
      return value
    }
  }

  async function get(id) {
    await store.load()
    const current = await snapshot(id)
    if (!current) return null
    let surface
    try {
      surface = await ctx.sessionQuery.readSurface(id)
    } catch {
      surface = { events: [] }
    }
    const result = summaryFromSnapshot(current, surface, entry(id))
    const agent = ctx.agents.get(id)
    result.running = agent?.status === 'running'
    return result
  }

  async function update(id, patch) {
    await store.update((draft) => {
      draft.version = 1
      draft.sessions ||= {}
      draft.sessions[id] = { ...(draft.sessions[id] || {}), ...patch }
      return draft
    })
  }

  async function refresh(id) {
    const value = await get(id)
    if (!value || disposed) return value
    await update(id, {
      title: value.title,
      firstPrompt: value.firstPrompt,
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
      model: value.model,
      hasImage: value.hasImage,
    })
    return value
  }

  async function create(selection, options = {}) {
    await store.load()
    const sessionId = `friday-${randomUUID()}`
    const handle = await ctx.agents.create({
      sessionId,
      ...(Array.isArray(options.seed) ? { seed: options.seed } : {}),
      agentOptions: selection || {},
      meta: {},
      setup: prepareAgent,
    })
    handles.set(sessionId, handle)
    const now = handle.agent.session.header.createdAt || Date.now()
    await update(sessionId, {
      createdAt: now,
      updatedAt: now,
      defaultModel: selection || null,
      model: selection || null,
      title: 'New conversation',
      firstPrompt: '',
      hasImage: false,
      ...(options.recoveredFrom ? { recoveredFrom: options.recoveredFrom } : {}),
    })
    return handle.agent
  }

  /**
   * Continue a pre-0.1.2 conversation whose persisted seed is incomplete.
   * The old log stays untouched; its sanitized events seed a new native
   * session, and the old index entry only records the mapping and hides the
   * duplicate list row.
   */
  async function recover(id) {
    const previous = entry(id)
    if (previous.recoveredSessionId) {
      const live = ctx.agents.get(previous.recoveredSessionId)
      if (live && isFridayAgent(live)) return live
      const prior = await snapshot(previous.recoveredSessionId).catch((error) => {
        if (isSeedValidationError(error)) return null
        throw error
      })
      if (prior) {
        const resumed = await ctx.agents.resume({ resumeSessionId: previous.recoveredSessionId, setup: prepareAgent })
        handles.set(previous.recoveredSessionId, resumed)
        return resumed.agent
      }
    }
    let raw = null
    try { raw = await rawSnapshot(id) } catch { raw = null }
    if (!raw) {
      await update(id, {
        corruptedAt: previous.corruptedAt || Date.now(),
        archivedAt: previous.archivedAt || Date.now(),
        deletedAt: previous.deletedAt || Date.now(),
      })
      throw new Error('This older conversation has an unreadable stored history and cannot be continued. Start a new conversation.')
    }
    const repaired = normalizeSessionSeed(raw.events)
    if (!repaired.changed) throw new Error('Conversation log has no recoverable messages')
    const selection = previous.defaultModel || previous.model || null
    const agent = await create(selection, { seed: repaired.events, recoveredFrom: id })
    await update(id, {
      recoveredSessionId: agent.id,
      recoveredAt: Date.now(),
      archivedAt: previous.archivedAt || Date.now(),
      deletedAt: previous.deletedAt || Date.now(),
    })
    return agent
  }

  /**
   * Dispose the Friday-owned Agent for one conversation so its Session goes
   * cold. A live Session without cwd is listed by DSH's session list (the
   * sidebar "Ungrouped" bucket) and is treated as host-owned by deletion
   * tools; Friday only keeps an Agent while a turn is being served.
   * @param {string} id Friday session id.
   * @param {{ force?: boolean }} [options] force also releases a running Agent.
   * @returns {Promise<boolean>} whether a handle was released.
   */
  async function release(id, { force = false, busy } = {}) {
    const handle = handles.get(id)
    if (!handle) return false
    const agent = ctx.agents.get(id)
    if (!force && agent?.status === 'running') return false
    if (busy?.()) return false
    try {
      if (agent?.session) await ctx.sessions.flush(agent.session)
    } catch (error) {
      ctx.logger.warn(`dsh-friday: flush before release failed for ${id}: ${String(error)}`)
    }
    // A new turn may have started while flushing; keep serving it.
    if (busy?.() || reserved.has(id) || handles.get(id) !== handle) return false
    if (!force && ctx.agents.get(id)?.status === 'running') return false
    handles.delete(id)
    clearTimeout(releaseTimers.get(id))
    releaseTimers.delete(id)
    try {
      await handle.dispose()
    } catch (error) {
      ctx.logger.warn(`dsh-friday: releasing ${id} failed: ${String(error)}`)
    }
    return true
  }

  /** Release an owned Agent shortly after it becomes idle and unreserved. */
  function scheduleRelease(id, delay = RELEASE_DELAY) {
    if (disposed || !handles.has(id)) return
    clearTimeout(releaseTimers.get(id))
    const timer = setTimeout(() => {
      releaseTimers.delete(id)
      if (reserved.has(id) || ctx.agents.get(id)?.status === 'running') return
      release(id).catch((error) => ctx.logger.warn(`dsh-friday: idle release failed for ${id}: ${String(error)}`))
    }, delay)
    if (typeof timer.unref === 'function') timer.unref()
    releaseTimers.set(id, timer)
  }

  /**
   * Keep a conversation's Agent loaded while one chat request uses it.
   * @param {string} id Friday session id.
   * @returns {() => void} idempotent unreserve callback that schedules release.
   */
  function reserve(id) {
    reserved.set(id, (reserved.get(id) || 0) + 1)
    clearTimeout(releaseTimers.get(id))
    let done = false
    return () => {
      if (done) return
      done = true
      const count = (reserved.get(id) || 1) - 1
      if (count > 0) reserved.set(id, count)
      else reserved.delete(id)
      scheduleRelease(id)
    }
  }

  async function ensureAgent(id) {
    const existing = ctx.agents.get(id)
    if (existing) {
      if (!isFridayAgent(existing)) throw new Error('Conversation is not an active Friday session')
      prepareAgent(existing.ctx, existing)
      return existing
    }
    if (!await snapshot(id)) {
      if (entry(id).corruptedAt) throw new Error('This older conversation has an unreadable stored history and cannot be continued. Start a new conversation.')
      throw new Error('Conversation not found')
    }
    try {
      const handle = await ctx.agents.resume({
        resumeSessionId: id,
        setup: prepareAgent,
      })
      handles.set(id, handle)
      return handle.agent
    } catch (error) {
      if (!isSeedValidationError(error)) throw error
      return await recover(id)
    }
  }

  async function list({ query = '', status = 'active', from, to, limit = 200 } = {}) {
    await store.load()
    let records
    try {
      records = await ctx.sessionPersistence.list()
    } catch (error) {
      ctx.logger.warn(`dsh-friday: persistence listing failed, falling back to the derived index: ${String(error)}`)
      records = Object.keys(store.get().sessions || {}).map((id) => ({ header: { id } }))
    }
    const ids = records
      .filter((record) => isFridayId(record?.header?.id) && !record?.header?.cwd)
      .map((record) => record.header.id)
    const needle = String(query || '').trim().toLocaleLowerCase()
    const items = []
    for (const id of ids) {
      const current = entry(id)
      if (current.deletedAt || current.corruptedAt) continue
      let value
      try {
        value = await get(id)
      } catch (error) {
        if (!isSeedValidationError(error)) throw error
        await update(id, { corruptedAt: current.corruptedAt || Date.now() })
        ctx.logger.warn(`dsh-friday: skipped ${id} after stored-history validation failed`)
        continue
      }
      if (!value || value.deleted || entry(id).corruptedAt) continue
      if (status === 'active' && (value.archived || value.upgraded)) continue
      if (status === 'archived' && !(value.archived || value.upgraded)) continue
      if (from != null && value.updatedAt < from) continue
      if (to != null && value.updatedAt > to) continue
      if (needle) {
        const hit = value.messages.find((message) => message.text.toLocaleLowerCase().includes(needle))
        const metadataHit = `${value.title}\n${value.firstPrompt}`.toLocaleLowerCase().includes(needle)
        if (!hit && !metadataHit) continue
        if (hit) {
          const at = hit.text.toLocaleLowerCase().indexOf(needle)
          value.snippet = hit.text.slice(Math.max(0, at - 40), at + 140)
        }
      }
      const { messages, upgradeSummary, ...summary } = value
      items.push(summary)
    }
    items.sort((a, b) => b.updatedAt - a.updatedAt)
    return items.slice(0, Math.max(1, Math.min(Number(limit) || 200, 5000)))
  }

  /**
   * Soft-delete one conversation. Upgraded conversations may be deleted too:
   * the workspace task is an independent Session, and the index entry keeps
   * upgradedSessionId so the source can never be upgraded again.
   */
  async function archive(id, reason = 'deleted') {
    await store.load()
    const value = await get(id)
    if (!value) {
      // Unreadable history: hide the index row instead of failing the request.
      if (Object.keys(entry(id)).length) {
        await update(id, { deletedAt: entry(id).deletedAt || Date.now(), cleanupReason: reason })
        return
      }
      throw new Error('Conversation not found')
    }
    if (value.upgraded && !value.archived) throw new Error('Finish the upgrade before deleting this conversation')
    const agent = ctx.agents.get(id)
    if (agent?.status === 'running') agent.cancel({ kind: 'user' })
    if (!value.archived) await ctx.workspaceRegistry.archiveSession(id, { stopActivity: true })
    await update(id, {
      archivedAt: entry(id).archivedAt || Date.now(),
      deletedAt: Date.now(),
      cleanupReason: reason,
    })
    await release(id, { force: true })
  }

  async function clear() {
    const items = await list({ status: 'active', limit: 5000 })
    let count = 0
    for (const item of items) {
      await archive(item.id)
      count += 1
    }
    return count
  }

  async function cleanup(retentionDays) {
    const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000
    const items = await list({ status: 'active', to: cutoff, limit: 5000 })
    let count = 0
    for (const item of items) {
      await archive(item.id, 'retention')
      count += 1
    }
    return count
  }

  async function attachment(sessionId, attachmentId) {
    const value = await get(sessionId)
    if (!value || value.deleted) return null
    const match = value.messages.flatMap((message) => message.images || [])
      .map((image) => image.attachment)
      .find((attachment) => attachment.attachmentId === attachmentId)
    if (!match) return null
    const stored = await ctx.attachments.readImage(match)
    return {
      attachment: stored.ref,
      dataUrl: `data:${stored.ref.mediaType};base64,${Buffer.from(stored.data).toString('base64')}`,
    }
  }

  ctx.effect(() => ctx.on('session/event', (session, event) => {
    if (disposed || !isFridayId(session?.id) || session?.header?.cwd) return
    const id = session.id
    clearTimeout(refreshTimers.get(id))
    refreshTimers.set(id, setTimeout(() => {
      refreshTimers.delete(id)
      refresh(id).catch((error) => ctx.logger.warn(`dsh-friday: index refresh failed for ${id}: ${String(error)}`))
    }, event.type === 'turn/end' ? 0 : 180))
  }), 'dsh-friday: index events')

  ctx.effect(() => ctx.on('agent/status', ({ agent, status } = {}) => {
    const id = agent?.id
    if (disposed || !handles.has(id)) return
    if (status === 'running') {
      clearTimeout(releaseTimers.get(id))
      releaseTimers.delete(id)
    } else {
      scheduleRelease(id)
    }
  }), 'dsh-friday: idle agent release')

  ctx.effect(() => async () => {
    disposed = true
    for (const timer of refreshTimers.values()) clearTimeout(timer)
    refreshTimers.clear()
    for (const timer of releaseTimers.values()) clearTimeout(timer)
    releaseTimers.clear()
    await store.flush()
    await Promise.allSettled([...handles.values()].map((handle) => handle.dispose()))
    handles.clear()
  }, 'dsh-friday: repository teardown')

  return {
    store,
    create,
    get,
    refresh,
    list,
    update,
    ensureAgent,
    release,
    reserve,
    archive,
    clear,
    cleanup,
    attachment,
  }
}
