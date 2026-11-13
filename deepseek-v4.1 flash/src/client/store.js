import React from 'react'

let state = {
  overlayOpen: false,
  overlaySessionId: null,
  inboxRefresh: 0,
  toast: null,
}

const listeners = new Set()

export function getState() {
  return state
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function setState(patch) {
  state = { ...state, ...patch }
  for (const fn of listeners) fn()
}

export function openOverlay(sessionId = null) {
  setState({ overlayOpen: true, overlaySessionId: sessionId })
}

export function closeOverlay() {
  setState({ overlayOpen: false })
}

export function toggleOverlay() {
  setState({ overlayOpen: !state.overlayOpen })
}

export function bumpInbox() {
  setState({ inboxRefresh: state.inboxRefresh + 1 })
}

let toastTimer = null
export function toast(message, tone = 'info') {
  setState({ toast: { message, tone, id: Date.now() } })
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => setState({ toast: null }), 3200)
}

export function useFridayStore(selector) {
  return React.useSyncExternalStore(
    subscribe,
    () => selector(state),
  )
}
