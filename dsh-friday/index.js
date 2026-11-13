import { createApi } from './src/host/api.js'
import { createChatRuntime } from './src/host/chat.js'
import { createConfigStore, defaultSelection, readConfig } from './src/host/config.js'
import { installFridayPolicy } from './src/host/policy.js'
import { createNativeWindow } from './src/host/native-window.js'
import { createRepository } from './src/host/sessions.js'
import { createUpgradeService } from './src/host/upgrade.js'

export const inject = [
  'webServer',
  'webApp',
  'connection',
  'agents',
  'sessions',
  'sessionPersistence',
  'sessionQuery',
  'sessionController',
  'workspaceRegistry',
  'attachments',
  'web',
  'llm',
  'tools',
  'systemPrompt',
  'agentDefaultModel',
]

const RETENTION_INTERVAL = 6 * 60 * 60 * 1000

export async function apply(ctx) {
  const configStore = createConfigStore()
  await configStore.load()
  const policy = installFridayPolicy(ctx)
  const repository = createRepository(ctx, policy)
  await repository.store.load()
  const chat = createChatRuntime(ctx, repository, configStore, readConfig, (id) => upgrades.locks.has(id))
  const upgrades = createUpgradeService(ctx, repository, readConfig, configStore, defaultSelection, chat.busy)
  const initialConfig = await readConfig(configStore)
  const nativeWindow = createNativeWindow(ctx, { repository, configStore, chat, upgrades }, initialConfig)
  createApi(ctx, { repository, configStore, chat, upgrades, nativeWindow })
  await nativeWindow.start()

  const cleanup = async () => {
    try {
      const config = await readConfig(configStore)
      const count = await repository.cleanup(config.retentionDays)
      if (count) ctx.logger.info(`dsh-friday: retention archived ${count} expired conversation(s)`)
    } catch (error) {
      ctx.logger.warn(`dsh-friday: retention failed: ${String(error)}`)
    }
  }
  ctx.effect(() => {
    const timer = setInterval(cleanup, RETENTION_INTERVAL)
    if (typeof timer.unref === 'function') timer.unref()
    return () => clearInterval(timer)
  }, 'dsh-friday: retention')
  queueMicrotask(cleanup)
  ctx.logger.info('dsh-friday: Friday 1.1.4 ready')
}
