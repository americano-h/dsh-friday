import React from 'react'
import en from '../../locale/en.json'
import zh from '../../locale/zh.json'
import { CSS } from './styles.js'
import { InboxPage } from './inbox.jsx'
import { QuickOverlay } from './overlay.jsx'
import { closeOverlay, getState, toggleOverlay } from './store.js'
import { openInbox } from './runtime.js'
import { InboxSettingsCard } from './inbox.jsx'
import { runtime } from './runtime.js'

const NS = 'dsh-friday'

class PanelBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error) { console.error('dsh-friday: Inbox panel crashed', error) }
  render() {
    if (this.state.error) {
      return <div className="df-page"><div className="df-empty-state">Friday Inbox failed: {String(this.state.error?.message || this.state.error)}</div></div>
    }
    return this.props.children
  }
}
const STYLE_ID = 'dsh-friday/styles'

export const inject = ['slots', 'locale', 'layout', 'uiWorkspace', 'workspaces']

function InboxGlyph({ size = 18, active = false }) {
  const stroke = active ? 'var(--dsw-alias-brand-primary)' : 'currentColor'
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M4.5 13.2 6.8 6.9A2.2 2.2 0 0 1 8.86 5.5h6.28a2.2 2.2 0 0 1 2.06 1.4l2.3 6.3v3.1a2.2 2.2 0 0 1-2.2 2.2H6.7a2.2 2.2 0 0 1-2.2-2.2v-3.1Z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4.5 13.4h3.4l.8 1.6h6.6l.8-1.6h3.4" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m15.9 4.2.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5.5-1.3Z" fill={active ? 'var(--dsw-alias-brand-primary)' : 'currentColor'} opacity=".9" />
    </svg>
  )
}

function ensureStyle() {
  if (typeof document === 'undefined') return () => {}
  let node = document.getElementById(STYLE_ID)
  if (node) return () => {}
  node = document.createElement('style')
  node.id = STYLE_ID
  node.dataset.plugin = 'dsh-friday'
  node.textContent = CSS
  document.head.appendChild(node)
  return () => node.remove()
}

function parseHotkey(spec) {
  const parts = String(spec || 'Alt+Space').split('+').map((part) => part.trim()).filter(Boolean)
  const key = parts.pop()?.toLowerCase() || 'space'
  const mods = { alt: false, ctrl: false, meta: false, shift: false }
  for (const part of parts) {
    const p = part.toLowerCase()
    if (p === 'alt' || p === 'option' || p === 'opt') mods.alt = true
    else if (p === 'ctrl' || p === 'control') mods.ctrl = true
    else if (p === 'meta' || p === 'cmd' || p === 'command' || p === 'super') mods.meta = true
    else if (p === 'shift') mods.shift = true
  }
  return { key, ...mods }
}

function matchesHotkey(event, hotkey) {
  const codeMatches = hotkey.key === 'space' ? event.code === 'Space' : event.key.toLowerCase() === hotkey.key
  return codeMatches
    && event.altKey === hotkey.alt
    && event.ctrlKey === hotkey.ctrl
    && event.metaKey === hotkey.meta
    && event.shiftKey === hotkey.shift
}

export function apply(ctx) {
  ctx.effect(() => ensureStyle(), 'dsh-friday: styles')
  ctx.effect(() => () => window.removeEventListener('dsh-friday:config-changed', loadHotkey), 'dsh-friday: hotkey config listener')
  ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'dsh-friday: locale')
  const dictionary = String(navigator.language || '').toLowerCase().startsWith('zh') ? zh : en
  const t = (key) => {
    const value = String(key).split('.').reduce((current, part) => (current && typeof current === 'object' ? current[part] : undefined), dictionary)
    return typeof value === 'string' ? value : key
  }
  runtime.layout = ctx.layout
  runtime.uiWorkspace = ctx.uiWorkspace
  runtime.workspaces = ctx.workspaces

  let hotkey = parseHotkey('Alt+Space')
  const loadHotkey = async () => {
    try {
      const response = await fetch('/dsh-friday/api/v1/config', { credentials: 'same-origin', headers: { 'X-DSH-Friday': '1' } })
      if (!response.ok) return
      const data = await response.json()
      if (data?.config?.hotkey) hotkey = parseHotkey(data.config.hotkey)
    } catch {}
  }
  loadHotkey()
  window.addEventListener('dsh-friday:config-changed', loadHotkey)

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
      if (event.defaultPrevented) return
      if (event.altKey && event.shiftKey && event.code === 'Space') {
        event.preventDefault()
        event.stopPropagation()
        openInbox()
        return
      }
      if (matchesHotkey(event, hotkey)) {
        event.preventDefault()
        event.stopPropagation()
        toggleOverlay()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, 'dsh-friday: hotkey')

  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist',
    id: 'inbox',
    order: 30,
    label: 'Inbox',
    locale: NS,
  }, (props) => <InboxGlyph size={props?.size || 18} active={Boolean(props?.active)} />))

  ctx.slots.inject('main', () => ctx.slots.register({
    name: 'main',
    key: 'inbox',
    locale: NS,
  }, (props) => <PanelBoundary><InboxPage {...props} t={t} /></PanelBoundary>))

  ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({
    name: 'plugins.bundle.config',
    key: 'dsh-friday',
    locale: NS,
  }, () => <InboxSettingsCard t={t} />))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'dsh-friday.quick',
    order: 40,
    locale: NS,
  }, (props) => <QuickOverlay {...props} t={t} />))
}
