window.__ModuleLoader__.load({
  id: 'dsh-friday',
  factory(require) {
    var module = { exports: {} };
    var exports = module.exports;
    (function (module, exports, require) {
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/main.jsx
var main_exports = {};
__export(main_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(main_exports);
var import_react8 = __toESM(require("react"), 1);

// locale/en.json
var en_default = {
  meta: {
    title: "Friday Inbox",
    description: "A hotkey quick-chat overlay whose conversations settle into a searchable Inbox, ready to continue or upgrade into a workspace task."
  },
  nav: {
    inbox: "Inbox",
    settings: "Inbox settings"
  },
  overlay: {
    title: "Quick chat",
    placeholder: "Ask anything. Only web search is available.",
    newChat: "New chat",
    send: "Send",
    stop: "Stop",
    openInbox: "Open Inbox",
    empty: "Ask a question, or paste an image.",
    thinking: "Thinking\u2026",
    searching: "Searching the web\u2026",
    references: "References",
    upgrade: "Upgrade to task",
    retry: "Retry",
    collapse: "Collapse",
    error: "Something went wrong.",
    imageLimit: "Up to 4 images, each under 10 MB.",
    visionRequired: "Add a vision model in Inbox settings before sending images."
  },
  inbox: {
    title: "Inbox",
    subtitle: "Lightweight conversations that can become real tasks.",
    search: "Search questions and answers",
    finder: "Find conversations",
    newChat: "New chat",
    continue: "Continue",
    upgrade: "Upgrade",
    delete: "Delete",
    clear: "Clear Inbox",
    cleanup: "Run retention cleanup",
    settings: "Settings",
    empty: "No conversations yet. Press Option + Space to start one.",
    emptySearch: "No conversations match this search.",
    active: "Active",
    archived: "Archived",
    all: "All",
    hasImage: "Image",
    upgraded: "Upgraded",
    model: "Model",
    updated: "Updated",
    noSelection: "Select a conversation to read it here.",
    loading: "Loading\u2026",
    deleteConfirm: "Delete this conversation from Inbox?",
    clearConfirm: "Move every active conversation out of Inbox?",
    deleted: "Conversation removed from Inbox.",
    cleared: "Inbox cleared.",
    cleanupDone: "Retention cleanup finished.",
    archive: "Archive",
    unarchive: "Restore"
  },
  finder: {
    title: "Find a conversation",
    placeholder: "Search everything in Inbox",
    hint: "Type a keyword from a question or an answer.",
    open: "Open"
  },
  upgradeDialog: {
    title: "Upgrade to a workspace task",
    description: "Friday compresses this conversation, then starts a full-tool task in the workspace you pick.",
    workspace: "Workspace",
    newWorkspace: "New workspace",
    cancel: "Cancel",
    confirm: "Upgrade",
    working: "Compressing and creating the task\u2026",
    noWorkspaces: "No workspaces yet. Create one to continue.",
    success: "Task created.",
    failed: "Upgrade failed."
  },
  settings: {
    title: "Friday Inbox",
    description: "Models and behavior for the quick-chat overlay and Inbox.",
    defaultModel: "Default model",
    defaultModelHint: "Used by the next conversation. Existing conversations keep their model.",
    visionModel: "Vision model",
    visionModelHint: "Image turns are routed here when the default model cannot read images.",
    hotkey: "Hotkey",
    hotkeyHint: "Active inside the DSH window. Example: Alt+Space.",
    retention: "Retention",
    retentionHint: "Active conversations older than this are archived automatically.",
    days: "days",
    save: "Save",
    saved: "Saved. Applies to the next conversation.",
    readOnly: "Settings are read-only in this deployment.",
    loading: "Loading settings\u2026",
    none: "None"
  },
  error: {
    network: "Cannot reach the Friday service.",
    unknown: "Unexpected error."
  }
};

// locale/zh.json
var zh_default = {
  meta: {
    title: "Friday Inbox",
    description: "\u5FEB\u6377\u952E\u5524\u8D77\u7684\u8F7B\u91CF\u95EE\u7B54\u6D6E\u5C42\uFF0C\u4F1A\u8BDD\u6C89\u6DC0\u5230\u53EF\u68C0\u7D22\u7684 Inbox\uFF0C\u5E76\u53EF\u538B\u7F29\u5347\u7EA7\u4E3A\u6B63\u5F0F\u5DE5\u4F5C\u533A\u4EFB\u52A1\u3002"
  },
  nav: {
    inbox: "Inbox",
    settings: "Inbox \u8BBE\u7F6E"
  },
  overlay: {
    title: "\u5FEB\u6377\u5BF9\u8BDD",
    placeholder: "\u95EE\u70B9\u4EC0\u4E48\u3002\u4EC5\u542F\u7528 Web Search\u3002",
    newChat: "\u65B0\u5BF9\u8BDD",
    send: "\u53D1\u9001",
    stop: "\u505C\u6B62",
    openInbox: "\u6253\u5F00 Inbox",
    empty: "\u8F93\u5165\u95EE\u9898\uFF0C\u6216\u7C98\u8D34\u4E00\u5F20\u56FE\u7247\u3002",
    thinking: "\u601D\u8003\u4E2D\u2026",
    searching: "\u6B63\u5728\u641C\u7D22\u7F51\u9875\u2026",
    references: "\u53C2\u8003\u6765\u6E90",
    upgrade: "\u5347\u7EA7\u4E3A\u4EFB\u52A1",
    retry: "\u91CD\u8BD5",
    collapse: "\u6536\u8D77",
    error: "\u51FA\u4E86\u70B9\u95EE\u9898\u3002",
    imageLimit: "\u6700\u591A 4 \u5F20\u56FE\u7247\uFF0C\u6BCF\u5F20\u4E0D\u8D85\u8FC7 10 MB\u3002",
    visionRequired: "\u8BF7\u5148\u5728 Inbox \u8BBE\u7F6E\u4E2D\u914D\u7F6E\u89C6\u89C9\u6A21\u578B\uFF0C\u518D\u53D1\u9001\u56FE\u7247\u3002"
  },
  inbox: {
    title: "Inbox",
    subtitle: "\u8F7B\u91CF\u5BF9\u8BDD\u7684\u6C89\u6DC0\u5904\uFF0C\u968F\u65F6\u53EF\u4EE5\u53D8\u6210\u6B63\u5F0F\u4EFB\u52A1\u3002",
    search: "\u641C\u7D22\u95EE\u9898\u4E0E\u56DE\u7B54",
    finder: "\u67E5\u627E\u5BF9\u8BDD",
    newChat: "\u65B0\u5BF9\u8BDD",
    continue: "\u7EE7\u7EED\u5BF9\u8BDD",
    upgrade: "\u5347\u7EA7",
    delete: "\u5220\u9664",
    clear: "\u6E05\u7A7A Inbox",
    cleanup: "\u6267\u884C\u4FDD\u7559\u671F\u6E05\u7406",
    settings: "\u8BBE\u7F6E",
    empty: "\u8FD8\u6CA1\u6709\u5BF9\u8BDD\u3002\u6309 Option + Space \u5F00\u59CB\u4E00\u6BB5\u3002",
    emptySearch: "\u6CA1\u6709\u5339\u914D\u7684\u5BF9\u8BDD\u3002",
    active: "\u6D3B\u52A8",
    archived: "\u5DF2\u5F52\u6863",
    all: "\u5168\u90E8",
    hasImage: "\u542B\u56FE",
    upgraded: "\u5DF2\u5347\u7EA7",
    model: "\u6A21\u578B",
    updated: "\u66F4\u65B0\u4E8E",
    noSelection: "\u9009\u62E9\u4E00\u6BB5\u5BF9\u8BDD\uFF0C\u5728\u8FD9\u91CC\u9605\u8BFB\u3002",
    loading: "\u52A0\u8F7D\u4E2D\u2026",
    deleteConfirm: "\u4ECE Inbox \u5220\u9664\u8FD9\u6BB5\u5BF9\u8BDD\uFF1F",
    clearConfirm: "\u5C06\u5168\u90E8\u6D3B\u52A8\u5BF9\u8BDD\u79FB\u51FA Inbox\uFF1F",
    deleted: "\u5BF9\u8BDD\u5DF2\u79FB\u51FA Inbox\u3002",
    cleared: "Inbox \u5DF2\u6E05\u7A7A\u3002",
    cleanupDone: "\u4FDD\u7559\u671F\u6E05\u7406\u5B8C\u6210\u3002",
    archive: "\u5F52\u6863",
    unarchive: "\u6062\u590D"
  },
  finder: {
    title: "\u67E5\u627E\u5BF9\u8BDD",
    placeholder: "\u641C\u7D22 Inbox \u4E2D\u7684\u5168\u90E8\u5185\u5BB9",
    hint: "\u8F93\u5165\u95EE\u9898\u6216\u56DE\u7B54\u91CC\u7684\u5173\u952E\u8BCD\u3002",
    open: "\u6253\u5F00"
  },
  upgradeDialog: {
    title: "\u5347\u7EA7\u4E3A\u5DE5\u4F5C\u533A\u4EFB\u52A1",
    description: "Friday \u4F1A\u538B\u7F29\u8FD9\u6BB5\u5BF9\u8BDD\uFF0C\u7136\u540E\u5728\u6240\u9009\u5DE5\u4F5C\u533A\u521B\u5EFA\u4E00\u4E2A\u5177\u5907\u5B8C\u6574\u5DE5\u5177\u7684\u4EFB\u52A1\u3002",
    workspace: "\u5DE5\u4F5C\u533A",
    newWorkspace: "\u65B0\u5EFA\u5DE5\u4F5C\u533A",
    cancel: "\u53D6\u6D88",
    confirm: "\u5347\u7EA7",
    working: "\u6B63\u5728\u538B\u7F29\u4E0A\u4E0B\u6587\u5E76\u521B\u5EFA\u4EFB\u52A1\u2026",
    noWorkspaces: "\u8FD8\u6CA1\u6709\u5DE5\u4F5C\u533A\u3002\u5148\u521B\u5EFA\u4E00\u4E2A\u518D\u7EE7\u7EED\u3002",
    success: "\u4EFB\u52A1\u5DF2\u521B\u5EFA\u3002",
    failed: "\u5347\u7EA7\u5931\u8D25\u3002"
  },
  settings: {
    title: "Friday Inbox",
    description: "\u5FEB\u6377\u5BF9\u8BDD\u4E0E Inbox \u7684\u6A21\u578B\u548C\u884C\u4E3A\u8BBE\u7F6E\u3002",
    defaultModel: "\u9ED8\u8BA4\u6A21\u578B",
    defaultModelHint: "\u4E0B\u4E00\u6BB5\u5BF9\u8BDD\u751F\u6548\uFF1B\u5DF2\u6709\u5BF9\u8BDD\u4FDD\u6301\u539F\u6A21\u578B\u3002",
    visionModel: "\u89C6\u89C9\u6A21\u578B",
    visionModelHint: "\u9ED8\u8BA4\u6A21\u578B\u4E0D\u80FD\u8BFB\u56FE\u65F6\uFF0C\u5E26\u56FE\u8F6E\u6B21\u8DEF\u7531\u5230\u8FD9\u91CC\u3002",
    hotkey: "\u5FEB\u6377\u952E",
    hotkeyHint: "\u5728 DSH \u7A97\u53E3\u5185\u751F\u6548\u3002\u793A\u4F8B\uFF1AAlt+Space\u3002",
    retention: "\u4FDD\u7559\u671F",
    retentionHint: "\u8D85\u8FC7\u8BE5\u5929\u6570\u7684\u6D3B\u52A8\u5BF9\u8BDD\u4F1A\u88AB\u81EA\u52A8\u5F52\u6863\u3002",
    days: "\u5929",
    save: "\u4FDD\u5B58",
    saved: "\u5DF2\u4FDD\u5B58\uFF0C\u4E0B\u4E00\u6BB5\u5BF9\u8BDD\u751F\u6548\u3002",
    readOnly: "\u5F53\u524D\u90E8\u7F72\u4E0B\u8BBE\u7F6E\u4E3A\u53EA\u8BFB\u3002",
    loading: "\u6B63\u5728\u52A0\u8F7D\u8BBE\u7F6E\u2026",
    none: "\u65E0"
  },
  error: {
    network: "\u65E0\u6CD5\u8FDE\u63A5 Friday \u670D\u52A1\u3002",
    unknown: "\u672A\u77E5\u9519\u8BEF\u3002"
  }
};

// src/client/styles.js
var CSS = `
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
`;

// src/client/inbox.jsx
var import_react6 = __toESM(require("react"), 1);

// src/client/api.js
var BASE = "/dsh-friday/api/v1";
async function request(path, options = {}) {
  const response = await fetch(BASE + path, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "X-DSH-Friday": "1",
      ...options.headers || {}
    },
    ...options
  });
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}
var api = {
  config: () => request("/config"),
  saveConfig: (config) => request("/config", { method: "POST", body: JSON.stringify(config) }),
  inbox: (query = {}) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) if (value != null && value !== "") params.set(key, value);
    return request(`/inbox${params.size ? `?${params}` : ""}`);
  },
  conversation: (id) => request(`/inbox/${encodeURIComponent(id)}`),
  remove: (id) => request(`/inbox/${encodeURIComponent(id)}`, { method: "DELETE" }),
  setArchived: (id, archived) => request(`/inbox/${encodeURIComponent(id)}/archive`, { method: "POST", body: JSON.stringify({ archived }) }),
  clear: () => request("/inbox/clear", { method: "POST", body: "{}" }),
  cleanup: () => request("/inbox/cleanup", { method: "POST", body: "{}" }),
  workspaces: () => request("/workspaces"),
  upgrade: (body) => request("/upgrade", { method: "POST", body: JSON.stringify(body) }),
  cancel: (sessionId) => request("/chat/cancel", { method: "POST", body: JSON.stringify({ sessionId }) })
};
async function streamChat(body, handlers, signal) {
  const response = await fetch(BASE + "/chat", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", "X-DSH-Friday": "1" },
    body: JSON.stringify(body),
    signal
  });
  if (!response.ok || !response.body) {
    let message = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {
    }
    throw new Error(message);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let split;
    while ((split = buffer.indexOf("\n\n")) >= 0) {
      const frame = buffer.slice(0, split);
      buffer = buffer.slice(split + 2);
      const data = frame.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trimStart()).join("\n");
      if (!data) continue;
      let payload;
      try {
        payload = JSON.parse(data);
      } catch {
        continue;
      }
      handlers.onEvent?.(payload);
      if (payload.type && handlers[payload.type]) handlers[payload.type](payload);
    }
  }
}

// src/client/markdown.jsx
var import_react = __toESM(require("react"), 1);
function renderInline(text, keyPrefix) {
  const nodes = [];
  let index = 0;
  let key = 0;
  const push = (node) => nodes.push(/* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, { key: `${keyPrefix}-${key++}` }, node));
  while (index < text.length) {
    const rest = text.slice(index);
    const code = /^`([^`]+)`/.exec(rest);
    if (code) {
      push(/* @__PURE__ */ import_react.default.createElement("code", null, code[1]));
      index += code[0].length;
      continue;
    }
    const link = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/i.exec(rest);
    if (link) {
      push(/* @__PURE__ */ import_react.default.createElement("a", { href: link[2], target: "_blank", rel: "noreferrer noopener" }, link[1]));
      index += link[0].length;
      continue;
    }
    const auto = /^https?:\/\/[^\s<>"]+/.exec(rest);
    if (auto) {
      const href = auto[0].replace(/[.,;:!?)]+$/, "");
      push(/* @__PURE__ */ import_react.default.createElement("a", { href, target: "_blank", rel: "noreferrer noopener" }, href));
      index += href.length;
      continue;
    }
    const bold = /^(\*\*|__)(.+?)\1/.exec(rest);
    if (bold) {
      push(/* @__PURE__ */ import_react.default.createElement("strong", null, renderInline(bold[2], `${keyPrefix}-b${key}`)));
      index += bold[0].length;
      continue;
    }
    const italic = /^(\*|_)([^*_]+?)\1/.exec(rest);
    if (italic) {
      push(/* @__PURE__ */ import_react.default.createElement("em", null, renderInline(italic[2], `${keyPrefix}-i${key}`)));
      index += italic[0].length;
      continue;
    }
    const strike = /^~~(.+?)~~/.exec(rest);
    if (strike) {
      push(/* @__PURE__ */ import_react.default.createElement("del", null, renderInline(strike[1], `${keyPrefix}-s${key}`)));
      index += strike[0].length;
      continue;
    }
    const next = /[`*_~[\]\n]/.exec(rest);
    const length = next ? Math.max(1, next.index) : rest.length;
    push(rest.slice(0, length));
    index += length;
  }
  return nodes;
}
function splitRow(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}
function Markdown({ text, className = "" }) {
  if (!text) return null;
  const lines = String(text).replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    const fence = /^```(\w*)\s*$/.exec(line);
    if (fence) {
      const body = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push(/* @__PURE__ */ import_react.default.createElement("pre", { key: `pre-${key++}` }, /* @__PURE__ */ import_react.default.createElement("code", { "data-language": fence[1] || void 0 }, body.join("\n"))));
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const Tag = `h${level}`;
      blocks.push(/* @__PURE__ */ import_react.default.createElement(Tag, { key: `h-${key++}` }, renderInline(heading[2], `h${key}`)));
      i += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push(/* @__PURE__ */ import_react.default.createElement("hr", { key: `hr-${key++}` }));
      i += 1;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const body = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        body.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push(/* @__PURE__ */ import_react.default.createElement("blockquote", { key: `q-${key++}` }, /* @__PURE__ */ import_react.default.createElement(Markdown, { text: body.join("\n") })));
      continue;
    }
    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1])) {
      const head = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      blocks.push(
        /* @__PURE__ */ import_react.default.createElement("table", { key: `t-${key++}` }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", null, head.map((cell, n) => /* @__PURE__ */ import_react.default.createElement("th", { key: n }, renderInline(cell, `th${n}`))))), /* @__PURE__ */ import_react.default.createElement("tbody", null, rows.map((row, r) => /* @__PURE__ */ import_react.default.createElement("tr", { key: r }, head.map((_, c) => /* @__PURE__ */ import_react.default.createElement("td", { key: c }, renderInline(row[c] || "", `td${r}-${c}`)))))))
      );
      continue;
    }
    const listMatch = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(line);
    if (listMatch) {
      const ordered = /\d/.test(listMatch[2]);
      const items = [];
      const baseIndent = listMatch[1].length;
      while (i < lines.length) {
        const m = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[i]);
        if (!m || m[1].length < baseIndent) break;
        if (m[1].length > baseIndent) {
          items[items.length - 1] = `${items[items.length - 1]}
${lines[i].trim()}`;
          i += 1;
          continue;
        }
        items.push(m[3]);
        i += 1;
      }
      const Tag = ordered ? "ol" : "ul";
      blocks.push(
        /* @__PURE__ */ import_react.default.createElement(Tag, { key: `list-${key++}` }, items.map((item, n) => {
          const [first, ...rest] = item.split("\n");
          return /* @__PURE__ */ import_react.default.createElement("li", { key: n }, renderInline(first, `li${n}`), rest.length ? /* @__PURE__ */ import_react.default.createElement(Markdown, { text: rest.join("\n") }) : null);
        }))
      );
      continue;
    }
    const paragraph = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !/^(```|#{1,4}\s|>\s?|[-*+]\s|\d+[.)]\s)/.test(lines[i])) {
      paragraph.push(lines[i]);
      i += 1;
    }
    blocks.push(/* @__PURE__ */ import_react.default.createElement("p", { key: `p-${key++}` }, renderInline(paragraph.join("\n"), `p${key}`).map((node, n) => /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, { key: n }, node, n < paragraph.length - 1 ? " " : ""))));
  }
  return /* @__PURE__ */ import_react.default.createElement("div", { className: `df-md ${className}` }, blocks);
}

// src/client/message.jsx
var import_react2 = __toESM(require("react"), 1);
function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
function MessageImages({ images, sessionId }) {
  const [urls, setUrls] = (0, import_react2.useState)({});
  (0, import_react2.useEffect)(() => {
    let cancelled = false;
    for (const image of images || []) {
      if (image.dataUrl || !image.attachment) continue;
      const id = image.attachment.attachmentId;
      if (!id || urls[id]) continue;
      fetch(`/dsh-friday/api/v1/attachment/${encodeURIComponent(sessionId)}/${encodeURIComponent(id)}`, { credentials: "same-origin", headers: { "X-DSH-Friday": "1" } }).then((response) => response.ok ? response.json() : null).then((data) => {
        if (!cancelled && data?.dataUrl) setUrls((prev) => ({ ...prev, [id]: data.dataUrl }));
      }).catch(() => {
      });
    }
    return () => {
      cancelled = true;
    };
  }, [images, sessionId, urls]);
  if (!images?.length) return null;
  return /* @__PURE__ */ import_react2.default.createElement("div", { className: "df-images", style: { padding: "4px 0 0" } }, images.map((image, index) => {
    const id = image.attachment?.attachmentId;
    const src = image.dataUrl || (id ? urls[id] : null);
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: "df-thumb", key: id || index, style: { width: 64, height: 64 } }, src ? /* @__PURE__ */ import_react2.default.createElement("img", { src, alt: image.attachment?.name || "" }) : /* @__PURE__ */ import_react2.default.createElement("span", { className: "df-subtle", style: { fontSize: 10, display: "grid", placeItems: "center", height: "100%" } }, "image"));
  }));
}
function References({ citations }) {
  if (!citations?.length) return null;
  return /* @__PURE__ */ import_react2.default.createElement("div", { className: "df-refs" }, citations.slice(0, 6).map((citation, index) => /* @__PURE__ */ import_react2.default.createElement("a", { className: "df-ref", key: `${citation.url}-${index}`, href: citation.url, target: "_blank", rel: "noreferrer noopener", title: citation.title || citation.url }, /* @__PURE__ */ import_react2.default.createElement("span", null, index + 1), /* @__PURE__ */ import_react2.default.createElement("span", { style: { overflow: "hidden", textOverflow: "ellipsis" } }, citation.title || domainOf(citation.url)))));
}

// src/client/settings.jsx
var import_react4 = __toESM(require("react"), 1);

// src/client/store.js
var import_react3 = __toESM(require("react"), 1);
var state = {
  overlayOpen: false,
  overlaySessionId: null,
  inboxRefresh: 0,
  toast: null
};
var listeners = /* @__PURE__ */ new Set();
function getState() {
  return state;
}
function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function setState(patch) {
  state = { ...state, ...patch };
  for (const fn of listeners) fn();
}
function openOverlay(sessionId = null) {
  setState({ overlayOpen: true, overlaySessionId: sessionId });
}
function closeOverlay() {
  setState({ overlayOpen: false });
}
function toggleOverlay() {
  setState({ overlayOpen: !state.overlayOpen });
}
function bumpInbox() {
  setState({ inboxRefresh: state.inboxRefresh + 1 });
}
var toastTimer = null;
function toast(message, tone = "info") {
  setState({ toast: { message, tone, id: Date.now() } });
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => setState({ toast: null }), 3200);
}
function useFridayStore(selector) {
  return import_react3.default.useSyncExternalStore(
    subscribe,
    () => selector(state)
  );
}

// src/client/settings.jsx
function modelValue(model) {
  return model ? `${model.provider}\0${model.model}` : "";
}
function parseModel(value) {
  if (!value) return null;
  const [provider, model] = value.split("\0");
  return provider && model ? { provider, model } : null;
}
function SettingsCard({ t }) {
  const [state2, setState2] = (0, import_react4.useState)({ loading: true, config: null, models: [], error: null, saving: false, saved: false });
  const [draft, setDraft] = (0, import_react4.useState)(null);
  (0, import_react4.useEffect)(() => {
    let cancelled = false;
    api.config().then((data) => {
      if (cancelled) return;
      setState2({ loading: false, config: data.config, models: data.models || [], error: null, saving: false, saved: false });
      setDraft({
        defaultModel: modelValue(data.config.defaultModel),
        visionModel: modelValue(data.config.visionModel),
        hotkey: data.config.hotkey || "Alt+Space",
        retentionDays: data.config.retentionDays ?? 30
      });
    }).catch((error) => {
      if (!cancelled) setState2((prev) => ({ ...prev, loading: false, error: error.message }));
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const options = (0, import_react4.useMemo)(() => {
    return state2.models.map((model) => ({
      value: `${model.provider}\0${model.model}`,
      label: model.label || `${model.provider} / ${model.model}`
    }));
  }, [state2.models]);
  if (state2.loading) return /* @__PURE__ */ import_react4.default.createElement("div", { className: "df-subtle", style: { padding: 12 } }, t("settings.loading"));
  if (!draft) return /* @__PURE__ */ import_react4.default.createElement("div", { className: "df-subtle", style: { padding: 12 } }, state2.error || t("error.unknown"));
  const save = async () => {
    setState2((prev) => ({ ...prev, saving: true, saved: false }));
    try {
      await api.saveConfig({
        defaultModel: parseModel(draft.defaultModel),
        visionModel: parseModel(draft.visionModel),
        hotkey: draft.hotkey,
        retentionDays: Number(draft.retentionDays) || 30
      });
      setState2((prev) => ({ ...prev, saving: false, saved: true }));
      window.dispatchEvent(new Event("dsh-friday:config-changed"));
      toast(t("settings.saved"), "success");
      setTimeout(() => setState2((prev) => ({ ...prev, saved: false })), 2600);
    } catch (error) {
      setState2((prev) => ({ ...prev, saving: false, error: error.message }));
      toast(error.message || t("error.unknown"), "error");
    }
  };
  return /* @__PURE__ */ import_react4.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4 } }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "df-form-row" }, /* @__PURE__ */ import_react4.default.createElement("label", { htmlFor: "df-default-model" }, t("settings.defaultModel")), /* @__PURE__ */ import_react4.default.createElement(
    "select",
    {
      id: "df-default-model",
      className: "df-select",
      value: draft.defaultModel,
      onChange: (event) => setDraft((prev) => ({ ...prev, defaultModel: event.target.value }))
    },
    /* @__PURE__ */ import_react4.default.createElement("option", { value: "" }, t("settings.none")),
    options.map((option) => /* @__PURE__ */ import_react4.default.createElement("option", { key: option.value, value: option.value }, option.label))
  ), /* @__PURE__ */ import_react4.default.createElement("span", { className: "df-hint" }, t("settings.defaultModelHint"))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "df-form-row" }, /* @__PURE__ */ import_react4.default.createElement("label", { htmlFor: "df-vision-model" }, t("settings.visionModel")), /* @__PURE__ */ import_react4.default.createElement(
    "select",
    {
      id: "df-vision-model",
      className: "df-select",
      value: draft.visionModel,
      onChange: (event) => setDraft((prev) => ({ ...prev, visionModel: event.target.value }))
    },
    /* @__PURE__ */ import_react4.default.createElement("option", { value: "" }, t("settings.none")),
    options.map((option) => /* @__PURE__ */ import_react4.default.createElement("option", { key: option.value, value: option.value }, option.label))
  ), /* @__PURE__ */ import_react4.default.createElement("span", { className: "df-hint" }, t("settings.visionModelHint"))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "df-select-grid" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "df-form-row" }, /* @__PURE__ */ import_react4.default.createElement("label", { htmlFor: "df-hotkey" }, t("settings.hotkey")), /* @__PURE__ */ import_react4.default.createElement(
    "input",
    {
      id: "df-hotkey",
      className: "df-select",
      value: draft.hotkey,
      onChange: (event) => setDraft((prev) => ({ ...prev, hotkey: event.target.value }))
    }
  ), /* @__PURE__ */ import_react4.default.createElement("span", { className: "df-hint" }, t("settings.hotkeyHint"))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "df-form-row" }, /* @__PURE__ */ import_react4.default.createElement("label", { htmlFor: "df-retention" }, t("settings.retention")), /* @__PURE__ */ import_react4.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ import_react4.default.createElement(
    "input",
    {
      id: "df-retention",
      type: "number",
      min: 1,
      max: 365,
      className: "df-number",
      value: draft.retentionDays,
      onChange: (event) => setDraft((prev) => ({ ...prev, retentionDays: event.target.value }))
    }
  ), /* @__PURE__ */ import_react4.default.createElement("span", { className: "df-subtle" }, t("settings.days"))), /* @__PURE__ */ import_react4.default.createElement("span", { className: "df-hint" }, t("settings.retentionHint")))), /* @__PURE__ */ import_react4.default.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 } }, state2.saved ? /* @__PURE__ */ import_react4.default.createElement("span", { className: "df-subtle", style: { alignSelf: "center" } }, t("settings.saved")) : null, /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", className: "df-btn primary", onClick: save, disabled: state2.saving }, state2.saving ? "\u2026" : t("settings.save"))));
}
function SettingsDialog({ t, onClose }) {
  (0, import_react4.useEffect)(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);
  return /* @__PURE__ */ import_react4.default.createElement("div", { className: "df-modal-backdrop", onMouseDown: (event) => {
    if (event.target === event.currentTarget) onClose?.();
  } }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "df-modal", role: "dialog", "aria-modal": "true", "aria-label": t("settings.title"), style: { width: "min(680px, 100%)" } }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "df-modal-head" }, t("settings.title"), /* @__PURE__ */ import_react4.default.createElement("div", { className: "df-subtle", style: { fontWeight: 400, marginTop: 2 } }, t("settings.description"))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "df-modal-body" }, /* @__PURE__ */ import_react4.default.createElement(SettingsCard, { t })), /* @__PURE__ */ import_react4.default.createElement("div", { className: "df-modal-foot" }, /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", className: "df-btn", onClick: onClose }, t("upgradeDialog.cancel")))));
}

// src/client/upgrade.jsx
var import_react5 = __toESM(require("react"), 1);

// src/client/runtime.js
var runtime = {
  uiWorkspace: null,
  workspaces: null,
  layout: null,
  refreshConfig: null
};
function openTask(sessionId) {
  try {
    runtime.uiWorkspace?.openSession(sessionId);
    runtime.layout?.selectPanel(null);
  } catch (error) {
    console.warn("dsh-friday: cannot open task", error);
  }
}
function openInbox() {
  try {
    runtime.layout?.selectPanel("inbox");
  } catch (error) {
    console.warn("dsh-friday: cannot open Inbox", error);
  }
}

// src/client/upgrade.jsx
function UpgradeDialog({ t, sessionId, onClose, onDone }) {
  const [state2, setState2] = (0, import_react5.useState)({ loading: true, workspaces: [], selected: null, busy: false, error: null });
  const [creating, setCreating] = (0, import_react5.useState)(false);
  (0, import_react5.useEffect)(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);
  (0, import_react5.useEffect)(() => {
    let cancelled = false;
    api.workspaces().then((data) => {
      if (cancelled) return;
      const workspaces = data.workspaces || [];
      setState2({ loading: false, workspaces, selected: workspaces[0]?.id || null, busy: false, error: null });
    }).catch((error) => {
      if (!cancelled) setState2({ loading: false, workspaces: [], selected: null, busy: false, error: error.message });
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const selected = (0, import_react5.useMemo)(
    () => state2.workspaces.find((workspace) => workspace.id === state2.selected) || null,
    [state2.workspaces, state2.selected]
  );
  const createWorkspace = async () => {
    if (!runtime.uiWorkspace) return;
    setCreating(true);
    try {
      const path = await runtime.uiWorkspace.pickDirectory();
      if (!path) return;
      const workspace = await runtime.workspaces.create({ path });
      const next = { id: workspace.id, title: workspace.title || workspace.path, path: workspace.path || path, sessionCount: 0 };
      setState2((prev) => ({ ...prev, workspaces: [next, ...prev.workspaces.filter((w) => w.id !== next.id)], selected: next.id }));
    } catch (error) {
      toast(error.message || t("upgradeDialog.failed"), "error");
    } finally {
      setCreating(false);
    }
  };
  const confirm = async () => {
    if (!state2.selected || state2.busy) return;
    setState2((prev) => ({ ...prev, busy: true, error: null }));
    try {
      const result = await api.upgrade({ sessionId, workspaceId: state2.selected });
      toast(t("upgradeDialog.success"), "success");
      onDone?.(result);
      onClose?.();
      if (result?.sessionId) openTask(result.sessionId);
    } catch (error) {
      setState2((prev) => ({ ...prev, busy: false, error: error.message || t("upgradeDialog.failed") }));
    }
  };
  return /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-modal-backdrop", onMouseDown: (event) => {
    if (event.target === event.currentTarget && !state2.busy) onClose?.();
  } }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-modal", role: "dialog", "aria-modal": "true", "aria-label": t("upgradeDialog.title") }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-modal-head" }, t("upgradeDialog.title")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-modal-body" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-subtle", style: { lineHeight: 1.6 } }, t("upgradeDialog.description")), state2.loading ? /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-subtle" }, t("inbox.loading")) : null, !state2.loading && state2.workspaces.length === 0 ? /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-subtle" }, t("upgradeDialog.noWorkspaces")) : null, /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-ws-list" }, state2.workspaces.map((workspace) => /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      type: "button",
      key: workspace.id,
      className: `df-ws${workspace.id === state2.selected ? " on" : ""}`,
      onClick: () => setState2((prev) => ({ ...prev, selected: workspace.id }))
    },
    /* @__PURE__ */ import_react5.default.createElement("span", { style: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 } }, /* @__PURE__ */ import_react5.default.createElement("span", { style: { fontSize: 12.5, fontWeight: 600 } }, workspace.title || workspace.path), /* @__PURE__ */ import_react5.default.createElement("span", { className: "df-path" }, workspace.path))
  ))), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: "df-btn", onClick: createWorkspace, disabled: creating || state2.busy }, "+ ", t("upgradeDialog.newWorkspace")), state2.error ? /* @__PURE__ */ import_react5.default.createElement("div", { style: { color: "var(--dsw-alias-state-error-primary)", fontSize: 12 } }, state2.error) : null), /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-modal-foot" }, /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: "df-btn ghost", onClick: onClose, disabled: state2.busy }, t("upgradeDialog.cancel")), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: "df-btn primary", onClick: confirm, disabled: !state2.selected || state2.busy || creating }, state2.busy ? t("upgradeDialog.working") : t("upgradeDialog.confirm")))));
}

// src/client/inbox.jsx
function formatTime(value, locale) {
  if (!value) return "";
  const date = new Date(value);
  const now = Date.now();
  const diff = now - date.getTime();
  if (diff < 6e4) return locale === "zh" ? "\u521A\u521A" : "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h`;
  return date.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", { month: "short", day: "numeric" });
}
function modelName(model) {
  if (!model) return "\u2014";
  return model.model || model.provider;
}
function Row({ item, selected, onSelect, t, locale }) {
  return /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: `df-row${selected ? " on" : ""}`, onClick: () => onSelect(item.id) }, /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-row-title" }, item.title || item.firstPrompt || t("inbox.title")), /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-row-snippet" }, item.firstPrompt || item.snippet || " "), /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-row-meta" }, /* @__PURE__ */ import_react6.default.createElement("span", null, formatTime(item.updatedAt, locale)), /* @__PURE__ */ import_react6.default.createElement("span", null, "\xB7"), /* @__PURE__ */ import_react6.default.createElement("span", null, modelName(item.model)), item.hasImage ? /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-chip" }, t("inbox.hasImage")) : null, item.upgraded ? /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-chip warn" }, t("inbox.upgraded")) : null, item.archived ? /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-chip" }, t("inbox.archived")) : null));
}
function Conversation({ conversation, t, locale, onContinue, onUpgrade, onArchive, onDelete, onOpenTask }) {
  const messages = conversation?.messages || [];
  return /* @__PURE__ */ import_react6.default.createElement(import_react6.default.Fragment, null, /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-detail-head" }, /* @__PURE__ */ import_react6.default.createElement("h2", { className: "df-detail-title" }, conversation.title || conversation.firstPrompt || t("inbox.title")), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-detail-actions" }, /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "df-btn primary", onClick: onContinue, disabled: conversation.archived }, t("inbox.continue")), conversation.upgraded && conversation.upgradedSessionId ? /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "df-btn", onClick: () => onOpenTask(conversation.upgradedSessionId) }, t("inbox.upgraded"), " \u2197") : /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "df-btn", onClick: onUpgrade, disabled: conversation.archived }, t("inbox.upgrade")), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "df-btn ghost", onClick: onArchive }, conversation.archived ? t("inbox.unarchive") : t("inbox.archive")), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "df-btn ghost danger", onClick: onDelete }, t("inbox.delete")), /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-spacer", style: { flex: 1 } }), /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-subtle", style: { fontSize: 11 } }, modelName(conversation.model), " \xB7 ", formatTime(conversation.updatedAt, locale)))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-detail-body", role: "log", "aria-label": "conversation" }, messages.length === 0 ? /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-empty-state" }, t("inbox.empty")) : null, messages.map((message, index) => /* @__PURE__ */ import_react6.default.createElement("div", { className: `df-msg ${message.role}`, key: message.id || index, "aria-label": `${message.role} message` }, message.role === "assistant" ? /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-avatar", "aria-hidden": "true" }, /* @__PURE__ */ import_react6.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none" }, /* @__PURE__ */ import_react6.default.createElement("path", { d: "M12 3.5l1.7 4.6 4.6 1.7-4.6 1.7L12 16.1l-1.7-4.6L5.7 9.8l4.6-1.7L12 3.5Z", fill: "currentColor" }))) : null, /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-bubble" }, /* @__PURE__ */ import_react6.default.createElement(MessageImages, { images: message.images, sessionId: conversation.id }), message.role === "assistant" ? /* @__PURE__ */ import_react6.default.createElement(Markdown, { text: message.text }) : /* @__PURE__ */ import_react6.default.createElement("div", { style: { whiteSpace: "pre-wrap" } }, message.text), /* @__PURE__ */ import_react6.default.createElement(References, { citations: message.citations }))))));
}
function Finder({ t, onClose, onOpen }) {
  const [query, setQuery] = (0, import_react6.useState)("");
  (0, import_react6.useEffect)(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);
  const [items, setItems] = (0, import_react6.useState)([]);
  const [loading, setLoading] = (0, import_react6.useState)(false);
  (0, import_react6.useEffect)(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      api.inbox({ q: query, status: "all", limit: 30 }).then((data) => {
        if (!cancelled) setItems(data.items || []);
      }).catch(() => {
        if (!cancelled) setItems([]);
      }).finally(() => {
        if (!cancelled) setLoading(false);
      });
    }, 160);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);
  return /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-modal-backdrop", onMouseDown: (event) => {
    if (event.target === event.currentTarget) onClose();
  } }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-modal", role: "dialog", "aria-modal": "true", "aria-label": t("finder.title") }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-modal-head" }, t("finder.title")), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-modal-body" }, /* @__PURE__ */ import_react6.default.createElement("input", { autoFocus: true, className: "df-search", placeholder: t("finder.placeholder"), value: query, onChange: (event) => setQuery(event.target.value) }), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-subtle" }, loading ? t("inbox.loading") : t("finder.hint")), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-list", style: { padding: 0, maxHeight: "48vh" } }, items.map((item) => /* @__PURE__ */ import_react6.default.createElement(Row, { key: item.id, item, selected: false, onSelect: () => onOpen(item.id), t, locale: navigator.language?.startsWith("zh") ? "zh" : "en" })), !loading && items.length === 0 ? /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-subtle", style: { padding: 10 } }, t("inbox.emptySearch")) : null)), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-modal-foot" }, /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "df-btn", onClick: onClose }, t("upgradeDialog.cancel")))));
}
function ConfirmDialog({ t, message, confirmLabel, onCancel, onConfirm }) {
  (0, import_react6.useEffect)(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onCancel]);
  return /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-modal-backdrop", onMouseDown: (event) => {
    if (event.target === event.currentTarget) onCancel();
  } }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-modal", role: "alertdialog", "aria-modal": "true", "aria-label": message, style: { width: "min(420px, 100%)" } }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-modal-head" }, message), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-modal-foot" }, /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "df-btn ghost", onClick: onCancel }, t("upgradeDialog.cancel")), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "df-btn primary", onClick: onConfirm }, confirmLabel || t("inbox.delete")))));
}
function InboxPage({ t }) {
  const locale = navigator.language?.startsWith("zh") ? "zh" : "en";
  const refresh = useFridayStore((state2) => state2.inboxRefresh);
  const [query, setQuery] = (0, import_react6.useState)("");
  const [status, setStatus] = (0, import_react6.useState)("active");
  const [items, setItems] = (0, import_react6.useState)([]);
  const [loading, setLoading] = (0, import_react6.useState)(true);
  const [selectedId, setSelectedId] = (0, import_react6.useState)(null);
  const [conversation, setConversation] = (0, import_react6.useState)(null);
  const [detailLoading, setDetailLoading] = (0, import_react6.useState)(false);
  const [finderOpen, setFinderOpen] = (0, import_react6.useState)(false);
  const [settingsOpen, setSettingsOpen] = (0, import_react6.useState)(false);
  const [upgradeOpen, setUpgradeOpen] = (0, import_react6.useState)(false);
  const [confirm, setConfirm] = (0, import_react6.useState)(null);
  const searchTimer = (0, import_react6.useRef)(null);
  (0, import_react6.useEffect)(() => {
    let cancelled = false;
    const load = () => {
      setLoading(true);
      api.inbox({ q: query, status }).then((data) => {
        if (cancelled) return;
        setItems(data.items || []);
        setSelectedId((current2) => current2 && data.items?.some((item) => item.id === current2) ? current2 : data.items?.[0]?.id || null);
      }).catch((error) => {
        if (!cancelled) toast(error.message, "error");
      }).finally(() => {
        if (!cancelled) setLoading(false);
      });
    };
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(load, query ? 180 : 0);
    return () => {
      cancelled = true;
      clearTimeout(searchTimer.current);
    };
  }, [query, status, refresh]);
  (0, import_react6.useEffect)(() => {
    if (!selectedId) {
      setConversation(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    api.conversation(selectedId).then((data) => {
      if (!cancelled) setConversation(data.conversation);
    }).catch((error) => {
      if (!cancelled) {
        toast(error.message, "error");
        setConversation(null);
      }
    }).finally(() => {
      if (!cancelled) setDetailLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedId, refresh]);
  const current = conversation && conversation.id === selectedId ? conversation : null;
  const stats = (0, import_react6.useMemo)(() => ({
    active: items.filter((item) => !item.archived).length,
    archived: items.filter((item) => item.archived).length
  }), [items]);
  async function setArchived(archived) {
    if (!conversation) return;
    try {
      await api.setArchived(conversation.id, archived);
      bumpInbox();
      toast(archived ? t("inbox.archive") : t("inbox.unarchive"), "success");
    } catch (error) {
      toast(error.message, "error");
    }
  }
  function remove() {
    if (!conversation) return;
    setConfirm({
      message: t("inbox.deleteConfirm"),
      confirmLabel: t("inbox.delete"),
      action: async () => {
        try {
          await api.remove(conversation.id);
          setSelectedId(null);
          setConversation(null);
          bumpInbox();
          toast(t("inbox.deleted"), "success");
        } catch (error) {
          toast(error.message, "error");
        }
      }
    });
  }
  function clearAll() {
    setConfirm({
      message: t("inbox.clearConfirm"),
      confirmLabel: t("inbox.clear"),
      action: async () => {
        try {
          await api.clear();
          setSelectedId(null);
          setConversation(null);
          bumpInbox();
          toast(t("inbox.cleared"), "success");
        } catch (error) {
          toast(error.message, "error");
        }
      }
    });
  }
  async function cleanup() {
    try {
      const result = await api.cleanup();
      bumpInbox();
      toast(`${t("inbox.cleanupDone")}${result?.count ? ` (${result.count})` : ""}`, "success");
    } catch (error) {
      toast(error.message, "error");
    }
  }
  return /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-page" }, /* @__PURE__ */ import_react6.default.createElement("aside", { className: "df-page-list" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-list-head" }, /* @__PURE__ */ import_react6.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ import_react6.default.createElement("h1", { className: "df-page-title" }, /* @__PURE__ */ import_react6.default.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ import_react6.default.createElement("path", { d: "M4.5 13.2 6.8 6.9A2.2 2.2 0 0 1 8.86 5.5h6.28a2.2 2.2 0 0 1 2.06 1.4l2.3 6.3v3.1a2.2 2.2 0 0 1-2.2 2.2H6.7a2.2 2.2 0 0 1-2.2-2.2v-3.1Z", stroke: "var(--dsw-alias-brand-primary)", strokeWidth: "1.5", strokeLinejoin: "round" }), /* @__PURE__ */ import_react6.default.createElement("path", { d: "M4.5 13.4h3.4l.8 1.6h6.6l.8-1.6h3.4", stroke: "var(--dsw-alias-brand-primary)", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })), t("inbox.title")), /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-spacer", style: { flex: 1 } }), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "df-icon-btn", title: t("inbox.settings"), "aria-label": t("inbox.settings"), onClick: () => setSettingsOpen(true) }, /* @__PURE__ */ import_react6.default.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none" }, /* @__PURE__ */ import_react6.default.createElement("path", { d: "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z", stroke: "currentColor", strokeWidth: "1.5" }), /* @__PURE__ */ import_react6.default.createElement("path", { d: "M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.4 2.4-.06-.06A1.7 1.7 0 0 0 15.46 19c-.3.13-.55.37-.68.68L14.6 20h-3.4l-.18-.32a1.7 1.7 0 0 0-.68-.68 1.7 1.7 0 0 0-1.88.34l-.06.06-2.4-2.4.06-.06A1.7 1.7 0 0 0 6.4 15a1.7 1.7 0 0 0-.68-.68L5.4 14.1v-3.4l.32-.18a1.7 1.7 0 0 0 .68-.68 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.4-2.4.06.06A1.7 1.7 0 0 0 10.34 5c.3-.13.55-.37.68-.68l.18-.32h3.4l.18.32c.13.3.37.55.68.68a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.4 2.4-.06.06a1.7 1.7 0 0 0-.34 1.88c.13.3.37.55.68.68l.32.18v3.4l-.32.18c-.3.13-.55.37-.68.68Z", stroke: "currentColor", strokeWidth: "1.3", strokeLinejoin: "round" })))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-subtle" }, t("inbox.subtitle")), /* @__PURE__ */ import_react6.default.createElement("input", { className: "df-search", placeholder: t("inbox.search"), value: query, onChange: (event) => setQuery(event.target.value) }), /* @__PURE__ */ import_react6.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-tabs" }, /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: `df-tab${status === "active" ? " on" : ""}`, onClick: () => setStatus("active") }, t("inbox.active")), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: `df-tab${status === "archived" ? " on" : ""}`, onClick: () => setStatus("archived") }, t("inbox.archived")), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: `df-tab${status === "all" ? " on" : ""}`, onClick: () => setStatus("all") }, t("inbox.all"))), /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-spacer", style: { flex: 1 } }), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "df-btn ghost", onClick: () => setFinderOpen(true) }, t("inbox.finder"))), /* @__PURE__ */ import_react6.default.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "df-btn primary", onClick: () => openOverlay(null) }, "+ ", t("inbox.newChat")), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "df-btn ghost", onClick: cleanup }, t("inbox.cleanup")), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "df-btn ghost danger", onClick: clearAll }, t("inbox.clear")))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-list" }, items.map((item) => /* @__PURE__ */ import_react6.default.createElement(Row, { key: item.id, item, selected: item.id === selectedId, onSelect: setSelectedId, t, locale })), loading && items.length === 0 ? /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-subtle", style: { padding: 12 } }, t("inbox.loading")) : null, !loading && items.length === 0 ? /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-empty-state", style: { minHeight: 160, padding: 16, textAlign: "center" } }, query ? t("inbox.emptySearch") : t("inbox.empty")) : null), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-subtle", style: { padding: "6px 12px", borderTop: "1px solid var(--dsw-alias-border-l1)" } }, stats.active, " ", t("inbox.active"), " \xB7 ", stats.archived, " ", t("inbox.archived"))), /* @__PURE__ */ import_react6.default.createElement("section", { className: "df-page-main" }, detailLoading && !current ? /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-empty-state" }, t("inbox.loading")) : current ? /* @__PURE__ */ import_react6.default.createElement(
    Conversation,
    {
      conversation: current,
      t,
      locale,
      onContinue: () => openOverlay(current.id),
      onUpgrade: () => setUpgradeOpen(true),
      onArchive: () => setArchived(!current.archived),
      onDelete: remove,
      onOpenTask: openTask
    }
  ) : /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-empty-state" }, /* @__PURE__ */ import_react6.default.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none" }, /* @__PURE__ */ import_react6.default.createElement("path", { d: "M4.5 13.2 6.8 6.9A2.2 2.2 0 0 1 8.86 5.5h6.28a2.2 2.2 0 0 1 2.06 1.4l2.3 6.3v3.1a2.2 2.2 0 0 1-2.2 2.2H6.7a2.2 2.2 0 0 1-2.2-2.2v-3.1Z", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round", opacity: ".5" })), t("inbox.noSelection"))), finderOpen ? /* @__PURE__ */ import_react6.default.createElement(Finder, { t, onClose: () => setFinderOpen(false), onOpen: (id) => {
    setFinderOpen(false);
    setSelectedId(id);
  } }) : null, settingsOpen ? /* @__PURE__ */ import_react6.default.createElement(SettingsDialog, { t, onClose: () => setSettingsOpen(false) }) : null, confirm ? /* @__PURE__ */ import_react6.default.createElement(
    ConfirmDialog,
    {
      t,
      message: confirm.message,
      confirmLabel: confirm.confirmLabel,
      onCancel: () => setConfirm(null),
      onConfirm: () => {
        const action = confirm.action;
        setConfirm(null);
        action();
      }
    }
  ) : null, upgradeOpen && current ? /* @__PURE__ */ import_react6.default.createElement(UpgradeDialog, { t, sessionId: current.id, onClose: () => setUpgradeOpen(false), onDone: () => {
    setUpgradeOpen(false);
    bumpInbox();
  } }) : null);
}
function InboxSettingsCard({ t }) {
  return /* @__PURE__ */ import_react6.default.createElement(SettingsCard, { t });
}

// src/client/overlay.jsx
var import_react7 = __toESM(require("react"), 1);
var MAX_IMAGES = 4;
var MAX_IMAGE_BYTES = 10 * 1024 * 1024;
var ALLOWED_IMAGE_TYPES = /* @__PURE__ */ new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
var LAST_KEY = "dsh-friday.last";
function readLast() {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (!value?.sessionId || !value?.at) return null;
    if (Date.now() - value.at > 5 * 60 * 1e3) return null;
    return value;
  } catch {
    return null;
  }
}
function remember(sessionId, title) {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify({ sessionId, at: Date.now(), title: title || "" }));
  } catch {
  }
}
var messageSeq = 0;
function nextId() {
  messageSeq += 1;
  return `local-${Date.now()}-${messageSeq}`;
}
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("read failed"));
    reader.readAsDataURL(file);
  });
}
function AssistantAvatar() {
  return /* @__PURE__ */ import_react7.default.createElement("span", { className: "df-avatar", "aria-hidden": "true" }, /* @__PURE__ */ import_react7.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none" }, /* @__PURE__ */ import_react7.default.createElement("path", { d: "M12 3.5l1.7 4.6 4.6 1.7-4.6 1.7L12 16.1l-1.7-4.6L5.7 9.8l4.6-1.7L12 3.5Z", fill: "currentColor" }), /* @__PURE__ */ import_react7.default.createElement("path", { d: "M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z", fill: "currentColor", opacity: ".6" })));
}
function QuickOverlay({ t }) {
  const open = useFridayStore((state2) => state2.overlayOpen);
  const requestedSession = useFridayStore((state2) => state2.overlaySessionId);
  const [sessionId, setSessionId] = (0, import_react7.useState)(null);
  const [title, setTitle] = (0, import_react7.useState)("");
  const [messages, setMessages] = (0, import_react7.useState)([]);
  const [input, setInput] = (0, import_react7.useState)("");
  const [images, setImages] = (0, import_react7.useState)([]);
  const [busy, setBusy] = (0, import_react7.useState)(false);
  const [status, setStatus] = (0, import_react7.useState)("");
  const [config, setConfig] = (0, import_react7.useState)(null);
  const [upgradeOpen, setUpgradeOpen] = (0, import_react7.useState)(false);
  const [showDrop, setShowDrop] = (0, import_react7.useState)(false);
  const abortRef = (0, import_react7.useRef)(null);
  const textareaRef = (0, import_react7.useRef)(null);
  const fileRef = (0, import_react7.useRef)(null);
  const listRef = (0, import_react7.useRef)(null);
  const stickRef = (0, import_react7.useRef)(true);
  (0, import_react7.useEffect)(() => {
    if (!open) return;
    let cancelled = false;
    api.config().then((data) => {
      if (!cancelled) setConfig(data);
    }).catch(() => {
    });
    return () => {
      cancelled = true;
    };
  }, [open]);
  (0, import_react7.useEffect)(() => {
    if (!open) {
      abortRef.current?.abort();
      abortRef.current = null;
      setState({ overlaySessionId: null });
      return;
    }
    const target = requestedSession || readLast()?.sessionId || null;
    if (target) {
      loadConversation(target);
    } else if (!sessionId) {
      setMessages([]);
      setTitle("");
    }
    const timer = setTimeout(() => textareaRef.current?.focus(), 40);
    return () => clearTimeout(timer);
  }, [open, requestedSession]);
  (0, import_react7.useEffect)(() => {
    const el = listRef.current;
    if (!el) return;
    if (stickRef.current) el.scrollTop = el.scrollHeight;
  }, [messages]);
  (0, import_react7.useEffect)(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, 160);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > 160 ? "auto" : "hidden";
  }, [input, open]);
  async function loadConversation(id) {
    try {
      const data = await api.conversation(id);
      const conversation = data.conversation;
      if (conversation.archived || conversation.upgraded) {
        toast(t("inbox.upgraded"), "warn");
        newChat();
        return;
      }
      setSessionId(conversation.id);
      setTitle(conversation.title || "");
      setMessages((conversation.messages || []).map((message) => ({ ...message, id: message.id || nextId() })));
      remember(conversation.id, conversation.title);
    } catch (error) {
      toast(error.message || t("error.unknown"), "error");
      setSessionId(null);
      setTitle("");
      setMessages([]);
    }
  }
  function newChat() {
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
    setStatus("");
    setSessionId(null);
    setTitle("");
    setMessages([]);
    setInput("");
    setImages([]);
    setState({ overlaySessionId: null });
    textareaRef.current?.focus();
  }
  function addFiles(fileList) {
    const files = Array.from(fileList || []).filter((file) => ALLOWED_IMAGE_TYPES.has(file.type));
    if (!files.length) return;
    if (!config?.visionAvailable && !config?.defaultSupportsImages) {
      toast(t("overlay.visionRequired"), "warn");
      return;
    }
    for (const file of files) {
      if (images.length >= MAX_IMAGES) {
        toast(t("overlay.imageLimit"), "warn");
        break;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast(t("overlay.imageLimit"), "warn");
        continue;
      }
      fileToDataUrl(file).then((dataUrl) => setImages((prev) => prev.length >= MAX_IMAGES ? prev : [...prev, { dataUrl, name: file.name || "image" }])).catch(() => toast(t("error.unknown"), "error"));
    }
  }
  function updateAssistant(id, updater) {
    setMessages((prev) => prev.map((message) => message.id === id ? updater(message) : message));
  }
  async function send() {
    if (busy) return;
    const text = input.trim();
    if (!text && images.length === 0) return;
    const userMessage = { id: nextId(), role: "user", text, images: images.map((image) => ({ dataUrl: image.dataUrl, attachment: { name: image.name } })) };
    const assistantId = nextId();
    const assistantMessage = { id: assistantId, role: "assistant", text: "", citations: [], pending: true };
    stickRef.current = true;
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setImages([]);
    setBusy(true);
    setStatus("");
    const controller = new AbortController();
    abortRef.current = controller;
    let streamSession = sessionId;
    try {
      await streamChat({
        sessionId,
        text,
        images: images.length ? images : void 0,
        clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }, {
        meta(payload) {
          if (payload.sessionId) {
            streamSession = payload.sessionId;
            setSessionId(payload.sessionId);
            remember(payload.sessionId, payload.title || title);
          }
          if (payload.title) setTitle(payload.title);
        },
        delta(payload) {
          updateAssistant(assistantId, (message) => ({ ...message, text: message.text + payload.text }));
        },
        reasoning() {
        },
        tool(payload) {
          setStatus(payload.name === "web_search" ? t("overlay.searching") : "");
        },
        citations(payload) {
          updateAssistant(assistantId, (message) => ({ ...message, citations: payload.sources || [] }));
        },
        title(payload) {
          if (payload.title) setTitle(payload.title);
        },
        done(payload) {
          updateAssistant(assistantId, (message) => ({ ...message, pending: false, text: message.text || payload.text || "" }));
          setBusy(false);
          setStatus("");
          if (payload.sessionId || streamSession) remember(payload.sessionId || streamSession, payload.title || title);
          bumpInbox();
        },
        error(payload) {
          updateAssistant(assistantId, (message) => ({ ...message, pending: false, error: payload.message || t("overlay.error") }));
          setBusy(false);
          setStatus("");
          toast(payload.message || t("overlay.error"), "error");
        }
      }, controller.signal);
    } catch (error) {
      if (error.name === "AbortError") {
        updateAssistant(assistantId, (message) => ({ ...message, pending: false }));
      } else {
        updateAssistant(assistantId, (message) => ({ ...message, pending: false, error: error.message || t("overlay.error") }));
        toast(error.message || t("overlay.error"), "error");
      }
      setBusy(false);
      setStatus("");
    } finally {
      abortRef.current = null;
    }
  }
  async function stop() {
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
    setStatus("");
    if (sessionId) api.cancel(sessionId).catch(() => {
    });
  }
  if (!open) return null;
  const canSend = (input.trim() || images.length) && !busy;
  return /* @__PURE__ */ import_react7.default.createElement(
    "div",
    {
      className: `df-overlay-root${showDrop ? " df-drop-active" : ""}`,
      onMouseDown: (event) => {
        if (event.target === event.currentTarget) closeOverlay();
      },
      onDragOver: (event) => {
        event.preventDefault();
        setShowDrop(true);
      },
      onDragLeave: (event) => {
        if (event.target === event.currentTarget) setShowDrop(false);
      },
      onDrop: (event) => {
        event.preventDefault();
        setShowDrop(false);
        addFiles(event.dataTransfer?.files);
      }
    },
    /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-quick", role: "dialog", "aria-modal": "true", "aria-label": t("overlay.title") }, /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-quick-head" }, /* @__PURE__ */ import_react7.default.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ import_react7.default.createElement("path", { d: "M4.5 13.2 6.8 6.9A2.2 2.2 0 0 1 8.86 5.5h6.28a2.2 2.2 0 0 1 2.06 1.4l2.3 6.3v3.1a2.2 2.2 0 0 1-2.2 2.2H6.7a2.2 2.2 0 0 1-2.2-2.2v-3.1Z", stroke: "var(--dsw-alias-brand-primary)", strokeWidth: "1.5", strokeLinejoin: "round" }), /* @__PURE__ */ import_react7.default.createElement("path", { d: "M4.5 13.4h3.4l.8 1.6h6.6l.8-1.6h3.4", stroke: "var(--dsw-alias-brand-primary)", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })), /* @__PURE__ */ import_react7.default.createElement("span", { className: "df-title" }, title || t("overlay.title")), /* @__PURE__ */ import_react7.default.createElement("span", { className: "df-subtle", style: { fontSize: 11 } }, t("nav.inbox")), /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-kbd" }, /* @__PURE__ */ import_react7.default.createElement("kbd", null, "\u2325"), /* @__PURE__ */ import_react7.default.createElement("kbd", null, "Space"), /* @__PURE__ */ import_react7.default.createElement("button", { type: "button", className: "df-icon-btn", onClick: closeOverlay, title: t("overlay.collapse"), "aria-label": t("overlay.collapse") }, /* @__PURE__ */ import_react7.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none" }, /* @__PURE__ */ import_react7.default.createElement("path", { d: "M6 6l12 12M18 6 6 18", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" }))))), /* @__PURE__ */ import_react7.default.createElement(
      "div",
      {
        className: `df-quick-body${messages.length === 0 ? " empty" : ""}`,
        ref: listRef,
        onScroll: (event) => {
          const el = event.currentTarget;
          stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
        }
      },
      messages.length === 0 ? /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-quick-empty" }, t("overlay.empty")) : null,
      messages.map((message) => /* @__PURE__ */ import_react7.default.createElement("div", { className: `df-msg ${message.role}`, key: message.id }, message.role === "assistant" ? /* @__PURE__ */ import_react7.default.createElement(AssistantAvatar, null) : null, /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-bubble" }, /* @__PURE__ */ import_react7.default.createElement(MessageImages, { images: message.images, sessionId }), message.text ? /* @__PURE__ */ import_react7.default.createElement(Markdown, { text: message.text }) : message.pending ? /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-search-status" }, /* @__PURE__ */ import_react7.default.createElement("span", { className: "df-dot" }), status || t("overlay.thinking")) : null, message.pending && message.text ? /* @__PURE__ */ import_react7.default.createElement("span", { className: "df-cursor" }) : null, message.error ? /* @__PURE__ */ import_react7.default.createElement("div", { style: { color: "var(--dsw-alias-state-error-primary)", fontSize: 12, marginTop: 6 } }, message.error) : null, /* @__PURE__ */ import_react7.default.createElement(References, { citations: message.citations }))))
    ), /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-quick-foot" }, images.length ? /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-images" }, images.map((image, index) => /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-thumb", key: `${image.name}-${index}` }, /* @__PURE__ */ import_react7.default.createElement("img", { src: image.dataUrl, alt: image.name }), /* @__PURE__ */ import_react7.default.createElement("button", { type: "button", onClick: () => setImages((prev) => prev.filter((_, i) => i !== index)), "aria-label": "remove" }, "\xD7")))) : null, /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-composer" }, /* @__PURE__ */ import_react7.default.createElement(
      "textarea",
      {
        ref: textareaRef,
        className: "df-textarea",
        rows: 1,
        value: input,
        placeholder: t("overlay.placeholder"),
        onChange: (event) => setInput(event.target.value),
        onPaste: (event) => {
          if (event.clipboardData?.files?.length) {
            event.preventDefault();
            addFiles(event.clipboardData.files);
          }
        },
        onKeyDown: (event) => {
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            send();
          }
        }
      }
    ), /* @__PURE__ */ import_react7.default.createElement("input", { ref: fileRef, type: "file", accept: "image/png,image/jpeg,image/webp,image/gif", multiple: true, hidden: true, onChange: (event) => {
      addFiles(event.target.files);
      event.target.value = "";
    } }), /* @__PURE__ */ import_react7.default.createElement("button", { type: "button", className: "df-icon-btn", title: t("overlay.imageLimit"), "aria-label": "add image", onClick: () => fileRef.current?.click() }, /* @__PURE__ */ import_react7.default.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none" }, /* @__PURE__ */ import_react7.default.createElement("rect", { x: "3.5", y: "5", width: "17", height: "14", rx: "3", stroke: "currentColor", strokeWidth: "1.5" }), /* @__PURE__ */ import_react7.default.createElement("circle", { cx: "8.5", cy: "10", r: "1.4", fill: "currentColor" }), /* @__PURE__ */ import_react7.default.createElement("path", { d: "m5.5 17 4.3-4.4 3.1 3.1 2.5-2.6L19 17", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }))), busy ? /* @__PURE__ */ import_react7.default.createElement("button", { type: "button", className: "df-send", onClick: stop, title: t("overlay.stop"), "aria-label": t("overlay.stop") }, /* @__PURE__ */ import_react7.default.createElement("svg", { width: "12", height: "12", viewBox: "0 0 24 24" }, /* @__PURE__ */ import_react7.default.createElement("rect", { x: "5", y: "5", width: "14", height: "14", rx: "2", fill: "currentColor" }))) : /* @__PURE__ */ import_react7.default.createElement("button", { type: "button", className: "df-send", onClick: send, disabled: !canSend, title: t("overlay.send"), "aria-label": t("overlay.send") }, /* @__PURE__ */ import_react7.default.createElement("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none" }, /* @__PURE__ */ import_react7.default.createElement("path", { d: "M5 12h13M12.5 5.5 19 12l-6.5 6.5", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round" })))), /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-actions" }, /* @__PURE__ */ import_react7.default.createElement("button", { type: "button", className: "df-btn ghost", onClick: newChat }, t("overlay.newChat")), /* @__PURE__ */ import_react7.default.createElement("button", { type: "button", className: "df-btn ghost", onClick: () => {
      closeOverlay();
      openInbox();
    } }, t("overlay.openInbox")), sessionId ? /* @__PURE__ */ import_react7.default.createElement("button", { type: "button", className: "df-btn ghost", onClick: () => setUpgradeOpen(true) }, t("overlay.upgrade")) : null, /* @__PURE__ */ import_react7.default.createElement("span", { className: "df-spacer" }), /* @__PURE__ */ import_react7.default.createElement("span", null, "Enter \u21B5 \xB7 Shift+Enter")))),
    upgradeOpen && sessionId ? /* @__PURE__ */ import_react7.default.createElement(
      UpgradeDialog,
      {
        t,
        sessionId,
        onClose: () => setUpgradeOpen(false),
        onDone: () => {
          setUpgradeOpen(false);
          bumpInbox();
        }
      }
    ) : null
  );
}

// src/client/main.jsx
var NS = "dsh-friday";
var PanelBoundary = class extends import_react8.default.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error) {
    console.error("dsh-friday: Inbox panel crashed", error);
  }
  render() {
    if (this.state.error) {
      return /* @__PURE__ */ import_react8.default.createElement("div", { className: "df-page" }, /* @__PURE__ */ import_react8.default.createElement("div", { className: "df-empty-state" }, "Friday Inbox failed: ", String(this.state.error?.message || this.state.error)));
    }
    return this.props.children;
  }
};
var STYLE_ID = "dsh-friday/styles";
var inject = ["slots", "locale", "layout", "uiWorkspace", "workspaces"];
function InboxGlyph({ size = 18, active = false }) {
  const stroke = active ? "var(--dsw-alias-brand-primary)" : "currentColor";
  return /* @__PURE__ */ import_react8.default.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", style: { display: "block" } }, /* @__PURE__ */ import_react8.default.createElement("path", { d: "M4.5 13.2 6.8 6.9A2.2 2.2 0 0 1 8.86 5.5h6.28a2.2 2.2 0 0 1 2.06 1.4l2.3 6.3v3.1a2.2 2.2 0 0 1-2.2 2.2H6.7a2.2 2.2 0 0 1-2.2-2.2v-3.1Z", stroke, strokeWidth: "1.5", strokeLinejoin: "round" }), /* @__PURE__ */ import_react8.default.createElement("path", { d: "M4.5 13.4h3.4l.8 1.6h6.6l.8-1.6h3.4", stroke, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ import_react8.default.createElement("path", { d: "m15.9 4.2.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5.5-1.3Z", fill: active ? "var(--dsw-alias-brand-primary)" : "currentColor", opacity: ".9" }));
}
function ensureStyle() {
  if (typeof document === "undefined") return () => {
  };
  let node = document.getElementById(STYLE_ID);
  if (node) return () => {
  };
  node = document.createElement("style");
  node.id = STYLE_ID;
  node.dataset.plugin = "dsh-friday";
  node.textContent = CSS;
  document.head.appendChild(node);
  return () => node.remove();
}
function parseHotkey(spec) {
  const parts = String(spec || "Alt+Space").split("+").map((part) => part.trim()).filter(Boolean);
  const key = parts.pop()?.toLowerCase() || "space";
  const mods = { alt: false, ctrl: false, meta: false, shift: false };
  for (const part of parts) {
    const p = part.toLowerCase();
    if (p === "alt" || p === "option" || p === "opt") mods.alt = true;
    else if (p === "ctrl" || p === "control") mods.ctrl = true;
    else if (p === "meta" || p === "cmd" || p === "command" || p === "super") mods.meta = true;
    else if (p === "shift") mods.shift = true;
  }
  return { key, ...mods };
}
function matchesHotkey(event, hotkey) {
  const codeMatches = hotkey.key === "space" ? event.code === "Space" : event.key.toLowerCase() === hotkey.key;
  return codeMatches && event.altKey === hotkey.alt && event.ctrlKey === hotkey.ctrl && event.metaKey === hotkey.meta && event.shiftKey === hotkey.shift;
}
function apply(ctx) {
  ctx.effect(() => ensureStyle(), "dsh-friday: styles");
  ctx.effect(() => () => window.removeEventListener("dsh-friday:config-changed", loadHotkey), "dsh-friday: hotkey config listener");
  ctx.effect(() => ctx.locale.register(NS, { en: en_default, zh: zh_default }), "dsh-friday: locale");
  const dictionary = String(navigator.language || "").toLowerCase().startsWith("zh") ? zh_default : en_default;
  const t = (key) => {
    const value = String(key).split(".").reduce((current, part) => current && typeof current === "object" ? current[part] : void 0, dictionary);
    return typeof value === "string" ? value : key;
  };
  runtime.layout = ctx.layout;
  runtime.uiWorkspace = ctx.uiWorkspace;
  runtime.workspaces = ctx.workspaces;
  let hotkey = parseHotkey("Alt+Space");
  const loadHotkey = async () => {
    try {
      const response = await fetch("/dsh-friday/api/v1/config", { credentials: "same-origin", headers: { "X-DSH-Friday": "1" } });
      if (!response.ok) return;
      const data = await response.json();
      if (data?.config?.hotkey) hotkey = parseHotkey(data.config.hotkey);
    } catch {
    }
  };
  loadHotkey();
  window.addEventListener("dsh-friday:config-changed", loadHotkey);
  ctx.effect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        if (document.querySelector(".df-modal-backdrop")) return;
        if (getState().overlayOpen) {
          event.preventDefault();
          closeOverlay();
        }
        return;
      }
      if (event.defaultPrevented) return;
      if (event.altKey && event.shiftKey && event.code === "Space") {
        event.preventDefault();
        event.stopPropagation();
        openInbox();
        return;
      }
      if (matchesHotkey(event, hotkey)) {
        event.preventDefault();
        event.stopPropagation();
        toggleOverlay();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, "dsh-friday: hotkey");
  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
    name: "sidebar.panellist",
    id: "inbox",
    order: 30,
    label: "Inbox",
    locale: NS
  }, (props) => /* @__PURE__ */ import_react8.default.createElement(InboxGlyph, { size: props?.size || 18, active: Boolean(props?.active) })));
  ctx.slots.inject("main", () => ctx.slots.register({
    name: "main",
    key: "inbox",
    locale: NS
  }, (props) => /* @__PURE__ */ import_react8.default.createElement(PanelBoundary, null, /* @__PURE__ */ import_react8.default.createElement(InboxPage, { ...props, t }))));
  ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register({
    name: "plugins.bundle.config",
    key: "dsh-friday",
    locale: NS
  }, () => /* @__PURE__ */ import_react8.default.createElement(InboxSettingsCard, { t })));
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "dsh-friday.quick",
    order: 40,
    locale: NS
  }, (props) => /* @__PURE__ */ import_react8.default.createElement(QuickOverlay, { ...props, t })));
}

    })(module, exports, require);
    return module.exports;
  },
});
