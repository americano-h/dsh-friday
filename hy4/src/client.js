/**
 * dsh-friday-hy4 0.1.0 — Web Client half.
 *
 * Registers four native Slots and renders everything with React.createElement
 * (no JSX, no build step). Colors come exclusively from --dsw-alias-* tokens so
 * light/dark switching follows the host automatically.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-friday-hy4',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const PKG = '@local/dsh-friday-hy4'
    const NS = 'dsh-friday-hy4'
    const PANEL_ID = 'dsh-friday-hy4-inbox'
    const API_PATH = 'plugins/dsh-friday-hy4/api'
    const IMAGE_PATH = 'plugins/dsh-friday-hy4/image'
    const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
    const MAX_IMAGE_BYTES = 5 * 1024 * 1024
    const MAX_IMAGES = 4

    const DICT = {
      en: {
        'inbox.title': 'Inbox',
        'inbox.subtitle': 'Quick Q&A, kept out of your workspaces',
        'action.new': 'New conversation',
        'action.search': 'Find conversation',
        'action.settings': 'Settings',
        'action.cleanup': 'Clean expired',
        'action.refresh': 'Refresh',
        'action.ask': 'Ask in floating dialog',
        'action.resume': 'Resume',
        'action.promote': 'Promote to task',
        'action.delete': 'Delete',
        'action.copy': 'Copy',
        'action.regenerate': 'Regenerate',
        'action.stop': 'Stop generating',
        'action.close': 'Close',
        'action.save': 'Save settings',
        'action.confirm': 'Confirm promotion',
        'action.newWorkspace': 'New workspace',
        'action.cancel': 'Cancel',
        'action.clear': 'Clear Inbox',
        'action.openQuick': 'Open quick dialog',
        'label.search': 'Search questions and answers',
        'label.time': 'Time',
        'label.allTime': 'All time',
        'label.7days': 'Last 7 days',
        'label.30days': 'Last 30 days',
        'label.defaultModel': 'Default model',
        'label.visionModel': 'Vision model',
        'label.hotkey': 'Hotkey',
        'label.retention': 'Retention (days)',
        'label.followDefault': 'Follow default model',
        'label.compressed': 'Compressed context (untrusted summary — review before confirming)',
        'label.workspaces': 'Target workspace',
        'label.status.active': 'Active',
        'label.status.archived': 'Archived',
        'label.images': 'images',
        'label.citations': 'Sources',
        'label.messages': 'messages',
        'empty.list': 'No conversations yet',
        'empty.detail': 'Select a conversation, or start a new one.',
        'empty.hint': 'Press the hotkey to open the quick dialog and ask your first question.',
        'quick.placeholder': 'Ask anything… Enter to send, Shift+Enter for a new line',
        'quick.attach': 'Attach image',
        'quick.hotkey': 'Hotkey',
        'quick.scopeNote': 'Hotkey works while this DSH window has focus.',
        'settings.scope': 'Configuration lives on this plugin page. It applies to the next conversation.',
        'settings.globalHotkey': 'System-wide global hotkeys and a standalone always-on-top window are not exposed to plugins; the hotkey is in-app only.',
        'settings.noVision': 'No image-capable model is registered; image input is disabled.',
        'settings.saved': 'Settings saved.',
        'promote.title': 'Promote to a formal task',
        'promote.note': 'Context is compressed automatically. Review it, then choose a workspace.',
        'promote.archived': 'The original Inbox conversation is archived and cannot be promoted twice.',
        'finder.title': 'Find conversation',
        'finder.placeholder': 'Search by keyword…',
        'finder.empty': 'No matching conversations',
        'finder.open': 'Open in Inbox',
        'finder.resume': 'Resume in quick dialog',
        'error.generic': 'Something went wrong',
        'error.alreadyPromoted': 'This conversation has already been promoted.',
        'status.generating': 'Generating…',
        'status.interrupted': 'Interrupted — content preserved',
        'status.error': 'Failed',
        'label.health': 'Runtime check',
        'action.health': 'Check runtime',
      },
      zh: {
        'inbox.title': 'Inbox',
        'inbox.subtitle': '轻量问答，不进入正式工作区',
        'action.new': '新建对话',
        'action.search': '对话查找',
        'action.settings': '设置',
        'action.cleanup': '清理过期',
        'action.refresh': '刷新',
        'action.ask': '在浮层中提问',
        'action.resume': '续问',
        'action.promote': '升级为正式任务',
        'action.delete': '删除',
        'action.copy': '复制',
        'action.regenerate': '重新生成',
        'action.stop': '停止生成',
        'action.close': '关闭',
        'action.save': '保存设置',
        'action.confirm': '确认升级',
        'action.newWorkspace': '新建工作区',
        'action.cancel': '取消',
        'action.clear': '清空 Inbox',
        'action.openQuick': '打开快捷对话框',
        'label.search': '检索问题与回答',
        'label.time': '时间',
        'label.allTime': '全部时间',
        'label.7days': '近 7 天',
        'label.30days': '近 30 天',
        'label.defaultModel': '默认模型',
        'label.visionModel': '视觉模型',
        'label.hotkey': '快捷键',
        'label.retention': '保留期（天）',
        'label.followDefault': '跟随默认模型',
        'label.compressed': '压缩后的上下文（不可信摘要，请先审阅再确认）',
        'label.workspaces': '目标工作区',
        'label.status.active': '活动',
        'label.status.archived': '已归档',
        'label.images': '张图片',
        'label.citations': '引用来源',
        'label.messages': '条消息',
        'empty.list': '还没有对话',
        'empty.detail': '选择一条会话，或新建一条对话。',
        'empty.hint': '按快捷键唤起浮层，问出第一个问题。',
        'quick.placeholder': '随便问点什么… Enter 发送，Shift+Enter 换行',
        'quick.attach': '添加图片',
        'quick.hotkey': '快捷键',
        'quick.scopeNote': '快捷键仅在 DSH 窗口获得焦点时生效。',
        'settings.scope': '配置在本插件管理页完成，下一次对话生效。',
        'settings.globalHotkey': '插件无法注册系统级全局快捷键与独立置顶窗口，当前为应用内快捷键。',
        'settings.noVision': '当前没有可用的视觉模型，图片输入已禁用。',
        'settings.saved': '设置已保存',
        'promote.title': '升级为正式任务',
        'promote.note': '系统会自动压缩上下文。请审阅后选择工作区。',
        'promote.archived': '原 Inbox 会话将转为归档态，且不可重复升级。',
        'finder.title': '对话查找窗口',
        'finder.placeholder': '输入关键词…',
        'finder.empty': '没有匹配的会话',
        'finder.open': '在 Inbox 中打开',
        'finder.resume': '在浮层中续问',
        'error.generic': '出了点问题',
        'error.alreadyPromoted': '该会话已升级，不能重复升级。',
        'status.generating': '正在生成…',
        'status.interrupted': '已中断，内容已保留',
        'status.error': '生成失败',
        'label.health': '运行自检',
        'action.health': '检查运行环境',
      },
    }

    let ctxRef = null
    let translate = null

    function t(key, vars) {
      let out = ''
      if (translate) { try { out = translate(key, vars) } catch { /* fall through */ } }
      if (typeof out !== 'string' || out === '' || out === key) {
        let lang = 'zh'
        try { lang = ctxRef?.locale?.getSnapshot?.()?.active || 'zh' } catch { /* ignore */ }
        const dict = DICT[lang] || DICT.en
        out = dict[key] || DICT.en[key] || key
      }
      if (vars) for (const [name, value] of Object.entries(vars)) out = out.split(`{${name}}`).join(String(value))
      return out
    }

    /* ---------------- Store ---------------- */

    const INITIAL = {
      ready: false,
      error: '',
      conversations: [],
      settings: { defaultModel: '', visionModel: '', hotkey: 'Alt+Space', retentionDays: 30 },
      capabilities: { globalHotkey: false, hotkeyScope: 'in-app', visionRoutes: 0, nativeSessionBackup: false },
      currentId: null,
      messages: [],
      generating: false,
      quickOpen: false,
      draft: '',
      images: [],
      finderOpen: false,
      settingsOpen: false,
      promoteId: null,
      selectedId: null,
      query: '',
      timeRange: 0,
    }
    let storeState = { ...INITIAL }
    const listeners = new Set()
    function setStore(patch) {
      storeState = { ...storeState, ...patch }
      for (const listener of listeners) listener()
    }
    function subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener) }
    function useStore() {
      return React.useSyncExternalStore(subscribe, () => storeState, () => storeState)
    }

    /* ---------------- API ---------------- */

    function routeUrl(path) {
      return new URL(String(path).replace(/^\/+/, ''), document.baseURI).href
    }
    function imageUrl(id) {
      return `${routeUrl(IMAGE_PATH)}?id=${encodeURIComponent(id)}`
    }
    async function api(action, payload) {
      const response = await fetch(routeUrl(API_PATH), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, payload: payload || {} }),
      })
      let json
      try { json = await response.json() } catch { throw new Error('响应不是合法 JSON') }
      if (!response.ok || !json.ok) throw new Error(json?.error || `HTTP ${response.status}`)
      return json.value
    }
    function showError(error) {
      setStore({ error: String(error?.message || error) })
    }

    let pollTimer = null
    let pollBusy = false
    function stopPolling() {
      if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
      pollBusy = false
    }
    async function pollOnce(id) {
      if (pollBusy) return
      pollBusy = true
      try {
        const value = await api('poll', { id })
        if (storeState.currentId === id || storeState.quickOpen) {
          setStore({ messages: value.messages, generating: value.generating })
        }
        if (!value.generating) stopPolling()
      } catch (error) {
        stopPolling()
        showError(error)
      } finally { pollBusy = false }
    }
    function startPolling(id) {
      stopPolling()
      void pollOnce(id)
      pollTimer = setInterval(() => void pollOnce(id), 150)
    }

    async function refreshState() {
      try {
        const value = await api('state')
        setStore({
          ready: true,
          conversations: value.conversations,
          settings: value.settings,
          capabilities: value.capabilities,
          error: '',
        })
        return value
      } catch (error) { showError(error); return null }
    }

    async function loadConversation(id) {
      if (!id) return
      try {
        const value = await api('poll', { id })
        setStore({ currentId: id, selectedId: id, messages: value.messages, generating: value.generating })
        if (value.generating) startPolling(id)
      } catch (error) { showError(error) }
    }

    async function openQuick(forceNew) {
      setStore({ quickOpen: true, error: '' })
      try {
        const created = await api('conversation.create', { forceNew: Boolean(forceNew) })
        await loadConversation(created.id)
      } catch (error) { showError(error) }
    }

    function closeQuick() { setStore({ quickOpen: false }) }

    async function sendMessage() {
      const text = storeState.draft.trim()
      if (!text || storeState.generating) return
      let id = storeState.currentId
      try {
        if (!id) {
          const created = await api('conversation.create', {})
          id = created.id
        }
        setStore({ draft: '', images: [], generating: true, currentId: id, error: '' })
        await api('ask', { id, text, images: storeState.images })
        startPolling(id)
        void refreshState()
      } catch (error) {
        setStore({ generating: false })
        showError(error)
      }
    }

    async function stopGenerating() {
      if (!storeState.currentId) return
      try { await api('stop', { id: storeState.currentId }); setStore({ generating: false }) }
      catch (error) { showError(error) }
    }

    async function regenerate() {
      if (!storeState.currentId) return
      try {
        setStore({ generating: true, error: '' })
        await api('regenerate', { id: storeState.currentId })
        startPolling(storeState.currentId)
      } catch (error) { setStore({ generating: false }); showError(error) }
    }

    /* ---------------- Hotkey ---------------- */

    function matchesHotkey(event, combo) {
      const parts = String(combo || 'Alt+Space').split('+').map(p => p.trim()).filter(Boolean)
      let alt = false, ctrl = false, meta = false, shift = false, key = ''
      for (const part of parts) {
        const lower = part.toLowerCase()
        if (lower === 'alt' || lower === 'option') alt = true
        else if (lower === 'ctrl' || lower === 'control') ctrl = true
        else if (lower === 'meta' || lower === 'cmd' || lower === 'mod') meta = true
        else if (lower === 'shift') shift = true
        else key = part
      }
      if (!key) return false
      if (event.altKey !== alt || event.ctrlKey !== ctrl || event.metaKey !== meta || event.shiftKey !== shift) return false
      const code = event.code || ''
      const pressed = event.key || ''
      const normalized = key.toLowerCase()
      // macOS Option+Space reports "\u00a0"; e.code stays "Space".
      if (normalized === 'space') return code === 'Space' || pressed === ' ' || pressed === '\u00a0' || pressed === 'Spacebar'
      if (normalized === 'enter') return code === 'Enter' || pressed === 'Enter'
      if (normalized === 'escape' || normalized === 'esc') return code === 'Escape' || pressed === 'Escape'
      return code === key || pressed.toLowerCase() === normalized || code.toLowerCase() === normalized
    }

    /* ---------------- Theme CSS ---------------- */

    const CSS = `
.df-root, .df-root * { box-sizing: border-box; }
.df-root { font-size: 13px; line-height: 20px; color: var(--dsw-alias-label-primary); font-family: inherit; }
.df-root button, .df-root input, .df-root textarea, .df-root select { font: inherit; color: inherit; }
.df-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; height:28px; padding:0 10px;
  border:1px solid var(--dsw-alias-border-l1); border-radius:6px; background:var(--dsw-alias-bg-layer-1);
  cursor:pointer; white-space:nowrap; font-size:12px; line-height:18px; }
.df-btn:hover:not(:disabled) { background:color-mix(in srgb, var(--dsw-alias-brand-primary) 6%, var(--dsw-alias-bg-layer-1)); }
.df-btn:focus-visible { outline:2px solid var(--dsw-alias-brand-primary); outline-offset:1px; }
.df-btn:disabled { opacity:.5; cursor:not-allowed; }
.df-btn-primary { background:var(--dsw-alias-brand-primary); border-color:var(--dsw-alias-brand-primary); color:var(--dsw-alias-bg-base); }
.df-btn-primary:hover:not(:disabled) { background:color-mix(in srgb, var(--dsw-alias-brand-primary) 88%, var(--dsw-alias-label-primary)); }
.df-btn-danger { color:var(--dsw-alias-state-error-primary); }
.df-btn-ghost { border-color:transparent; background:transparent; }
.df-input { height:32px; padding:0 10px; border:1px solid var(--dsw-alias-border-l1); border-radius:6px;
  background:var(--dsw-alias-bg-base); width:100%; }
.df-input:focus { outline:none; border-color:var(--dsw-alias-brand-primary); }
.df-select { height:32px; padding:0 8px; border:1px solid var(--dsw-alias-border-l1); border-radius:6px;
  background:var(--dsw-alias-bg-base); max-width:100%; }
.df-textarea { width:100%; min-height:64px; padding:8px 10px; border:1px solid var(--dsw-alias-border-l1);
  border-radius:6px; background:var(--dsw-alias-bg-base); resize:vertical; }
.df-muted { color:var(--dsw-alias-label-secondary); font-size:12px; line-height:18px; }
.df-badge { display:inline-flex; align-items:center; height:18px; padding:0 6px; border-radius:6px; font-size:11px;
  border:1px solid var(--dsw-alias-border-l1); color:var(--dsw-alias-label-secondary); }
.df-badge-archived { color:var(--dsw-alias-state-idle-primary); }
.df-badge-active { color:var(--dsw-alias-state-success-primary); border-color:color-mix(in srgb, var(--dsw-alias-state-success-primary) 30%, var(--dsw-alias-border-l1)); }
.df-error { color:var(--dsw-alias-state-error-primary); font-size:12px; }
.df-page { height:100%; display:flex; flex-direction:column; background:var(--dsw-alias-bg-base); }
.df-header { display:flex; align-items:center; gap:8px; padding:12px 16px; border-bottom:1px solid var(--dsw-alias-border-l1); flex:none; flex-wrap:wrap; row-gap:8px; }
.df-title { font-size:16px; font-weight:600; line-height:24px; }
.df-header-spacer { flex:1; min-width:0; }
.df-body { display:flex; flex:1; min-height:0; }
.df-list { width:300px; flex:none; border-right:1px solid var(--dsw-alias-border-l1); overflow:auto; }
.df-row { padding:10px 12px; border-bottom:1px solid var(--dsw-alias-border-l1); cursor:pointer; min-height:56px; }
.df-row:hover { background:color-mix(in srgb, var(--dsw-alias-brand-primary) 5%, var(--dsw-alias-bg-layer-1)); }
.df-row[data-selected="true"] { background:color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, var(--dsw-alias-bg-layer-1)); }
.df-row-title { font-size:13px; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.df-row-summary { color:var(--dsw-alias-label-secondary); font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:2px; }
.df-row-meta { display:flex; gap:8px; align-items:center; margin-top:4px; color:var(--dsw-alias-label-secondary); font-size:11px; }
.df-detail { flex:1; min-width:0; display:flex; flex-direction:column; }
.df-detail-head { display:flex; align-items:center; gap:8px; padding:10px 16px; border-bottom:1px solid var(--dsw-alias-border-l1); flex:none; }
.df-detail-body { flex:1; min-height:0; overflow:auto; padding:16px 20px; }
.df-empty { height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; color:var(--dsw-alias-label-secondary); text-align:center; padding:24px; }
.df-empty-glyph { width:32px; height:32px; opacity:.6; }
.df-msg { margin-bottom:20px; }
.df-msg-role { font-size:11px; color:var(--dsw-alias-label-secondary); margin-bottom:4px; letter-spacing:.04em; }
.df-msg-user { padding:8px 12px; border-radius:8px; background:var(--dsw-alias-bg-layer-1); border:1px solid var(--dsw-alias-border-l1); }
.df-msg-assistant { padding:0 2px; }
.df-md { word-break:break-word; }
.df-md h1,.df-md h2,.df-md h3,.df-md h4 { font-size:14px; font-weight:600; margin:12px 0 6px; }
.df-md p { margin:6px 0; }
.df-md ul,.df-md ol { margin:6px 0; padding-left:20px; }
.df-md li { margin:2px 0; }
.df-md pre { margin:8px 0; padding:10px 12px; border-radius:6px; overflow:auto;
  background:var(--dsw-alias-bg-layer-2); border:1px solid var(--dsw-alias-border-l1); }
.df-md code { font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:12px; }
.df-md :not(pre) > code { padding:1px 4px; border-radius:4px; background:var(--dsw-alias-bg-layer-2); }
.df-md table { border-collapse:collapse; margin:8px 0; font-size:12px; max-width:100%; display:block; overflow:auto; }
.df-md th,.df-md td { border:1px solid var(--dsw-alias-border-l1); padding:4px 8px; text-align:left; }
.df-md th { background:var(--dsw-alias-bg-layer-1); font-weight:600; }
.df-md blockquote { margin:8px 0; padding:2px 10px; border-left:2px solid var(--dsw-alias-border-l2); color:var(--dsw-alias-label-secondary); }
.df-md a { color:var(--dsw-alias-brand-primary); }
.df-citations { margin-top:10px; padding-top:8px; border-top:1px solid var(--dsw-alias-border-l1); display:flex; flex-direction:column; gap:4px; }
.df-citation { font-size:12px; color:var(--dsw-alias-label-secondary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.df-citation a { color:var(--dsw-alias-brand-primary); }
.df-images { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
.df-image { width:64px; height:64px; object-fit:cover; border-radius:6px; border:1px solid var(--dsw-alias-border-l1); }
.df-chip { display:inline-flex; align-items:center; gap:4px; height:22px; padding:0 6px; border-radius:6px;
  border:1px solid var(--dsw-alias-border-l1); background:var(--dsw-alias-bg-layer-1); font-size:11px; }
.df-modal-backdrop { position:fixed; inset:0; z-index:60; display:flex; align-items:center; justify-content:center;
  background:color-mix(in srgb, var(--dsw-alias-bg-base) 55%, transparent); }
.df-modal { width:min(620px, calc(100vw - 32px)); max-height:80vh; display:flex; flex-direction:column;
  background:var(--dsw-alias-bg-overlay); border:1px solid var(--dsw-alias-border-l2); border-radius:12px;
  box-shadow:0 8px 32px color-mix(in srgb, var(--dsw-alias-label-primary) 14%, transparent); }
.df-modal-head { display:flex; align-items:center; padding:12px 16px; border-bottom:1px solid var(--dsw-alias-border-l1); }
.df-modal-body { padding:16px; overflow:auto; min-height:0; }
.df-modal-foot { display:flex; gap:8px; justify-content:flex-end; padding:12px 16px; border-top:1px solid var(--dsw-alias-border-l1); }
.df-field { display:flex; flex-direction:column; gap:4px; margin-bottom:12px; }
.df-field-label { font-size:12px; color:var(--dsw-alias-label-secondary); }
.df-wslist { max-height:180px; overflow:auto; border:1px solid var(--dsw-alias-border-l1); border-radius:6px; }
.df-wsrow { padding:6px 10px; cursor:pointer; border-bottom:1px solid var(--dsw-alias-border-l1); font-size:12px; }
.df-wsrow:last-child { border-bottom:none; }
.df-wsrow[data-selected="true"] { background:color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, var(--dsw-alias-bg-layer-1)); }
.df-pre { white-space:pre-wrap; word-break:break-word; font-size:12px; line-height:18px; max-height:220px; overflow:auto;
  padding:10px 12px; border-radius:6px; background:var(--dsw-alias-bg-layer-1); border:1px solid var(--dsw-alias-border-l1); }
.df-overlay { position:fixed; inset:0; z-index:50; pointer-events:none; display:flex; align-items:flex-end; justify-content:flex-end; padding:24px; }
.df-quick { pointer-events:auto; width:560px; max-width:calc(100vw - 48px); max-height:70vh; display:flex; flex-direction:column;
  background:var(--dsw-alias-bg-overlay); border:1px solid var(--dsw-alias-border-l2); border-radius:12px;
  box-shadow:0 8px 32px color-mix(in srgb, var(--dsw-alias-label-primary) 16%, transparent);
  animation:df-in 200ms ease-out; }
@keyframes df-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
.df-quick-head { display:flex; align-items:center; gap:8px; padding:8px 12px; border-bottom:1px solid var(--dsw-alias-border-l1); flex:none; }
.df-quick-body { flex:1; min-height:0; overflow:auto; padding:12px; }
.df-quick-foot { flex:none; border-top:1px solid var(--dsw-alias-border-l1); padding:8px 12px; }
.df-quick-input { width:100%; min-height:44px; max-height:140px; padding:8px 10px; border:1px solid var(--dsw-alias-border-l1);
  border-radius:8px; background:var(--dsw-alias-bg-base); resize:vertical; }
.df-quick-tools { display:flex; align-items:center; gap:6px; margin-top:8px; flex-wrap:wrap; }
.df-glyph { display:block; }
.df-crash { padding:12px; color:var(--dsw-alias-state-error-primary); font-size:12px; }
.df-section { padding:4px 0; }
.df-note { padding:8px 10px; border-radius:6px; background:var(--dsw-alias-bg-layer-1);
  border:1px solid var(--dsw-alias-border-l1); font-size:12px; color:var(--dsw-alias-label-secondary); }
.df-settings-grid { display:grid; grid-template-columns:160px minmax(0,1fr); gap:12px 16px; align-items:center; }
`

    function Style() { return h('style', null, CSS) }

    class Boundary extends React.Component {
      constructor(props) { super(props); this.state = { error: null } }
      static getDerivedStateFromError(error) { return { error } }
      componentDidCatch(error) { console.error('[dsh-friday-hy4] slot entry crashed', error) }
      render() {
        if (this.state.error) {
          return h('div', { className: 'df-root df-crash' }, `Inbox 组件出错：${String(this.state.error?.message || this.state.error)}`)
        }
        return this.props.children
      }
    }

    function Root(props) { return h('div', { className: 'df-root' }, h(Style), props.children) }

    /* ---------------- Markdown ---------------- */

    function inlineNodes(text) {
      const nodes = []
      const push = value => nodes.push(h(React.Fragment, { key: nodes.length }, value))
      const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*|\[[^\]]+\]\([^)]+\))/g
      let last = 0
      let match
      while ((match = pattern.exec(text)) !== null) {
        if (match.index > last) push(text.slice(last, match.index))
        const token = match[0]
        if (token.startsWith('**')) push(h('strong', null, token.slice(2, -2)))
        else if (token.startsWith('`')) push(h('code', null, token.slice(1, -1)))
        else if (token.startsWith('[')) {
          const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token)
          push(h('a', { href: link[2], target: '_blank', rel: 'noreferrer' }, link[1]))
        } else push(h('em', null, token.slice(1, -1)))
        last = match.index + token.length
      }
      if (last < text.length) push(text.slice(last))
      return nodes
    }

    function Markdown(props) {
      const lines = String(props.text || '').split('\n')
      const blocks = []
      let i = 0
      const add = node => blocks.push(h(React.Fragment, { key: blocks.length }, node))
      const isSpecial = line => /^```/.test(line) || /^#{1,6}\s/.test(line) || /^\s*>/.test(line)
        || /^\s*([-*+]|\d+\.)\s+/.test(line) || /^\|.*\|/.test(line) || line.trim() === ''
      while (i < lines.length) {
        const line = lines[i]
        if (/^```/.test(line)) {
          const language = line.slice(3).trim()
          const code = []
          i += 1
          while (i < lines.length && !/^```/.test(lines[i])) { code.push(lines[i]); i += 1 }
          i += 1
          add(h('pre', null, h('code', language ? { 'data-lang': language } : null, code.join('\n'))))
          continue
        }
        if (/^\|.*\|/.test(line) && /^\|[\s:|-]+\|$/.test(lines[i + 1] || '')) {
          const cells = row => row.slice(1, -1).split('|').map(c => c.trim())
          const header = cells(line)
          i += 2
          const rows = []
          while (i < lines.length && /^\|.*\|/.test(lines[i])) { rows.push(cells(lines[i])); i += 1 }
          add(h('table', null,
            h('thead', null, h('tr', null, header.map((c, n) => h('th', { key: n }, inlineNodes(c))))),
            h('tbody', null, rows.map((row, n) => h('tr', { key: n }, row.map((c, k) => h('td', { key: k }, inlineNodes(c))))))))
          continue
        }
        const heading = /^(#{1,6})\s+(.*)$/.exec(line)
        if (heading) {
          const Tag = `h${Math.min(heading[1].length, 4)}`
          add(h(Tag, null, inlineNodes(heading[2])))
          i += 1
          continue
        }
        if (/^\s*>\s?/.test(line)) {
          const quoted = []
          while (i < lines.length && /^\s*>\s?/.test(lines[i])) { quoted.push(lines[i].replace(/^\s*>\s?/, '')); i += 1 }
          add(h('blockquote', null, inlineNodes(quoted.join(' '))))
          continue
        }
        const listMatch = /^(\s*)([-*+]|\d+\.)\s+(.*)$/.exec(line)
        if (listMatch) {
          const ordered = /\d/.test(listMatch[2])
          const items = []
          while (i < lines.length) {
            const m = /^(\s*)([-*+]|\d+\.)\s+(.*)$/.exec(lines[i])
            if (!m) break
            items.push(m[3]); i += 1
          }
          add(h(ordered ? 'ol' : 'ul', null, items.map((item, n) => h('li', { key: n }, inlineNodes(item)))))
          continue
        }
        if (line.trim() === '') { i += 1; continue }
        const paragraph = [line]
        i += 1
        while (i < lines.length && !isSpecial(lines[i])) { paragraph.push(lines[i]); i += 1 }
        add(h('p', null, inlineNodes(paragraph.join(' '))))
      }
      return h('div', { className: 'df-md' }, blocks)
    }

    function Citations(props) {
      const list = props.citations || []
      if (!list.length) return null
      return h('div', { className: 'df-citations' },
        h('div', { className: 'df-muted' }, t('label.citations')),
        ...list.map((c, n) => h('div', { className: 'df-citation', key: n },
          h('a', { href: c.url, target: '_blank', rel: 'noreferrer' }, `[${n + 1}] ${c.title || c.url}`))))
    }

    function MessageImages(props) {
      const list = props.images || []
      if (!list.length) return null
      return h('div', { className: 'df-images' }, ...list.map((image, n) =>
        h('img', { className: 'df-image', key: image.id || n, src: imageUrl(image.id), alt: image.name || 'image', title: image.name || '' })))
    }

    function MessageView(props) {
      const m = props.message
      const isUser = m.role === 'user'
      return h('div', { className: 'df-msg' },
        h('div', { className: 'df-msg-role' }, isUser ? 'You' : 'Inbox'),
        h('div', { className: isUser ? 'df-msg-user' : 'df-msg-assistant' },
          isUser ? h('div', { className: 'df-md' }, h('p', null, m.text)) : h(Markdown, { text: m.text }),
          h(MessageImages, { images: m.images }),
          h(Citations, { citations: m.citations }),
          m.status === 'error' && m.error ? h('div', { className: 'df-error' }, m.error) : null,
          m.status === 'interrupted' ? h('div', { className: 'df-muted' }, t('status.interrupted')) : null))
    }

    /* ---------------- Shared widgets ---------------- */

    function Modal(props) {
      React.useEffect(() => {
        const onEscape = event => { if (event.key === 'Escape') { event.stopPropagation(); props.onClose() } }
        window.addEventListener('keydown', onEscape, true)
        return () => window.removeEventListener('keydown', onEscape, true)
      }, [props.onClose])
      return h('div', { className: 'df-modal-backdrop', onMouseDown: event => { if (event.target === event.currentTarget) props.onClose() } },
        h('div', { className: 'df-modal', role: 'dialog', 'aria-modal': 'true' },
          h('div', { className: 'df-modal-head' },
            h('strong', null, props.title),
            h('div', { className: 'df-header-spacer' }),
            h('button', { className: 'df-btn df-btn-ghost', type: 'button', onClick: props.onClose, 'aria-label': t('action.close') }, '✕')),
          h('div', { className: 'df-modal-body' }, props.children),
          props.footer ? h('div', { className: 'df-modal-foot' }, props.footer) : null))
    }

    function IconInbox(props) {
      const size = props.size || 18
      return h('svg', {
        className: 'df-glyph', viewBox: '0 0 24 24', width: size, height: size,
        fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
        h('rect', { x: 2.5, y: 4, width: 19, height: 16, rx: 3 }),
        h('path', { d: 'M2.5 13h5l1.5 3h6l1.5-3h5' }),
        h('path', { d: 'M12 6.5v4.5m0 0-2-2m2 2 2-2' }))
    }

    function InboxGlyph(props) {
      const active = Boolean(props.active)
      return h('span', {
        style: {
          color: active ? 'var(--dsw-alias-brand-primary)' : 'currentColor',
          background: active ? 'color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent)' : 'transparent',
          borderRadius: '6px', display: 'inline-flex', padding: '2px',
        },
        title: 'Inbox',
      }, h(IconInbox, { size: props.size || 18 }))
    }

    /* ---------------- Image intake ---------------- */

    function addFiles(fileList) {
      const files = Array.from(fileList || []).filter(f => ALLOWED_IMAGE_TYPES.includes(f.type))
      const room = MAX_IMAGES - storeState.images.length
      if (files.length > room) showError(new Error(`最多 ${MAX_IMAGES} 张图片`))
      for (const file of files.slice(0, Math.max(0, room))) {
        if (file.size > MAX_IMAGE_BYTES) { showError(new Error('单张图片不能超过 5 MiB')); continue }
        const reader = new FileReader()
        reader.onload = () => {
          const next = storeState.images.concat([{ name: file.name, dataUrl: String(reader.result) }]).slice(0, MAX_IMAGES)
          setStore({ images: next })
        }
        reader.onerror = () => showError(new Error('图片读取失败'))
        reader.readAsDataURL(file)
      }
    }

    function ImageChips(props) {
      if (!props.images.length) return null
      return h('div', { className: 'df-quick-tools' }, ...props.images.map((image, n) =>
        h('span', { className: 'df-chip', key: n },
          h('img', { src: image.dataUrl, alt: '', style: { width: 14, height: 14, objectFit: 'cover', borderRadius: 3 } }),
          image.name || `image ${n + 1}`,
          h('button', {
            type: 'button', className: 'df-btn df-btn-ghost', style: { height: 18, padding: '0 2px', border: 'none' },
            onClick: () => setStore({ images: storeState.images.filter((_, k) => k !== n) }),
            'aria-label': 'remove',
          }, '✕'))))
    }

    /* ---------------- Quick dialog ---------------- */

    function QuickDialogBody(props) {
      const s = useStore()
      const inputRef = React.useRef(null)
      const fileRef = React.useRef(null)
      React.useEffect(() => { if (s.quickOpen) inputRef.current?.focus() }, [s.quickOpen])
      React.useEffect(() => {
        const onEscape = event => {
          if (event.key === 'Escape' && storeState.quickOpen) { event.stopPropagation(); closeQuick() }
        }
        window.addEventListener('keydown', onEscape, true)
        return () => window.removeEventListener('keydown', onEscape, true)
      }, [])
      if (!s.quickOpen) return h(Root, null, null)

      const onKeyDown = event => {
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent?.isComposing) {
          event.preventDefault()
          void sendMessage()
        }
      }
      return h(Root, null,
        h('div', { className: 'df-overlay' },
          h('div', { className: 'df-quick', role: 'dialog', 'aria-label': t('inbox.title'),
            onPaste: event => {
              const files = Array.from(event.clipboardData?.files || []).filter(f => f.type.startsWith('image/'))
              if (files.length) { event.preventDefault(); addFiles(files) }
            },
            onDragOver: event => event.preventDefault(),
            onDrop: event => { event.preventDefault(); addFiles(event.dataTransfer?.files) } },
            h('div', { className: 'df-quick-head' },
              h(IconInbox, { size: 16 }),
              h('strong', null, t('inbox.title')),
              h('div', { className: 'df-header-spacer' }),
              h('span', { className: 'df-muted' }, `${t('quick.hotkey')}: ${s.settings.hotkey}`),
              h('button', { className: 'df-btn df-btn-ghost', type: 'button', onClick: () => { void openQuick(true) }, title: t('action.new') }, '＋'),
              h('button', { className: 'df-btn df-btn-ghost', type: 'button', onClick: closeQuick, 'aria-label': t('action.close') }, '✕')),
            s.messages.length ? h('div', { className: 'df-quick-body' },
              ...s.messages.map((m, n) => h(MessageView, { key: m.id || n, message: m }))) : null,
            h('div', { className: 'df-quick-foot' },
              h(ImageChips, { images: s.images }),
              h('textarea', {
                ref: inputRef, className: 'df-quick-input', value: s.draft,
                placeholder: t('quick.placeholder'), rows: 2,
                onChange: event => setStore({ draft: event.target.value }), onKeyDown,
              }),
              h('input', { ref: fileRef, type: 'file', accept: ALLOWED_IMAGE_TYPES.join(','), multiple: true,
                style: { display: 'none' }, onChange: event => { addFiles(event.target.files); event.target.value = '' } }),
              h('div', { className: 'df-quick-tools' },
                h('button', { className: 'df-btn', type: 'button', onClick: () => fileRef.current?.click(),
                  disabled: s.capabilities.visionRoutes === 0 || s.images.length >= MAX_IMAGES }, t('quick.attach')),
                h('div', { className: 'df-header-spacer' }),
                s.generating
                  ? h('button', { className: 'df-btn', type: 'button', onClick: () => void stopGenerating() }, t('action.stop'))
                  : null,
                h('button', { className: 'df-btn', type: 'button', onClick: () => void regenerate(),
                  disabled: s.generating || !s.currentId }, t('action.regenerate')),
                h('button', { className: 'df-btn df-btn-primary', type: 'button', onClick: () => void sendMessage(),
                  disabled: s.generating || !s.draft.trim() }, '↑'),
                h('button', { className: 'df-btn', type: 'button',
                  onClick: () => setStore({ promoteId: s.currentId }),
                  disabled: !s.currentId || s.generating }, t('action.promote'))),
              s.error ? h('div', { className: 'df-error' }, s.error) : null,
              h('div', { className: 'df-muted' }, t('quick.scopeNote'))))))
    }

    /* ---------------- Settings form ---------------- */

    function SettingsForm(props) {
      const s = useStore()
      const [routes, setRoutes] = React.useState([])
      const [form, setForm] = React.useState({ ...s.settings })
      const [message, setMessage] = React.useState('')
      const [health, setHealth] = React.useState('')
      React.useEffect(() => { setForm({ ...s.settings }) }, [s.settings])
      React.useEffect(() => {
        let alive = true
        api('models.list').then(value => { if (alive) setRoutes(value.routes || []) }).catch(error => { if (alive) setMessage(String(error.message || error)) })
        return () => { alive = false }
      }, [])
      const options = [h('option', { key: '', value: '' }, t('label.followDefault')),
        ...routes.map(r => h('option', { key: `${r.provider}/${r.model}`, value: `${r.provider}/${r.model}` },
          `${r.provider}/${r.model}${r.vision ? ' · vision' : ''}`))]
      const save = async () => {
        try {
          const value = await api('settings.update', { settings: form })
          setStore({ settings: value.settings })
          setMessage(t('settings.saved'))
        } catch (error) { setMessage(String(error.message || error)) }
      }
      const check = async () => {
        try {
          const value = await api('health')
          setHealth(`${t('label.health')}: llm=${value.llm ? 'ok' : 'missing'}, web=${value.web ? 'ok' : 'missing'}, route=${value.defaultRoute ? `${value.defaultRoute.provider}/${value.defaultRoute.model}` : 'none'}`)
        } catch (error) { setHealth(String(error.message || error)) }
      }
      return h('div', { className: 'df-section' },
        h('div', { className: 'df-note' }, t('settings.scope')),
        h('div', { style: { height: 12 } }),
        h('div', { className: 'df-settings-grid' },
          h('label', { className: 'df-field-label', htmlFor: 'df-default-model' }, t('label.defaultModel')),
          h('select', { id: 'df-default-model', className: 'df-select', value: form.defaultModel,
            onChange: event => setForm({ ...form, defaultModel: event.target.value }) }, ...options),
          h('label', { className: 'df-field-label', htmlFor: 'df-vision-model' }, t('label.visionModel')),
          h('select', { id: 'df-vision-model', className: 'df-select', value: form.visionModel,
            onChange: event => setForm({ ...form, visionModel: event.target.value }) }, ...options),
          h('label', { className: 'df-field-label', htmlFor: 'df-hotkey' }, t('label.hotkey')),
          h('input', { id: 'df-hotkey', className: 'df-input', value: form.hotkey,
            onChange: event => setForm({ ...form, hotkey: event.target.value }) }),
          h('label', { className: 'df-field-label', htmlFor: 'df-retention' }, t('label.retention')),
          h('input', { id: 'df-retention', className: 'df-input', type: 'number', min: 1, max: 365, value: form.retentionDays,
            onChange: event => setForm({ ...form, retentionDays: Number(event.target.value) }) })),
        h('div', { className: 'df-muted' }, t('settings.globalHotkey')),
        s.capabilities.visionRoutes === 0 ? h('div', { className: 'df-error' }, t('settings.noVision')) : null,
        h('div', { style: { display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' } },
          h('button', { className: 'df-btn df-btn-primary', type: 'button', onClick: () => void save() }, t('action.save')),
          h('button', { className: 'df-btn', type: 'button', onClick: () => void check() }, t('action.health')),
          h('button', { className: 'df-btn', type: 'button', onClick: async () => {
            try { const value = await api('cleanup'); setMessage(`removed ${value.removed}`); void refreshState() }
            catch (error) { setMessage(String(error.message || error)) }
          } }, t('action.cleanup'))),
        message ? h('div', { className: 'df-muted', style: { marginTop: 8 } }, message) : null,
        health ? h('div', { className: 'df-muted', style: { marginTop: 4 } }, health) : null)
    }

    function SettingsSection() {
      return h(Boundary, null, h(Root, null, h(SettingsForm)))
    }

    /* ---------------- Finder / Promote / Settings dialogs ---------------- */

    function FinderDialog() {
      const s = useStore()
      const [query, setQuery] = React.useState('')
      const [items, setItems] = React.useState([])
      const run = async value => {
        try { setItems((await api('search', { query: value })).items || []) }
        catch (error) { showError(error) }
      }
      React.useEffect(() => { void run('') }, [])
      return h(Modal, {
        title: t('finder.title'), onClose: () => setStore({ finderOpen: false }),
        footer: h('button', { className: 'df-btn', type: 'button', onClick: () => setStore({ finderOpen: false }) }, t('action.close')),
      },
        h('input', { className: 'df-input', autoFocus: true, placeholder: t('finder.placeholder'), value: query,
          onChange: event => { setQuery(event.target.value); void run(event.target.value) } }),
        h('div', { style: { marginTop: 12 } }, items.length ? items.map(item =>
          h('div', { className: 'df-row', key: item.id, style: { borderRadius: 6, border: '1px solid var(--dsw-alias-border-l1)', marginBottom: 6 } },
            h('div', { className: 'df-row-title' }, item.title),
            h('div', { className: 'df-row-summary' }, item.firstQuestion),
            h('div', { style: { display: 'flex', gap: 6, marginTop: 6 } },
              h('button', { className: 'df-btn', type: 'button', onClick: () => {
                void loadConversation(item.id); setStore({ finderOpen: false })
              } }, t('finder.open')),
              h('button', { className: 'df-btn', type: 'button', onClick: () => {
                void loadConversation(item.id)
                setStore({ finderOpen: false, quickOpen: true })
              } }, t('finder.resume'))))) : h('div', { className: 'df-empty' }, t('finder.empty'))))
    }

    function PromoteDialog(props) {
      const s = useStore()
      const [data, setData] = React.useState(null)
      const [selected, setSelected] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const [message, setMessage] = React.useState('')
      const requestIdRef = React.useRef(null)
      if (!requestIdRef.current) requestIdRef.current = (globalThis.crypto?.randomUUID?.() || `df-${Date.now()}`)
      React.useEffect(() => {
        let alive = true
        api('promote.prepare', { id: props.id }).then(value => {
          if (!alive) return
          setData(value)
          if (value.workspaces?.length) setSelected(value.workspaces[0].id)
        }).catch(error => { if (alive) setMessage(String(error.message || error)) })
        return () => { alive = false }
      }, [props.id])

      const newWorkspace = async () => {
        try {
          const uiWorkspace = ctxRef?.uiWorkspace || ctxRef?.get?.('uiWorkspace')
          const workspaces = ctxRef?.workspaces || ctxRef?.get?.('workspaces')
          if (!uiWorkspace?.pickDirectory || !workspaces?.create) throw new Error('工作区创建能力不可用')
          const path = await uiWorkspace.pickDirectory()
          if (!path) return
          const created = await workspaces.create({ path })
          const value = await api('promote.prepare', { id: props.id })
          setData(value)
          setSelected(String(created?.id || created?.workspaceId || value.workspaces?.[0]?.id || ''))
        } catch (error) { setMessage(String(error.message || error)) }
      }

      const confirm = async () => {
        if (!selected || !data || busy) return
        setBusy(true)
        setMessage('')
        try {
          await api('promote.begin', { id: props.id })
          const remote = ctxRef?.remote || ctxRef?.get?.('remote')
          const uiWorkspace = ctxRef?.uiWorkspace || ctxRef?.get?.('uiWorkspace')
          let sessionId = ''
          if (remote?.session?.create && remote?.session?.prompt) {
            const created = await remote.session.create({ workspaceId: selected })
            sessionId = String(created?.sessionId || '')
            if (!sessionId) throw new Error('创建任务失败：未返回 sessionId')
            await remote.session.prompt({
              requestId: requestIdRef.current,
              sessionId,
              mode: 'queue',
              content: [{ type: 'text', text: data.compressed }],
              clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
            uiWorkspace?.openSession?.(sessionId)
          } else if (uiWorkspace?.startSession) {
            uiWorkspace.startSession(selected, { prompt: data.compressed, whenDraftExists: 'append', clearPreviousDraft: false })
          } else {
            throw new Error('无法创建正式任务：session 与 uiWorkspace 均不可用')
          }
          await api('promote.commit', { id: props.id, sessionId, workspaceId: selected })
          await refreshState()
          setStore({ promoteId: null, quickOpen: false })
        } catch (error) {
          setMessage(String(error.message || error))
        } finally { setBusy(false) }
      }

      return h(Modal, {
        title: t('promote.title'), onClose: () => setStore({ promoteId: null }),
        footer: [
          h('button', { className: 'df-btn', key: 'cancel', type: 'button', onClick: () => setStore({ promoteId: null }) }, t('action.cancel')),
          h('button', { className: 'df-btn df-btn-primary', key: 'confirm', type: 'button', disabled: busy || !selected || !data,
            onClick: () => void confirm() }, t('action.confirm')),
        ],
      },
        h('div', { className: 'df-note' }, `${t('promote.note')} ${t('promote.archived')}`),
        h('div', { style: { height: 12 } }),
        h('div', { className: 'df-field' },
          h('span', { className: 'df-field-label' }, t('label.compressed')),
          h('pre', { className: 'df-pre' }, data ? data.compressed : '…')),
        h('div', { className: 'df-field' },
          h('span', { className: 'df-field-label' }, t('label.workspaces')),
          h('div', { className: 'df-wslist' }, data?.workspaces?.length
            ? data.workspaces.map(w => h('div', { className: 'df-wsrow', key: w.id,
              'data-selected': selected === w.id ? 'true' : 'false', onClick: () => setSelected(w.id) },
              w.title, h('span', { className: 'df-muted' }, ` · ${w.path}`)))
            : h('div', { className: 'df-wsrow' }, '—')),
          h('button', { className: 'df-btn', type: 'button', style: { marginTop: 8 }, onClick: () => void newWorkspace() }, t('action.newWorkspace'))),
        message ? h('div', { className: 'df-error', style: { marginTop: 8 } }, message) : null)
    }

    function SettingsDialog() {
      return h(Modal, {
        title: t('action.settings'), onClose: () => setStore({ settingsOpen: false }),
        footer: h('button', { className: 'df-btn', type: 'button', onClick: () => setStore({ settingsOpen: false }) }, t('action.close')),
      }, h(SettingsForm))
    }

    /* ---------------- Inbox main panel ---------------- */

    function InboxPage() {
      const s = useStore()
      React.useEffect(() => { void refreshState() }, [])
      const [searchText, setSearchText] = React.useState('')
      const doSearch = async value => {
        setSearchText(value)
        if (!value.trim()) { void refreshState(); return }
        try {
          const from = s.timeRange ? Date.now() - s.timeRange * 24 * 60 * 60 * 1000 : 0
          setStore({ conversations: (await api('search', { query: value, from })).items || [] })
        } catch (error) { showError(error) }
      }
      const selected = s.conversations.find(c => c.id === s.selectedId) || null
      const canPromote = selected && selected.status !== 'archived' && !selected.promotedTo

      return h(Root, null,
        h('div', { className: 'df-page' },
          h('div', { className: 'df-header' },
            h(IconInbox, { size: 18 }),
            h('div', null,
              h('div', { className: 'df-title' }, t('inbox.title')),
              h('div', { className: 'df-muted' }, t('inbox.subtitle'))),
            h('div', { className: 'df-header-spacer' }),
            h('input', { className: 'df-input', style: { width: 220 }, placeholder: t('label.search'), value: searchText,
              onChange: event => void doSearch(event.target.value) }),
            h('select', { className: 'df-select', value: s.timeRange,
              onChange: event => { const v = Number(event.target.value); setStore({ timeRange: v }); void doSearch(searchText) } },
              h('option', { value: 0 }, t('label.allTime')),
              h('option', { value: 7 }, t('label.7days')),
              h('option', { value: 30 }, t('label.30days'))),
            h('button', { className: 'df-btn', type: 'button', onClick: () => setStore({ finderOpen: true }) }, t('action.search')),
            h('button', { className: 'df-btn', type: 'button', onClick: () => void openQuick(false) }, t('action.openQuick')),
            h('button', { className: 'df-btn', type: 'button', onClick: () => setStore({ settingsOpen: true }) }, t('action.settings')),
            h('button', { className: 'df-btn', type: 'button', onClick: () => void refreshState() }, t('action.refresh')),
            h('button', { className: 'df-btn df-btn-danger', type: 'button', onClick: async () => {
              try { await api('conversation.clear'); await refreshState(); setStore({ currentId: null, messages: [] }) }
              catch (error) { showError(error) }
            } }, t('action.clear'))),
          s.error ? h('div', { className: 'df-error', style: { padding: '4px 16px' } }, s.error) : null,
          h('div', { className: 'df-body' },
            h('div', { className: 'df-list' }, s.conversations.length
              ? s.conversations.map(c => h('div', { className: 'df-row', key: c.id,
                'data-selected': s.selectedId === c.id ? 'true' : 'false',
                onClick: () => void loadConversation(c.id) },
                h('div', { className: 'df-row-title' }, c.title),
                h('div', { className: 'df-row-summary' }, c.firstQuestion || '—'),
                h('div', { className: 'df-row-meta' },
                  h('span', null, new Date(c.updatedAt).toLocaleString()),
                  h('span', { className: `df-badge ${c.status === 'archived' ? 'df-badge-archived' : 'df-badge-active'}` },
                    c.status === 'archived' ? t('label.status.archived') : t('label.status.active')),
                  c.hasImages ? h('span', null, `▣ ${t('label.images')}`) : null,
                  h('span', null, `${c.messageCount} ${t('label.messages')}`))))
              : h('div', { className: 'df-empty' },
                h(IconInbox, { size: 32 }),
                h('div', null, t('empty.list')),
                h('div', { className: 'df-muted' }, t('empty.hint')))),
            h('div', { className: 'df-detail' },
              selected
                ? h(React.Fragment, null,
                  h('div', { className: 'df-detail-head' },
                    h('strong', null, selected.title),
                    h('span', { className: 'df-badge' }, selected.model || '—'),
                    h('div', { className: 'df-header-spacer' }),
                    h('button', { className: 'df-btn', type: 'button', onClick: () => { void loadConversation(selected.id); setStore({ quickOpen: true }) } }, t('action.resume')),
                    h('button', { className: 'df-btn', type: 'button', disabled: !canPromote,
                      onClick: () => setStore({ promoteId: selected.id }) }, t('action.promote')),
                    h('button', { className: 'df-btn df-btn-danger', type: 'button', onClick: async () => {
                      try { await api('conversation.delete', { id: selected.id }); setStore({ currentId: null, selectedId: null, messages: [] }); await refreshState() }
                      catch (error) { showError(error) }
                    } }, t('action.delete'))),
                  h('div', { className: 'df-detail-body' }, s.currentId === selected.id && s.messages.length
                    ? s.messages.map((m, n) => h(MessageView, { key: m.id || n, message: m }))
                    : h('div', { className: 'df-empty' }, t('empty.detail'))))
                : h('div', { className: 'df-empty' },
                  h(IconInbox, { size: 32 }), h('div', null, t('empty.detail'))))),
        s.finderOpen ? h(FinderDialog) : null,
        s.settingsOpen ? h(SettingsDialog) : null,
        s.promoteId ? h(PromoteDialog, { id: s.promoteId }) : null))
    }

    /* ---------------- Registration ---------------- */

    function safe(component) {
      return function SafeSlotEntry(props) {
        return h(Boundary, null, h(Root, null, h(component, props || {})))
      }
    }

    // Keep the panel id identical in both registrations (review P0 finding).
    const SafeInboxPage = safe(InboxPage)
    const SafeQuickDialog = safe(QuickDialogBody)
    const SafeGlyph = safe(InboxGlyph)
    const SafeSettings = safe(SettingsSection)

    return {
      inject: ['slots', 'layout', 'locale'],
      apply(ctx) {
        ctxRef = ctx
        try { translate = ctx.locale.bind(NS) } catch { translate = null }
        ctx.effect(() => {
          const disposers = []
          const grab = fn => { try { const d = fn(); if (typeof d === 'function') disposers.push(d) } catch (error) { console.error('[dsh-friday-hy4] locale register failed', error) } }
          grab(() => ctx.locale.register(NS, 'en', DICT.en))
          grab(() => ctx.locale.register(NS, 'zh', DICT.zh))
          return () => { for (const d of disposers) { try { d() } catch { /* ignore */ } } }
        }, 'dsh-friday-hy4: locale')

        ctx.effect(() => {
          const onKey = event => {
            if (event.key === 'Escape' && storeState.quickOpen) { event.stopPropagation(); closeQuick(); return }
            if (matchesHotkey(event, storeState.settings.hotkey)) {
              event.preventDefault()
              event.stopPropagation()
              if (storeState.quickOpen) closeQuick()
              else void openQuick(false)
            }
          }
          window.addEventListener('keydown', onKey, true)
          return () => window.removeEventListener('keydown', onKey, true)
        }, 'dsh-friday-hy4: in-app hotkey')

        const registrations = [
          ['sidebar.panellist', { name: 'sidebar.panellist', id: PANEL_ID, order: 40, label: () => t('inbox.title') }, SafeGlyph],
          ['main', { name: 'main', key: PANEL_ID }, SafeInboxPage],
          ['shell.overlay', { name: 'shell.overlay', id: 'dsh-friday-hy4-quick', order: 10 }, SafeQuickDialog],
          ['plugins.bundle.config', { name: 'plugins.bundle.config', key: PKG }, SafeSettings],
        ]
        for (const [owner, options, component] of registrations) {
          try {
            ctx.effect(() => ctx.slots.inject(owner, () => ctx.slots.register(options, component)),
              `dsh-friday-hy4: ${owner}`)
          } catch (error) {
            console.error('[dsh-friday-hy4] slot registration failed', owner, error)
          }
        }
        void refreshState()
      },
    }
  },
})
