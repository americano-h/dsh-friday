import { defaultSelection, modelCatalog, readConfig, supportsImages } from './config.js'

export async function publicConfig(ctx, repository, configStore, nativeWindow) {
  const config = await readConfig(configStore)
  const hostDefaultModel = defaultSelection(ctx, {})
  const selection = config.defaultModel || hostDefaultModel
  let recent = null
  try {
    recent = (await repository.list({ status: 'active', limit: 1 }))[0] || null
  } catch (error) {
    // Settings must remain usable even when one Inbox history cannot be listed.
    ctx.logger.warn(`dsh-friday: recent conversation unavailable while loading settings: ${String(error)}`)
  }
  const native = nativeWindow?.snapshot() || null
  return {
    config,
    hostDefaultModel,
    effectiveDefaultModel: selection || null,
    models: await modelCatalog(ctx),
    defaultSupportsImages: await supportsImages(ctx, selection),
    visionAvailable: Boolean(config.visionModel && await supportsImages(ctx, config.visionModel)),
    imageLimits: ctx.attachments.imageLimits,
    recent,
    platform: process.platform,
    capabilities: {
      systemGlobalHotkey: Boolean(native?.available),
      nativeFloatingWindow: Boolean(native?.available),
      physicalSessionDelete: false,
    },
    native,
    nativePendingTask: nativeWindow?.pendingTask || null,
  }
}
