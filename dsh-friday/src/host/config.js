import { homedir } from 'node:os'
import { join } from 'node:path'
import { JsonStore } from './store.js'

export const DATA_DIR = join(process.env.DSH_HOME || join(homedir(), '.dsh'), 'dsh-friday-kimi')
export const DEFAULT_CONFIG = Object.freeze({
  version: 1,
  defaultModel: null,
  visionModel: null,
  hotkey: 'Alt+Space',
  retentionDays: 30,
})

const KEY = '(?:Space|Enter|Escape|Tab|Backspace|Delete|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|F(?:[1-9]|1[0-2])|[A-Za-z0-9])'
const HOTKEY = new RegExp(`^(?:(?:Alt|Option|Ctrl|Control|Meta|Cmd|Command|Shift)\\+)+${KEY}$`)

export function normalizeModel(value) {
  if (!value || typeof value !== 'object') return null
  const provider = typeof value.provider === 'string' ? value.provider.trim() : ''
  const model = typeof value.model === 'string' ? value.model.trim() : ''
  return provider && model ? { provider, model } : null
}

export function validateHotkey(value) {
  if (typeof value !== 'string' || !HOTKEY.test(value.trim())) {
    throw new Error('Hotkey must include a modifier and one key, for example Alt+Space or Meta+Shift+K')
  }
  const parts = value.trim().split('+')
  if (!parts.slice(0, -1).some((part) => ['Alt', 'Option', 'Ctrl', 'Control', 'Meta', 'Cmd', 'Command'].includes(part))) {
    throw new Error('Hotkey requires Option, Ctrl, or Command')
  }
  return value.trim()
}

export function normalizeConfig(input = {}) {
  const retentionDays = Number(input.retentionDays ?? DEFAULT_CONFIG.retentionDays)
  if (!Number.isInteger(retentionDays) || retentionDays < 1 || retentionDays > 365) {
    throw new Error('Retention must be an integer from 1 to 365 days')
  }
  return {
    version: 1,
    defaultModel: normalizeModel(input.defaultModel),
    visionModel: normalizeModel(input.visionModel),
    hotkey: validateHotkey(input.hotkey ?? DEFAULT_CONFIG.hotkey),
    retentionDays,
  }
}

export function createConfigStore() {
  return new JsonStore(join(DATA_DIR, 'settings.json'), () => ({ ...DEFAULT_CONFIG }))
}

export async function readConfig(store) {
  await store.load()
  try {
    return normalizeConfig(store.get())
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

export async function saveConfig(store, patch) {
  const current = await readConfig(store)
  const next = normalizeConfig({ ...current, ...patch, version: 1 })
  await store.write(next)
  return next
}

export function defaultSelection(ctx, config) {
  if (config.defaultModel) return config.defaultModel
  try {
    return normalizeModel(ctx.agentDefaultModel?.currentSelection())
  } catch {
    return null
  }
}

export async function supportsImages(ctx, selection) {
  const normalized = normalizeModel(selection)
  if (!normalized) return false
  try {
    const info = await ctx.llm.resolveModelInfo(normalized.provider, normalized.model)
    return Array.isArray(info.inputModalities) && info.inputModalities.includes('image')
  } catch {
    return false
  }
}

export async function modelCatalog(ctx) {
  const options = []
  const seen = new Set()
  const add = (provider, providerName, model) => {
    const key = `${provider}\0${model.id}`
    if (seen.has(key)) return
    seen.add(key)
    options.push({
      provider,
      providerName: providerName || provider,
      model: model.id,
      modelName: model.name || model.id,
      label: `${providerName || provider} · ${model.name || model.id}`,
      inputModalities: Array.isArray(model.inputModalities) ? model.inputModalities : undefined,
    })
  }
  try {
    const catalog = await ctx.sessionController.modelCatalog()
    for (const group of catalog.groups || []) {
      for (const model of group.models || []) add(group.id, group.name, model)
    }
  } catch {}
  if (!options.length) {
    for (const provider of ctx.llm.listProviders()) {
      try {
        for (const model of await ctx.llm.listModels(provider.id)) add(provider.id, provider.name, model)
      } catch {}
    }
  }
  return options
}
