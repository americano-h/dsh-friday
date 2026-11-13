import React, { useCallback, useEffect, useRef, useState } from 'react'
import { api, streamChat } from './api.js'
import { ConversationComposer, ImageDrafts, useImageDrafts } from './composer.jsx'
import { Icon, MessageList, Modal } from './messages.jsx'
import { newConversation, openOverlay, openTask, runtime, setState, toast, useFridayState } from './store.js'
import { UpgradeDialog } from './upgrade.jsx'

function timeLabel(value) {
  if (!value) return ''
  const date = new Date(value)
  const today = new Date()
  const sameDay = date.toDateString() === today.toDateString()
  return new Intl.DateTimeFormat(undefined, sameDay
    ? { hour: '2-digit', minute: '2-digit' }
    : { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}

function rangeStart(range) {
  if (range === 'all') return undefined
  const days = range === 'today' ? 1 : range === 'week' ? 7 : 30
  return Date.now() - days * 24 * 60 * 60 * 1000
}

function FindDialog({ t, onClose, onSelect }) {
  const [query, setQuery] = useState('')
  const [state, setState] = useState({ loading: false, items: [], error: null })
  useEffect(() => {
    let active = true
    const timer = setTimeout(() => {
      setState((current) => ({ ...current, loading: true }))
      api.inbox({ query, status: 'all', limit: 100 })
        .then((value) => { if (active) setState({ loading: false, items: value.items, error: null }) })
        .catch((error) => { if (active) setState({ loading: false, items: [], error: error.message }) })
    }, 180)
    return () => { active = false; clearTimeout(timer) }
  }, [query])
  return (
    <Modal title={t('dialog.findTitle')} onClose={onClose} className="df-find-modal">
      <div className="df-search-field"><Icon name="search" /><input data-autofocus autoFocus value={query} placeholder={t('inbox.search')} onChange={(event) => setQuery(event.target.value)} /></div>
      {state.error ? <div className="df-error">{state.error}</div> : null}
      <div className="df-find-results">
        {!state.loading && !state.items.length ? <div className="df-empty-small">{t('state.noResults')}</div> : null}
        {state.items.map((item) => (
          <button className="df-find-row" type="button" key={item.id} onClick={() => onSelect(item)}>
            <span className="df-row-title">{item.title}</span>
            <span>{item.snippet || item.firstPrompt}</span>
            <small>{timeLabel(item.updatedAt)}{item.archived ? ` · ${t('inbox.upgraded')}` : ''}</small>
          </button>
        ))}
      </div>
    </Modal>
  )
}

export function InboxPage({ t }) {
  const requestedId = useFridayState((state) => state.inboxSelection)
  const [query, setQuery] = useState('')
  const [range, setRange] = useState('all')
  const [status, setStatus] = useState('active')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [findOpen, setFindOpen] = useState(false)
  const [upgradeId, setUpgradeId] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [initialConfig, setLocalConfig] = useState(null)
  const currentConfig = useFridayState((state) => state.config)
  const config = currentConfig || initialConfig
  const [draft, setDraft] = useState('')
  const [generating, setGenerating] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [citations, setCitations] = useState([])
  const [chatError, setChatError] = useState(null)
  const requestSequence = useRef(0)
  const selectedIdRef = useRef(null)
  const abortRef = useRef(null)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)
  const { images, setImages, addFiles } = useImageDrafts(config, setChatError)

  useEffect(() => {
    api.config().then(setLocalConfig).catch(() => {})
  }, [])

  const loadItems = useCallback(async () => {
    const sequence = ++requestSequence.current
    setLoading(true)
    try {
      const value = await api.inbox({ query, status, from: rangeStart(range) })
      if (sequence !== requestSequence.current) return
      setItems(value.items)
      setError(null)
    } catch (requestError) {
      if (sequence === requestSequence.current) setError(requestError.message)
    } finally {
      if (sequence === requestSequence.current) setLoading(false)
    }
  }, [query, status, range])

  useEffect(() => {
    const timer = setTimeout(loadItems, 180)
    return () => clearTimeout(timer)
  }, [loadItems])

  const select = useCallback(async (id) => {
    abortRef.current?.abort()
    abortRef.current = null
    selectedIdRef.current = id
    setSelectedId(id)
    setDraft('')
    setImages([])
    setGenerating(false)
    setStreamingText('')
    setCitations([])
    setChatError(null)
    if (!id) { setDetail(null); return }
    try {
      const value = await api.conversation(id)
      if (selectedIdRef.current !== id) return
      setDetail(value.conversation)
      setError(null)
    } catch (requestError) {
      if (selectedIdRef.current === id) setError(requestError.message)
    }
  }, [setImages])

  useEffect(() => {
    if (requestedId) {
      const requested = items.find((item) => item.id === requestedId)
      if (requested) {
        void select(requestedId)
        setState({ inboxSelection: null })
      }
      return
    }
    if (!items.length) {
      if (selectedIdRef.current) void select(null)
      return
    }
    if (!selectedId || !items.some((item) => item.id === selectedId)) void select(items[0].id)
  }, [items, selectedId, select, requestedId])

  useEffect(() => {
    if (!requestedId) return
    let current = true
    api.conversation(requestedId).then(({ conversation }) => {
      if (!current) return
      setQuery('')
      setRange('all')
      setStatus(conversation.archived || conversation.upgraded ? 'archived' : 'active')
      void loadItems()
    }).catch(() => { if (current) setState({ inboxSelection: null }) })
    return () => { current = false }
  }, [requestedId, loadItems])

  useEffect(() => {
    const timer = setInterval(loadItems, 4500)
    return () => clearInterval(timer)
  }, [loadItems])

  const refreshDetail = useCallback(async (id) => {
    if (!id) return
    try {
      const value = await api.conversation(id)
      if (selectedIdRef.current === id) setDetail(value.conversation)
    } catch (requestError) {
      if (selectedIdRef.current === id) setChatError(requestError.message)
    }
  }, [])

  useEffect(() => {
    if (!selectedId || generating) return
    const timer = setInterval(() => { void refreshDetail(selectedId) }, 1200)
    return () => clearInterval(timer)
  }, [selectedId, detail?.running, generating, refreshDetail])

  useEffect(() => {
    if (!selectedId) return
    const timer = setTimeout(() => inputRef.current?.focus(), 30)
    return () => clearTimeout(timer)
  }, [selectedId])

  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    input.style.height = 'auto'
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`
  }, [draft, selectedId])

  useEffect(() => {
    const node = scrollRef.current
    if (!node) return
    if (node.scrollHeight - node.scrollTop - node.clientHeight < 180) node.scrollTop = node.scrollHeight
  }, [detail?.messages?.length, streamingText])

  const runStream = useCallback(async () => {
    const id = selectedIdRef.current
    const text = draft.trim()
    if (!id || generating || (!text && !images.length)) return
    setGenerating(true)
    setChatError(null)
    setStreamingText('')
    setCitations([])
    setDraft('')
    setImages([])
    const controller = new AbortController()
    abortRef.current = controller
    try {
      await streamChat({
        body: { sessionId: id, text, images, clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        signal: controller.signal,
        onEvent: (event) => {
          if (selectedIdRef.current !== id) return
          if (event.type === 'delta') setStreamingText((current) => current + event.text)
          else if (event.type === 'citations') setCitations(event.sources || [])
          else if (event.type === 'done') {
            setDetail(event.conversation || null)
            setStreamingText('')
            setGenerating(false)
          } else if (event.type === 'error') {
            setChatError(event.message)
            setGenerating(false)
          }
        },
      })
      if (selectedIdRef.current === id) await refreshDetail(id)
    } catch (requestError) {
      if (requestError.name !== 'AbortError' && selectedIdRef.current === id) setChatError(requestError.message)
      if (selectedIdRef.current === id) await refreshDetail(id)
    } finally {
      if (selectedIdRef.current === id) {
        setGenerating(false)
        setStreamingText('')
      }
      if (abortRef.current === controller) abortRef.current = null
      void loadItems()
    }
  }, [generating, draft, images, refreshDetail, loadItems, setImages])

  const stop = async () => {
    const id = selectedIdRef.current
    if (!id) return
    try { await api.cancel(id) } catch (requestError) { setChatError(requestError.message) }
    abortRef.current?.abort()
    abortRef.current = null
    setGenerating(false)
    setStreamingText('')
    await refreshDetail(id)
  }

  const showQuickPanel = async () => {
    if (runtime.native || !config?.native?.pageReady) return openOverlay(detail.id)
    try { await api.showNative(detail.id) } catch (failure) { setError(failure.message) }
  }

  const resumeUpgrade = async () => {
    try {
      const task = await api.upgrade(detail.id, detail.upgradedWorkspaceId)
      await loadItems()
      await refreshDetail(detail.id)
      openTask(task.sessionId)
    } catch (failure) { setError(failure.message) }
  }

  const remove = async (id) => {
    try {
      await api.remove(id)
      setConfirm(null)
      abortRef.current?.abort()
      selectedIdRef.current = null
      setDetail(null)
      setSelectedId(null)
      await loadItems()
      toast(t('inbox.delete'), 'success')
    } catch (requestError) { setError(requestError.message) }
  }

  const clear = async () => {
    try {
      const value = await api.clear()
      setConfirm(null)
      await loadItems()
      toast(`${t('inbox.clear')} · ${value.count}`, 'success')
    } catch (requestError) { setError(requestError.message) }
  }

  const cleanup = async () => {
    try {
      const value = await api.cleanup()
      await loadItems()
      toast(`${t('inbox.cleanup')} · ${value.count}`, 'success')
    } catch (requestError) { setError(requestError.message) }
  }

  return (
    <div className="df-page">
      <header className="df-page-head">
        <div><h1>{t('inbox.title')}</h1><p>{t('inbox.subtitle')}</p></div>
        <div className="df-page-actions">
          <button className="df-btn" type="button" onClick={() => setFindOpen(true)}><Icon name="search" />{t('inbox.find')}</button>
          <button className="df-btn primary" type="button" onClick={newConversation}><Icon name="plus" />{t('inbox.new')}</button>
        </div>
      </header>
      <div className="df-toolbar">
        <div className="df-search-field"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('inbox.search')} /></div>
        <select className="df-input df-time-filter" aria-label="Time range" value={range} onChange={(event) => setRange(event.target.value)}>
          {['all', 'today', 'week', 'month'].map((value) => <option key={value} value={value}>{t(`state.${value === 'all' ? 'allTime' : value}`)}</option>)}
        </select>
        <button className="df-btn subtle" type="button" onClick={cleanup}>{t('inbox.cleanup')}</button>
        {status === 'active' ? <button className="df-btn subtle danger" type="button" disabled={!items.length} onClick={() => setConfirm('clear')}>{t('inbox.clear')}</button> : null}
      </div>
      <div className="df-tabs" role="tablist">
        <button role="tab" aria-selected={status === 'active'} className={status === 'active' ? 'active' : ''} onClick={() => setStatus('active')}>{t('inbox.active')}</button>
        <button role="tab" aria-selected={status === 'archived'} className={status === 'archived' ? 'active' : ''} onClick={() => setStatus('archived')}>{t('inbox.archived')}</button>
      </div>
      {error ? <div className="df-error df-page-error" role="alert">{error}<button className="df-btn" onClick={loadItems}>{t('state.retry')}</button></div> : null}
      <div className="df-inbox-layout">
        <section className="df-list" aria-label={t('inbox.title')}>
          {loading && !items.length ? <div className="df-empty-small">{t('state.loading')}</div> : null}
          {!loading && !items.length ? (
            <div className="df-empty-state"><Icon name="inbox" size={28} /><h2>{query ? t('state.noResults') : t('inbox.empty')}</h2><p>{t('inbox.emptyHint').replace('{hotkey}', config?.config?.hotkey || 'Alt+Space')}</p></div>
          ) : null}
          {items.map((item) => (
            <button className={`df-inbox-row ${selectedId === item.id ? 'selected' : ''}`} type="button" key={item.id} onClick={() => select(item.id)}>
              <span className="df-row-top"><strong>{item.title}</strong><time>{timeLabel(item.updatedAt)}</time></span>
              <span className="df-row-summary">{item.snippet || item.firstPrompt || item.title}</span>
              <span className="df-row-meta">
                <span>{item.model?.model || 'Friday'}</span>
                {item.hasImage ? <span className="df-badge"><Icon name="image" size={12} />{t('inbox.images')}</span> : null}
                {item.archived ? <span className="df-badge">{t('inbox.upgraded')}</span> : null}
              </span>
            </button>
          ))}
        </section>
        <section className="df-detail">
          {!detail ? <div className="df-empty-state"><Icon name="chevron" size={24} /><p>{t('inbox.find')}</p></div> : (
            <>
              <header className="df-detail-head">
                <div><h2>{detail.title}</h2><div className="df-hint">{timeLabel(detail.updatedAt)} · {detail.model?.model || 'Friday'}</div></div>
                <div className="df-detail-actions">
                  {!detail.archived && !detail.upgraded && <button className="df-btn" onClick={showQuickPanel}>{t('inbox.quick')}</button>}
                  {detail.archived && detail.upgraded && <button className="df-icon-btn danger" type="button" onClick={() => setConfirm(detail.id)} aria-label={t('inbox.delete')}><Icon name="trash" /></button>}
                  {detail.upgraded && !detail.archived ? <button className="df-btn" onClick={resumeUpgrade}>{t('inbox.resumeUpgrade')}</button> : detail.upgradedSessionId ? <button className="df-btn" type="button" onClick={() => openTask(detail.upgradedSessionId)}>{t('inbox.openTask')}<Icon name="chevron" /></button> : (
                    <>
                      <button className="df-btn primary" type="button" disabled={detail.running || generating} onClick={() => setUpgradeId(detail.id)}><Icon name="upgrade" />{t('inbox.upgrade')}</button>
                      <button className="df-icon-btn danger" type="button" onClick={() => setConfirm(detail.id)} aria-label={t('inbox.delete')}><Icon name="trash" /></button>
                    </>
                  )}
                </div>
              </header>
              <div className="df-detail-transcript" ref={scrollRef}>
                <MessageList conversation={detail} sessionId={detail.id} streamingText={streamingText || detail.liveText} streamingCitations={citations} t={t} />
                {generating && !streamingText ? <div className="df-thinking"><span />{t('quick.thinking')}</div> : null}
              </div>
              <footer className="df-inline-chat">
                <ImageDrafts images={images} setImages={setImages} />
                {chatError ? <div className="df-error" role="alert">{chatError}</div> : null}
                {detail.archived || detail.upgraded ? <div className="df-hint">{t('inbox.upgraded')}</div> : null}
                <ConversationComposer t={t} draft={draft} setDraft={setDraft} images={images} addFiles={addFiles}
                  generating={generating || detail.running} archived={Boolean(detail.archived || detail.upgraded)}
                  imageEnabled={Boolean(config && (config.defaultSupportsImages || config.visionAvailable))} inputRef={inputRef}
                  shortcuts={config?.config?.shortcuts} onSubmit={runStream} onStop={stop} />
              </footer>
            </>
          )}
        </section>
      </div>
      {findOpen ? <FindDialog t={t} onClose={() => setFindOpen(false)} onSelect={(item) => {
        setFindOpen(false)
        setQuery('')
        setRange('all')
        setStatus(item.archived ? 'archived' : 'active')
        setTimeout(() => { void select(item.id) }, 0)
      }} /> : null}
      {upgradeId ? <UpgradeDialog sessionId={upgradeId} t={t} onClose={() => setUpgradeId(null)} /> : null}
      {confirm ? (
        <Modal title={confirm === 'clear' ? t('dialog.clearTitle') : t('dialog.deleteTitle')}
          description={confirm === 'clear' ? t('dialog.clearDescription') : t('dialog.deleteDescription')} onClose={() => setConfirm(null)}>
          <div className="df-modal-actions">
            <button className="df-btn" onClick={() => setConfirm(null)}>{t('dialog.cancel')}</button>
            <button className="df-btn danger-solid" onClick={() => confirm === 'clear' ? clear() : remove(confirm)}>{t('dialog.confirmDelete')}</button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
