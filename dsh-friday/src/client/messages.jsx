import React, { useEffect, useState } from 'react'
import { api } from './api.js'
import { Markdown, safeHref } from './markdown.jsx'

export function Icon({ name, size = 18 }) {
  const paths = {
    plus: 'M12 5v14M5 12h14',
    close: 'm6 6 12 12M18 6 6 18',
    search: 'm21 21-4.4-4.4m2.4-5.1a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z',
    send: 'm22 2-7 20-4-9-9-4 20-7Z',
    stop: 'M7 7h10v10H7z',
    image: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm12.5 6-5-5L5 21',
    copy: 'M8 8h12v12H8zM4 16V4h12',
    refresh: 'M20 6v5h-5M4 18v-5h5m9.5-4A8 8 0 0 0 5 6.5L4 11m16 2-1 4.5A8 8 0 0 1 5.5 15',
    upgrade: 'M12 19V5m-6 6 6-6 6 6M5 21h14',
    trash: 'M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6',
    inbox: 'M3 13 6 5h12l3 8v6H3v-6Zm0 1h5l2 3h4l2-3h5',
    chevron: 'm9 18 6-6-6-6',
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[name] || paths.inbox} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Attachment({ sessionId, image }) {
  const [url, setUrl] = useState(null)
  const [failed, setFailed] = useState(false)
  const ref = image.attachment
  useEffect(() => {
    let active = true
    setUrl(null)
    setFailed(false)
    api.attachment(sessionId, ref.attachmentId)
      .then((value) => { if (active) setUrl(value.dataUrl) })
      .catch(() => { if (active) setFailed(true) })
    return () => { active = false }
  }, [sessionId, ref.attachmentId])
  return (
    <div className="df-attachment">
      {url ? <img src={url} alt={ref.name || 'Attached'} /> : <span>{failed ? 'Image unavailable' : 'Loading image…'}</span>}
    </div>
  )
}

export function Sources({ sources = [], t }) {
  if (!sources.length) return null
  return (
    <div className="df-sources">
      <div className="df-sources-title">{t('quick.sources')}</div>
      <ol>{sources.filter((source) => safeHref(source.url)).map((source) => (
        <li key={source.url}>
          <a href={safeHref(source.url)} target="_blank" rel="noreferrer noopener">{source.title || source.url}</a>
          {source.snippet ? <span>{source.snippet}</span> : null}
        </li>
      ))}</ol>
    </div>
  )
}

export function MessageList({ conversation, sessionId, streamingText, streamingCitations, t }) {
  const messages = [...(conversation?.messages || [])]
  if (streamingText) messages.push({ id: 'streaming', role: 'assistant', text: streamingText, citations: streamingCitations })
  return (
    <div className="df-messages">
      {messages.map((message) => (
        <article className={`df-message ${message.role}`} key={`${message.id}-${message.seq || ''}`}>
          <div className="df-message-role">{message.role === 'user' ? 'You' : 'Friday'}</div>
          {message.images?.length ? (
            <div className="df-attachment-grid">
              {message.images.map((image) => <Attachment key={image.attachment.attachmentId} sessionId={sessionId || conversation.id} image={image} />)}
            </div>
          ) : null}
          {message.text ? <Markdown text={message.text} /> : null}
          <Sources sources={message.citations} t={t} />
          {message.interrupted ? <div className="df-hint">Interrupted</div> : null}
        </article>
      ))}
    </div>
  )
}

export function Modal({ title, description, children, onClose, className = '' }) {
  const dialogRef = React.useRef(null)
  const onCloseRef = React.useRef(onClose)
  onCloseRef.current = onClose
  useEffect(() => {
    const previous = document.activeElement
    const dialog = dialogRef.current
    const focusable = () => [...(dialog?.querySelectorAll('button, input, select, textarea, [tabindex="0"]') || [])].filter((node) => !node.disabled)
    const preferred = dialog?.querySelector('[data-autofocus]')
    ;(preferred || focusable()[0])?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onCloseRef.current?.()
      }
      if (event.key === 'Tab') {
        const items = focusable()
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      previous?.focus?.()
    }
  }, [])
  return (
    <div className="df-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.() }}>
      <section className={`df-modal ${className}`} role="dialog" aria-modal="true" aria-label={title} ref={dialogRef}>
        <header className="df-modal-head">
          <div><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>
          <button className="df-icon-btn" type="button" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </header>
        <div className="df-modal-body">{children}</div>
      </section>
    </div>
  )
}
