import React, { useEffect, useMemo, useState } from 'react'
import { api } from './api.js'
import { runtime, openTask } from './runtime.js'
import { toast } from './store.js'

export function UpgradeDialog({ t, sessionId, onClose, onDone }) {
  const [state, setState] = useState({ loading: true, workspaces: [], selected: null, busy: false, error: null })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') { event.preventDefault(); onClose?.() } }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose])

  useEffect(() => {
    let cancelled = false
    api.workspaces()
      .then((data) => {
        if (cancelled) return
        const workspaces = data.workspaces || []
        setState({ loading: false, workspaces, selected: workspaces[0]?.id || null, busy: false, error: null })
      })
      .catch((error) => {
        if (!cancelled) setState({ loading: false, workspaces: [], selected: null, busy: false, error: error.message })
      })
    return () => { cancelled = true }
  }, [])

  const selected = useMemo(
    () => state.workspaces.find((workspace) => workspace.id === state.selected) || null,
    [state.workspaces, state.selected],
  )

  const createWorkspace = async () => {
    if (!runtime.uiWorkspace) return
    setCreating(true)
    try {
      const path = await runtime.uiWorkspace.pickDirectory()
      if (!path) return
      const workspace = await runtime.workspaces.create({ path })
      const next = { id: workspace.id, title: workspace.title || workspace.path, path: workspace.path || path, sessionCount: 0 }
      setState((prev) => ({ ...prev, workspaces: [next, ...prev.workspaces.filter((w) => w.id !== next.id)], selected: next.id }))
    } catch (error) {
      toast(error.message || t('upgradeDialog.failed'), 'error')
    } finally {
      setCreating(false)
    }
  }

  const confirm = async () => {
    if (!state.selected || state.busy) return
    setState((prev) => ({ ...prev, busy: true, error: null }))
    try {
      const result = await api.upgrade({ sessionId, workspaceId: state.selected })
      toast(t('upgradeDialog.success'), 'success')
      onDone?.(result)
      onClose?.()
      if (result?.sessionId) openTask(result.sessionId)
    } catch (error) {
      setState((prev) => ({ ...prev, busy: false, error: error.message || t('upgradeDialog.failed') }))
    }
  }

  return (
    <div className="df-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !state.busy) onClose?.() }}>
      <div className="df-modal" role="dialog" aria-modal="true" aria-label={t('upgradeDialog.title')}>
        <div className="df-modal-head">{t('upgradeDialog.title')}</div>
        <div className="df-modal-body">
          <div className="df-subtle" style={{ lineHeight: 1.6 }}>{t('upgradeDialog.description')}</div>
          {state.loading ? <div className="df-subtle">{t('inbox.loading')}</div> : null}
          {!state.loading && state.workspaces.length === 0 ? (
            <div className="df-subtle">{t('upgradeDialog.noWorkspaces')}</div>
          ) : null}
          <div className="df-ws-list">
            {state.workspaces.map((workspace) => (
              <button
                type="button"
                key={workspace.id}
                className={`df-ws${workspace.id === state.selected ? ' on' : ''}`}
                onClick={() => setState((prev) => ({ ...prev, selected: workspace.id }))}
              >
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>{workspace.title || workspace.path}</span>
                  <span className="df-path">{workspace.path}</span>
                </span>
              </button>
            ))}
          </div>
          <button type="button" className="df-btn" onClick={createWorkspace} disabled={creating || state.busy}>
            + {t('upgradeDialog.newWorkspace')}
          </button>
          {state.error ? <div style={{ color: 'var(--dsw-alias-state-error-primary)', fontSize: 12 }}>{state.error}</div> : null}
        </div>
        <div className="df-modal-foot">
          <button type="button" className="df-btn ghost" onClick={onClose} disabled={state.busy}>{t('upgradeDialog.cancel')}</button>
          <button type="button" className="df-btn primary" onClick={confirm} disabled={!state.selected || state.busy || creating}>
            {state.busy ? t('upgradeDialog.working') : t('upgradeDialog.confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}
