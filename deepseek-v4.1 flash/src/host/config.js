import { JsonStore } from './store.js'
import { CONFIG_FILE } from './paths.js'

const DEFAULTS = {
  version: 1,
  defaultModel: null,
  visionModel: null,
  hotkey: 'Alt+Space',
  retentionDays: 30,
}

const HOTKEY_RE = /^([A-Za-z]+\+)+([A-Za-z0-9]+)$/

export function createConfigStore() {
  return new JsonStore(CONFIG_FILE, () => ({ ...DEFAULTS }))
}

function normalizeModel(value) {
  if (!value || typeof value !== 'object') return null
  const provider = typeof value.provider === 'string' ? value.provider.trim() : ''
  const model = typeof value.model === 'string' ? value.model.trim() : ''
  return provider && model ? { provider, model } : null
}

export async function readConfig(configStore) {
  await configStore.load()
  const raw = configStore.get()
  const retention = Number(raw.retentionDays)
  return {
    version: 1,
    defaultModel: normalizeModel(raw.defaultModel),
    visionModel: normalizeModel(raw.visionModel),
    hotkey: typeof raw.hotkey === 'string' && HOTKEY_RE.test(raw.hotkey) ? raw.hotkey : DEFAULTS.hotkey,
    retentionDays: Number.isFinite(retention) && retention >= 1 && retention <= 365 ? Math.floor(retention) : DEFAULTS.retentionDays,
  }
}

export async function saveConfig(configStore, patch) {
  const next = {
    defaultModel: normalizeModel(patch.defaultModel),
    visionModel: normalizeModel(patch.visionModel),
    hotkey: typeof patch.hotkey === 'string' && patch.hotkey.trim() ? patch.hotkey.trim() : DEFAULTS.hotkey,
    retentionDays: Number(patch.retentionDays) || DEFAULTS.retentionDays,
  }
  if (!HOTKEY_RE.test(next.hotkey)) throw new Error('hotkey must look like Alt+Space or Meta+Shift+K')
  next.retentionDays = Math.min(365, Math.max(1, Math.floor(next.retentionDays)))
  await configStore.update((current) => ({ ...current, ...next, version: 1 }))
  return readConfig(configStore)
}

export function effectiveDefaultModel(ctx, config) {
  if (config.defaultModel) return config.defaultModel
  try {
    const current = ctx.get('agentDefaultModel')?.currentSelection()
    if (current?.provider && current?.model) return { provider: current.provider, model: current.model }
  } catch {}
  return null
}

export async function supportsImages(ctx, selection) {
  if (!selection?.provider || !selection?.model) return false
  try {
    const info = await ctx.llm.resolveModelInfo(selection.provider, selection.model)
    return Array.isArray(info?.inputModalities) ? info.inputModalities.includes('image') : false
  } catch {
    return false
  }
}

export async function listModelOptions(ctx) {
  const options = []
  const seen = new Set()
  try {
    const catalog = await ctx.sessionController.modelCatalog()
    for (const group of catalog?.groups || []) {
      for (const model of group.models || []) {
        const key = `${group.id}/${model.id}`
        if (seen.has(key)) continue
        seen.add(key)
        options.push({
          provider: group.id,
          providerName: group.name || group.id,
          model: model.id,
          modelName: model.name || model.id,
          label: `${group.name || group.id} · ${model.name || model.id}`,
        })
      }
    }
  } catch {}
  if (options.length === 0) {
    try {
      for (const provider of ctx.llm.listProviders()) {
        try {
          for (const model of await ctx.llm.listModels(provider.id)) {
            const key = `${provider.id}/${model.id}`
            if (seen.has(key)) continue
            seen.add(key)
            options.push({
              provider: provider.id,
              providerName: provider.name || provider.id,
              model: model.id,
              modelName: model.name || model.id,
              label: `${provider.name || provider.id} · ${model.name || model.id}`,
            })
          }
        } catch {}
      }
    } catch {}
  }
  return options
}
