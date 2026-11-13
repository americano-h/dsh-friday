import React, { useEffect, useMemo, useState } from 'react'
import { api } from './api.js'
import { toast } from './store.js'

function modelValue(model) {
  return model ? `${model.provider}\u0000${model.model}` : ''
}

function parseModel(value) {
  if (!value) return null
  const [provider, model] = value.split('\u0000')
  return provider && model ? { provider, model } : null
}

export function SettingsCard({ t }) {
  const [state, setState] = useState({ loading: true, config: null, models: [], error: null, saving: false, saved: false })
  const [draft, setDraft] = useState(null)

  useEffect(() => {
    let cancelled = false
    api.config()
      .then((data) => {
        if (cancelled) return
        setState({ loading: false, config: data.config, models: data.models || [], error: null, saving: false, saved: false })
        setDraft({
          defaultModel: modelValue(data.config.defaultModel),
          visionModel: modelValue(data.config.visionModel),
          hotkey: data.config.hotkey || 'Alt+Space',
          retentionDays: data.config.retentionDays ?? 30,
        })
      })
      .catch((error) => {
        if (!cancelled) setState((prev) => ({ ...prev, loading: false, error: error.message }))
      })
    return () => { cancelled = true }
  }, [])

  const options = useMemo(() => {
    return state.models.map((model) => ({
      value: `${model.provider}\u0000${model.model}`,
      label: model.label || `${model.provider} / ${model.model}`,
    }))
  }, [state.models])

  if (state.loading) return <div className="df-subtle" style={{ padding: 12 }}>{t('settings.loading')}</div>
  if (!draft) return <div className="df-subtle" style={{ padding: 12 }}>{state.error || t('error.unknown')}</div>

  const save = async () => {
    setState((prev) => ({ ...prev, saving: true, saved: false }))
    try {
      await api.saveConfig({
        defaultModel: parseModel(draft.defaultModel),
        visionModel: parseModel(draft.visionModel),
        hotkey: draft.hotkey,
        retentionDays: Number(draft.retentionDays) || 30,
      })
      setState((prev) => ({ ...prev, saving: false, saved: true }))
      window.dispatchEvent(new Event('dsh-friday:config-changed'))
      toast(t('settings.saved'), 'success')
      setTimeout(() => setState((prev) => ({ ...prev, saved: false })), 2600)
    } catch (error) {
      setState((prev) => ({ ...prev, saving: false, error: error.message }))
      toast(error.message || t('error.unknown'), 'error')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div className="df-form-row">
        <label htmlFor="df-default-model">{t('settings.defaultModel')}</label>
        <select
          id="df-default-model"
          className="df-select"
          value={draft.defaultModel}
          onChange={(event) => setDraft((prev) => ({ ...prev, defaultModel: event.target.value }))}
        >
          <option value="">{t('settings.none')}</option>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <span className="df-hint">{t('settings.defaultModelHint')}</span>
      </div>
      <div className="df-form-row">
        <label htmlFor="df-vision-model">{t('settings.visionModel')}</label>
        <select
          id="df-vision-model"
          className="df-select"
          value={draft.visionModel}
          onChange={(event) => setDraft((prev) => ({ ...prev, visionModel: event.target.value }))}
        >
          <option value="">{t('settings.none')}</option>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <span className="df-hint">{t('settings.visionModelHint')}</span>
      </div>
      <div className="df-select-grid">
        <div className="df-form-row">
          <label htmlFor="df-hotkey">{t('settings.hotkey')}</label>
          <input
            id="df-hotkey"
            className="df-select"
            value={draft.hotkey}
            onChange={(event) => setDraft((prev) => ({ ...prev, hotkey: event.target.value }))}
          />
          <span className="df-hint">{t('settings.hotkeyHint')}</span>
        </div>
        <div className="df-form-row">
          <label htmlFor="df-retention">{t('settings.retention')}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              id="df-retention"
              type="number"
              min={1}
              max={365}
              className="df-number"
              value={draft.retentionDays}
              onChange={(event) => setDraft((prev) => ({ ...prev, retentionDays: event.target.value }))}
            />
            <span className="df-subtle">{t('settings.days')}</span>
          </div>
          <span className="df-hint">{t('settings.retentionHint')}</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
        {state.saved ? <span className="df-subtle" style={{ alignSelf: 'center' }}>{t('settings.saved')}</span> : null}
        <button type="button" className="df-btn primary" onClick={save} disabled={state.saving}>
          {state.saving ? '…' : t('settings.save')}
        </button>
      </div>
    </div>
  )
}

export function SettingsDialog({ t, onClose }) {
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') { event.preventDefault(); onClose?.() } }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose])
  return (
    <div className="df-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.() }}>
      <div className="df-modal" role="dialog" aria-modal="true" aria-label={t('settings.title')} style={{ width: 'min(680px, 100%)' }}>
        <div className="df-modal-head">
          {t('settings.title')}
          <div className="df-subtle" style={{ fontWeight: 400, marginTop: 2 }}>{t('settings.description')}</div>
        </div>
        <div className="df-modal-body">
          <SettingsCard t={t} />
        </div>
        <div className="df-modal-foot">
          <button type="button" className="df-btn" onClick={onClose}>{t('upgradeDialog.cancel')}</button>
        </div>
      </div>
    </div>
  )
}
