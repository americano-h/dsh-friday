import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import en from '../../locale/en.json'
import zh from '../../locale/zh.json'
import { actionMatches } from './hotkey.js'
import { defaultShortcuts } from '../shared/preferences.js'
import { api } from './api.js'
import { nativeCommand, openNativeTask } from './native-transport.js'
import { InboxPage } from './inbox.jsx'
import { QuickOverlay } from './overlay.jsx'
import { getState, openOverlay, runtime, setConfig, setState, useFridayState } from './store.js'
import { CSS } from './styles.js'

window.__DSH_FRIDAY_NATIVE__ = true
runtime.native = {
  activity: (motion) => nativeCommand('activity', { motion }),
  hide: () => nativeCommand('hide'),
  writeClipboard: async (text) => nativeCommand('copy', { text }),
  resize: (size) => nativeCommand('resize', size),
  openTask: openNativeTask,
}
runtime.uiWorkspace = {
  pickDirectory: () => api.pickDirectory(),
  openSession: () => {},
}
runtime.workspaces = {
  create: ({ path }) => api.createWorkspace(path),
}

function translator() {
  const dictionary = String(navigator.language || '').toLowerCase().startsWith('zh') ? zh : en
  return (key) => {
    const value = key.split('.').reduce((current, part) => current?.[part], dictionary)
    return typeof value === 'string' ? value : key
  }
}

function NativeToast() {
  const value = useFridayState((state) => state.toast)
  if (!value) return null
  return <div className={`df-toast ${value.tone}`} role="status">{value.message}</div>
}

class NativeBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) return <div className="df-native-fatal" role="alert">{String(this.state.error.message || this.state.error)}</div>
    return this.props.children
  }
}

function NativeApp() {
  const t = translator()
  const inboxOpen = useFridayState((state) => state.inboxOpen)
  useEffect(() => {
    let sequence = 0
    const onVisibility = async (event) => {
      const request = ++sequence
      if (!event.detail.visible) {
        setState({ overlayOpen: false, inboxOpen: false })
        return
      }
      if (event.detail.sessionId) {
        openOverlay(event.detail.sessionId)
        return
      }
      openOverlay(undefined)
      try {
        const config = await api.config()
        if (request !== sequence || !getState().overlayOpen) return
        setConfig(config)
        if (getState().sessionId !== undefined) return
        const recent = config.recent
        openOverlay(recent && (recent.running || Date.now() - recent.updatedAt <= 300000) ? recent.id : null)
      } catch { if (request === sequence) openOverlay(null) }
    }
    const onKey = (event) => {
      if (!event.isComposing && actionMatches(event, getState().config?.config?.shortcuts?.close || defaultShortcuts.close) && getState().inboxOpen && !document.querySelector('.df-modal')) runtime.native.hide()
    }
    const onShortcuts = (event) => {
      const current = getState().config
      if (current) setConfig({ ...current, config: { ...current.config, shortcuts: event.detail } })
    }
    window.addEventListener('dsh-friday:shortcuts', onShortcuts)
    window.addEventListener('keydown', onKey)
    window.addEventListener('dsh-friday:native-visibility', onVisibility)
    nativeCommand('clientReady')
    return () => {
      window.removeEventListener('dsh-friday:shortcuts', onShortcuts)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('dsh-friday:native-visibility', onVisibility)
    }
  }, [])
  return <NativeBoundary><style>{CSS}</style><QuickOverlay t={t} />{inboxOpen && <InboxPage t={t} />}<NativeToast /></NativeBoundary>
}

createRoot(document.getElementById('root')).render(<NativeApp />)
