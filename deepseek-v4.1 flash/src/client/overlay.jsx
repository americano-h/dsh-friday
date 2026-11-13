import React, { useEffect, useRef, useState } from 'react'
import { api, streamChat } from './api.js'
import { Markdown } from './markdown.jsx'
import { MessageImages, References } from './message.jsx'
import { closeOverlay, bumpInbox, setState, toast, useFridayStore } from './store.js'
import { openInbox } from './runtime.js'
import { UpgradeDialog } from './upgrade.jsx'

const MAX_IMAGES = 4
const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
const LAST_KEY = 'dsh-friday.last'

function readLast() {
  try {
    const raw = localStorage.getItem(LAST_KEY)
    if (!raw) return null
    const value = JSON.parse(raw)
    if (!value?.sessionId || !value?.at) return null
    if (Date.now() - value.at > 5 * 60 * 1000) return null
    return value
  } catch {
    return null
  }
}

function remember(sessionId, title) {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify({ sessionId, at: Date.now(), title: title || '' }))
  } catch {}
}

let messageSeq = 0
function nextId() {
  messageSeq += 1
  return `local-${Date.now()}-${messageSeq}`
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error || new Error('read failed'))
    reader.readAsDataURL(file)
  })
}

function AssistantAvatar() {
  return (
    <span className="df-avatar" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 3.5l1.7 4.6 4.6 1.7-4.6 1.7L12 16.1l-1.7-4.6L5.7 9.8l4.6-1.7L12 3.5Z" fill="currentColor" />
        <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" fill="currentColor" opacity=".6" />
      </svg>
    </span>
  )
}

export function QuickOverlay({ t }) {
  const open = useFridayStore((state) => state.overlayOpen)
  const requestedSession = useFridayStore((state) => state.overlaySessionId)
  const [sessionId, setSessionId] = useState(null)
  const [title, setTitle] = useState('')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [images, setImages] = useState([])
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [config, setConfig] = useState(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [showDrop, setShowDrop] = useState(false)
  const abortRef = useRef(null)
  const textareaRef = useRef(null)
  const fileRef = useRef(null)
  const listRef = useRef(null)
  const stickRef = useRef(true)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    api.config()
      .then((data) => { if (!cancelled) setConfig(data) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [open])

  useEffect(() => {
    if (!open) {
      abortRef.current?.abort()
      abortRef.current = null
      setState({ overlaySessionId: null })
      return
    }
    const target = requestedSession || readLast()?.sessionId || null
    if (target) {
      loadConversation(target)
    } else if (!sessionId) {
      setMessages([])
      setTitle('')
    }
    const timer = setTimeout(() => textareaRef.current?.focus(), 40)
    return () => clearTimeout(timer)
  }, [open, requestedSession])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    if (stickRef.current) el.scrollTop = el.scrollHeight
  }, [messages])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const next = Math.min(el.scrollHeight, 160)
    el.style.height = `${next}px`
    el.style.overflowY = el.scrollHeight > 160 ? 'auto' : 'hidden'
  }, [input, open])

  async function loadConversation(id) {
    try {
      const data = await api.conversation(id)
      const conversation = data.conversation
      if (conversation.archived || conversation.upgraded) {
        toast(t('inbox.upgraded'), 'warn')
        newChat()
        return
      }
      setSessionId(conversation.id)
      setTitle(conversation.title || '')
      setMessages((conversation.messages || []).map((message) => ({ ...message, id: message.id || nextId() })))
      remember(conversation.id, conversation.title)
    } catch (error) {
      toast(error.message || t('error.unknown'), 'error')
      setSessionId(null)
      setTitle('')
      setMessages([])
    }
  }

  function newChat() {
    abortRef.current?.abort()
    abortRef.current = null
    setBusy(false)
    setStatus('')
    setSessionId(null)
    setTitle('')
    setMessages([])
    setInput('')
    setImages([])
    setState({ overlaySessionId: null })
    textareaRef.current?.focus()
  }

  function addFiles(fileList) {
    const files = Array.from(fileList || []).filter((file) => ALLOWED_IMAGE_TYPES.has(file.type))
    if (!files.length) return
    if (!config?.visionAvailable && !config?.defaultSupportsImages) {
      toast(t('overlay.visionRequired'), 'warn')
      return
    }
    for (const file of files) {
      if (images.length >= MAX_IMAGES) {
        toast(t('overlay.imageLimit'), 'warn')
        break
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast(t('overlay.imageLimit'), 'warn')
        continue
      }
      fileToDataUrl(file)
        .then((dataUrl) => setImages((prev) => (prev.length >= MAX_IMAGES ? prev : [...prev, { dataUrl, name: file.name || 'image' }])))
        .catch(() => toast(t('error.unknown'), 'error'))
    }
  }

  function updateAssistant(id, updater) {
    setMessages((prev) => prev.map((message) => (message.id === id ? updater(message) : message)))
  }

  async function send() {
    if (busy) return
    const text = input.trim()
    if (!text && images.length === 0) return
    const userMessage = { id: nextId(), role: 'user', text, images: images.map((image) => ({ dataUrl: image.dataUrl, attachment: { name: image.name } })) }
    const assistantId = nextId()
    const assistantMessage = { id: assistantId, role: 'assistant', text: '', citations: [], pending: true }
    stickRef.current = true
    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
    setImages([])
    setBusy(true)
    setStatus('')
    const controller = new AbortController()
    abortRef.current = controller
    let streamSession = sessionId
    try {
      await streamChat({
        sessionId,
        text,
        images: images.length ? images : undefined,
        clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }, {
        meta(payload) {
          if (payload.sessionId) {
            streamSession = payload.sessionId
            setSessionId(payload.sessionId)
            remember(payload.sessionId, payload.title || title)
          }
          if (payload.title) setTitle(payload.title)
        },
        delta(payload) {
          updateAssistant(assistantId, (message) => ({ ...message, text: message.text + payload.text }))
        },
        reasoning() {},
        tool(payload) {
          setStatus(payload.name === 'web_search' ? t('overlay.searching') : '')
        },
        citations(payload) {
          updateAssistant(assistantId, (message) => ({ ...message, citations: payload.sources || [] }))
        },
        title(payload) {
          if (payload.title) setTitle(payload.title)
        },
        done(payload) {
          updateAssistant(assistantId, (message) => ({ ...message, pending: false, text: message.text || payload.text || '' }))
          setBusy(false)
          setStatus('')
          if (payload.sessionId || streamSession) remember(payload.sessionId || streamSession, payload.title || title)
          bumpInbox()
        },
        error(payload) {
          updateAssistant(assistantId, (message) => ({ ...message, pending: false, error: payload.message || t('overlay.error') }))
          setBusy(false)
          setStatus('')
          toast(payload.message || t('overlay.error'), 'error')
        },
      }, controller.signal)
    } catch (error) {
      if (error.name === 'AbortError') {
        updateAssistant(assistantId, (message) => ({ ...message, pending: false }))
      } else {
        updateAssistant(assistantId, (message) => ({ ...message, pending: false, error: error.message || t('overlay.error') }))
        toast(error.message || t('overlay.error'), 'error')
      }
      setBusy(false)
      setStatus('')
    } finally {
      abortRef.current = null
    }
  }

  async function stop() {
    abortRef.current?.abort()
    abortRef.current = null
    setBusy(false)
    setStatus('')
    if (sessionId) api.cancel(sessionId).catch(() => {})
  }

  if (!open) return null

  const canSend = (input.trim() || images.length) && !busy
  return (
    <div
      className={`df-overlay-root${showDrop ? ' df-drop-active' : ''}`}
      onMouseDown={(event) => { if (event.target === event.currentTarget) closeOverlay() }}
      onDragOver={(event) => { event.preventDefault(); setShowDrop(true) }}
      onDragLeave={(event) => { if (event.target === event.currentTarget) setShowDrop(false) }}
      onDrop={(event) => {
        event.preventDefault()
        setShowDrop(false)
        addFiles(event.dataTransfer?.files)
      }}
    >
      <div className="df-quick" role="dialog" aria-modal="true" aria-label={t('overlay.title')}>
        <div className="df-quick-head">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4.5 13.2 6.8 6.9A2.2 2.2 0 0 1 8.86 5.5h6.28a2.2 2.2 0 0 1 2.06 1.4l2.3 6.3v3.1a2.2 2.2 0 0 1-2.2 2.2H6.7a2.2 2.2 0 0 1-2.2-2.2v-3.1Z" stroke="var(--dsw-alias-brand-primary)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M4.5 13.4h3.4l.8 1.6h6.6l.8-1.6h3.4" stroke="var(--dsw-alias-brand-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="df-title">{title || t('overlay.title')}</span>
          <span className="df-subtle" style={{ fontSize: 11 }}>{t('nav.inbox')}</span>
          <div className="df-kbd">
            <kbd>⌥</kbd><kbd>Space</kbd>
            <button type="button" className="df-icon-btn" onClick={closeOverlay} title={t('overlay.collapse')} aria-label={t('overlay.collapse')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
        <div
          className={`df-quick-body${messages.length === 0 ? ' empty' : ''}`}
          ref={listRef}
          onScroll={(event) => {
            const el = event.currentTarget
            stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48
          }}
        >
          {messages.length === 0 ? <div className="df-quick-empty">{t('overlay.empty')}</div> : null}
          {messages.map((message) => (
            <div className={`df-msg ${message.role}`} key={message.id}>
              {message.role === 'assistant' ? <AssistantAvatar /> : null}
              <div className="df-bubble">
                <MessageImages images={message.images} sessionId={sessionId} />
                {message.text ? <Markdown text={message.text} /> : message.pending ? <div className="df-search-status"><span className="df-dot" />{status || t('overlay.thinking')}</div> : null}
                {message.pending && message.text ? <span className="df-cursor" /> : null}
                {message.error ? <div style={{ color: 'var(--dsw-alias-state-error-primary)', fontSize: 12, marginTop: 6 }}>{message.error}</div> : null}
                <References citations={message.citations} />
              </div>
            </div>
          ))}
        </div>
        <div className="df-quick-foot">
          {images.length ? (
            <div className="df-images">
              {images.map((image, index) => (
                <div className="df-thumb" key={`${image.name}-${index}`}>
                  <img src={image.dataUrl} alt={image.name} />
                  <button type="button" onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))} aria-label="remove">×</button>
                </div>
              ))}
            </div>
          ) : null}
          <div className="df-composer">
            <textarea
              ref={textareaRef}
              className="df-textarea"
              rows={1}
              value={input}
              placeholder={t('overlay.placeholder')}
              onChange={(event) => setInput(event.target.value)}
              onPaste={(event) => {
                if (event.clipboardData?.files?.length) {
                  event.preventDefault()
                  addFiles(event.clipboardData.files)
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault()
                  send()
                }
              }}
            />
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple hidden onChange={(event) => { addFiles(event.target.files); event.target.value = '' }} />
            <button type="button" className="df-icon-btn" title={t('overlay.imageLimit')} aria-label="add image" onClick={() => fileRef.current?.click()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" /><circle cx="8.5" cy="10" r="1.4" fill="currentColor" /><path d="m5.5 17 4.3-4.4 3.1 3.1 2.5-2.6L19 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            {busy ? (
              <button type="button" className="df-send" onClick={stop} title={t('overlay.stop')} aria-label={t('overlay.stop')}>
                <svg width="12" height="12" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor" /></svg>
              </button>
            ) : (
              <button type="button" className="df-send" onClick={send} disabled={!canSend} title={t('overlay.send')} aria-label={t('overlay.send')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M12.5 5.5 19 12l-6.5 6.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            )}
          </div>
          <div className="df-actions">
            <button type="button" className="df-btn ghost" onClick={newChat}>{t('overlay.newChat')}</button>
            <button type="button" className="df-btn ghost" onClick={() => { closeOverlay(); openInbox() }}>{t('overlay.openInbox')}</button>
            {sessionId ? <button type="button" className="df-btn ghost" onClick={() => setUpgradeOpen(true)}>{t('overlay.upgrade')}</button> : null}
            <span className="df-spacer" />
            <span>Enter ↵ · Shift+Enter</span>
          </div>
        </div>
      </div>
      {upgradeOpen && sessionId ? (
        <UpgradeDialog
          t={t}
          sessionId={sessionId}
          onClose={() => setUpgradeOpen(false)}
          onDone={() => { setUpgradeOpen(false); bumpInbox() }}
        />
      ) : null}
    </div>
  )
}
