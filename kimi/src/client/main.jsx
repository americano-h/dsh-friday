import React from 'react'
import en from '../../locale/en.json'
import zh from '../../locale/zh.json'
import { api } from './api.js'
import { matchesHotkey, parseHotkey } from './hotkey.js'
import { InboxPage } from './inbox.jsx'
import { QuickOverlay } from './overlay.jsx'
import { SettingsForm } from './settings.jsx'
import { CSS } from './styles.js'
import { closeOverlay, getState, openOverlay, openTask, runtime, setConfig, useFridayState } from './store.js'

const NS = 'dsh-friday'

class FridayBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error) { console.error('dsh-friday: view crashed', error) }
  render() {
    if (this.state.error) return <div className="df-page"><div className="df-error">Friday: {String(this.state.error.message || this.state.error)}</div></div>
    return this.props.children
  }
}

function InboxGlyph({ size = 18, active = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M3.5 13 6.2 6.4A2 2 0 0 1 8.1 5h7.8a2 2 0 0 1 1.9 1.4L20.5 13v5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-5Z"
        stroke={active ? 'var(--dsw-alias-brand-primary)' : 'currentColor'} strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M3.8 13.5h4.2l1.5 2.5h5l1.5-2.5h4.2" stroke={active ? 'var(--dsw-alias-brand-primary)' : 'currentColor'} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m16.8 2 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" fill={active ? 'var(--dsw-alias-brand-primary)' : 'currentColor'} />
    </svg>
  )
}

function Toast() {
  const value = useFridayState((state) => state.toast)
  if (!value) return null
  return <div className={`df-toast ${value.tone}`} role="status">{value.message}</div>
}

function GlobalUI({ t }) {
  return <><style>{CSS}</style><QuickOverlay t={t} /><Toast /></>
}

function translator() {
  const dictionary = String(navigator.language || '').toLowerCase().startsWith('zh') ? zh : en
  return (key) => {
    const value = key.split('.').reduce((current, part) => current?.[part], dictionary)
    return typeof value === 'string' ? value : key
  }
}

export const inject = ['slots', 'locale', 'layout', 'uiWorkspace', 'workspaces']

export function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'dsh-friday: locale')
  const t = translator()
  runtime.layout = ctx.layout
  runtime.uiWorkspace = ctx.uiWorkspace
  runtime.workspaces = ctx.workspaces

  let hotkey = parseHotkey()
  const loadHotkey = () => {
    api.config().then((data) => {
      hotkey = parseHotkey(data.config.hotkey)
      setConfig(data)
      if (data.nativePendingTask) {
        openTask(data.nativePendingTask)
        void api.ackNativeTask(data.nativePendingTask).catch(() => {})
      }
    }).catch(() => {})
  }
  loadHotkey()
  window.addEventListener('dsh-friday:config-changed', loadHotkey)
  window.addEventListener('focus', loadHotkey)

  ctx.effect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        if (document.querySelector('.df-modal-backdrop')) return
        if (getState().overlayOpen) {
          event.preventDefault()
          closeOverlay()
        }
        return
      }
      if (event.defaultPrevented || event.repeat || !matchesHotkey(event, hotkey)) return
      event.preventDefault()
      event.stopPropagation()
      if (getState().overlayOpen) closeOverlay()
      else openOverlay(undefined)
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('dsh-friday:config-changed', loadHotkey)
      window.removeEventListener('focus', loadHotkey)
    }
  }, 'dsh-friday: window hotkey')

  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist',
    id: 'inbox',
    order: 30,
    label: () => 'Inbox',
  }, (props) => <InboxGlyph size={props?.size || 18} active={Boolean(props?.active)} />))

  ctx.slots.inject('main', () => ctx.slots.register({
    name: 'main',
    key: 'inbox',
  }, () => <FridayBoundary><style>{CSS}</style><InboxPage t={t} /></FridayBoundary>))

  ctx.slots.inject('plugins.row.config', () => ctx.slots.register({
    name: 'plugins.row.config',
    key: 'dsh-friday#friday',
  }, (props) => <FridayBoundary><style>{CSS}</style><SettingsForm {...props} t={t} /></FridayBoundary>))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'dsh-friday.quick',
    order: 40,
    label: 'Friday quick conversation',
  }, () => <FridayBoundary><GlobalUI t={t} /></FridayBoundary>))
}
