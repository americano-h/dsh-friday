import { randomUUID } from 'node:crypto'
import { INBOX_DIR, isInboxCwd } from './paths.js'
import { effectiveDefaultModel } from './config.js'

export function textOf(content) {
  if (!Array.isArray(content)) return ''
  return content
    .filter((block) => block && block.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text)
    .join('\n')
    .trim()
}

function imageRefsOf(content) {
  if (!Array.isArray(content)) return []
  return content
    .filter((block) => block && block.type === 'image' && block.attachment)
    .map((block) => block.attachment)
}

export function citationsOf(meta) {
  if (!meta || typeof meta !== 'object' || !Array.isArray(meta.sources)) return []
  return meta.sources
    .filter((source) => source && typeof source.url === 'string')
    .map((source) => ({
      url: source.url,
      ...(typeof source.title === 'string' ? { title: source.title } : {}),
      ...(typeof source.snippet === 'string' ? { snippet: source.snippet } : {}),
    }))
}

export function deriveMessages(surfaceEvents) {
  const messages = []
  let pendingCitations = []
  for (const event of surfaceEvents || []) {
    if (event.type === 'tool/result') {
      const citations = citationsOf(event.data?.meta)
      if (citations.length) pendingCitations = [...pendingCitations, ...citations]
      continue
    }
    if (event.type === 'user/message') {
      const message = event.data
      const sourceKind = message?.source?.kind
      if (sourceKind !== 'user') continue
      const text = textOf(message.content)
      const images = imageRefsOf(message.content)
      if (!text && images.length === 0) continue
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
      const text = textOf(event.data?.message?.content)
      if (!text && pendingCitations.length === 0) continue
      messages.push({
        id: event.data?.message?.id || `assistant-${event.seq}`,
        role: 'assistant',
        text,
        ...(pendingCitations.length ? { citations: pendingCitations } : {}),
        at: event.time,
        seq: event.seq,
      })
      pendingCitations = []
    }
  }
  return messages
}

export async function isInboxSessionId(ctx, sessionId) {
  try {
    const snapshot = await ctx.sessionQuery.readSession(sessionId)
    return isInboxCwd(snapshot.session?.cwd)
  } catch {
    return false
  }
}

export async function readConversation(ctx, store, sessionId) {
  await store.load()
  const index = store.get()
  const entry = index.sessions?.[sessionId]
  let snapshot
  try {
    snapshot = await ctx.sessionQuery.readSession(sessionId)
  } catch {
    return null
  }
  if (!isInboxCwd(snapshot.session?.cwd)) return null
  let surface
  try {
    surface = await ctx.sessionQuery.readSurface(sessionId)
  } catch {
    surface = { events: [] }
  }
  const events = snapshot.events || []
  const messages = deriveMessages(surface.events || [])
  let title = ''
  let model = entry?.model || null
  let updatedAt = entry?.updatedAt || snapshot.session.createdAt || 0
  let firstPrompt = entry?.firstPrompt || ''
  let hasImage = Boolean(entry?.hasImage)
  for (const event of events) {
    if (event.time > updatedAt) updatedAt = event.time
    if (event.type === 'session/title' && typeof event.data?.title === 'string') title = event.data.title
    if (event.type === 'request/header' && event.data?.header?.config) {
      model = { provider: event.data.header.config.provider, model: event.data.header.config.model }
    }
    if (event.type === 'user/message' && event.data?.source?.kind === 'user') {
      if (!firstPrompt) firstPrompt = textOf(event.data.content).slice(0, 180)
      if (imageRefsOf(event.data.content).length) hasImage = true
    }
  }
  const firstUser = messages.find((message) => message.role === 'user')
  if (!firstPrompt && firstUser) firstPrompt = firstUser.text.slice(0, 180)
  if (!hasImage && messages.some((message) => message.images?.length)) hasImage = true
  const archivedIds = Array.isArray(ctx.workspaceRegistry.archivedSessionIds)
    ? ctx.workspaceRegistry.archivedSessionIds
    : []
  return {
    id: sessionId,
    title: title || entry?.title || firstPrompt.slice(0, 40) || '',
    firstPrompt,
    createdAt: snapshot.session.createdAt,
    updatedAt,
    model,
    hasImage,
    archived: archivedIds.includes(sessionId),
    upgraded: Boolean(entry?.upgradedSessionId),
    upgradedSessionId: entry?.upgradedSessionId || null,
    upgradedWorkspaceId: entry?.upgradedWorkspaceId || null,
    deleted: Boolean(entry?.deletedAt),
    messages,
  }
}

export async function listInbox(ctx, store, { query = '', status = 'active', limit = 100 } = {}) {
  await store.load()
  let records = []
  try {
    records = await ctx.sessionQuery.filterSessions([{ kind: 'cwd', values: [INBOX_DIR] }])
  } catch {
    records = []
  }
  const index = store.get()
  const items = []
  const needle = query.trim().toLowerCase()
  const archivedSet = new Set(Array.isArray(ctx.workspaceRegistry.archivedSessionIds) ? ctx.workspaceRegistry.archivedSessionIds : [])
  for (const record of records) {
    const id = record.header.id
    const entry = index.sessions?.[id]
    if (entry?.deletedAt) continue
    const mustRead = Boolean(needle) || !entry || (!entry.firstPrompt && !entry.title)
    const conversation = mustRead ? await readConversation(ctx, store, id) : null
    if (mustRead && !conversation) continue
    if (conversation?.deleted) continue
    if (conversation && !conversation.messages.length && !conversation.firstPrompt && !conversation.title) continue
    const item = {
      id,
      title: conversation?.title || entry?.title || '',
      firstPrompt: conversation?.firstPrompt || entry?.firstPrompt || '',
      createdAt: conversation?.createdAt || entry?.createdAt || record.header.createdAt,
      updatedAt: conversation?.updatedAt || entry?.updatedAt || record.header.createdAt,
      model: conversation?.model || entry?.model || null,
      hasImage: conversation?.hasImage ?? entry?.hasImage ?? false,
      archived: conversation?.archived ?? archivedSet.has(id),
      upgraded: conversation?.upgraded ?? Boolean(entry?.upgradedSessionId),
      upgradedSessionId: conversation?.upgradedSessionId || entry?.upgradedSessionId || null,
    }
    if (status === 'active' && item.archived) continue
    if (status === 'archived' && !item.archived) continue
    if (needle) {
      const haystack = [
        item.title,
        item.firstPrompt,
        ...(conversation?.messages || []).map((message) => message.text),
      ].join('\n').toLowerCase()
      if (!haystack.includes(needle)) continue
      const hit = (conversation?.messages || []).find((message) => message.text.toLowerCase().includes(needle))
      const at = hit ? hit.text.toLowerCase().indexOf(needle) : -1
      const start = Math.max(0, at - 24)
      item.snippet = hit ? hit.text.slice(start, start + 160) : item.firstPrompt
    }
    items.push(item)
  }
  items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
  return items.slice(0, Math.max(1, Math.min(limit, 5000)))
}

export async function ensureAgent(ctx, sessionId) {
  const live = ctx.agents.get(sessionId)
  if (live) return live
  const result = await ctx.sessionController.resolveAgent(sessionId)
  if (result?.error) {
    const error = new Error(result.error.code || 'session/not-found')
    error.code = result.error.code
    throw error
  }
  return result.agent
}

export function selectModel(agent, selection) {
  if (!selection?.provider || !selection?.model) return
  try {
    agent.model?.select?.({ provider: selection.provider, model: selection.model })
  } catch {}
}

export async function createInboxSession(ctx, config, logger) {
  const selection = effectiveDefaultModel(ctx, config)
  if (!selection) throw new Error('No default model is configured. Open Inbox settings and choose one.')
  const created = await ctx.sessionController.create({ cwd: INBOX_DIR })
  const agent = await ensureAgent(ctx, created.sessionId)
  selectModel(agent, selection)
  logger.info?.(`dsh-friday: created Inbox session ${created.sessionId} with ${selection.provider}/${selection.model}`)
  return { sessionId: created.sessionId, agent }
}

export function decodeDataUrl(dataUrl) {
  if (typeof dataUrl !== 'string') throw new Error('invalid image payload')
  const match = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl)
  if (!match) throw new Error('unsupported image format')
  return { mediaType: match[1], bytes: Buffer.from(match[2], 'base64') }
}

export async function saveImages(ctx, images) {
  if (!Array.isArray(images) || images.length === 0) return []
  const inputs = images.slice(0, 4).map((image, index) => {
    const decoded = decodeDataUrl(image?.dataUrl)
    return {
      data: new Uint8Array(decoded.bytes),
      mediaType: decoded.mediaType,
      name: typeof image?.name === 'string' ? image.name : `image-${index + 1}`,
    }
  })
  return ctx.attachments.saveImages(inputs)
}

export async function describeImages(ctx, config, refs) {
  if (!refs.length) return ''
  if (!config.visionModel) return ''
  const descriptions = []
  for (let index = 0; index < refs.length; index += 1) {
    const attachment = refs[index]
    const parts = [
      { type: 'text', text: 'Describe this image for a text-only assistant in one compact paragraph. Mention visible text, UI, people, objects, and any details relevant for answering questions about it. Do not add commentary.' },
      { type: 'image', attachment },
    ]
    let text = ''
    let failure = null
    for await (const chunk of ctx.llm.stream({
      provider: config.visionModel.provider,
      model: config.visionModel.model,
      messages: [{ role: 'user', content: parts }],
      maxTokens: 700,
    })) {
      if (chunk.type === 'text-delta') text += chunk.text
      if (chunk.type === 'finish' && (chunk.reason.kind === 'error' || chunk.reason.kind === 'aborted')) {
        failure = chunk.reason.failure?.message || 'vision request failed'
      }
    }
    if (failure) throw new Error(failure)
    descriptions.push(`[Image ${index + 1} description] ${text.trim()}`)
  }
  return descriptions.join('\n\n')
}

export async function sendPrompt(ctx, sessionId, content, clientTimeZone) {
  const requestId = randomUUID()
  await ctx.sessionController.prompt({
    sessionId,
    requestId,
    mode: 'queue',
    content,
    ...(clientTimeZone ? { clientTimeZone } : {}),
  }, new AbortController().signal)
  return requestId
}

export async function readAttachment(ctx, sessionId, attachmentId) {
  let snapshot
  try {
    snapshot = await ctx.sessionQuery.readSession(sessionId)
  } catch {
    return null
  }
  for (const event of snapshot.events || []) {
    if (event.type !== 'user/message') continue
    for (const ref of imageRefsOf(event.data?.content)) {
      if (ref.attachmentId === attachmentId) {
        const stored = await ctx.attachments.readImage(ref)
        return {
          dataUrl: `data:${stored.ref.mediaType};base64,${Buffer.from(stored.data).toString('base64')}`,
          attachment: stored.ref,
        }
      }
    }
  }
  return null
}

export async function readTitle(ctx, sessionId) {
  try {
    const title = await ctx.sessionQuery.readTitle(sessionId)
    return title?.title || ''
  } catch {
    return ''
  }
}
