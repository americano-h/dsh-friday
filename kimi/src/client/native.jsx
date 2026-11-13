import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import en from '../../locale/en.json'
import zh from '../../locale/zh.json'
import { api } from './api.js'
import { nativeCommand, openNativeTask } from './native-transport.js'
import { QuickOverlay } from './overlay.jsx'
import { openOverlay, runtime, setState, useFridayState } from './store.js'
import { CSS } from './styles.js'

window.__DSH_FRIDAY_NATIVE__ = true
runtime.native = {
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
  useEffect(() => {
    const onVisibility = (event) => {
      if (event.detail) openOverlay(undefined)
      else setState((current) => ({ overlayOpen: false, sessionId: current.sessionId }))
    }
    window.addEventListener('dsh-friday:native-visibility', onVisibility)
    return () => window.removeEventListener('dsh-friday:native-visibility', onVisibility)
  }, [])
  return <NativeBoundary><style>{CSS}</style><QuickOverlay t={t} /><NativeToast /></NativeBoundary>
}

createRoot(document.getElementById('root')).render(<NativeApp />)
nativeCommand('clientReady')
