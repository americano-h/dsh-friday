export const CSS = `
.df-overlay-root {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: clamp(48px, 12vh, 140px);
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 38%, transparent);
  backdrop-filter: blur(6px);
  pointer-events: auto;
  animation: df-fade-in 140ms ease-out;
}
@keyframes df-fade-in { from { opacity: 0 } to { opacity: 1 } }
@keyframes df-rise { from { opacity: 0; transform: translateY(10px) scale(.985) } to { opacity: 1; transform: none } }
.df-quick {
  width: min(760px, calc(100vw - 48px));
  max-height: min(78vh, 900px);
  display: flex;
  flex-direction: column;
  background: var(--dsw-alias-bg-overlay);
  color: var(--dsw-alias-label-primary);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 18px;
  box-shadow: 0 24px 80px color-mix(in srgb, #000 28%, transparent), 0 2px 8px color-mix(in srgb, #000 12%, transparent);
  overflow: hidden;
  animation: df-rise 160ms cubic-bezier(.2,.8,.2,1);
  font: inherit;
}
.df-quick-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
}
.df-quick-head .df-title { color: var(--dsw-alias-label-primary); font-weight: 600; font-size: 13px; }
.df-kbd {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
}
.df-kbd kbd {
  font: inherit;
  padding: 1px 6px;
  border-radius: 5px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
}
.df-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
}
.df-icon-btn:hover { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); }
.df-icon-btn:focus-visible, .df-btn:focus-visible, .df-input:focus-visible, .df-textarea:focus-visible, .df-send:focus-visible, .df-tab:focus-visible, .df-row:focus-visible, .df-ref:focus-visible, .df-ws:focus-visible, .df-search:focus-visible, .df-select:focus-visible, .df-number:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}
.df-quick-body {
  padding: 16px 18px 10px;
  overflow-y: auto;
  min-height: 120px;
  max-height: 56vh;
  scrollbar-width: thin;
}
.df-quick-body.empty { min-height: 0; max-height: none; padding: 8px 18px 2px; }
.df-quick-empty {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  padding: 16px 2px 6px;
  line-height: 1.6;
}
.df-quick-foot {
  padding: 10px 12px 12px;
  border-top: 1px solid var(--dsw-alias-border-l1);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.df-composer {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px 8px 8px 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1);
  transition: border-color 120ms ease;
}
.df-composer:focus-within { border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 55%, var(--dsw-alias-border-l2)); }
.df-textarea {
  flex: 1;
  min-height: 24px;
  max-height: 160px;
  resize: none;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 14px;
  line-height: 1.55;
  padding: 3px 0;
}
.df-textarea::placeholder { color: var(--dsw-alias-label-secondary); }
.df-send {
  flex: none;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 9px;
  background: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-label-primary-foreground, #fff);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.df-send:disabled { opacity: .4; cursor: default; }
.df-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
}
.df-actions .df-spacer { flex: 1; }
.df-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  border-radius: 8px;
  padding: 4px 10px;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.df-btn:hover { border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 45%, var(--dsw-alias-border-l2)); }
.df-btn.primary { background: var(--dsw-alias-brand-primary); border-color: transparent; color: var(--dsw-alias-label-primary-foreground, #fff); }
.df-btn.ghost { background: transparent; border-color: transparent; color: var(--dsw-alias-label-secondary); }
.df-btn.ghost:hover { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); }
.df-btn.danger { color: var(--dsw-alias-state-error-primary); }
.df-btn:disabled { opacity: .5; cursor: default; }

.df-msg { display: flex; gap: 10px; margin-bottom: 14px; align-items: flex-start; }
.df-msg.user { justify-content: flex-end; }
.df-bubble {
  max-width: 88%;
  border-radius: 14px;
  padding: 10px 13px;
  font-size: 13.5px;
  line-height: 1.62;
  overflow-wrap: anywhere;
}
.df-msg.user .df-bubble {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1);
  border-bottom-right-radius: 5px;
}
.df-msg.assistant .df-bubble { background: transparent; padding-left: 2px; max-width: 94%; }
.df-avatar {
  width: 24px; height: 24px; flex: none; border-radius: 7px;
  display: inline-flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 16%, transparent);
  color: var(--dsw-alias-brand-primary);
  margin-top: 1px;
}
.df-meta { display: flex; align-items: center; gap: 8px; margin: 2px 0 6px; color: var(--dsw-alias-label-secondary); font-size: 11px; }
.df-refs { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.df-ref {
  display: inline-flex; align-items: center; gap: 5px;
  max-width: 240px; padding: 2px 8px;
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary); font-size: 11px; text-decoration: none;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.df-ref:hover { color: var(--dsw-alias-brand-primary); border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 40%, var(--dsw-alias-border-l1)); }
.df-cursor::after { content: ""; display: inline-block; width: 7px; height: 15px; margin-left: 2px; vertical-align: -2px; background: var(--dsw-alias-brand-primary); animation: df-blink 1s steps(2) infinite; }
@keyframes df-blink { 50% { opacity: 0 } }
.df-search-status { display: inline-flex; align-items: center; gap: 6px; color: var(--dsw-alias-label-secondary); font-size: 11px; }
.df-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--dsw-alias-brand-primary); animation: df-pulse 1.2s ease-in-out infinite; }
@keyframes df-pulse { 50% { opacity: .3; transform: scale(.8) } }

.df-images { display: flex; gap: 6px; flex-wrap: wrap; padding: 0 2px 6px; }
.df-thumb { position: relative; width: 56px; height: 56px; border-radius: 8px; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-2); }
.df-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.df-thumb button { position: absolute; top: 2px; right: 2px; width: 18px; height: 18px; border: 0; border-radius: 50%; background: color-mix(in srgb, #000 55%, transparent); color: #fff; cursor: pointer; line-height: 1; font-size: 12px; }
.df-drop-active { outline: 2px dashed var(--dsw-alias-brand-primary); outline-offset: -8px; }

.df-page { display: flex; height: 100%; min-height: 0; width: 100%; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); }
.df-page-list { width: clamp(260px, 32%, 340px); flex: none; border-right: 1px solid var(--dsw-alias-border-l1); display: flex; flex-direction: column; min-height: 0; }
.df-page-main { flex: 1; min-width: 0; display: flex; flex-direction: column; min-height: 0; height: 100%; }
.df-list-head { padding: 18px 16px 10px; display: flex; flex-direction: column; gap: 10px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.df-page-title { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 650; margin: 0; }
.df-subtle { color: var(--dsw-alias-label-secondary); font-size: 12px; }
.df-search { width: 100%; box-sizing: border-box; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); border-radius: 8px; padding: 7px 10px; font: inherit; font-size: 12.5px; outline: none; }
.df-search:focus { border-color: var(--dsw-alias-brand-primary); }
.df-tabs { display: flex; gap: 4px; }
.df-tab { border: 0; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12px; padding: 3px 9px; border-radius: 999px; cursor: pointer; min-height: 28px; }
.df-tab:hover { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); }
.df-tab.on { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); }
.df-list { overflow-y: auto; min-height: 0; padding: 6px; }
.df-row { width: 100%; text-align: left; border: 1px solid transparent; background: transparent; color: inherit; font: inherit; border-radius: 10px; padding: 10px 10px; cursor: pointer; display: flex; flex-direction: column; gap: 4px; }
.df-row:hover { background: var(--dsw-alias-bg-layer-2); }
.df-row.on { background: var(--dsw-alias-bg-layer-2); border-color: var(--dsw-alias-border-l1); }
.df-row-title { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.df-row-snippet { color: var(--dsw-alias-label-secondary); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.df-row-meta { display: flex; align-items: center; gap: 6px; color: var(--dsw-alias-label-secondary); font-size: 11px; }
.df-chip { border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px; padding: 0 6px; font-size: 10.5px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-2); }
.df-chip.warn { color: var(--dsw-alias-state-warn-primary); border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 35%, transparent); }
.df-detail-head { padding: 18px 22px 12px; border-bottom: 1px solid var(--dsw-alias-border-l1); display: flex; flex-direction: column; gap: 8px; }
.df-detail-title { font-size: 16px; font-weight: 650; margin: 0; line-height: 1.35; }
.df-detail-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; row-gap: 6px; }
.df-detail-actions .df-subtle { margin-left: auto; }
.df-detail-actions .df-btn { white-space: nowrap; }
.df-detail-body { flex: 1 1 auto; min-height: 240px; overflow-y: auto; padding: 18px 22px 28px; }
.df-empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--dsw-alias-label-secondary); font-size: 13px; }
.df-modal-backdrop { position: fixed; inset: 0; z-index: 70; background: color-mix(in srgb, var(--dsw-alias-bg-base) 45%, transparent); display: flex; align-items: center; justify-content: center; padding: 24px; }
.df-modal { width: min(560px, 100%); max-height: min(76vh, 720px); background: var(--dsw-alias-bg-overlay); border: 1px solid var(--dsw-alias-border-l2); border-radius: 14px; box-shadow: 0 20px 60px color-mix(in srgb, #000 30%, transparent); display: flex; flex-direction: column; overflow: hidden; }
.df-modal-head { padding: 14px 16px; border-bottom: 1px solid var(--dsw-alias-border-l1); font-weight: 600; font-size: 13.5px; }
.df-modal-body { padding: 14px 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
.df-modal-foot { padding: 12px 16px; border-top: 1px solid var(--dsw-alias-border-l1); display: flex; gap: 8px; justify-content: flex-end; }
.df-form-row { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.df-form-row label { font-size: 12px; font-weight: 600; }
.df-form-row .df-hint { color: var(--dsw-alias-label-secondary); font-size: 11.5px; line-height: 1.5; }
.df-select, .df-number { width: 100%; box-sizing: border-box; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); border-radius: 8px; padding: 7px 9px; font: inherit; font-size: 12.5px; }
.df-select-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.df-ws-list { display: flex; flex-direction: column; gap: 4px; }
.df-ws { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; cursor: pointer; background: transparent; color: inherit; font: inherit; text-align: left; }
.df-ws:hover { border-color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-2); }
.df-ws.on { border-color: var(--dsw-alias-brand-primary); background: color-mix(in srgb, var(--dsw-alias-brand-primary) 8%, transparent); }
.df-ws:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
.df-ws .df-path { color: var(--dsw-alias-label-secondary); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.df-toast { position: fixed; bottom: 26px; left: 50%; transform: translateX(-50%); z-index: 80; background: var(--dsw-alias-bg-overlay); color: var(--dsw-alias-label-primary); border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; padding: 8px 14px; font-size: 12.5px; box-shadow: 0 8px 30px color-mix(in srgb, #000 20%, transparent); }
.df-md { font-size: 13.5px; line-height: 1.65; }
.df-md > :first-child { margin-top: 0; }
.df-md > :last-child { margin-bottom: 0; }
.df-md p { margin: 8px 0; }
.df-md h1, .df-md h2, .df-md h3, .df-md h4 { margin: 16px 0 6px; line-height: 1.35; font-weight: 650; }
.df-md h1 { font-size: 18px; } .df-md h2 { font-size: 16px; } .df-md h3 { font-size: 14.5px; } .df-md h4 { font-size: 13.5px; }
.df-md ul, .df-md ol { margin: 8px 0; padding-left: 22px; }
.df-md li { margin: 3px 0; }
.df-md code { font-family: var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: .92em; background: var(--dsw-alias-bg-layer-2); border: 1px solid var(--dsw-alias-border-l1); border-radius: 4px; padding: 1px 4px; }
.df-md pre { margin: 10px 0; overflow-x: auto; background: var(--dsw-alias-bg-layer-2); border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; padding: 10px 12px; }
.df-md pre code { background: transparent; border: 0; padding: 0; font-size: 12px; line-height: 1.55; }
.df-md blockquote { margin: 10px 0; padding: 2px 0 2px 12px; border-left: 2px solid var(--dsw-alias-border-l2); color: var(--dsw-alias-label-secondary); }
.df-md a { color: var(--dsw-alias-brand-primary); text-decoration: none; }
.df-md a:hover { text-decoration: underline; }
.df-md table { border-collapse: collapse; margin: 10px 0; width: 100%; font-size: 12.5px; }
.df-md th, .df-md td { border: 1px solid var(--dsw-alias-border-l1); padding: 5px 8px; text-align: left; vertical-align: top; }
.df-md th { background: var(--dsw-alias-bg-layer-2); font-weight: 600; }
.df-md hr { border: 0; border-top: 1px solid var(--dsw-alias-border-l1); margin: 14px 0; }

@media (prefers-reduced-motion: reduce) {
  .df-overlay-root, .df-quick, .df-cursor::after, .df-dot { animation: none !important; }
}
`
