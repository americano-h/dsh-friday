import React, { useEffect, useState } from 'react'
import { api } from './api.js'
import { Modal } from './messages.jsx'
import { openTask, runtime, toast } from './store.js'

export function UpgradeDialog({ sessionId, t, onClose }) {
  const [state, setState] = useState({ loading: true, workspaces: [], selected: '', summary: '', error: null, upgrading: false })

  const load = async () => {
    try {
      const [preview, workspaceValue] = await Promise.all([api.previewUpgrade(sessionId), api.workspaces()])
      setState((current) => ({
        ...current,
        loading: false,
        summary: preview.summary,
        revision: preview.revision,
        workspaces: workspaceValue.workspaces,
        selected: current.selected || workspaceValue.workspaces[0]?.id || '',
        error: null,
      }))
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.message }))
    }
  }
  useEffect(() => { void load() }, [])

  const createWorkspace = async () => {
    setState((current) => ({ ...current, error: null }))
    try {
      const path = await runtime.uiWorkspace?.pickDirectory()
      if (!path) return
      const workspace = await runtime.workspaces?.create({ path })
      if (!workspace) throw new Error('Workspace service is unavailable')
      const value = await api.workspaces()
      setState((current) => ({ ...current, workspaces: value.workspaces, selected: workspace.id }))
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }))
    }
  }

  const confirm = async () => {
    if (!state.selected || !state.summary.trim()) return
    setState((current) => ({ ...current, upgrading: true, error: null }))
    try {
      const result = await api.upgrade(sessionId, state.selected, state.summary.trim(), state.revision)
      toast(t('inbox.upgraded'), 'success')
      onClose()
      openTask(result.sessionId)
    } catch (error) {
      setState((current) => ({ ...current, upgrading: false, error: error.message }))
    }
  }

  const selectedWorkspace = state.workspaces.find((workspace) => workspace.id === state.selected)

  return (
    <Modal title={t('dialog.upgradeTitle')} description={t('dialog.upgradeDescription')} onClose={state.upgrading ? () => {} : onClose} className="df-upgrade-modal">
      <div className="df-form-row df-upgrade-context">
        <label htmlFor="df-upgrade-summary">{t('dialog.context')}</label>
        <textarea id="df-upgrade-summary" value={state.summary} disabled={state.loading || state.upgrading}
          placeholder={state.loading ? t('state.loading') : t('dialog.contextPlaceholder')}
          onChange={(event) => setState((current) => ({ ...current, summary: event.target.value }))} />
      </div>
      <div className="df-form-row">
        <label htmlFor="df-workspace">{t('dialog.workspace')}</label>
        <div className="df-inline df-workspace-picker">
          <div className="df-workspace-choice">
            <select id="df-workspace" className="df-input" value={state.selected} disabled={state.loading || state.upgrading}
              onChange={(event) => setState((current) => ({ ...current, selected: event.target.value }))}>
              {state.workspaces.map((workspace) => <option value={workspace.id} key={workspace.id}>{workspace.title}</option>)}
            </select>
            {selectedWorkspace ? <div className="df-workspace-path" title={selectedWorkspace.path}>{selectedWorkspace.path}</div> : null}
          </div>
          <button className="df-btn" type="button" onClick={createWorkspace} disabled={state.upgrading}>{t('dialog.newWorkspace')}</button>
        </div>
      </div>
      {state.error ? <div className="df-error" role="alert">{state.error}<button className="df-btn" onClick={load}>{t('state.retry')}</button></div> : null}
      <div className="df-modal-actions">
        <button className="df-btn" type="button" onClick={onClose} disabled={state.upgrading}>{t('dialog.cancel')}</button>
        <button className="df-btn primary" type="button" onClick={confirm} disabled={!state.selected || !state.summary.trim() || state.upgrading || state.loading}>
          {state.upgrading ? t('state.loading') : t('dialog.confirm')}
        </button>
      </div>
    </Modal>
  )
}
