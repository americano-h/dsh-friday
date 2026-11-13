import React, { useEffect, useMemo, useRef, useState } from 'react'
import { api } from './api.js'
import { Markdown } from './markdown.jsx'
import { MessageImages, References } from './message.jsx'
import { SettingsDialog, SettingsCard } from './settings.jsx'
import { UpgradeDialog } from './upgrade.jsx'
import { bumpInbox, openOverlay, toast, useFridayStore } from './store.js'
import { openTask } from './runtime.js'

function formatTime(value, locale) {
  if (!value) return ''
  const date = new Date(value)
  const now = Date.now()
  const diff = now - date.getTime()
  if (diff < 60_000) return locale === 'zh' ? '刚刚' : 'just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`
  return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })
}

function modelName(model) {
  if (!model) return '—'
  return model.model || model.provider
}

function Row({ item, selected, onSelect, t, locale }) {
  return (
    <button type="button" className={`df-row${selected ? ' on' : ''}`} onClick={() => onSelect(item.id)}>
      <span className="df-row-title">{item.title || item.firstPrompt || t('inbox.title')}</span>
      <span className="df-row-snippet">{item.firstPrompt || item.snippet || ' '}</span>
      <span className="df-row-meta">
        <span>{formatTime(item.updatedAt, locale)}</span>
        <span>·</span>
        <span>{modelName(item.model)}</span>
        {item.hasImage ? <span className="df-chip">{t('inbox.hasImage')}</span> : null}
        {item.upgraded ? <span className="df-chip warn">{t('inbox.upgraded')}</span> : null}
        {item.archived ? <span className="df-chip">{t('inbox.archived')}</span> : null}
      </span>
    </button>
  )
}

function Conversation({ conversation, t, locale, onContinue, onUpgrade, onArchive, onDelete, onOpenTask }) {
  const messages = conversation?.messages || []
  return (
    <>
      <div className="df-detail-head">
        <h2 className="df-detail-title">{conversation.title || conversation.firstPrompt || t('inbox.title')}</h2>
        <div className="df-detail-actions">
          <button type="button" className="df-btn primary" onClick={onContinue} disabled={conversation.archived}>
            {t('inbox.continue')}
          </button>
          {conversation.upgraded && conversation.upgradedSessionId ? (
            <button type="button" className="df-btn" onClick={() => onOpenTask(conversation.upgradedSessionId)}>
              {t('inbox.upgraded')} ↗
            </button>
          ) : (
            <button type="button" className="df-btn" onClick={onUpgrade} disabled={conversation.archived}>
              {t('inbox.upgrade')}
            </button>
          )}
          <button type="button" className="df-btn ghost" onClick={onArchive}>
            {conversation.archived ? t('inbox.unarchive') : t('inbox.archive')}
          </button>
          <button type="button" className="df-btn ghost danger" onClick={onDelete}>{t('inbox.delete')}</button>
          <span className="df-spacer" style={{ flex: 1 }} />
          <span className="df-subtle" style={{ fontSize: 11 }}>
            {modelName(conversation.model)} · {formatTime(conversation.updatedAt, locale)}
          </span>
        </div>
      </div>
      <div className="df-detail-body" role="log" aria-label="conversation">
        {messages.length === 0 ? <div className="df-empty-state">{t('inbox.empty')}</div> : null}
        {messages.map((message, index) => (
          <div className={`df-msg ${message.role}`} key={message.id || index} aria-label={`${message.role} message`}>
            {message.role === 'assistant' ? (
              <span className="df-avatar" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3.5l1.7 4.6 4.6 1.7-4.6 1.7L12 16.1l-1.7-4.6L5.7 9.8l4.6-1.7L12 3.5Z" fill="currentColor" /></svg>
              </span>
            ) : null}
            <div className="df-bubble">
              <MessageImages images={message.images} sessionId={conversation.id} />
              {message.role === 'assistant' ? <Markdown text={message.text} /> : <div style={{ whiteSpace: 'pre-wrap' }}>{message.text}</div>}
              <References citations={message.citations} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function Finder({ t, onClose, onOpen }) {
  const [query, setQuery] = useState('')
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') { event.preventDefault(); onClose() } }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      setLoading(true)
      api.inbox({ q: query, status: 'all', limit: 30 })
        .then((data) => { if (!cancelled) setItems(data.items || []) })
        .catch(() => { if (!cancelled) setItems([]) })
        .finally(() => { if (!cancelled) setLoading(false) })
    }, 160)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [query])
  return (
    <div className="df-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="df-modal" role="dialog" aria-modal="true" aria-label={t('finder.title')}>
        <div className="df-modal-head">{t('finder.title')}</div>
        <div className="df-modal-body">
          <input autoFocus className="df-search" placeholder={t('finder.placeholder')} value={query} onChange={(event) => setQuery(event.target.value)} />
          <div className="df-subtle">{loading ? t('inbox.loading') : t('finder.hint')}</div>
          <div className="df-list" style={{ padding: 0, maxHeight: '48vh' }}>
            {items.map((item) => (
              <Row key={item.id} item={item} selected={false} onSelect={() => onOpen(item.id)} t={t} locale={navigator.language?.startsWith('zh') ? 'zh' : 'en'} />
            ))}
            {!loading && items.length === 0 ? <div className="df-subtle" style={{ padding: 10 }}>{t('inbox.emptySearch')}</div> : null}
          </div>
        </div>
        <div className="df-modal-foot"><button type="button" className="df-btn" onClick={onClose}>{t('upgradeDialog.cancel')}</button></div>
      </div>
    </div>
  )
}

function ConfirmDialog({ t, message, confirmLabel, onCancel, onConfirm }) {
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') { event.preventDefault(); onCancel() } }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onCancel])
  return (
    <div className="df-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <div className="df-modal" role="alertdialog" aria-modal="true" aria-label={message} style={{ width: 'min(420px, 100%)' }}>
        <div className="df-modal-head">{message}</div>
        <div className="df-modal-foot">
          <button type="button" className="df-btn ghost" onClick={onCancel}>{t('upgradeDialog.cancel')}</button>
          <button type="button" className="df-btn primary" onClick={onConfirm}>{confirmLabel || t('inbox.delete')}</button>
        </div>
      </div>
    </div>
  )
}

export function InboxPage({ t }) {
  const locale = navigator.language?.startsWith('zh') ? 'zh' : 'en'
  const refresh = useFridayStore((state) => state.inboxRefresh)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('active')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [conversation, setConversation] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [finderOpen, setFinderOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const searchTimer = useRef(null)

  useEffect(() => {
    let cancelled = false
    const load = () => {
      setLoading(true)
      api.inbox({ q: query, status })
        .then((data) => {
          if (cancelled) return
          setItems(data.items || [])
          setSelectedId((current) => current && data.items?.some((item) => item.id === current) ? current : data.items?.[0]?.id || null)
        })
        .catch((error) => { if (!cancelled) toast(error.message, 'error') })
        .finally(() => { if (!cancelled) setLoading(false) })
    }
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(load, query ? 180 : 0)
    return () => { cancelled = true; clearTimeout(searchTimer.current) }
  }, [query, status, refresh])

  useEffect(() => {
    if (!selectedId) {
      setConversation(null)
      return
    }
    let cancelled = false
    setDetailLoading(true)
    api.conversation(selectedId)
      .then((data) => { if (!cancelled) setConversation(data.conversation) })
      .catch((error) => { if (!cancelled) { toast(error.message, 'error'); setConversation(null) } })
      .finally(() => { if (!cancelled) setDetailLoading(false) })
    return () => { cancelled = true }
  }, [selectedId, refresh])

  const current = conversation && conversation.id === selectedId ? conversation : null

  const stats = useMemo(() => ({
    active: items.filter((item) => !item.archived).length,
    archived: items.filter((item) => item.archived).length,
  }), [items])

  async function setArchived(archived) {
    if (!conversation) return
    try {
      await api.setArchived(conversation.id, archived)
      bumpInbox()
      toast(archived ? t('inbox.archive') : t('inbox.unarchive'), 'success')
    } catch (error) {
      toast(error.message, 'error')
    }
  }

  function remove() {
    if (!conversation) return
    setConfirm({
      message: t('inbox.deleteConfirm'),
      confirmLabel: t('inbox.delete'),
      action: async () => {
        try {
          await api.remove(conversation.id)
          setSelectedId(null)
          setConversation(null)
          bumpInbox()
          toast(t('inbox.deleted'), 'success')
        } catch (error) {
          toast(error.message, 'error')
        }
      },
    })
  }

  function clearAll() {
    setConfirm({
      message: t('inbox.clearConfirm'),
      confirmLabel: t('inbox.clear'),
      action: async () => {
        try {
          await api.clear()
          setSelectedId(null)
          setConversation(null)
          bumpInbox()
          toast(t('inbox.cleared'), 'success')
        } catch (error) {
          toast(error.message, 'error')
        }
      },
    })
  }

  async function cleanup() {
    try {
      const result = await api.cleanup()
      bumpInbox()
      toast(`${t('inbox.cleanupDone')}${result?.count ? ` (${result.count})` : ''}`, 'success')
    } catch (error) {
      toast(error.message, 'error')
    }
  }

  return (
    <div className="df-page">
      <aside className="df-page-list">
        <div className="df-list-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 className="df-page-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4.5 13.2 6.8 6.9A2.2 2.2 0 0 1 8.86 5.5h6.28a2.2 2.2 0 0 1 2.06 1.4l2.3 6.3v3.1a2.2 2.2 0 0 1-2.2 2.2H6.7a2.2 2.2 0 0 1-2.2-2.2v-3.1Z" stroke="var(--dsw-alias-brand-primary)" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M4.5 13.4h3.4l.8 1.6h6.6l.8-1.6h3.4" stroke="var(--dsw-alias-brand-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('inbox.title')}
            </h1>
            <span className="df-spacer" style={{ flex: 1 }} />
            <button type="button" className="df-icon-btn" title={t('inbox.settings')} aria-label={t('inbox.settings')} onClick={() => setSettingsOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" stroke="currentColor" strokeWidth="1.5" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.4 2.4-.06-.06A1.7 1.7 0 0 0 15.46 19c-.3.13-.55.37-.68.68L14.6 20h-3.4l-.18-.32a1.7 1.7 0 0 0-.68-.68 1.7 1.7 0 0 0-1.88.34l-.06.06-2.4-2.4.06-.06A1.7 1.7 0 0 0 6.4 15a1.7 1.7 0 0 0-.68-.68L5.4 14.1v-3.4l.32-.18a1.7 1.7 0 0 0 .68-.68 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.4-2.4.06.06A1.7 1.7 0 0 0 10.34 5c.3-.13.55-.37.68-.68l.18-.32h3.4l.18.32c.13.3.37.55.68.68a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.4 2.4-.06.06a1.7 1.7 0 0 0-.34 1.88c.13.3.37.55.68.68l.32.18v3.4l-.32.18c-.3.13-.55.37-.68.68Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
            </button>
          </div>
          <div className="df-subtle">{t('inbox.subtitle')}</div>
          <input className="df-search" placeholder={t('inbox.search')} value={query} onChange={(event) => setQuery(event.target.value)} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="df-tabs">
              <button type="button" className={`df-tab${status === 'active' ? ' on' : ''}`} onClick={() => setStatus('active')}>{t('inbox.active')}</button>
              <button type="button" className={`df-tab${status === 'archived' ? ' on' : ''}`} onClick={() => setStatus('archived')}>{t('inbox.archived')}</button>
              <button type="button" className={`df-tab${status === 'all' ? ' on' : ''}`} onClick={() => setStatus('all')}>{t('inbox.all')}</button>
            </div>
            <span className="df-spacer" style={{ flex: 1 }} />
            <button type="button" className="df-btn ghost" onClick={() => setFinderOpen(true)}>{t('inbox.finder')}</button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" className="df-btn primary" onClick={() => openOverlay(null)}>+ {t('inbox.newChat')}</button>
            <button type="button" className="df-btn ghost" onClick={cleanup}>{t('inbox.cleanup')}</button>
            <button type="button" className="df-btn ghost danger" onClick={clearAll}>{t('inbox.clear')}</button>
          </div>
        </div>
        <div className="df-list">
          {items.map((item) => (
            <Row key={item.id} item={item} selected={item.id === selectedId} onSelect={setSelectedId} t={t} locale={locale} />
          ))}
          {loading && items.length === 0 ? <div className="df-subtle" style={{ padding: 12 }}>{t('inbox.loading')}</div> : null}
          {!loading && items.length === 0 ? (
            <div className="df-empty-state" style={{ minHeight: 160, padding: 16, textAlign: 'center' }}>
              {query ? t('inbox.emptySearch') : t('inbox.empty')}
            </div>
          ) : null}
        </div>
        <div className="df-subtle" style={{ padding: '6px 12px', borderTop: '1px solid var(--dsw-alias-border-l1)' }}>
          {stats.active} {t('inbox.active')} · {stats.archived} {t('inbox.archived')}
        </div>
      </aside>
      <section className="df-page-main">
        {detailLoading && !current ? <div className="df-empty-state">{t('inbox.loading')}</div> : current ? (
          <Conversation
            conversation={current}
            t={t}
            locale={locale}
            onContinue={() => openOverlay(current.id)}
            onUpgrade={() => setUpgradeOpen(true)}
            onArchive={() => setArchived(!current.archived)}
            onDelete={remove}
            onOpenTask={openTask}
          />
        ) : (
          <div className="df-empty-state">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4.5 13.2 6.8 6.9A2.2 2.2 0 0 1 8.86 5.5h6.28a2.2 2.2 0 0 1 2.06 1.4l2.3 6.3v3.1a2.2 2.2 0 0 1-2.2 2.2H6.7a2.2 2.2 0 0 1-2.2-2.2v-3.1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" opacity=".5" /></svg>
            {t('inbox.noSelection')}
          </div>
        )}
      </section>
      {finderOpen ? (
        <Finder t={t} onClose={() => setFinderOpen(false)} onOpen={(id) => { setFinderOpen(false); setSelectedId(id) }} />
      ) : null}
      {settingsOpen ? <SettingsDialog t={t} onClose={() => setSettingsOpen(false)} /> : null}
      {confirm ? (
        <ConfirmDialog
          t={t}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          onCancel={() => setConfirm(null)}
          onConfirm={() => { const action = confirm.action; setConfirm(null); action() }}
        />
      ) : null}
      {upgradeOpen && current ? (
        <UpgradeDialog t={t} sessionId={current.id} onClose={() => setUpgradeOpen(false)} onDone={() => { setUpgradeOpen(false); bumpInbox() }} />
      ) : null}
    </div>
  )
}

export function InboxSettingsCard({ t }) {
  return <SettingsCard t={t} />
}
