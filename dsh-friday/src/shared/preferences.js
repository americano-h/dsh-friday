export const defaultOrb = Object.freeze({ color: '#5ce1ff', brightness: 100, opacity: 100, size: 100 })
export const orbRanges = Object.freeze({ brightness: [25, 175], opacity: [10, 100], size: [50, 150] })
export const defaultShortcuts = Object.freeze({ newChat: 'Alt+N', close: 'Escape', send: 'Enter', newline: 'Shift+Enter' })

const aliases = { Option: 'Alt', Control: 'Ctrl', Cmd: 'Meta', Command: 'Meta' }
const modifiers = ['Ctrl', 'Alt', 'Shift', 'Meta']
const keyPattern = /^(?:Space|Enter|Escape|Tab|Backspace|Delete|Arrow(?:Up|Down|Left|Right)|F(?:[1-9]|1[0-2])|[A-Z0-9])$/

export function shortcutId(value) {
  if (typeof value !== 'string') return null
  const parts = value.trim().split('+')
  let key = parts.pop()
  if (key.length === 1) key = key.toUpperCase()
  const mods = parts.map((part) => aliases[part] || part)
  if (!keyPattern.test(key) || mods.some((mod) => !modifiers.includes(mod)) || new Set(mods).size !== mods.length) return null
  return [...modifiers.filter((mod) => mods.includes(mod)), key].join('+')
}

export function recordedShortcut(event) {
  const key = (event.code || event.key || '').replace(/^Key([A-Z])$/, '$1').replace(/^Digit([0-9])$/, '$1').replace(/^NumpadEnter$/, 'Enter')
  return shortcutId([...modifiers.filter((mod) => event[mod.toLowerCase() + 'Key']), key].join('+'))
}

export function normalizeOrb(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid orb appearance')
  const orb = { ...defaultOrb, ...value }
  if (!/^#[0-9a-f]{6}$/i.test(orb.color)) throw new Error('Invalid orb color')
  for (const [key, [min, max]] of Object.entries(orbRanges)) {
    if (!Number.isInteger(orb[key]) || orb[key] < min || orb[key] > max) throw new Error(`Invalid orb ${key}: ${min}–${max}%`)
  }
  return { color: orb.color, brightness: orb.brightness, opacity: orb.opacity, size: orb.size }
}

export function normalizeShortcuts(input, globalKey) {
  const used = new Set([shortcutId(globalKey)])
  const result = {}
  for (const [action, fallback] of Object.entries(defaultShortcuts)) {
    let value = shortcutId(input?.[action] ?? fallback)
    // A previous release allowed Option+N as the global shortcut.
    if (action === 'newChat' && input?.newChat == null && used.has(value)) value = 'Alt+Shift+N'
    if (!value || (!/(Ctrl|Alt|Meta)\+/.test(value) && !/^(Shift\+)?(Enter|Escape)$/.test(value))) {
      throw new Error('Use a modifier with the key, or choose Enter or Escape.')
    }
    if (used.has(value)) throw new Error(`Shortcut already assigned: ${value}`)
    used.add(value)
    result[action] = value
  }
  return result
}
