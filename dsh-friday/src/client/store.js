import React from 'react'

let state = {
  overlayOpen: false,
  inboxOpen: false,
  inboxSelection: null,
  sessionId: undefined,
  config: null,
  toast: null,
}
const listeners = new Set()

export function getState() { return state }

export function setState(patch) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }
  for (const listener of listeners) listener()
}

export function useFridayState(selector = (value) => value) {
  return React.useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => selector(state),
    () => selector(state),
  )
}

export function openOverlay(sessionId) {
  setState({ inboxOpen: false, overlayOpen: true, sessionId })
}

export function closeOverlay() {
  setState((current) => ({ overlayOpen: false, sessionId: current.sessionId }))
  runtime.native?.hide()
}

export function newConversation() {
  setState({ inboxOpen: false, overlayOpen: true, sessionId: null })
}

export function setConfig(config) {
  const previousHotkey = state.config?.config?.hotkey
  setState({ config })
  if (previousHotkey !== config?.config?.hotkey) window.dispatchEvent(new Event('dsh-friday:config-changed'))
}

export function markRecent(id) {
  if (!id) return
  setState((current) => ({
    config: current.config
      ? { ...current.config, recent: { id, title: current.config.recent?.id === id ? current.config.recent.title : '', updatedAt: Date.now() } }
      : current.config,
  }))
}

let toastSequence = 0
export function toast(message, tone = 'info') {
  const id = ++toastSequence
  setState({ toast: { id, message, tone } })
  setTimeout(() => {
    if (getState().toast?.id === id) setState({ toast: null })
  }, 3200)
}

export const runtime = {
  layout: null,
  uiWorkspace: null,
  workspaces: null,
  native: null,
}

export function openInbox() {
  const inboxSelection = getState().sessionId || null
  setState({ inboxOpen: true, overlayOpen: false, inboxSelection })
  if (runtime.native) {
    runtime.native.resize({ width: 910, height: 640 })
    return
  }
  try { runtime.layout?.selectPanel('inbox') } catch (error) { console.error('dsh-friday: open Inbox', error) }
}

export function openTask(sessionId) {
  try {
    if (runtime.native) {
      void runtime.native.openTask(sessionId).catch((error) => toast(error.message || String(error), 'error'))
      closeOverlay()
      return
    }
    runtime.uiWorkspace?.openSession(sessionId)
    runtime.layout?.selectPanel(null)
    setState({ overlayOpen: false })
  } catch (error) {
    console.error('dsh-friday: open upgraded task', error)
    toast(error.message || String(error), 'error')
  }
}
