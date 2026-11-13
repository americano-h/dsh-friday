export const CSS = String.raw`
.df-page, .df-quick, .df-modal, .df-settings-block, .df-toast { box-sizing: border-box; font: inherit; font-size: var(--dsh-content-font-size, 14px); color: var(--dsw-alias-label-primary); }
.df-page *, .df-quick *, .df-modal *, .df-settings-block * { box-sizing: border-box; }
:where(.df-page, .df-quick, .df-modal, .df-settings-block) :where(button, input, textarea, select) { font: inherit; }
.df-page h1, .df-page h2, .df-modal h2, .df-quick p { margin: 0; }
.df-page h1 { font-size: calc(var(--dsh-content-font-size, 14px) * 1.55); line-height: 1.3; letter-spacing: -.02em; }
.df-page-head p { margin: 5px 0 0; color: var(--dsw-alias-label-secondary); font-size: var(--dsh-content-font-size, 14px); }
.df-btn, .df-icon-btn, .df-send, .df-answer-actions button, .df-tabs button {
  border: 1px solid var(--dsw-alias-border-l1); color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-1); border-radius: 8px; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  transition: background .15s ease, border-color .15s ease, transform .15s ease;
}
.df-btn { min-height: 32px; padding: 6px 11px; font-size: calc(var(--dsh-content-font-size, 14px) * .92); white-space: nowrap; }
.df-btn:hover:not(:disabled), .df-icon-btn:hover:not(:disabled), .df-answer-actions button:hover:not(:disabled) { background: var(--dsw-alias-bg-layer-2); border-color: var(--dsw-alias-border-l2); }
.df-btn:active:not(:disabled), .df-icon-btn:active:not(:disabled), .df-send:active:not(:disabled) { transform: translateY(1px); }
.df-btn.primary, .df-send { background: var(--dsw-alias-brand-primary); color: var(--dsw-alias-bg-layer-1); border-color: var(--dsw-alias-brand-primary); }
.df-btn.primary:hover:not(:disabled), .df-send:hover:not(:disabled) { background: var(--dsw-alias-brand-primary); filter: brightness(1.06); }
.df-btn.subtle { background: transparent; }
.df-btn.danger-solid { background: var(--dsw-alias-state-error-primary); color: var(--dsw-alias-bg-layer-1); border-color: var(--dsw-alias-state-error-primary); }
.df-icon-btn { width: 30px; height: 30px; padding: 0; background: transparent; border-color: transparent; }
.df-icon-btn.danger, .df-btn.danger { color: var(--dsw-alias-state-error-primary); }
.df-send { width: 34px; height: 34px; flex: 0 0 34px; padding: 0; border-radius: 10px; }
.df-btn:disabled, .df-icon-btn:disabled, .df-send:disabled { opacity: .42; cursor: not-allowed; }
.df-btn:focus-visible, .df-icon-btn:focus-visible, .df-send:focus-visible, .df-answer-actions button:focus-visible,
.df-tabs button:focus-visible, .df-inbox-row:focus-visible, .df-find-row:focus-visible, .df-input:focus-visible,
.df-composer textarea:focus-visible, .df-search-field input:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px;
}
.df-input {
  width: 100%; min-height: 34px; padding: 7px 10px; border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary); outline: none;
}
.df-input:disabled { opacity: .55; }
.df-hint { color: var(--dsw-alias-label-secondary); font-size: calc(var(--dsh-content-font-size, 14px) * .875); line-height: 1.5; }
.df-error { color: var(--dsw-alias-state-error-primary); font-size: calc(var(--dsh-content-font-size, 14px) * .92); line-height: 1.5; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.df-inline { display: flex; align-items: center; gap: 8px; }
.df-form-row { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
.df-form-row > label { font-size: calc(var(--dsh-content-font-size, 14px) * .92); font-weight: 600; }

.df-prefs { margin: 18px 0; padding: 12px; min-width: 0; border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; }
.df-prefs legend { padding: 0 5px; font-weight: 600; }
.df-orb-controls { display: grid; grid-template-columns: minmax(100px, .65fr) minmax(150px, 1fr); align-items: center; gap: 14px; }
.df-orb-preview { height: 145px; position: relative; overflow: hidden; display: grid; place-items: center; border-radius: 8px; background: var(--dsw-alias-bg-base); border: 1px solid var(--dsw-alias-border-l1); }
.df-orb-preview img { position: absolute; pointer-events: none; max-width: none; }
.df-orb-row, .df-key-row { display: flex; align-items: center; gap: 8px; min-height: 37px; }
.df-orb-row input { margin-left: auto; accent-color: var(--dsw-alias-brand-primary); }
.df-orb-row input[type=range] { width: min(46%, 180px); }
.df-orb-row output { min-width: 4ch; text-align: right; font-variant-numeric: tabular-nums; }
.df-key-row { justify-content: space-between; }
.df-key-row button { min-width: 110px; }
.df-key-row button[aria-pressed=true] { border-color: var(--dsw-alias-brand-primary); }
@media(max-width: 520px) { .df-orb-controls { grid-template-columns: 1fr; } }

/* Full-page Inbox */
.df-page { height: 100%; min-height: 0; display: flex; flex-direction: column; background: var(--dsw-alias-bg-base); overflow: hidden; }
.df-page-head { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 24px 26px 18px; }
.df-page-actions, .df-detail-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.df-toolbar { display: flex; align-items: center; gap: 9px; padding: 0 26px 12px; }
.df-search-field { min-width: 0; flex: 1; display: flex; align-items: center; gap: 8px; min-height: 34px; padding: 0 10px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-secondary); }
.df-search-field:focus-within { border-color: var(--dsw-alias-brand-primary); }
.df-search-field input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--dsw-alias-label-primary); }
.df-search-field input:focus-visible { outline: 0; }
.df-time-filter { flex: 0 0 132px; width: 132px; }
.df-tabs { display: flex; gap: 4px; padding: 0 26px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.df-tabs button { border: 0; border-bottom: 2px solid transparent; border-radius: 0; background: transparent; padding: 9px 12px 8px; color: var(--dsw-alias-label-secondary); font-size: calc(var(--dsh-content-font-size, 14px) * .92); }
.df-tabs button.active { color: var(--dsw-alias-label-primary); border-bottom-color: var(--dsw-alias-brand-primary); }
.df-page-error { margin: 10px 26px 0; }
.df-inbox-layout { flex: 1; min-height: 0; display: flex; }
.df-list { width: clamp(270px, 33%, 360px); flex: 0 0 auto; overflow-y: auto; border-right: 1px solid var(--dsw-alias-border-l1); padding: 10px; }
.df-inbox-row { width: 100%; display: flex; flex-direction: column; gap: 7px; text-align: left; padding: 12px; margin-bottom: 4px; border: 1px solid transparent; border-radius: 10px; background: transparent; color: var(--dsw-alias-label-primary); cursor: pointer; }
.df-inbox-row:hover { background: var(--dsw-alias-bg-layer-1); }
.df-inbox-row.selected { background: var(--dsw-alias-bg-layer-2); border-color: var(--dsw-alias-border-l1); }
.df-row-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.df-row-title, .df-row-top strong { font-size: var(--dsh-content-font-size, 14px); font-weight: 600; line-height: 1.45; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.df-row-top time { flex: 0 0 auto; color: var(--dsw-alias-label-secondary); font-size: calc(var(--dsh-content-font-size, 14px) * .8); padding-top: 2px; }
.df-row-summary { color: var(--dsw-alias-label-secondary); font-size: calc(var(--dsh-content-font-size, 14px) * .875); line-height: 1.55; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.df-row-meta { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; color: var(--dsw-alias-label-secondary); font-size: calc(var(--dsh-content-font-size, 14px) * .8); }
.df-badge { display: inline-flex; align-items: center; gap: 3px; padding: 2px 5px; border-radius: 5px; background: var(--dsw-alias-bg-layer-1); border: 1px solid var(--dsw-alias-border-l1); }
.df-detail { flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column; background: var(--dsw-alias-bg-layer-1); }
.df-detail-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; padding: 17px 20px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.df-detail-head h2 { font-size: calc(var(--dsh-content-font-size, 14px) * 1.1); line-height: 1.45; margin-bottom: 4px; }
.df-detail-transcript { flex: 1; min-height: 0; overflow-y: auto; padding: 18px 20px 24px; }
.df-inline-chat { flex: 0 0 auto; padding: 8px 20px 14px; border-top: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); }
.df-inline-chat .df-composer { margin: 0; }
.df-inline-chat .df-image-drafts { padding: 0 0 8px; }
.df-inline-chat .df-error, .df-inline-chat > .df-hint { margin: 0 0 7px; }
.df-empty-state { min-height: 220px; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 10px; color: var(--dsw-alias-label-secondary); padding: 30px; }
.df-empty-state h2 { font-size: var(--dsh-content-font-size, 14px); color: var(--dsw-alias-label-primary); }
.df-empty-state p { margin: 0; font-size: calc(var(--dsh-content-font-size, 14px) * .92); }
.df-empty-small { padding: 36px 16px; text-align: center; color: var(--dsw-alias-label-secondary); font-size: calc(var(--dsh-content-font-size, 14px) * .92); }

/* Quick conversation */
.df-overlay-root { position: fixed; inset: 0; z-index: 80; pointer-events: none; }
.df-quick { pointer-events: auto; position: absolute; top: max(56px, 8vh); left: 50%; transform: translateX(-50%); width: min(720px, calc(100vw - 36px)); max-height: min(760px, 84vh); display: flex; flex-direction: column; overflow: hidden; border: 1px solid color-mix(in srgb, var(--dsw-alias-border-l2) 34%, transparent); border-radius: 18px; background: var(--dsw-alias-bg-layer-1); box-shadow: 0 0 0 8px color-mix(in srgb, var(--dsw-alias-bg-overlay) 22%, transparent), 0 18px 60px color-mix(in srgb, var(--dsw-alias-label-primary) 15%, transparent); animation: df-enter .16s ease-out; }
.df-quick.positioned { animation: df-fade .12s ease-out; }
.df-quick.compact { max-height: none; }
.df-quick.expanded { height: min(560px, calc(100vh - 72px)); min-height: 0; }
@keyframes df-enter { from { opacity: 0; transform: translate(-50%, -6px) scale(.99); } to { opacity: 1; transform: translate(-50%, 0) scale(1); } }
@keyframes df-fade { from { opacity: 0; } to { opacity: 1; } }
.df-quick-head { min-height: 46px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 7px 9px 7px 15px; border-bottom: 1px solid color-mix(in srgb, var(--dsw-alias-border-l1) 72%, transparent); cursor: grab; touch-action: none; }
.df-quick-head:active { cursor: grabbing; }
.df-quick-head button { cursor: pointer; }
.df-quick-brand { min-width: 0; display: flex; align-items: center; gap: 9px; }
.df-quick-brand strong { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: calc(var(--dsh-content-font-size, 14px) * .92); font-weight: 600; }
.df-brand-dot { width: 8px; height: 8px; flex: 0 0 auto; border-radius: 50%; background: var(--dsw-alias-brand-primary); box-shadow: 0 0 0 4px color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent); }
.df-quick-actions { display: flex; align-items: center; gap: 2px; }
.df-quick-empty { padding: 24px 22px 15px; text-align: center; color: var(--dsw-alias-label-secondary); }
.df-quick-empty span { color: var(--dsw-alias-brand-primary); font-size: calc(var(--dsh-content-font-size, 14px) * 1.55); font-weight: 650; letter-spacing: -.03em; }
.df-quick-empty p { margin-top: 5px; font-size: calc(var(--dsh-content-font-size, 14px) * .92); }
.df-quick-transcript { flex: 1; min-height: 120px; overflow-y: auto; padding: 12px 15px; }
.df-composer { display: flex; align-items: center; gap: 8px; margin: 8px 10px 6px; padding: 6px; border: 1px solid color-mix(in srgb, var(--dsw-alias-border-l2) 82%, transparent); border-radius: 13px; background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 76%, transparent); }
.df-composer:focus-within { border-color: var(--dsw-alias-brand-primary); }
.df-composer button { line-height: 0; }
.df-composer button svg { display: block; }
.df-composer-attach { width: 34px; height: 34px; flex: 0 0 34px; }
.df-composer textarea { flex: 1; min-width: 0; min-height: max(34px, calc(1.45em + 14px)); max-height: 140px; resize: none; overflow-y: auto; border: 0; outline: 0; padding: 7px 4px; background: transparent; color: var(--dsw-alias-label-primary); line-height: 1.45; }
.df-composer textarea:focus-visible { outline: 0; }
.df-composer textarea::placeholder { color: color-mix(in srgb, var(--dsw-alias-label-secondary) 62%, transparent); }
.df-search-field input::placeholder { color: var(--dsw-alias-label-secondary); }
.df-quick-error { margin: 5px 14px; }
.df-thinking { display: flex; align-items: center; gap: 8px; padding: 14px 4px; color: var(--dsw-alias-label-secondary); font-size: calc(var(--dsh-content-font-size, 14px) * .92); }
.df-thinking span { width: 7px; height: 7px; border-radius: 50%; background: var(--dsw-alias-brand-primary); animation: df-pulse 1s infinite alternate; }
@keyframes df-pulse { to { opacity: .25; } }
.df-answer-actions { display: flex; gap: 6px; padding: 0 15px 4px; }
.df-answer-actions button { width: 28px; height: 28px; padding: 0; border-color: transparent; background: transparent; color: var(--dsw-alias-label-secondary); }
.df-quick .df-message-role { display: none; }
.df-image-drafts { display: flex; gap: 8px; overflow-x: auto; padding: 8px 13px 0; }
.df-image-draft { position: relative; flex: 0 0 auto; width: 58px; height: 58px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 9px; overflow: hidden; }
.df-image-draft img { width: 100%; height: 100%; object-fit: cover; }
.df-image-draft button { position: absolute; top: 2px; right: 2px; width: 18px; height: 18px; display: grid; place-items: center; padding: 0; border: 1px solid var(--dsw-alias-border-l1); border-radius: 50%; background: var(--dsw-alias-bg-overlay); color: var(--dsw-alias-label-primary); cursor: pointer; }

/* Standalone macOS panel uses the same surface, dimensions, and outer ring. */
.df-overlay-root.df-native { inset: 0; padding: 8px; }
.df-native .df-quick { position: relative; inset: auto; width: 100%; height: auto; min-height: 0; max-height: calc(100vh - 16px); transform: none; animation: none; }
.df-native .df-quick.compact { height: auto; max-height: none; }
.df-native .df-quick.expanded { height: 560px; max-height: calc(100vh - 16px); }
.df-native .df-quick-head { flex: 0 0 46px; }
.df-native .df-modal-backdrop { background: color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent); }
.df-native-fatal { margin: 24px; padding: 14px; border-radius: 12px; color: var(--dsw-alias-state-error-primary); background: var(--dsw-alias-bg-overlay); font: var(--dsh-content-font-size, 14px)/1.5 -apple-system, BlinkMacSystemFont, sans-serif; }

/* Messages and safe Markdown */
.df-messages { display: flex; flex-direction: column; gap: 15px; }
.df-message { min-width: 0; padding: 0 2px; }
.df-message.user { padding: 11px 13px; border-radius: 11px; background: color-mix(in srgb, var(--dsw-alias-brand-primary) 8%, var(--dsw-alias-bg-layer-1)); border: 1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 15%, var(--dsw-alias-border-l1)); }
.df-message.assistant { padding: 2px 3px; }
.df-message-role { margin-bottom: 6px; color: var(--dsw-alias-label-secondary); font-size: calc(var(--dsh-content-font-size, 14px) * .75); font-weight: 650; text-transform: uppercase; letter-spacing: .08em; }
.df-markdown { font-size: var(--dsh-content-font-size, 14px); line-height: 1.7; overflow-wrap: anywhere; }
.df-markdown p { margin: 0 0 9px; white-space: pre-wrap; }
.df-markdown p:last-child { margin-bottom: 0; }
.df-markdown h2, .df-markdown h3, .df-markdown h4 { margin: 15px 0 7px; line-height: 1.4; }
.df-markdown h2 { font-size: calc(var(--dsh-content-font-size, 14px) * 1.15); } .df-markdown h3 { font-size: var(--dsh-content-font-size, 14px); } .df-markdown h4 { font-size: calc(var(--dsh-content-font-size, 14px) * .92); }
.df-markdown ul, .df-markdown ol { margin: 6px 0 10px; padding-left: 22px; }
.df-markdown li { margin: 3px 0; }
.df-markdown code { padding: 1px 4px; border-radius: 4px; background: var(--dsw-alias-bg-layer-2); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: calc(var(--dsh-code-font-size, 11px) + 1px); }
.df-markdown pre { margin: 10px 0; padding: 12px; overflow-x: auto; border: 1px solid var(--dsw-alias-border-l1); border-radius: 9px; background: var(--dsw-alias-bg-base); }
.df-markdown pre code { font-size: var(--dsh-code-font-size, 11px); padding: 0; background: transparent; line-height: 1.55; }
.df-markdown a, .df-sources a { color: var(--dsw-alias-brand-primary); text-decoration: none; }
.df-markdown a:hover, .df-sources a:hover { text-decoration: underline; }
.df-markdown blockquote { margin: 9px 0; padding: 4px 10px; border-left: 3px solid var(--dsw-alias-border-l2); color: var(--dsw-alias-label-secondary); white-space: pre-wrap; }
.df-table-scroll { margin: 10px 0; overflow-x: auto; border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; }
.df-markdown table { width: 100%; border-collapse: collapse; font-size: inherit; }
.df-markdown th, .df-markdown td { padding: 7px 9px; text-align: left; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.df-markdown th { background: var(--dsw-alias-bg-layer-2); font-weight: 600; }
.df-markdown tr:last-child td { border-bottom: 0; }
.df-sources { margin-top: 10px; padding-top: 9px; border-top: 1px solid var(--dsw-alias-border-l1); }
.df-sources-title:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
.df-sources-title { cursor: pointer; color: var(--dsw-alias-label-secondary); font-size: calc(var(--dsh-content-font-size, 14px) * .8); font-weight: 600; }
.df-sources ol { margin: 6px 0 0; padding-left: 18px; }
.df-sources li { margin: 5px 0; font-size: calc(var(--dsh-content-font-size, 14px) * .8); }
.df-sources li span { display: block; margin-top: 2px; color: var(--dsw-alias-label-secondary); line-height: 1.45; }
.df-attachment-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 9px; }
.df-attachment { width: min(240px, 100%); min-height: 70px; display: grid; place-items: center; overflow: hidden; border: 1px solid var(--dsw-alias-border-l1); border-radius: 9px; background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); font-size: calc(var(--dsh-content-font-size, 14px) * .8); }
.df-attachment img { display: block; width: 100%; max-height: 320px; object-fit: contain; }

/* Dialogs and settings */
.df-modal-backdrop { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 22px; pointer-events: auto; background: color-mix(in srgb, var(--dsw-alias-label-primary) 20%, transparent); }
.df-modal { width: min(580px, 100%); max-height: min(740px, 90vh); display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2); border-radius: 14px; background: var(--dsw-alias-bg-overlay); box-shadow: 0 20px 70px color-mix(in srgb, var(--dsw-alias-label-primary) 20%, transparent); }
.df-modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 18px 18px 13px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.df-modal-head h2 { font-size: calc(var(--dsh-content-font-size, 14px) * 1.1); }
.df-modal-head p { margin: 6px 0 0; color: var(--dsw-alias-label-secondary); font-size: calc(var(--dsh-content-font-size, 14px) * .875); line-height: 1.55; }
.df-modal-body { overflow-y: auto; padding: 17px 18px; }
.df-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }
.df-upgrade-modal { width: min(720px, 100%); }
.df-upgrade-context textarea { width: 100%; min-height: 260px; max-height: 420px; resize: vertical; padding: 13px 14px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; outline: none; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); font: var(--dsh-content-font-size, 14px)/1.65 ui-monospace, SFMono-Regular, Menlo, monospace; }
.df-upgrade-context textarea:focus { border-color: var(--dsw-alias-brand-primary); }
.df-workspace-picker { align-items: flex-start; }
.df-workspace-choice { flex: 1; min-width: 0; }
.df-workspace-choice select { color: var(--dsw-alias-label-primary); font-weight: 550; }
.df-workspace-path { margin: 5px 2px 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--dsw-alias-label-secondary); font-size: calc(var(--dsh-content-font-size, 14px) * .875); font-weight: 400; }
.df-find-modal { width: min(660px, 100%); }
.df-find-results { max-height: 460px; overflow-y: auto; margin-top: 12px; }
.df-find-row { width: 100%; display: flex; flex-direction: column; gap: 5px; padding: 11px 8px; text-align: left; border: 0; border-bottom: 1px solid var(--dsw-alias-border-l1); background: transparent; color: var(--dsw-alias-label-primary); cursor: pointer; }
.df-find-row:hover { background: var(--dsw-alias-bg-layer-1); }
.df-find-row > span:not(.df-row-title) { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--dsw-alias-label-secondary); font-size: calc(var(--dsh-content-font-size, 14px) * .875); }
.df-find-row small { color: var(--dsw-alias-label-secondary); }
.df-settings-block { max-width: 760px; padding: 4px 0; }
.df-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.df-capability-note { padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; background: var(--dsw-alias-bg-layer-1); }
.df-settings-actions { display: flex; justify-content: flex-end; margin-top: 12px; }
.df-toast { position: fixed; right: 22px; bottom: 22px; z-index: 120; max-width: min(420px, calc(100vw - 44px)); padding: 10px 14px; pointer-events: auto; border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; background: var(--dsw-alias-bg-overlay); box-shadow: 0 8px 32px color-mix(in srgb, var(--dsw-alias-label-primary) 16%, transparent); font-size: calc(var(--dsh-content-font-size, 14px) * .92); }
.df-toast.success { border-color: var(--dsw-alias-state-success-primary); }
.df-toast.error { border-color: var(--dsw-alias-state-error-primary); color: var(--dsw-alias-state-error-primary); }
.df-list, .df-detail-transcript, .df-quick-transcript, .df-modal-body, .df-find-results { scrollbar-width: thin; scrollbar-color: var(--dsw-alias-border-l2) transparent; }
@media (max-width: 840px) {
  .df-list { width: 285px; }
  .df-detail-head { flex-direction: column; }
  .df-toolbar { flex-wrap: wrap; }
  .df-search-field { flex-basis: 100%; }
}
@media (max-width: 620px) {
  .df-page-head { padding: 18px 16px 12px; align-items: flex-start; }
  .df-page-actions { justify-content: flex-end; }
  .df-toolbar, .df-tabs { padding-left: 16px; padding-right: 16px; }
  .df-list { width: 42%; }
  .df-detail-actions { flex-wrap: wrap; }
  .df-detail-actions .df-btn svg { width: 17px; height: 17px; }
  .df-settings-grid { grid-template-columns: 1fr; gap: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .df-quick, .df-thinking span { animation: none; }
  .df-btn, .df-icon-btn, .df-send, .df-answer-actions button, .df-tabs button { transition: none; }
}
`
