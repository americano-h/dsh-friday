import React, { useCallback, useEffect, useRef, useState } from 'react'
import { api, streamChat } from './api.js'
import { ConversationComposer, ImageDrafts, useImageDrafts } from './composer.jsx'
import { Icon, MessageList } from './messages.jsx'
import { closeOverlay, getState, markRecent, newConversation, runtime, setConfig, setState, toast, useFridayState } from './store.js'
import { UpgradeDialog } from './upgrade.jsx'

export function QuickOverlay({ t }) {
  const open = useFridayState((state) => state.overlayOpen)
  const sessionId = useFridayState((state) => state.sessionId)
  const config = useFridayState((state) => state.config)
  const [conversation, setConversation] = useState(null)
  const [draft, setDraft] = useState('')
  const [generating, setGenerating] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [citations, setCitations] = useState([])
  const [error, setError] = useState(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [position, setPosition] = useState(null)
  const abortRef = useRef(null)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)
  const dragRef = useRef(null)
  const { images, setImages, addFiles } = useImageDrafts(config, setError)

  const refresh = useCallback(async (id = getState().sessionId) => {
    if (!id) return null
    try {
      const value = await api.conversation(id)
      setConversation(value.conversation)
      return value.conversation
    } catch (requestError) {
      setError(requestError.message)
      return null
    }
  }, [])

  useEffect(() => {
    if (!open || config) return
    api.config().then(setConfig).catch((requestError) => setError(requestError.message))
  }, [open, config])

  useEffect(() => {
    if (!open || !config || sessionId !== undefined) return
    const recent = config.recent
    const resume = recent && Date.now() - recent.updatedAt <= 5 * 60 * 1000
    setState({ sessionId: resume ? recent.id : null })
  }, [open, config, sessionId])

  useEffect(() => {
    if (!open) return
    setError(null)
    setStreamingText('')
    setCitations([])
    if (!sessionId) {
      setConversation(null)
      return
    }
    void refresh(sessionId)
  }, [open, sessionId, refresh])

  useEffect(() => {
    if (!open || !conversation?.running || generating) return
    const timer = setInterval(() => { void refresh() }, 1200)
    return () => clearInterval(timer)
  }, [open, conversation?.running, generating, refresh])

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => inputRef.current?.focus(), 30)
    return () => clearTimeout(timer)
  }, [open, sessionId])

  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    input.style.height = 'auto'
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`
  }, [draft])

  useEffect(() => {
    const node = scrollRef.current
    if (!node) return
    if (node.scrollHeight - node.scrollTop - node.clientHeight < 180) node.scrollTop = node.scrollHeight
  }, [conversation?.messages?.length, streamingText])

  useEffect(() => {
    if (!open || !runtime.native) return
    const expanded = Boolean(conversation?.messages?.length || streamingText || generating)
    const height = upgradeOpen ? 700 : (expanded ? 560 : 62) + (images.length ? 68 : 0) + (error ? 42 : 0)
    runtime.native.resize({ width: upgradeOpen ? 760 : 720, height })
  }, [open, conversation?.messages?.length, streamingText, generating, images.length, error, upgradeOpen])

  const hide = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setGenerating(false)
    setStreamingText('')
    closeOverlay()
    if (getState().sessionId) setTimeout(() => { void refresh() }, 300)
  }, [refresh])

  const createNew = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setConversation(null)
    setGenerating(false)
    setStreamingText('')
    setCitations([])
    setImages([])
    setError(null)
    newConversation()
  }, [])

  const runStream = useCallback(async (regenerate = false) => {
    if (generating || sessionId === undefined) return
    const text = draft.trim()
    if (!regenerate && !text && !images.length) return
    setGenerating(true)
    setError(null)
    setStreamingText('')
    setCitations([])
    const controller = new AbortController()
    abortRef.current = controller
    let activeId = sessionId
    if (!regenerate) {
      setDraft('')
      setImages([])
    }
    try {
      await streamChat({
        body: regenerate
          ? { sessionId: activeId }
          : { sessionId: activeId, text, images, clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        regenerate,
        signal: controller.signal,
        onEvent: (event) => {
          if (event.type === 'meta') {
            activeId = event.sessionId
            markRecent(activeId)
            if (getState().sessionId !== activeId) setState({ sessionId: activeId })
          } else if (event.type === 'delta') {
            setStreamingText((current) => current + event.text)
          } else if (event.type === 'citations') {
            setCitations(event.sources || [])
          } else if (event.type === 'done') {
            setConversation(event.conversation || null)
            setStreamingText('')
            setGenerating(false)
            api.config().then(setConfig).catch(() => {})
          } else if (event.type === 'error') {
            setError(event.message)
            setGenerating(false)
          }
        },
      })
      if (activeId) await refresh(activeId)
    } catch (requestError) {
      if (requestError.name !== 'AbortError') setError(requestError.message)
      if (activeId) await refresh(activeId)
    } finally {
      setGenerating(false)
      setStreamingText('')
      abortRef.current = null
    }
  }, [generating, sessionId, draft, images, refresh])

  const stop = async () => {
    if (!sessionId) return
    try { await api.cancel(sessionId) } catch (requestError) { setError(requestError.message) }
    abortRef.current?.abort()
    abortRef.current = null
    setGenerating(false)
    setStreamingText('')
    await refresh(sessionId)
  }

  const startDrag = (event) => {
    if (runtime.native || event.button !== 0 || event.target.closest('button, textarea, input, select, a, .df-quick-transcript, .df-modal')) return
    const rect = event.currentTarget.getBoundingClientRect()
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const moveDrag = (event) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const left = Math.max(8, Math.min(window.innerWidth - drag.width - 8, drag.left + event.clientX - drag.startX))
    const top = Math.max(8, Math.min(window.innerHeight - 46 - 8, drag.top + event.clientY - drag.startY))
    setPosition({ left, top })
  }
  const endDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  if (!open) return null
  const messages = conversation?.messages || []
  const lastAssistant = [...messages].reverse().find((message) => message.role === 'assistant')
  const imageEnabled = Boolean(config && (config.defaultSupportsImages || config.visionAvailable))
  const archived = Boolean(conversation?.archived || conversation?.upgraded)
  const expanded = Boolean(messages.length || streamingText || generating)

  const copy = async () => {
    if (!lastAssistant) return
    try {
      if (runtime.native) await runtime.native.writeClipboard(lastAssistant.text)
      else await navigator.clipboard.writeText(lastAssistant.text)
      toast(t('quick.copied'), 'success')
    } catch (clipboardError) { setError(clipboardError.message) }
  }

  return (
    <div className={`df-overlay-root${runtime.native ? ' df-native' : ''}`}>
      <section className={`df-quick ${expanded ? 'expanded' : 'compact'}${position ? ' positioned' : ''}`} aria-label="Friday quick conversation"
        style={position ? { left: position.left, top: position.top, transform: 'none' } : undefined}
        onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}
        onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'copy' }}
        onDrop={(event) => { event.preventDefault(); void addFiles(event.dataTransfer.files) }}>
        {expanded ? (
          <header className="df-quick-head">
            <div className="df-quick-brand"><span className="df-brand-dot" /><strong>{conversation?.title || 'Friday'}</strong></div>
            <div className="df-quick-actions">
              <button className="df-icon-btn" type="button" onClick={createNew} title={t('quick.new')} aria-label={t('quick.new')}><Icon name="plus" /></button>
              {sessionId && messages.length && !archived ? <button className="df-icon-btn" type="button" onClick={() => setUpgradeOpen(true)} title={t('quick.upgrade')} aria-label={t('quick.upgrade')}><Icon name="upgrade" /></button> : null}
              <button className="df-icon-btn" type="button" onClick={hide} title={t('quick.close')} aria-label={t('quick.close')}><Icon name="close" /></button>
            </div>
          </header>
        ) : null}

        {expanded ? (
          <div className="df-quick-transcript" ref={scrollRef}>
            <MessageList conversation={conversation} sessionId={sessionId} streamingText={streamingText} streamingCitations={citations} t={t} />
            {generating && !streamingText ? <div className="df-thinking" aria-label={t('quick.thinking')}><span /></div> : null}
          </div>
        ) : null}

        {lastAssistant && !generating ? (
          <div className="df-answer-actions">
            <button type="button" onClick={copy} title={t('quick.copy')} aria-label={t('quick.copy')}><Icon name="copy" size={15} /></button>
            <button type="button" onClick={() => void runStream(true)} title={t('quick.regenerate')} aria-label={t('quick.regenerate')}><Icon name="refresh" size={15} /></button>
          </div>
        ) : null}

        <ImageDrafts images={images} setImages={setImages} />

        {error ? <div className="df-error df-quick-error" role="alert">{error}</div> : null}
        {archived ? <div className="df-hint df-quick-error">{t('inbox.upgraded')}</div> : null}
        <ConversationComposer t={t} draft={draft} setDraft={setDraft} images={images} addFiles={addFiles}
          generating={generating} archived={archived} imageEnabled={imageEnabled} inputRef={inputRef}
          onSubmit={() => runStream(false)} onStop={stop} onEscape={hide} />
      </section>
      {upgradeOpen && sessionId ? <UpgradeDialog sessionId={sessionId} t={t} onClose={() => setUpgradeOpen(false)} /> : null}
    </div>
  )
}
