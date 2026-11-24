import { defaultHotkey, recordedShortcut, shortcutId } from '../shared/preferences.js'

const keyLabels = { Escape: 'Esc', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→' }
const macKeyLabels = { Ctrl: 'Control', Alt: 'Option', Meta: 'Command', Enter: 'Return', Backspace: 'Delete', Delete: 'Forward Delete' }

export function formatShortcut(spec, platform = globalThis.navigator?.userAgentData?.platform || globalThis.navigator?.platform || '') {
  const id = shortcutId(spec)
  if (!id) return ''
  const meta = /^win/i.test(platform) ? 'Windows' : /^linux/i.test(platform) ? 'Super' : 'Meta'
  const labels = /^mac/i.test(platform) ? macKeyLabels : { Meta: meta }
  return id.split('+').map((key) => labels[key] || keyLabels[key] || key).join(' + ')
}

export function actionMatches(event, spec) {
  const id = recordedShortcut(event)
  return Boolean(id && id === shortcutId(spec))
}

export function parseHotkey(spec = defaultHotkey) {
  const parts = String(spec).split('+').map((part) => part.trim()).filter(Boolean)
  const key = parts.pop()?.toLowerCase() || 'space'
  const result = { key, alt: false, ctrl: false, meta: false, shift: false }
  for (const part of parts) {
    const modifier = part.toLowerCase()
    if (['alt', 'option', 'opt'].includes(modifier)) result.alt = true
    else if (['ctrl', 'control'].includes(modifier)) result.ctrl = true
    else if (['meta', 'cmd', 'command', 'super'].includes(modifier)) result.meta = true
    else if (modifier === 'shift') result.shift = true
  }
  return result
}

export function matchesHotkey(event, hotkey) {
  const physical = recordedShortcut(event)?.split('+').pop()?.toLowerCase()
  const keyMatches = physical === hotkey.key
  return keyMatches
    && event.altKey === hotkey.alt
    && event.ctrlKey === hotkey.ctrl
    && event.metaKey === hotkey.meta
    && event.shiftKey === hotkey.shift
}
