import React, { useEffect, useRef, useState } from 'react'
import { api } from './api.js'
import { defaultShortcuts, normalizeShortcuts, orbRanges, recordedShortcut } from '../shared/preferences.js'

export function OrbControls({ orb, change, t }) {
  const [image, setImage] = useState('')
  const [error, setError] = useState(null)
  const { color, brightness } = orb
  useEffect(() => {
    let active = true
    const timer = setTimeout(() => {
      api.previewOrb({ color, brightness }).then((data) => {
        if (active) { setImage(data.image); setError(null) }
      }).catch((e) => { if (active) setError(e.message) })
    }, 40)
    return () => { active = false; clearTimeout(timer) }
  }, [color, brightness])
  return <fieldset className="df-prefs">
    <legend>{t('settings.orb')}</legend>
    <div className="df-orb-controls">
      <div className="df-orb-preview" aria-label={t('settings.preview')}>
        {error ? <span role="alert">{error}</span> : image
          ? <img src={image} alt={t('settings.preview')} style={{ width: 140 * orb.size / 100, opacity: orb.opacity / 100 }} />
          : <span>{t('state.loading')}</span>}
      </div>
      <div>
        <label className="df-orb-row">{t('settings.color')}
          <input type="color" value={color} onChange={(e) => change({ ...orb, color: e.target.value })} />
        </label>
        {Object.entries(orbRanges).map(([key, [min, max]]) => <label className="df-orb-row" key={key}>
          {t('settings.' + key)}
          <input type="range" min={min} max={max} value={orb[key]} onChange={(e) => change({ ...orb, [key]: Number(e.target.value) })} />
          <output>{orb[key]}%</output>
        </label>)}
      </div>
    </div>
  </fieldset>
}

export function ShortcutControls({ draft, change, t }) {
  const [recording, setRecording] = useState(null)
  const [error, setError] = useState('')
  const lease = useRef(null)
  const finish = () => {
    const current = lease.current
    lease.current = null
    if (current) current.ready.then(() => api.recordShortcut(current.id, false)).catch(() => {})
    setRecording(null)
  }
  useEffect(() => {
    window.addEventListener('blur', finish)
    return () => { window.removeEventListener('blur', finish); finish() }
  }, [])
  useEffect(() => {
    if (!recording) return
    const timer = setTimeout(finish, 20000)
    return () => clearTimeout(timer)
  }, [recording])
  const begin = (action) => {
    finish()
    setError('')
    const id = crypto.randomUUID()
    const ready = api.recordShortcut(id, true)
    lease.current = { id, ready }
    setRecording(action)
    ready.catch((e) => { if (lease.current?.id === id) { finish(); setError(e.message) } })
  }
  const capture = (e, action) => {
    if (recording !== action) return
    e.preventDefault()
    e.stopPropagation()
    if (e.repeat || ['Alt','Control','Meta','Shift'].includes(e.key)) return
    const spec = recordedShortcut(e)
    if (!spec || (action === 'hotkey' && !/(Ctrl|Alt|Meta)\+/.test(spec))) { setError(t('settings.invalidKey')); return }
    const patch = action === 'hotkey' ? { hotkey: spec } : { shortcuts: { ...draft.shortcuts, [action]: spec } }
    try { normalizeShortcuts(patch.shortcuts || draft.shortcuts, patch.hotkey || draft.hotkey) }
    catch { setError(t('settings.keyConflict')); return }
    change(patch)
    finish()
    setError('')
  }
  return <fieldset className="df-prefs">
    <legend>{t('settings.shortcuts')}</legend>
    {['hotkey', ...Object.keys(defaultShortcuts)].map((action) => <div className="df-key-row" key={action}>
      <label htmlFor={'df-' + action}>{t('settings.' + action)}</label>
      <button type="button" id={'df-' + action} className="df-btn" data-recording={recording === action ? '' : undefined}
        aria-pressed={recording === action} onBlur={() => { if (recording === action) finish() }}
        onClick={() => recording === action ? finish() : begin(action)} onKeyDown={(e) => capture(e, action)}>
        {recording === action ? t('settings.pressKeys') : (action === 'hotkey' ? draft.hotkey : draft.shortcuts[action])}
      </button>
    </div>)}
    {error && <p className="df-error" role="alert">{error}</p>}
  </fieldset>
}
