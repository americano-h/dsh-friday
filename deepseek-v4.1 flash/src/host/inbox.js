import { INBOX_DIR, isInboxCwd } from './paths.js'
import { readConversation, listInbox } from './sessions.js'

function emptyEntry(now) {
  return {
    createdAt: now,
    updatedAt: now,
    title: '',
    firstPrompt: '',
    hasImage: false,
    model: null,
    upgradedSessionId: null,
    upgradedWorkspaceId: null,
    upgradedAt: null,
    archivedAt: null,
    deletedAt: null,
  }
}

export function installIndexer(ctx, store, logger) {
  let pending = null
  let timer = null

  const flush = async () => {
    if (!pending) return
    const patch = pending
    pending = null
    try {
      await store.update((current) => {
        const sessions = { ...(current.sessions || {}) }
        for (const [id, value] of Object.entries(patch)) {
          sessions[id] = { ...(sessions[id] || emptyEntry(Date.now())), ...value }
        }
        return { ...current, version: 1, sessions }
      })
    } catch (error) {
      logger.warn(`dsh-friday: index write failed: ${String(error)}`)
    }
  }

  const queue = (id, patch) => {
    if (!pending) pending = {}
    pending[id] = { ...(pending[id] || {}), ...patch }
    if (timer) return
    timer = setTimeout(() => {
      timer = null
      flush()
    }, 220)
  }

  ctx.effect(() => () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    return flush()
  }, 'dsh-friday: index flush')

  ctx.effect(() => ctx.on('session/created', (session) => {
    if (!isInboxCwd(session.header?.cwd)) return
    queue(session.id, emptyEntry(session.header.createdAt || Date.now()))
  }), 'dsh-friday: index session created')

  ctx.effect(() => ctx.on('session/event', (session, event) => {
    if (!isInboxCwd(session.header?.cwd)) return
    const patch = { updatedAt: event.time }
    if (event.type === 'session/title' && typeof event.data?.title === 'string') patch.title = event.data.title
    if (event.type === 'request/header' && event.data?.header?.config) {
      patch.model = { provider: event.data.header.config.provider, model: event.data.header.config.model }
    }
    if (event.type === 'user/message' && event.data?.source?.kind === 'user') {
      const content = Array.isArray(event.data.content) ? event.data.content : []
      const text = content.filter((block) => block?.type === 'text').map((block) => block.text).join(' ').trim()
      const hasImage = content.some((block) => block?.type === 'image')
      queue(session.id, {
        ...patch,
        ...(text ? { firstPrompt: text.slice(0, 180) } : {}),
        ...(hasImage ? { hasImage: true } : {}),
      })
      return
    }
    if (event.type === 'assistant/message' || event.type === 'tool/result' || event.type === 'turn/end') {
      queue(session.id, patch)
    }
  }), 'dsh-friday: index session events')

  return {
    async reconcile() {
      let records = []
      try {
        records = await ctx.sessionQuery.filterSessions([{ kind: 'cwd', values: [INBOX_DIR] }])
      } catch (error) {
        logger.warn(`dsh-friday: index reconcile failed: ${String(error)}`)
        return
      }
      for (const record of records) {
        if (!isInboxCwd(record.header?.cwd)) continue
        const conversation = await readConversation(ctx, store, record.header.id)
        if (!conversation) continue
        queue(conversation.id, {
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          title: conversation.title,
          firstPrompt: conversation.firstPrompt,
          hasImage: conversation.hasImage,
          model: conversation.model,
        })
      }
      await flush()
    },
    markUpgraded(sourceId, targetId, workspaceId) {
      queue(sourceId, {
        upgradedSessionId: targetId,
        upgradedWorkspaceId: workspaceId,
        upgradedAt: Date.now(),
        archivedAt: Date.now(),
      })
    },
    markArchived(id, archived) {
      queue(id, { archivedAt: archived ? Date.now() : null })
    },
    markDeleted(id) {
      queue(id, { deletedAt: Date.now() })
    },
    async flushNow() {
      await flush()
    },
  }
}

export function isExpired(updatedAt, now, retentionDays) {
  if (!updatedAt) return false
  return updatedAt < now - retentionDays * 24 * 60 * 60 * 1000
}

export async function cleanupRetention(ctx, store, config, logger) {
  const items = await listInbox(ctx, store, { status: 'active', limit: 5000 })
  const cutoff = Date.now() - config.retentionDays * 24 * 60 * 60 * 1000
  let count = 0
  for (const item of items) {
    if (!item.updatedAt || item.updatedAt >= cutoff) continue
    if (item.archived) continue
    try {
      await ctx.workspaceRegistry.archiveSession(item.id, { stopActivity: true })
      count += 1
    } catch (error) {
      logger.warn(`dsh-friday: retention archive failed for ${item.id}: ${String(error)}`)
    }
  }
  return count
}
