import React, { useEffect, useState } from 'react'
import { api } from './api.js'
import { setConfig, toast } from './store.js'

const modelValue = (model) => model ? `${model.provider}\0${model.model}` : ''
const parseModel = (value) => {
  if (!value) return null
  const [provider, model] = value.split('\0')
  return provider && model ? { provider, model } : null
}

export function SettingsForm({ t, view = 'page' }) {
  const [state, setState] = useState({ loading: true, models: [], native: null, error: null, saving: false })
  const [draft, setDraft] = useState(null)

  useEffect(() => {
    let active = true
    api.config().then((data) => {
      if (!active) return
      setState({ loading: false, models: data.models || [], native: data.native || null, error: null, saving: false })
      setDraft({
        defaultModel: modelValue(data.config.defaultModel),
        visionModel: modelValue(data.config.visionModel),
        hotkey: data.config.hotkey,
        retentionDays: data.config.retentionDays,
      })
    }).catch((error) => {
      if (!active) return
      setState((current) => ({ ...current, loading: false, error: error.message }))
      setDraft((current) => current || { defaultModel: '', visionModel: '', hotkey: 'Alt+Space', retentionDays: 30 })
    })
    return () => { active = false }
  }, [])

  if (view === 'summary') return <span>{t('meta.description')}</span>
  if (state.loading) return <div className="df-settings-block">{t('state.loading')}</div>
  if (!draft) return <div className="df-error">{state.error || t('state.error')}</div>

  const update = (patch) => setDraft((current) => ({ ...current, ...patch }))
  const save = async () => {
    setState((current) => ({ ...current, saving: true, error: null }))
    try {
      const value = await api.saveConfig({
        defaultModel: parseModel(draft.defaultModel),
        visionModel: parseModel(draft.visionModel),
        hotkey: draft.hotkey,
        retentionDays: Number(draft.retentionDays),
      })
      const data = await api.config()
      setConfig(data)
      setState((current) => ({ ...current, native: data.native || null, saving: false }))
      toast(t('settings.saved'), 'success')
    } catch (error) {
      setState((current) => ({ ...current, saving: false, error: error.message }))
    }
  }

  return (
    <div className="df-settings-block">
      <div className="df-form-row">
        <label htmlFor="df-default-model">{t('settings.defaultModel')}</label>
        <select id="df-default-model" className="df-input" value={draft.defaultModel} onChange={(event) => update({ defaultModel: event.target.value })}>
          <option value="">{t('settings.inherit')}</option>
          {state.models.map((model) => <option key={modelValue(model)} value={modelValue(model)}>{model.label}</option>)}
        </select>
        <span className="df-hint">{t('settings.defaultHint')}</span>
      </div>
      <div className="df-form-row">
        <label htmlFor="df-vision-model">{t('settings.visionModel')}</label>
        <select id="df-vision-model" className="df-input" value={draft.visionModel} onChange={(event) => update({ visionModel: event.target.value })}>
          <option value="">{t('settings.none')}</option>
          {state.models.map((model) => <option key={modelValue(model)} value={modelValue(model)}>{model.label}</option>)}
        </select>
        <span className="df-hint">{t('settings.visionHint')}</span>
      </div>
      <div className="df-settings-grid">
        <div className="df-form-row">
          <label htmlFor="df-hotkey">{t('settings.hotkey')}</label>
          <input id="df-hotkey" className="df-input" value={draft.hotkey} onChange={(event) => update({ hotkey: event.target.value })} />
          <span className="df-hint">{t('settings.hotkeyHint')}</span>
        </div>
        <div className="df-form-row">
          <label htmlFor="df-retention">{t('settings.retention')}</label>
          <input id="df-retention" className="df-input" type="number" min="1" max="365" value={draft.retentionDays}
            onChange={(event) => update({ retentionDays: event.target.value })} />
          <span className="df-hint">{t('settings.retentionHint')}</span>
        </div>
      </div>
      <p className={`df-hint df-capability-note${state.native?.hotkeyError || state.native?.lastError ? ' df-error' : ''}`}>
        {state.native?.hotkeyError || state.native?.lastError || t('settings.globalLimit')}
      </p>
      {state.error ? <div className="df-error" role="alert">{state.error}</div> : null}
      <div className="df-settings-actions">
        <button className="df-btn primary" type="button" onClick={save} disabled={state.saving}>{state.saving ? t('state.loading') : t('settings.save')}</button>
      </div>
    </div>
  )
}
