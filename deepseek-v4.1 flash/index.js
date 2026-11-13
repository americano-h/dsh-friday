import { createApi } from './src/host/api.js'
import { createChatRuntime } from './src/host/chat.js'
import { createConfigStore, readConfig } from './src/host/config.js'
import { cleanupRetention, installIndexer } from './src/host/inbox.js'
import { ensureDirs } from './src/host/paths.js'
import { installPolicy } from './src/host/policy.js'
import { createIndexStore } from './src/host/store.js'
import { INDEX_FILE } from './src/host/paths.js'

export const inject = [
  'webServer',
  'connection',
  'agents',
  'sessionController',
  'sessionQuery',
  'workspaceRegistry',
  'attachments',
  'llm',
  'tools',
]

const RETENTION_INTERVAL_MS = 6 * 60 * 60 * 1000

export async function apply(ctx) {
  const logger = ctx.logger
  await ensureDirs()
  const configStore = createConfigStore()
  const store = createIndexStore(INDEX_FILE)
  await Promise.all([configStore.load(), store.load()])

  const policy = installPolicy(ctx, logger)
  const indexer = installIndexer(ctx, store, logger)
  const chat = createChatRuntime(ctx, configStore, store, indexer, logger)
  createApi(ctx, { configStore, store, indexer, chat, logger })

  const retention = async () => {
    try {
      const config = await readConfig(configStore)
      const count = await cleanupRetention(ctx, store, config, logger)
      if (count > 0) {
        logger.info(`dsh-friday: retention archived ${count} Inbox conversation(s)`)
        await indexer.flushNow()
      }
    } catch (error) {
      logger.warn(`dsh-friday: retention run failed: ${String(error)}`)
    }
  }

  ctx.effect(() => {
    const timer = setInterval(retention, RETENTION_INTERVAL_MS)
    if (typeof timer.unref === 'function') timer.unref()
    return () => clearInterval(timer)
  }, 'dsh-friday: retention timer')

  ctx.effect(() => () => {
    // policy guard is registered on ctx and disposed with the plugin
    void policy
  }, 'dsh-friday: policy handle')

  queueMicrotask(() => {
    indexer.reconcile().catch((error) => logger.warn(`dsh-friday: initial reconcile failed: ${String(error)}`))
  })

  logger.info('dsh-friday: Inbox quick chat ready')
}
