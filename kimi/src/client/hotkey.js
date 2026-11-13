export function parseHotkey(spec = 'Alt+Space') {
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
  const keyMatches = hotkey.key === 'space'
    ? event.code === 'Space'
    : String(event.key).toLowerCase() === hotkey.key
  return keyMatches
    && event.altKey === hotkey.alt
    && event.ctrlKey === hotkey.ctrl
    && event.metaKey === hotkey.meta
    && event.shiftKey === hotkey.shift
}
