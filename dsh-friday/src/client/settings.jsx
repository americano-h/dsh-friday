import React, { useEffect, useState } from 'react'
import { OrbControls, ShortcutControls } from './appearance-settings.jsx'
import { api } from './api.js'
import { setConfig, toast } from './store.js'

const modelValue = (selection) => selection ? JSON.stringify([selection.provider, selection.model]) : ''
const parseModel = (value) => {
  if (!value) return null
  const [provider, model] = JSON.parse(value)
  return { provider, model }
}

function modelOptions(models, selected, t) {
  const options = models.map((model) => <option key={modelValue(model)} value={modelValue(model)}>{model.label}</option>)
  if (selected && !models.some((model) => modelValue(model) === selected)) {
    const { provider, model } = parseModel(selected)
    options.push(<option key={selected} value={selected}>{provider} · {model} ({t('settings.unlisted')})</option>)
  }
  return options
}

export function SettingsForm({ t, view = 'page' }) {
  const [state, setState] = useState({ loading: true, models: [], native: null, error: null, saving: false })
  const [draft, setDraft] = useState(null)

  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    if (view === 'summary') return
    setState((current) => ({ ...current, loading: true, error: null }))
    let active = true
    api.config().then((data) => {
      if (!active) return
      setState({ loading: false, models: data.models || [], hostDefault: data.hostDefaultModel, native: data.native || null, error: null, saving: false })
      setDraft({
        defaultModel: modelValue(data.config.defaultModel),
        visionModel: modelValue(data.config.visionModel),
        hotkey: data.config.hotkey,
        shortcuts: data.config.shortcuts,
        orb: data.config.orb,
        retentionDays: data.config.retentionDays,
      })
    }).catch((error) => {
      if (!active) return
      setState((current) => ({ ...current, loading: false, error: error.message }))
      setDraft(null)
    })
    return () => { active = false }
  }, [attempt, view])

  if (view === 'summary') return <span>{t('meta.description')}</span>
  if (state.loading) return <div className="df-settings-block">{t('state.loading')}</div>
  if (!draft) return <div className="df-error" role="alert">
    {state.error || t('state.error')}
    <button className="df-btn" type="button" onClick={() => setAttempt((value) => value + 1)}>{t('state.retry')}</button>
  </div>
  const host = state.hostDefault
  const hostLabel = state.models.find((model) => modelValue(model) === modelValue(host))?.label || (host && `${host.provider} · ${host.model}`)

  const update = (patch) => setDraft((current) => ({ ...current, ...patch }))
  const save = async () => {
    setState((current) => ({ ...current, saving: true, error: null }))
    try {
      await api.saveConfig({
        defaultModel: parseModel(draft.defaultModel),
        visionModel: parseModel(draft.visionModel),
        hotkey: draft.hotkey,
        shortcuts: draft.shortcuts,
        orb: draft.orb,
        retentionDays: Number(draft.retentionDays),
      })
      const data = await api.config()
      setConfig(data)
      setState((current) => ({ ...current, models: data.models || [], hostDefault: data.hostDefaultModel, native: data.native || null, saving: false }))
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
          <option value="">{t('settings.inherit')}{hostLabel ? ` (${hostLabel})` : ''}</option>
          {modelOptions(state.models, draft.defaultModel, t)}
        </select>
        <span className="df-hint">{t('settings.defaultHint')}</span>
      </div>
      <div className="df-form-row">
        <label htmlFor="df-vision-model">{t('settings.visionModel')}</label>
        <select id="df-vision-model" className="df-input" value={draft.visionModel} onChange={(event) => update({ visionModel: event.target.value })}>
          <option value="">{t('settings.none')}</option>
          {modelOptions(state.models, draft.visionModel, t)}
        </select>
        <span className="df-hint">{t('settings.visionHint')}</span>
      </div>
      <OrbControls orb={draft.orb} change={(orb) => update({ orb })} t={t} />
      <ShortcutControls draft={draft} change={update} t={t} />
      <div className="df-settings-grid">
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
