window.__ModuleLoader__.load({
  id: "dsh-friday",
  factory(require) {
    var module = { exports: {} };
    var exports = module.exports;
    (function (module, exports, require) {
"use strict";
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
var import_react9 = __toESM(require("react"), 1);

// locale/en.json
var en_default = {
  meta: {
    title: "Friday",
    description: "Quick answers with web-search-only tools, a durable Inbox, and compressed promotion into workspace tasks."
  },
  inbox: {
    title: "Inbox",
    subtitle: "Lightweight questions, kept outside your workspaces.",
    new: "New conversation",
    search: "Search questions and answers",
    find: "Find conversation",
    active: "Active",
    archived: "Upgraded archive",
    empty: "No conversations yet",
    emptyHint: "Press Option + Space to ask your first quick question.",
    clear: "Clear Inbox",
    cleanup: "Clear expired",
    continue: "Continue",
    upgrade: "Upgrade",
    delete: "Delete",
    images: "Images",
    upgraded: "Upgraded",
    openTask: "Open task",
    quick: "Quick panel",
    resumeUpgrade: "Finish upgrade"
  },
  quick: {
    placeholder: "Ask Friday",
    send: "Send",
    stop: "Stop",
    new: "New conversation",
    close: "Close",
    attach: "Add images",
    searching: "Searching the web\u2026",
    thinking: "Thinking\u2026",
    copy: "Copy",
    copied: "Copied",
    regenerate: "Regenerate",
    sources: "Sources",
    upgrade: "Upgrade to task",
    hint: "Enter to send \xB7 Shift + Enter for a new line \xB7 Esc to hide"
  },
  settings: {
    defaultModel: "Default model",
    defaultHint: "Used by the next new conversation. Existing conversations keep their model.",
    visionModel: "Vision model",
    visionHint: "Used automatically for image turns when the default model cannot read images.",
    inherit: "Inherit DSH default",
    none: "Not configured",
    hotkey: "Quick-open hotkey",
    hotkeyHint: "Default: Alt+Space (Option + Space on macOS). Works system-wide while DSH is running.",
    retention: "Retention (days)",
    retentionHint: "Expired active conversations are archived and removed from the Inbox. Upgraded archives are retained.",
    save: "Save settings",
    saved: "Settings saved",
    globalLimit: "The native Friday panel starts with DSH and supports a system-wide hotkey, free dragging, and macOS Liquid Glass."
  },
  dialog: {
    findTitle: "Find a conversation",
    upgradeTitle: "Upgrade to a full task",
    upgradeDescription: "Review and edit the compressed context. Creating a task only injects it and waits for your instruction; the Inbox original is archived.",
    context: "Compressed context",
    contextPlaceholder: "Generating compressed context\u2026",
    workspace: "Destination workspace",
    newWorkspace: "New workspace",
    cancel: "Cancel",
    confirm: "Compress and create",
    deleteTitle: "Delete this conversation?",
    deleteDescription: "It will disappear from Inbox and be archived in DSH. This cannot be undone from Inbox.",
    clearTitle: "Clear active conversations?",
    clearDescription: "All active Inbox conversations will be archived and hidden. Upgraded archives are not affected.",
    confirmDelete: "Delete"
  },
  state: {
    loading: "Loading\u2026",
    retry: "Retry",
    error: "Something went wrong",
    noResults: "No matching conversations",
    allTime: "Any time",
    today: "Last 24 hours",
    week: "Last 7 days",
    month: "Last 30 days"
  }
};

// locale/zh.json
var zh_default = {
  meta: {
    title: "Friday",
    description: "\u4EC5\u9650 Web Search \u7684\u5FEB\u6377\u95EE\u7B54\u3001\u6301\u4E45\u5316 Inbox\uFF0C\u4EE5\u53CA\u81EA\u52A8\u538B\u7F29\u5347\u7EA7\u4E3A\u5DE5\u4F5C\u533A\u6B63\u5F0F\u4EFB\u52A1\u3002"
  },
  inbox: {
    title: "Inbox",
    subtitle: "\u8F7B\u91CF\u95EE\u7B54\uFF0C\u72EC\u7ACB\u6C89\u6DC0\uFF0C\u4E0D\u8FDB\u5165\u5DE5\u4F5C\u533A\u3002",
    new: "\u65B0\u5BF9\u8BDD",
    search: "\u641C\u7D22\u95EE\u9898\u4E0E\u56DE\u7B54",
    find: "\u67E5\u627E\u5BF9\u8BDD",
    active: "\u6D3B\u52A8",
    archived: "\u5DF2\u5347\u7EA7\u5F52\u6863",
    empty: "\u8FD8\u6CA1\u6709\u5FEB\u6377\u5BF9\u8BDD",
    emptyHint: "\u6309 Option + Space\uFF0C\u5F00\u59CB\u7B2C\u4E00\u4E2A\u8F7B\u91CF\u95EE\u7B54\u3002",
    clear: "\u6E05\u7A7A Inbox",
    cleanup: "\u6E05\u7A7A\u8FC7\u671F",
    continue: "\u7EE7\u7EED\u95EE\u7B54",
    upgrade: "\u5347\u7EA7",
    delete: "\u5220\u9664",
    images: "\u542B\u56FE\u7247",
    upgraded: "\u5DF2\u5347\u7EA7",
    openTask: "\u6253\u5F00\u4EFB\u52A1",
    quick: "\u5FEB\u6377\u9762\u677F",
    resumeUpgrade: "\u5B8C\u6210\u5347\u7EA7"
  },
  quick: {
    placeholder: "\u5411 Friday \u63D0\u95EE",
    send: "\u53D1\u9001",
    stop: "\u505C\u6B62",
    new: "\u65B0\u5BF9\u8BDD",
    close: "\u6536\u8D77",
    attach: "\u6DFB\u52A0\u56FE\u7247",
    searching: "\u6B63\u5728\u8054\u7F51\u68C0\u7D22\u2026",
    thinking: "\u6B63\u5728\u601D\u8003\u2026",
    copy: "\u590D\u5236",
    copied: "\u5DF2\u590D\u5236",
    regenerate: "\u91CD\u65B0\u751F\u6210",
    sources: "\u5F15\u7528\u6765\u6E90",
    upgrade: "\u5347\u7EA7\u4E3A\u6B63\u5F0F\u4EFB\u52A1",
    hint: "Enter \u53D1\u9001 \xB7 Shift + Enter \u6362\u884C \xB7 Esc \u6536\u8D77"
  },
  settings: {
    defaultModel: "\u9ED8\u8BA4\u6A21\u578B",
    defaultHint: "\u4E0B\u4E00\u6B21\u65B0\u5BF9\u8BDD\u751F\u6548\uFF1B\u5DF2\u6709\u4F1A\u8BDD\u4FDD\u6301\u5404\u81EA\u6A21\u578B\u3002",
    visionModel: "\u89C6\u89C9\u6A21\u578B",
    visionHint: "\u9ED8\u8BA4\u6A21\u578B\u4E0D\u652F\u6301\u56FE\u7247\u65F6\uFF0C\u5E26\u56FE\u8F6E\u6B21\u81EA\u52A8\u6539\u7528\u6B64\u6A21\u578B\u3002",
    inherit: "\u7EE7\u627F DSH \u9ED8\u8BA4\u6A21\u578B",
    none: "\u672A\u914D\u7F6E",
    hotkey: "\u5FEB\u6377\u5524\u8D77\u952E",
    hotkeyHint: "\u9ED8\u8BA4 Alt+Space\uFF08macOS \u7684 Option + Space\uFF09\uFF1BDSH \u8FD0\u884C\u65F6\u53EF\u5728\u4EFB\u610F\u5E94\u7528\u4E2D\u5524\u8D77\u3002",
    retention: "\u4FDD\u7559\u671F\uFF08\u5929\uFF09",
    retentionHint: "\u5230\u671F\u7684\u6D3B\u52A8\u4F1A\u8BDD\u4F1A\u5F52\u6863\u5E76\u79FB\u51FA Inbox\uFF1B\u5DF2\u5347\u7EA7\u5F52\u6863\u4F1A\u8BDD\u4E0D\u53D7\u5F71\u54CD\u3002",
    save: "\u4FDD\u5B58\u8BBE\u7F6E",
    saved: "\u8BBE\u7F6E\u5DF2\u4FDD\u5B58",
    globalLimit: "\u539F\u751F Friday \u7A97\u53E3\u968F DSH \u542F\u52A8\uFF0C\u652F\u6301\u7CFB\u7EDF\u5168\u5C40\u5FEB\u6377\u952E\u3001\u4EFB\u610F\u62D6\u52A8\u4E0E macOS Liquid Glass\u3002"
  },
  dialog: {
    findTitle: "\u67E5\u627E\u5BF9\u8BDD",
    upgradeTitle: "\u5347\u7EA7\u4E3A\u6B63\u5F0F\u4EFB\u52A1",
    upgradeDescription: "\u67E5\u770B\u5E76\u7F16\u8F91\u538B\u7F29\u4E0A\u4E0B\u6587\u3002\u65B0\u5EFA\u540E\u53EA\u6CE8\u5165\u4E0A\u4E0B\u6587\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u6267\u884C\uFF1BInbox \u539F\u4F1A\u8BDD\u5C06\u8F6C\u5165\u5F52\u6863\u3002",
    context: "\u538B\u7F29\u540E\u7684\u4E0A\u4E0B\u6587",
    contextPlaceholder: "\u6B63\u5728\u751F\u6210\u538B\u7F29\u4E0A\u4E0B\u6587\u2026",
    workspace: "\u76EE\u6807\u5DE5\u4F5C\u533A",
    newWorkspace: "\u65B0\u5EFA\u5DE5\u4F5C\u533A",
    cancel: "\u53D6\u6D88",
    confirm: "\u538B\u7F29\u5E76\u65B0\u5EFA",
    deleteTitle: "\u5220\u9664\u8FD9\u6BB5\u5BF9\u8BDD\uFF1F",
    deleteDescription: "\u5BF9\u8BDD\u5C06\u4ECE Inbox \u79FB\u9664\u5E76\u5728 DSH \u4E2D\u5F52\u6863\uFF0C\u65E0\u6CD5\u5728 Inbox \u5185\u64A4\u9500\u3002",
    clearTitle: "\u6E05\u7A7A\u6D3B\u52A8\u5BF9\u8BDD\uFF1F",
    clearDescription: "\u6240\u6709\u6D3B\u52A8 Inbox \u4F1A\u8BDD\u5C06\u5F52\u6863\u5E76\u9690\u85CF\uFF1B\u5DF2\u5347\u7EA7\u5F52\u6863\u4F1A\u8BDD\u4E0D\u53D7\u5F71\u54CD\u3002",
    confirmDelete: "\u786E\u8BA4\u5220\u9664"
  },
  state: {
    loading: "\u6B63\u5728\u52A0\u8F7D\u2026",
    retry: "\u91CD\u8BD5",
    error: "\u51FA\u73B0\u4E86\u4E00\u70B9\u95EE\u9898",
    noResults: "\u6CA1\u6709\u5339\u914D\u7684\u5BF9\u8BDD",
    allTime: "\u5168\u90E8\u65F6\u95F4",
    today: "\u6700\u8FD1 24 \u5C0F\u65F6",
    week: "\u6700\u8FD1 7 \u5929",
    month: "\u6700\u8FD1 30 \u5929"
  }
};

// src/client/native-transport.js
var pending = /* @__PURE__ */ new Map();
var streams = /* @__PURE__ */ new Map();
var sequence = 0;
function channel() {
  const value = window.webkit?.messageHandlers?.fridayBridge;
  if (!value) throw new Error("Friday native bridge is unavailable");
  return value;
}
function nextId(prefix) {
  sequence += 1;
  return `${prefix}-${Date.now()}-${sequence}`;
}
function isNativeWindow() {
  return Boolean(window.__DSH_FRIDAY_NATIVE__);
}
function nativeBridge(method, params = {}) {
  const id = nextId("request");
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    channel().postMessage({ type: "request", id, method, params });
  });
}
function parseBody(options) {
  if (!options.body) return {};
  return typeof options.body === "string" ? JSON.parse(options.body) : options.body;
}
async function nativeRequest(path, options = {}) {
  const method = options.method || "GET";
  const body = parseBody(options);
  if (path === "/config") return nativeBridge(method === "PUT" ? "saveConfig" : "config", method === "PUT" ? body : {});
  if (path === "/inbox/clear") return nativeBridge("clear");
  if (path === "/inbox/cleanup") return nativeBridge("cleanup");
  if (path === "/chat/cancel") return nativeBridge("cancel", body);
  if (path === "/workspaces") return nativeBridge("workspaces");
  if (path === "/upgrade/preview") return nativeBridge("upgradePreview", body);
  if (path === "/upgrade") return nativeBridge("upgrade", body);
  if (path === "/native/task-ack") return nativeBridge("ackTask", body);
  if (path.startsWith("/inbox?")) {
    const query = new URL(path, "file:///native/").searchParams;
    return nativeBridge("inbox", Object.fromEntries(query.entries()));
  }
  const attachment = /^\/attachment\/([^/]+)\/([^/]+)$/.exec(path);
  if (attachment) return nativeBridge("attachment", { sessionId: decodeURIComponent(attachment[1]), attachmentId: decodeURIComponent(attachment[2]) });
  const conversation = /^\/inbox\/([^/]+)$/.exec(path);
  if (conversation) {
    const sessionId = decodeURIComponent(conversation[1]);
    return nativeBridge(method === "DELETE" ? "remove" : "conversation", { sessionId });
  }
  throw new Error(`Unsupported Friday native request: ${method} ${path}`);
}
function nativeStreamChat({ body, regenerate = false, signal, onEvent }) {
  const id = nextId("stream");
  return new Promise((resolve, reject) => {
    const finish = (error) => {
      if (!streams.has(id)) return;
      streams.delete(id);
      signal?.removeEventListener("abort", abort);
      if (error) reject(error);
      else resolve();
    };
    const abort = () => {
      channel().postMessage({ type: "abort", id });
      finish(new DOMException("Friday native stream was aborted", "AbortError"));
    };
    streams.set(id, { onEvent, finish });
    signal?.addEventListener("abort", abort, { once: true });
    if (signal?.aborted) {
      abort();
      return;
    }
    try {
      channel().postMessage({ type: "request", id, method: "chat", params: { body, regenerate } });
    } catch (error) {
      finish(error);
    }
  });
}
window.FridayNative = {
  resolve(id, ok, value) {
    const request2 = pending.get(id);
    if (!request2) return;
    pending.delete(id);
    if (ok) request2.resolve(value);
    else request2.reject(new Error(value?.message || String(value || "Friday native request failed")));
  },
  stream(id, event) {
    streams.get(id)?.onEvent?.(event);
  },
  streamEnd(id, message) {
    const stream = streams.get(id);
    if (!stream) return;
    stream.finish(message ? new Error(message) : null);
  },
  visibility(visible, sessionId) {
    window.dispatchEvent(new CustomEvent("dsh-friday:native-visibility", { detail: { visible: Boolean(visible), sessionId } }));
  }
};

// src/client/api.js
var BASE = "/dsh-friday/api/v1";
async function request(path, options = {}) {
  if (isNativeWindow()) return nativeRequest(path, options);
  const response = await fetch(BASE + path, {
    credentials: "same-origin",
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-DSH-Friday": "1",
      ...options.headers || {}
    }
  });
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {
    }
    throw new Error(message);
  }
  return response.json();
}
var api = {
  showNative: (sessionId) => request("/native/show", { method: "POST", body: JSON.stringify({ sessionId }) }),
  config: () => request("/config"),
  saveConfig: (config) => request("/config", { method: "PUT", body: JSON.stringify(config) }),
  inbox: ({ query = "", status = "active", from, to, limit = 200 } = {}) => {
    const params = new URLSearchParams({ status, limit: String(limit) });
    if (query) params.set("q", query);
    if (from != null) params.set("from", String(from));
    if (to != null) params.set("to", String(to));
    return request(`/inbox?${params}`);
  },
  conversation: (id) => request(`/inbox/${encodeURIComponent(id)}`),
  remove: (id) => request(`/inbox/${encodeURIComponent(id)}`, { method: "DELETE", body: "{}" }),
  clear: () => request("/inbox/clear", { method: "POST", body: "{}" }),
  cleanup: () => request("/inbox/cleanup", { method: "POST", body: "{}" }),
  cancel: (sessionId) => request("/chat/cancel", { method: "POST", body: JSON.stringify({ sessionId }) }),
  workspaces: () => request("/workspaces"),
  previewUpgrade: (sessionId) => request("/upgrade/preview", { method: "POST", body: JSON.stringify({ sessionId }) }),
  upgrade: (sessionId, workspaceId, summary, revision) => request("/upgrade", { method: "POST", body: JSON.stringify({ sessionId, workspaceId, summary, revision }) }),
  attachment: (sessionId, attachmentId) => request(`/attachment/${encodeURIComponent(sessionId)}/${encodeURIComponent(attachmentId)}`),
  pickDirectory: () => nativeBridge("pickDirectory"),
  createWorkspace: (path) => nativeBridge("createWorkspace", { path }),
  ackNativeTask: (sessionId) => request("/native/task-ack", { method: "POST", body: JSON.stringify({ sessionId }) })
};
async function streamChat({ body, regenerate = false, signal, onEvent }) {
  if (isNativeWindow()) return nativeStreamChat({ body, regenerate, signal, onEvent });
  const response = await fetch(`${BASE}${regenerate ? "/chat/regenerate" : "/chat"}`, {
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
      if (data.error) message = data.error;
    } catch {
    }
    throw new Error(message);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let boundary;
    while ((boundary = buffer.indexOf("\n\n")) >= 0) {
      const frame = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      const data = frame.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trimStart()).join("\n");
      if (!data) continue;
      try {
        onEvent?.(JSON.parse(data));
      } catch {
      }
    }
  }
}

// src/client/hotkey.js
function parseHotkey(spec = "Alt+Space") {
  const parts = String(spec).split("+").map((part) => part.trim()).filter(Boolean);
  const key = parts.pop()?.toLowerCase() || "space";
  const result = { key, alt: false, ctrl: false, meta: false, shift: false };
  for (const part of parts) {
    const modifier = part.toLowerCase();
    if (["alt", "option", "opt"].includes(modifier)) result.alt = true;
    else if (["ctrl", "control"].includes(modifier)) result.ctrl = true;
    else if (["meta", "cmd", "command", "super"].includes(modifier)) result.meta = true;
    else if (modifier === "shift") result.shift = true;
  }
  return result;
}
function matchesHotkey(event, hotkey) {
  const keyMatches = hotkey.key === "space" ? event.code === "Space" : String(event.key).toLowerCase() === hotkey.key;
  return keyMatches && event.altKey === hotkey.alt && event.ctrlKey === hotkey.ctrl && event.metaKey === hotkey.meta && event.shiftKey === hotkey.shift;
}

// src/client/inbox.jsx
var import_react6 = __toESM(require("react"), 1);

// src/client/composer.jsx
var import_react3 = __toESM(require("react"), 1);

// src/client/messages.jsx
var import_react2 = __toESM(require("react"), 1);

// src/client/markdown.jsx
var import_react = __toESM(require("react"), 1);
function safeHref(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
function Inline({ text }) {
  const nodes = [];
  const pattern = /(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\([^\s)]+\))/g;
  let cursor = 0;
  let match;
  let key = 0;
  while (match = pattern.exec(text)) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    const token = match[0];
    if (token.startsWith("`")) nodes.push(/* @__PURE__ */ import_react.default.createElement("code", { key: key++ }, token.slice(1, -1)));
    else if (token.startsWith("**")) nodes.push(/* @__PURE__ */ import_react.default.createElement("strong", { key: key++ }, token.slice(2, -2)));
    else if (token.startsWith("*")) nodes.push(/* @__PURE__ */ import_react.default.createElement("em", { key: key++ }, token.slice(1, -1)));
    else {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      const href = safeHref(link?.[2] || "");
      nodes.push(href ? /* @__PURE__ */ import_react.default.createElement("a", { key: key++, href, target: "_blank", rel: "noreferrer noopener" }, link[1]) : token);
    }
    cursor = match.index + token.length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, nodes);
}
function Table({ lines }) {
  const rows = lines.map((line) => line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
  const head = rows[0] || [];
  const body = rows.slice(2);
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "df-table-scroll" }, /* @__PURE__ */ import_react.default.createElement("table", null, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", null, head.map((cell, index) => /* @__PURE__ */ import_react.default.createElement("th", { key: index }, /* @__PURE__ */ import_react.default.createElement(Inline, { text: cell }))))), /* @__PURE__ */ import_react.default.createElement("tbody", null, body.map((row, rowIndex) => /* @__PURE__ */ import_react.default.createElement("tr", { key: rowIndex }, row.map((cell, index) => /* @__PURE__ */ import_react.default.createElement("td", { key: index }, /* @__PURE__ */ import_react.default.createElement(Inline, { text: cell }))))))));
}
function Markdown({ text = "" }) {
  const lines = String(text).replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let index = 0;
  let key = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (line.trimStart().startsWith("```")) {
      const language = line.trim().slice(3);
      const code = [];
      index += 1;
      while (index < lines.length && !lines[index].trimStart().startsWith("```")) code.push(lines[index++]);
      if (index < lines.length) index += 1;
      blocks.push(/* @__PURE__ */ import_react.default.createElement("pre", { key: key++, "data-language": language || void 0 }, /* @__PURE__ */ import_react.default.createElement("code", null, code.join("\n"))));
      continue;
    }
    if (/^\s*\|.+\|\s*$/.test(line) && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1] || "")) {
      const table = [line, lines[index + 1]];
      index += 2;
      while (index < lines.length && /^\s*\|.+\|\s*$/.test(lines[index])) table.push(lines[index++]);
      blocks.push(/* @__PURE__ */ import_react.default.createElement(Table, { key: key++, lines: table }));
      continue;
    }
    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) {
      const Tag = `h${Math.min(4, heading[1].length + 1)}`;
      blocks.push(/* @__PURE__ */ import_react.default.createElement(Tag, { key: key++ }, /* @__PURE__ */ import_react.default.createElement(Inline, { text: heading[2] })));
      index += 1;
      continue;
    }
    if (/^\s*>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) quote.push(lines[index++].replace(/^\s*>\s?/, ""));
      blocks.push(/* @__PURE__ */ import_react.default.createElement("blockquote", { key: key++ }, /* @__PURE__ */ import_react.default.createElement(Inline, { text: quote.join("\n") })));
      continue;
    }
    if (/^\s*(?:[-*+]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items = [];
      const itemPattern = ordered ? /^\s*\d+\.\s+/ : /^\s*[-*+]\s+/;
      while (index < lines.length && itemPattern.test(lines[index])) items.push(lines[index++].replace(itemPattern, ""));
      const Tag = ordered ? "ol" : "ul";
      blocks.push(/* @__PURE__ */ import_react.default.createElement(Tag, { key: key++ }, items.map((item, itemIndex) => /* @__PURE__ */ import_react.default.createElement("li", { key: itemIndex }, /* @__PURE__ */ import_react.default.createElement(Inline, { text: item })))));
      continue;
    }
    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(?:\s*```|\s*#{1,4}\s|\s*>\s?|\s*(?:[-*+]|\d+\.)\s+|\s*\|.+\|\s*)$/.test(lines[index])) {
      paragraph.push(lines[index++]);
    }
    blocks.push(/* @__PURE__ */ import_react.default.createElement("p", { key: key++ }, /* @__PURE__ */ import_react.default.createElement(Inline, { text: paragraph.join("\n") })));
  }
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "df-markdown" }, blocks);
}

// src/client/messages.jsx
function Icon({ name, size = 18 }) {
  const paths = {
    plus: "M12 5v14M5 12h14",
    close: "m6 6 12 12M18 6 6 18",
    search: "m21 21-4.4-4.4m2.4-5.1a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z",
    send: "m22 2-7 20-4-9-9-4 20-7Z",
    stop: "M7 7h10v10H7z",
    image: "M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm12.5 6-5-5L5 21",
    copy: "M8 8h12v12H8zM4 16V4h12",
    refresh: "M20 6v5h-5M4 18v-5h5m9.5-4A8 8 0 0 0 5 6.5L4 11m16 2-1 4.5A8 8 0 0 1 5.5 15",
    upgrade: "M12 19V5m-6 6 6-6 6 6M5 21h14",
    trash: "M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6",
    inbox: "M3 13 6 5h12l3 8v6H3v-6Zm0 1h5l2 3h4l2-3h5",
    chevron: "m9 18 6-6-6-6"
  };
  return /* @__PURE__ */ import_react2.default.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ import_react2.default.createElement("path", { d: paths[name] || paths.inbox, stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" }));
}
function Attachment({ sessionId, image }) {
  const [url, setUrl] = (0, import_react2.useState)(null);
  const [failed, setFailed] = (0, import_react2.useState)(false);
  const ref = image.attachment;
  (0, import_react2.useEffect)(() => {
    let active = true;
    setUrl(null);
    setFailed(false);
    api.attachment(sessionId, ref.attachmentId).then((value) => {
      if (active) setUrl(value.dataUrl);
    }).catch(() => {
      if (active) setFailed(true);
    });
    return () => {
      active = false;
    };
  }, [sessionId, ref.attachmentId]);
  return /* @__PURE__ */ import_react2.default.createElement("div", { className: "df-attachment" }, url ? /* @__PURE__ */ import_react2.default.createElement("img", { src: url, alt: ref.name || "Attached" }) : /* @__PURE__ */ import_react2.default.createElement("span", null, failed ? "Image unavailable" : "Loading image\u2026"));
}
function Sources({ sources = [], t }) {
  if (!sources.length) return null;
  return /* @__PURE__ */ import_react2.default.createElement("div", { className: "df-sources" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "df-sources-title" }, t("quick.sources")), /* @__PURE__ */ import_react2.default.createElement("ol", null, sources.filter((source) => safeHref(source.url)).map((source) => /* @__PURE__ */ import_react2.default.createElement("li", { key: source.url }, /* @__PURE__ */ import_react2.default.createElement("a", { href: safeHref(source.url), target: "_blank", rel: "noreferrer noopener" }, source.title || source.url), source.snippet ? /* @__PURE__ */ import_react2.default.createElement("span", null, source.snippet) : null))));
}
function MessageList({ conversation, sessionId, streamingText, streamingCitations, t }) {
  const messages = [...conversation?.messages || []];
  if (streamingText) messages.push({ id: "streaming", role: "assistant", text: streamingText, citations: streamingCitations });
  return /* @__PURE__ */ import_react2.default.createElement("div", { className: "df-messages" }, messages.map((message) => /* @__PURE__ */ import_react2.default.createElement("article", { className: `df-message ${message.role}`, key: `${message.id}-${message.seq || ""}` }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "df-message-role" }, message.role === "user" ? "You" : "Friday"), message.images?.length ? /* @__PURE__ */ import_react2.default.createElement("div", { className: "df-attachment-grid" }, message.images.map((image) => /* @__PURE__ */ import_react2.default.createElement(Attachment, { key: image.attachment.attachmentId, sessionId: sessionId || conversation.id, image }))) : null, message.text ? /* @__PURE__ */ import_react2.default.createElement(Markdown, { text: message.text }) : null, /* @__PURE__ */ import_react2.default.createElement(Sources, { sources: message.citations, t }), message.interrupted ? /* @__PURE__ */ import_react2.default.createElement("div", { className: "df-hint" }, "Interrupted") : null)));
}
function Modal({ title, description, children, onClose, className = "" }) {
  const dialogRef = import_react2.default.useRef(null);
  const onCloseRef = import_react2.default.useRef(onClose);
  onCloseRef.current = onClose;
  (0, import_react2.useEffect)(() => {
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    const focusable = () => [...dialog?.querySelectorAll('button, input, select, textarea, [tabindex="0"]') || []].filter((node) => !node.disabled);
    const preferred = dialog?.querySelector("[data-autofocus]");
    (preferred || focusable()[0])?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current?.();
      }
      if (event.key === "Tab") {
        const items = focusable();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      previous?.focus?.();
    };
  }, []);
  return /* @__PURE__ */ import_react2.default.createElement("div", { className: "df-modal-backdrop", onMouseDown: (event) => {
    if (event.target === event.currentTarget) onClose?.();
  } }, /* @__PURE__ */ import_react2.default.createElement("section", { className: `df-modal ${className}`, role: "dialog", "aria-modal": "true", "aria-label": title, ref: dialogRef }, /* @__PURE__ */ import_react2.default.createElement("header", { className: "df-modal-head" }, /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement("h2", null, title), description ? /* @__PURE__ */ import_react2.default.createElement("p", null, description) : null), /* @__PURE__ */ import_react2.default.createElement("button", { className: "df-icon-btn", type: "button", onClick: onClose, "aria-label": "Close" }, /* @__PURE__ */ import_react2.default.createElement(Icon, { name: "close" }))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "df-modal-body" }, children)));
}

// src/client/composer.jsx
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Could not read ${file.name || "image"}`));
    reader.readAsDataURL(file);
  });
}
function useImageDrafts(config, setError) {
  const [images, setImages] = (0, import_react3.useState)([]);
  const addFiles = (0, import_react3.useCallback)(async (files) => {
    if (!config) return;
    const limits = config.imageLimits || {};
    const allowed = limits.mediaTypes || ["image/png", "image/jpeg", "image/webp", "image/gif"];
    const candidates = [...files].filter((file) => file.type.startsWith("image/"));
    if (!candidates.length) return;
    setError(null);
    try {
      if (images.length + candidates.length > (limits.maxImagesPerMessage || 4)) {
        throw new Error(`At most ${limits.maxImagesPerMessage || 4} images are allowed per message`);
      }
      let total = images.reduce((sum, image) => sum + image.bytes, 0);
      const added = [];
      for (const file of candidates) {
        if (!allowed.includes(file.type)) throw new Error(`${file.name || "Image"} has an unsupported format`);
        if (file.size > (limits.maxImageBytes || 10 * 1024 * 1024)) throw new Error(`${file.name || "Image"} is too large`);
        total += file.size;
        if (total > (limits.maxMessageImageBytes || 20 * 1024 * 1024)) throw new Error("The combined image size is too large");
        added.push({ name: file.name || `pasted-${Date.now()}.png`, bytes: file.size, dataUrl: await readFile(file) });
      }
      setImages((current) => [...current, ...added]);
    } catch (fileError) {
      setError(fileError.message);
    }
  }, [config, images, setError]);
  return { images, setImages, addFiles };
}
function ImageDrafts({ images, setImages }) {
  if (!images.length) return null;
  return /* @__PURE__ */ import_react3.default.createElement("div", { className: "df-image-drafts" }, images.map((image, index) => /* @__PURE__ */ import_react3.default.createElement("div", { className: "df-image-draft", key: `${image.name}-${index}` }, /* @__PURE__ */ import_react3.default.createElement("img", { src: image.dataUrl, alt: image.name }), /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", onClick: () => setImages((current) => current.filter((_, itemIndex) => itemIndex !== index)), "aria-label": "Remove image" }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "close", size: 13 })))));
}
function ConversationComposer({
  t,
  draft,
  setDraft,
  images,
  addFiles,
  generating,
  archived,
  imageEnabled,
  onSubmit,
  onStop,
  onEscape,
  inputRef,
  className = ""
}) {
  const fileRef = (0, import_react3.useRef)(null);
  return /* @__PURE__ */ import_react3.default.createElement("div", { className: `df-composer ${className}` }, /* @__PURE__ */ import_react3.default.createElement(
    "input",
    {
      ref: fileRef,
      type: "file",
      accept: "image/png,image/jpeg,image/webp,image/gif",
      multiple: true,
      hidden: true,
      onChange: (event) => {
        void addFiles(event.target.files);
        event.target.value = "";
      }
    }
  ), /* @__PURE__ */ import_react3.default.createElement(
    "button",
    {
      className: "df-icon-btn df-composer-attach",
      type: "button",
      disabled: !imageEnabled || generating || archived,
      title: imageEnabled ? t("quick.attach") : t("settings.visionHint"),
      "aria-label": t("quick.attach"),
      onClick: () => fileRef.current?.click()
    },
    /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "plus" })
  ), /* @__PURE__ */ import_react3.default.createElement(
    "textarea",
    {
      ref: inputRef,
      rows: "1",
      value: draft,
      disabled: generating || archived,
      placeholder: t("quick.placeholder"),
      onChange: (event) => setDraft(event.target.value),
      onPaste: (event) => {
        const files = [...event.clipboardData.files];
        if (files.length) {
          event.preventDefault();
          void addFiles(files);
        }
      },
      onKeyDown: (event) => {
        if (event.key === "Escape" && onEscape) {
          event.preventDefault();
          event.stopPropagation();
          onEscape();
        }
        if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
          event.preventDefault();
          void onSubmit();
        }
      }
    }
  ), /* @__PURE__ */ import_react3.default.createElement(
    "button",
    {
      className: "df-send",
      type: "button",
      disabled: generating ? false : archived || !draft.trim() && !images.length,
      onClick: generating ? onStop : () => void onSubmit(),
      "aria-label": generating ? t("quick.stop") : t("quick.send")
    },
    /* @__PURE__ */ import_react3.default.createElement(Icon, { name: generating ? "stop" : "send" })
  ));
}

// src/client/store.js
var import_react4 = __toESM(require("react"), 1);
var state = {
  overlayOpen: false,
  inboxOpen: false,
  inboxSelection: null,
  sessionId: void 0,
  config: null,
  toast: null
};
var listeners = /* @__PURE__ */ new Set();
function getState() {
  return state;
}
function setState(patch) {
  state = { ...state, ...typeof patch === "function" ? patch(state) : patch };
  for (const listener of listeners) listener();
}
function useFridayState(selector = (value) => value) {
  return import_react4.default.useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => selector(state),
    () => selector(state)
  );
}
function openOverlay(sessionId) {
  setState({ inboxOpen: false, overlayOpen: true, sessionId });
}
function closeOverlay() {
  setState((current) => ({ overlayOpen: false, sessionId: current.sessionId }));
  runtime.native?.hide();
}
function newConversation() {
  setState({ inboxOpen: false, overlayOpen: true, sessionId: null });
}
function setConfig(config) {
  const previousHotkey = state.config?.config?.hotkey;
  setState({ config });
  if (previousHotkey !== config?.config?.hotkey) window.dispatchEvent(new Event("dsh-friday:config-changed"));
}
function markRecent(id) {
  if (!id) return;
  setState((current) => ({
    config: current.config ? { ...current.config, recent: { id, title: current.config.recent?.id === id ? current.config.recent.title : "", updatedAt: Date.now() } } : current.config
  }));
}
var toastSequence = 0;
function toast(message, tone = "info") {
  const id = ++toastSequence;
  setState({ toast: { id, message, tone } });
  setTimeout(() => {
    if (getState().toast?.id === id) setState({ toast: null });
  }, 3200);
}
var runtime = {
  layout: null,
  uiWorkspace: null,
  workspaces: null,
  native: null
};
function openInbox() {
  const inboxSelection = getState().sessionId || null;
  setState({ inboxOpen: true, overlayOpen: false, inboxSelection });
  if (runtime.native) {
    runtime.native.resize({ width: 910, height: 640 });
    return;
  }
  try {
    runtime.layout?.selectPanel("inbox");
  } catch (error) {
    console.error("dsh-friday: open Inbox", error);
  }
}
function openTask(sessionId) {
  try {
    if (runtime.native) {
      void runtime.native.openTask(sessionId).catch((error) => toast(error.message || String(error), "error"));
      closeOverlay();
      return;
    }
    runtime.uiWorkspace?.openSession(sessionId);
    runtime.layout?.selectPanel(null);
    setState({ overlayOpen: false });
  } catch (error) {
    console.error("dsh-friday: open upgraded task", error);
    toast(error.message || String(error), "error");
  }
}

// src/client/upgrade.jsx
var import_react5 = __toESM(require("react"), 1);
function UpgradeDialog({ sessionId, t, onClose }) {
  const [state2, setState2] = (0, import_react5.useState)({ loading: true, workspaces: [], selected: "", summary: "", error: null, upgrading: false });
  const load = async () => {
    try {
      const [preview, workspaceValue] = await Promise.all([api.previewUpgrade(sessionId), api.workspaces()]);
      setState2((current) => ({
        ...current,
        loading: false,
        summary: preview.summary,
        revision: preview.revision,
        workspaces: workspaceValue.workspaces,
        selected: current.selected || workspaceValue.workspaces[0]?.id || "",
        error: null
      }));
    } catch (error) {
      setState2((current) => ({ ...current, loading: false, error: error.message }));
    }
  };
  (0, import_react5.useEffect)(() => {
    void load();
  }, []);
  const createWorkspace = async () => {
    setState2((current) => ({ ...current, error: null }));
    try {
      const path = await runtime.uiWorkspace?.pickDirectory();
      if (!path) return;
      const workspace = await runtime.workspaces?.create({ path });
      if (!workspace) throw new Error("Workspace service is unavailable");
      const value = await api.workspaces();
      setState2((current) => ({ ...current, workspaces: value.workspaces, selected: workspace.id }));
    } catch (error) {
      setState2((current) => ({ ...current, error: error.message }));
    }
  };
  const confirm = async () => {
    if (!state2.selected || !state2.summary.trim()) return;
    setState2((current) => ({ ...current, upgrading: true, error: null }));
    try {
      const result = await api.upgrade(sessionId, state2.selected, state2.summary.trim(), state2.revision);
      toast(t("inbox.upgraded"), "success");
      onClose();
      openTask(result.sessionId);
    } catch (error) {
      setState2((current) => ({ ...current, upgrading: false, error: error.message }));
    }
  };
  const selectedWorkspace = state2.workspaces.find((workspace) => workspace.id === state2.selected);
  return /* @__PURE__ */ import_react5.default.createElement(Modal, { title: t("dialog.upgradeTitle"), description: t("dialog.upgradeDescription"), onClose: state2.upgrading ? () => {
  } : onClose, className: "df-upgrade-modal" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-form-row df-upgrade-context" }, /* @__PURE__ */ import_react5.default.createElement("label", { htmlFor: "df-upgrade-summary" }, t("dialog.context")), /* @__PURE__ */ import_react5.default.createElement(
    "textarea",
    {
      id: "df-upgrade-summary",
      value: state2.summary,
      disabled: state2.loading || state2.upgrading,
      placeholder: state2.loading ? t("state.loading") : t("dialog.contextPlaceholder"),
      onChange: (event) => setState2((current) => ({ ...current, summary: event.target.value }))
    }
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-form-row" }, /* @__PURE__ */ import_react5.default.createElement("label", { htmlFor: "df-workspace" }, t("dialog.workspace")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-inline df-workspace-picker" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-workspace-choice" }, /* @__PURE__ */ import_react5.default.createElement(
    "select",
    {
      id: "df-workspace",
      className: "df-input",
      value: state2.selected,
      disabled: state2.loading || state2.upgrading,
      onChange: (event) => setState2((current) => ({ ...current, selected: event.target.value }))
    },
    state2.workspaces.map((workspace) => /* @__PURE__ */ import_react5.default.createElement("option", { value: workspace.id, key: workspace.id }, workspace.title))
  ), selectedWorkspace ? /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-workspace-path", title: selectedWorkspace.path }, selectedWorkspace.path) : null), /* @__PURE__ */ import_react5.default.createElement("button", { className: "df-btn", type: "button", onClick: createWorkspace, disabled: state2.upgrading }, t("dialog.newWorkspace")))), state2.error ? /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-error", role: "alert" }, state2.error, /* @__PURE__ */ import_react5.default.createElement("button", { className: "df-btn", onClick: load }, t("state.retry"))) : null, /* @__PURE__ */ import_react5.default.createElement("div", { className: "df-modal-actions" }, /* @__PURE__ */ import_react5.default.createElement("button", { className: "df-btn", type: "button", onClick: onClose, disabled: state2.upgrading }, t("dialog.cancel")), /* @__PURE__ */ import_react5.default.createElement("button", { className: "df-btn primary", type: "button", onClick: confirm, disabled: !state2.selected || !state2.summary.trim() || state2.upgrading || state2.loading }, state2.upgrading ? t("state.loading") : t("dialog.confirm"))));
}

// src/client/inbox.jsx
function timeLabel(value) {
  if (!value) return "";
  const date = new Date(value);
  const today = /* @__PURE__ */ new Date();
  const sameDay = date.toDateString() === today.toDateString();
  return new Intl.DateTimeFormat(void 0, sameDay ? { hour: "2-digit", minute: "2-digit" } : { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}
function rangeStart(range) {
  if (range === "all") return void 0;
  const days = range === "today" ? 1 : range === "week" ? 7 : 30;
  return Date.now() - days * 24 * 60 * 60 * 1e3;
}
function FindDialog({ t, onClose, onSelect }) {
  const [query, setQuery] = (0, import_react6.useState)("");
  const [state2, setState2] = (0, import_react6.useState)({ loading: false, items: [], error: null });
  (0, import_react6.useEffect)(() => {
    let active = true;
    const timer = setTimeout(() => {
      setState2((current) => ({ ...current, loading: true }));
      api.inbox({ query, status: "all", limit: 100 }).then((value) => {
        if (active) setState2({ loading: false, items: value.items, error: null });
      }).catch((error) => {
        if (active) setState2({ loading: false, items: [], error: error.message });
      });
    }, 180);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);
  return /* @__PURE__ */ import_react6.default.createElement(Modal, { title: t("dialog.findTitle"), onClose, className: "df-find-modal" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-search-field" }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "search" }), /* @__PURE__ */ import_react6.default.createElement("input", { "data-autofocus": true, autoFocus: true, value: query, placeholder: t("inbox.search"), onChange: (event) => setQuery(event.target.value) })), state2.error ? /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-error" }, state2.error) : null, /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-find-results" }, !state2.loading && !state2.items.length ? /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-empty-small" }, t("state.noResults")) : null, state2.items.map((item) => /* @__PURE__ */ import_react6.default.createElement("button", { className: "df-find-row", type: "button", key: item.id, onClick: () => onSelect(item) }, /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-row-title" }, item.title), /* @__PURE__ */ import_react6.default.createElement("span", null, item.snippet || item.firstPrompt), /* @__PURE__ */ import_react6.default.createElement("small", null, timeLabel(item.updatedAt), item.archived ? ` \xB7 ${t("inbox.upgraded")}` : "")))));
}
function InboxPage({ t }) {
  const requestedId = useFridayState((state2) => state2.inboxSelection);
  const [query, setQuery] = (0, import_react6.useState)("");
  const [range, setRange] = (0, import_react6.useState)("all");
  const [status, setStatus] = (0, import_react6.useState)("active");
  const [items, setItems] = (0, import_react6.useState)([]);
  const [loading, setLoading] = (0, import_react6.useState)(true);
  const [error, setError] = (0, import_react6.useState)(null);
  const [selectedId, setSelectedId] = (0, import_react6.useState)(null);
  const [detail, setDetail] = (0, import_react6.useState)(null);
  const [findOpen, setFindOpen] = (0, import_react6.useState)(false);
  const [upgradeId, setUpgradeId] = (0, import_react6.useState)(null);
  const [confirm, setConfirm] = (0, import_react6.useState)(null);
  const [config, setLocalConfig] = (0, import_react6.useState)(null);
  const [draft, setDraft] = (0, import_react6.useState)("");
  const [generating, setGenerating] = (0, import_react6.useState)(false);
  const [streamingText, setStreamingText] = (0, import_react6.useState)("");
  const [citations, setCitations] = (0, import_react6.useState)([]);
  const [chatError, setChatError] = (0, import_react6.useState)(null);
  const requestSequence = (0, import_react6.useRef)(0);
  const selectedIdRef = (0, import_react6.useRef)(null);
  const abortRef = (0, import_react6.useRef)(null);
  const inputRef = (0, import_react6.useRef)(null);
  const scrollRef = (0, import_react6.useRef)(null);
  const { images, setImages, addFiles } = useImageDrafts(config, setChatError);
  (0, import_react6.useEffect)(() => {
    api.config().then(setLocalConfig).catch(() => {
    });
  }, []);
  const loadItems = (0, import_react6.useCallback)(async () => {
    const sequence2 = ++requestSequence.current;
    setLoading(true);
    try {
      const value = await api.inbox({ query, status, from: rangeStart(range) });
      if (sequence2 !== requestSequence.current) return;
      setItems(value.items);
      setError(null);
    } catch (requestError) {
      if (sequence2 === requestSequence.current) setError(requestError.message);
    } finally {
      if (sequence2 === requestSequence.current) setLoading(false);
    }
  }, [query, status, range]);
  (0, import_react6.useEffect)(() => {
    const timer = setTimeout(loadItems, 180);
    return () => clearTimeout(timer);
  }, [loadItems]);
  const select = (0, import_react6.useCallback)(async (id) => {
    abortRef.current?.abort();
    abortRef.current = null;
    selectedIdRef.current = id;
    setSelectedId(id);
    setDraft("");
    setImages([]);
    setGenerating(false);
    setStreamingText("");
    setCitations([]);
    setChatError(null);
    if (!id) {
      setDetail(null);
      return;
    }
    try {
      const value = await api.conversation(id);
      if (selectedIdRef.current !== id) return;
      setDetail(value.conversation);
      setError(null);
    } catch (requestError) {
      if (selectedIdRef.current === id) setError(requestError.message);
    }
  }, [setImages]);
  (0, import_react6.useEffect)(() => {
    if (requestedId) {
      const requested = items.find((item) => item.id === requestedId);
      if (requested) {
        void select(requestedId);
        setState({ inboxSelection: null });
      }
      return;
    }
    if (!items.length) {
      if (selectedIdRef.current) void select(null);
      return;
    }
    if (!selectedId || !items.some((item) => item.id === selectedId)) void select(items[0].id);
  }, [items, selectedId, select, requestedId]);
  (0, import_react6.useEffect)(() => {
    if (!requestedId) return;
    let current = true;
    api.conversation(requestedId).then(({ conversation }) => {
      if (!current) return;
      setQuery("");
      setRange("all");
      setStatus(conversation.archived || conversation.upgraded ? "archived" : "active");
      void loadItems();
    }).catch(() => {
      if (current) setState({ inboxSelection: null });
    });
    return () => {
      current = false;
    };
  }, [requestedId, loadItems]);
  (0, import_react6.useEffect)(() => {
    const timer = setInterval(loadItems, 4500);
    return () => clearInterval(timer);
  }, [loadItems]);
  const refreshDetail = (0, import_react6.useCallback)(async (id) => {
    if (!id) return;
    try {
      const value = await api.conversation(id);
      if (selectedIdRef.current === id) setDetail(value.conversation);
    } catch (requestError) {
      if (selectedIdRef.current === id) setChatError(requestError.message);
    }
  }, []);
  (0, import_react6.useEffect)(() => {
    if (!selectedId || generating) return;
    const timer = setInterval(() => {
      void refreshDetail(selectedId);
    }, 1200);
    return () => clearInterval(timer);
  }, [selectedId, detail?.running, generating, refreshDetail]);
  (0, import_react6.useEffect)(() => {
    if (!selectedId) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(timer);
  }, [selectedId]);
  (0, import_react6.useEffect)(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
  }, [draft, selectedId]);
  (0, import_react6.useEffect)(() => {
    const node = scrollRef.current;
    if (!node) return;
    if (node.scrollHeight - node.scrollTop - node.clientHeight < 180) node.scrollTop = node.scrollHeight;
  }, [detail?.messages?.length, streamingText]);
  const runStream = (0, import_react6.useCallback)(async () => {
    const id = selectedIdRef.current;
    const text = draft.trim();
    if (!id || generating || !text && !images.length) return;
    setGenerating(true);
    setChatError(null);
    setStreamingText("");
    setCitations([]);
    setDraft("");
    setImages([]);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      await streamChat({
        body: { sessionId: id, text, images, clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        signal: controller.signal,
        onEvent: (event) => {
          if (selectedIdRef.current !== id) return;
          if (event.type === "delta") setStreamingText((current) => current + event.text);
          else if (event.type === "citations") setCitations(event.sources || []);
          else if (event.type === "done") {
            setDetail(event.conversation || null);
            setStreamingText("");
            setGenerating(false);
          } else if (event.type === "error") {
            setChatError(event.message);
            setGenerating(false);
          }
        }
      });
      if (selectedIdRef.current === id) await refreshDetail(id);
    } catch (requestError) {
      if (requestError.name !== "AbortError" && selectedIdRef.current === id) setChatError(requestError.message);
      if (selectedIdRef.current === id) await refreshDetail(id);
    } finally {
      if (selectedIdRef.current === id) {
        setGenerating(false);
        setStreamingText("");
      }
      if (abortRef.current === controller) abortRef.current = null;
      void loadItems();
    }
  }, [generating, draft, images, refreshDetail, loadItems, setImages]);
  const stop = async () => {
    const id = selectedIdRef.current;
    if (!id) return;
    try {
      await api.cancel(id);
    } catch (requestError) {
      setChatError(requestError.message);
    }
    abortRef.current?.abort();
    abortRef.current = null;
    setGenerating(false);
    setStreamingText("");
    await refreshDetail(id);
  };
  const showQuickPanel = async () => {
    if (runtime.native || !config?.native?.pageReady) return openOverlay(detail.id);
    try {
      await api.showNative(detail.id);
    } catch (failure) {
      setError(failure.message);
    }
  };
  const resumeUpgrade = async () => {
    try {
      const task = await api.upgrade(detail.id, detail.upgradedWorkspaceId);
      await loadItems();
      await refreshDetail(detail.id);
      openTask(task.sessionId);
    } catch (failure) {
      setError(failure.message);
    }
  };
  const remove = async (id) => {
    try {
      await api.remove(id);
      setConfirm(null);
      abortRef.current?.abort();
      selectedIdRef.current = null;
      setDetail(null);
      setSelectedId(null);
      await loadItems();
      toast(t("inbox.delete"), "success");
    } catch (requestError) {
      setError(requestError.message);
    }
  };
  const clear = async () => {
    try {
      const value = await api.clear();
      setConfirm(null);
      await loadItems();
      toast(`${t("inbox.clear")} \xB7 ${value.count}`, "success");
    } catch (requestError) {
      setError(requestError.message);
    }
  };
  const cleanup = async () => {
    try {
      const value = await api.cleanup();
      await loadItems();
      toast(`${t("inbox.cleanup")} \xB7 ${value.count}`, "success");
    } catch (requestError) {
      setError(requestError.message);
    }
  };
  return /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-page" }, /* @__PURE__ */ import_react6.default.createElement("header", { className: "df-page-head" }, /* @__PURE__ */ import_react6.default.createElement("div", null, /* @__PURE__ */ import_react6.default.createElement("h1", null, t("inbox.title")), /* @__PURE__ */ import_react6.default.createElement("p", null, t("inbox.subtitle"))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-page-actions" }, /* @__PURE__ */ import_react6.default.createElement("button", { className: "df-btn", type: "button", onClick: () => setFindOpen(true) }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "search" }), t("inbox.find")), /* @__PURE__ */ import_react6.default.createElement("button", { className: "df-btn primary", type: "button", onClick: newConversation }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "plus" }), t("inbox.new")))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-toolbar" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-search-field" }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "search" }), /* @__PURE__ */ import_react6.default.createElement("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: t("inbox.search") })), /* @__PURE__ */ import_react6.default.createElement("select", { className: "df-input df-time-filter", "aria-label": "Time range", value: range, onChange: (event) => setRange(event.target.value) }, ["all", "today", "week", "month"].map((value) => /* @__PURE__ */ import_react6.default.createElement("option", { key: value, value }, t(`state.${value === "all" ? "allTime" : value}`)))), /* @__PURE__ */ import_react6.default.createElement("button", { className: "df-btn subtle", type: "button", onClick: cleanup }, t("inbox.cleanup")), status === "active" ? /* @__PURE__ */ import_react6.default.createElement("button", { className: "df-btn subtle danger", type: "button", disabled: !items.length, onClick: () => setConfirm("clear") }, t("inbox.clear")) : null), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-tabs", role: "tablist" }, /* @__PURE__ */ import_react6.default.createElement("button", { role: "tab", "aria-selected": status === "active", className: status === "active" ? "active" : "", onClick: () => setStatus("active") }, t("inbox.active")), /* @__PURE__ */ import_react6.default.createElement("button", { role: "tab", "aria-selected": status === "archived", className: status === "archived" ? "active" : "", onClick: () => setStatus("archived") }, t("inbox.archived"))), error ? /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-error df-page-error", role: "alert" }, error, /* @__PURE__ */ import_react6.default.createElement("button", { className: "df-btn", onClick: loadItems }, t("state.retry"))) : null, /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-inbox-layout" }, /* @__PURE__ */ import_react6.default.createElement("section", { className: "df-list", "aria-label": t("inbox.title") }, loading && !items.length ? /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-empty-small" }, t("state.loading")) : null, !loading && !items.length ? /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-empty-state" }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "inbox", size: 28 }), /* @__PURE__ */ import_react6.default.createElement("h2", null, query ? t("state.noResults") : t("inbox.empty")), /* @__PURE__ */ import_react6.default.createElement("p", null, t("inbox.emptyHint"))) : null, items.map((item) => /* @__PURE__ */ import_react6.default.createElement("button", { className: `df-inbox-row ${selectedId === item.id ? "selected" : ""}`, type: "button", key: item.id, onClick: () => select(item.id) }, /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-row-top" }, /* @__PURE__ */ import_react6.default.createElement("strong", null, item.title), /* @__PURE__ */ import_react6.default.createElement("time", null, timeLabel(item.updatedAt))), /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-row-summary" }, item.snippet || item.firstPrompt || item.title), /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-row-meta" }, /* @__PURE__ */ import_react6.default.createElement("span", null, item.model?.model || "Friday"), item.hasImage ? /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-badge" }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "image", size: 12 }), t("inbox.images")) : null, item.archived ? /* @__PURE__ */ import_react6.default.createElement("span", { className: "df-badge" }, t("inbox.upgraded")) : null)))), /* @__PURE__ */ import_react6.default.createElement("section", { className: "df-detail" }, !detail ? /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-empty-state" }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "chevron", size: 24 }), /* @__PURE__ */ import_react6.default.createElement("p", null, t("inbox.find"))) : /* @__PURE__ */ import_react6.default.createElement(import_react6.default.Fragment, null, /* @__PURE__ */ import_react6.default.createElement("header", { className: "df-detail-head" }, /* @__PURE__ */ import_react6.default.createElement("div", null, /* @__PURE__ */ import_react6.default.createElement("h2", null, detail.title), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-hint" }, timeLabel(detail.updatedAt), " \xB7 ", detail.model?.model || "Friday")), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-detail-actions" }, !detail.archived && !detail.upgraded && /* @__PURE__ */ import_react6.default.createElement("button", { className: "df-btn", onClick: showQuickPanel }, t("inbox.quick")), detail.archived && detail.upgraded && /* @__PURE__ */ import_react6.default.createElement("button", { className: "df-icon-btn danger", type: "button", onClick: () => setConfirm(detail.id), "aria-label": t("inbox.delete") }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "trash" })), detail.upgraded && !detail.archived ? /* @__PURE__ */ import_react6.default.createElement("button", { className: "df-btn", onClick: resumeUpgrade }, t("inbox.resumeUpgrade")) : detail.upgradedSessionId ? /* @__PURE__ */ import_react6.default.createElement("button", { className: "df-btn", type: "button", onClick: () => openTask(detail.upgradedSessionId) }, t("inbox.openTask"), /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "chevron" })) : /* @__PURE__ */ import_react6.default.createElement(import_react6.default.Fragment, null, /* @__PURE__ */ import_react6.default.createElement("button", { className: "df-btn primary", type: "button", disabled: detail.running || generating, onClick: () => setUpgradeId(detail.id) }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "upgrade" }), t("inbox.upgrade")), /* @__PURE__ */ import_react6.default.createElement("button", { className: "df-icon-btn danger", type: "button", onClick: () => setConfirm(detail.id), "aria-label": t("inbox.delete") }, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "trash" }))))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-detail-transcript", ref: scrollRef }, /* @__PURE__ */ import_react6.default.createElement(MessageList, { conversation: detail, sessionId: detail.id, streamingText: streamingText || detail.liveText, streamingCitations: citations, t }), generating && !streamingText ? /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-thinking" }, /* @__PURE__ */ import_react6.default.createElement("span", null), t("quick.thinking")) : null), /* @__PURE__ */ import_react6.default.createElement("footer", { className: "df-inline-chat" }, /* @__PURE__ */ import_react6.default.createElement(ImageDrafts, { images, setImages }), chatError ? /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-error", role: "alert" }, chatError) : null, detail.archived || detail.upgraded ? /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-hint" }, t("inbox.upgraded")) : null, /* @__PURE__ */ import_react6.default.createElement(
    ConversationComposer,
    {
      t,
      draft,
      setDraft,
      images,
      addFiles,
      generating: generating || detail.running,
      archived: Boolean(detail.archived || detail.upgraded),
      imageEnabled: Boolean(config && (config.defaultSupportsImages || config.visionAvailable)),
      inputRef,
      onSubmit: runStream,
      onStop: stop
    }
  ))))), findOpen ? /* @__PURE__ */ import_react6.default.createElement(FindDialog, { t, onClose: () => setFindOpen(false), onSelect: (item) => {
    setFindOpen(false);
    setQuery("");
    setRange("all");
    setStatus(item.archived ? "archived" : "active");
    setTimeout(() => {
      void select(item.id);
    }, 0);
  } }) : null, upgradeId ? /* @__PURE__ */ import_react6.default.createElement(UpgradeDialog, { sessionId: upgradeId, t, onClose: () => setUpgradeId(null) }) : null, confirm ? /* @__PURE__ */ import_react6.default.createElement(
    Modal,
    {
      title: confirm === "clear" ? t("dialog.clearTitle") : t("dialog.deleteTitle"),
      description: confirm === "clear" ? t("dialog.clearDescription") : t("dialog.deleteDescription"),
      onClose: () => setConfirm(null)
    },
    /* @__PURE__ */ import_react6.default.createElement("div", { className: "df-modal-actions" }, /* @__PURE__ */ import_react6.default.createElement("button", { className: "df-btn", onClick: () => setConfirm(null) }, t("dialog.cancel")), /* @__PURE__ */ import_react6.default.createElement("button", { className: "df-btn danger-solid", onClick: () => confirm === "clear" ? clear() : remove(confirm) }, t("dialog.confirmDelete")))
  ) : null);
}

// src/client/overlay.jsx
var import_react7 = __toESM(require("react"), 1);
function QuickOverlay({ t }) {
  const open = useFridayState((state2) => state2.overlayOpen);
  const sessionId = useFridayState((state2) => state2.sessionId);
  const config = useFridayState((state2) => state2.config);
  const [conversation, setConversation] = (0, import_react7.useState)(null);
  const [draft, setDraft] = (0, import_react7.useState)("");
  const [generating, setGenerating] = (0, import_react7.useState)(false);
  const [streamingText, setStreamingText] = (0, import_react7.useState)("");
  const [citations, setCitations] = (0, import_react7.useState)([]);
  const [error, setError] = (0, import_react7.useState)(null);
  const [upgradeOpen, setUpgradeOpen] = (0, import_react7.useState)(false);
  const [position, setPosition] = (0, import_react7.useState)(null);
  const abortRef = (0, import_react7.useRef)(null);
  const inputRef = (0, import_react7.useRef)(null);
  const scrollRef = (0, import_react7.useRef)(null);
  const dragRef = (0, import_react7.useRef)(null);
  const { images, setImages, addFiles } = useImageDrafts(config, setError);
  const refresh = (0, import_react7.useCallback)(async (id = getState().sessionId) => {
    if (!id) return null;
    try {
      const value = await api.conversation(id);
      if (getState().sessionId === id) setConversation(value.conversation);
      return value.conversation;
    } catch (requestError) {
      setError(requestError.message);
      return null;
    }
  }, []);
  (0, import_react7.useEffect)(() => {
    if (!open || config) return;
    api.config().then(setConfig).catch((requestError) => setError(requestError.message));
  }, [open, config]);
  (0, import_react7.useEffect)(() => {
    if (!open || !config || sessionId !== void 0) return;
    const recent = config.recent;
    const resume = recent && Date.now() - recent.updatedAt <= 5 * 60 * 1e3;
    setState({ sessionId: resume ? recent.id : null });
  }, [open, config, sessionId]);
  (0, import_react7.useEffect)(() => {
    if (!open) return;
    setError(null);
    if (!abortRef.current) {
      setStreamingText("");
      setCitations([]);
    }
    if (!sessionId) {
      setConversation(null);
      return;
    }
    void refresh(sessionId);
  }, [open, sessionId, refresh]);
  (0, import_react7.useEffect)(() => {
    if (!open || !sessionId || generating) return;
    const timer = setInterval(() => {
      void refresh();
    }, 1200);
    return () => clearInterval(timer);
  }, [open, sessionId, generating, refresh]);
  (0, import_react7.useEffect)(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(timer);
  }, [open, sessionId]);
  (0, import_react7.useEffect)(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
  }, [draft]);
  (0, import_react7.useEffect)(() => {
    const node = scrollRef.current;
    if (!node) return;
    if (node.scrollHeight - node.scrollTop - node.clientHeight < 180) node.scrollTop = node.scrollHeight;
  }, [conversation?.messages?.length, streamingText]);
  (0, import_react7.useEffect)(() => {
    if (!open || !runtime.native) return;
    const expanded2 = Boolean(conversation?.messages?.length || streamingText || generating);
    const height = upgradeOpen ? 700 : (expanded2 ? 480 : 106) + (images.length ? 68 : 0) + (error ? 42 : 0);
    runtime.native.resize({ width: upgradeOpen ? 730 : 490, height });
  }, [open, conversation?.messages?.length, streamingText, generating, images.length, error, upgradeOpen]);
  const hide = (0, import_react7.useCallback)(() => {
    closeOverlay();
    if (getState().sessionId) setTimeout(() => {
      void refresh();
    }, 300);
  }, [refresh]);
  const createNew = (0, import_react7.useCallback)(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setConversation(null);
    setGenerating(false);
    setStreamingText("");
    setCitations([]);
    setImages([]);
    setError(null);
    newConversation();
  }, []);
  const runStream = (0, import_react7.useCallback)(async (regenerate = false) => {
    if (generating || abortRef.current || sessionId === void 0) return;
    const text = draft.trim();
    if (!regenerate && !text && !images.length) return;
    setGenerating(true);
    setError(null);
    setStreamingText("");
    setCitations([]);
    const controller = new AbortController();
    abortRef.current = controller;
    let activeId = sessionId;
    if (!regenerate) {
      setDraft("");
      setImages([]);
    }
    try {
      await streamChat({
        body: regenerate ? { sessionId: activeId } : { sessionId: activeId, text, images, clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        regenerate,
        signal: controller.signal,
        onEvent: (event) => {
          if (event.type === "meta") {
            activeId = event.sessionId;
            markRecent(activeId);
            if (controller.signal.aborted) return;
            if (getState().sessionId !== activeId) setState({ sessionId: activeId });
          } else if (event.type === "delta") {
            setStreamingText((current) => current + event.text);
          } else if (event.type === "citations") {
            setCitations(event.sources || []);
          } else if (event.type === "done") {
            setConversation(event.conversation || null);
            setStreamingText("");
            setGenerating(false);
            api.config().then(setConfig).catch(() => {
            });
          } else if (event.type === "error") {
            setError(event.message);
            setGenerating(false);
          }
        }
      });
      if (activeId) await refresh(activeId);
    } catch (requestError) {
      if (requestError.name !== "AbortError") setError(requestError.message);
      if (activeId) await refresh(activeId);
    } finally {
      if (abortRef.current === controller) {
        setGenerating(false);
        setStreamingText("");
        abortRef.current = null;
      }
    }
  }, [generating, sessionId, draft, images, refresh]);
  const stop = async () => {
    if (!sessionId) return;
    try {
      await api.cancel(sessionId);
    } catch (requestError) {
      setError(requestError.message);
    }
    abortRef.current?.abort();
    abortRef.current = null;
    setGenerating(false);
    setStreamingText("");
    await refresh(sessionId);
  };
  const startDrag = (event) => {
    if (runtime.native || event.button !== 0 || event.target.closest("button, textarea, input, select, a, .df-quick-transcript, .df-modal")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const left = Math.max(8, Math.min(window.innerWidth - drag.width - 8, drag.left + event.clientX - drag.startX));
    const top = Math.max(8, Math.min(window.innerHeight - 46 - 8, drag.top + event.clientY - drag.startY));
    setPosition({ left, top });
  };
  const endDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  (0, import_react7.useEffect)(() => {
    const busy = generating || conversation?.running;
    const motion = error ? "error" : upgradeOpen ? "attention" : !busy ? "idle" : streamingText || conversation?.liveText ? "speaking" : "thinking";
    runtime.native?.activity(motion);
  }, [error, upgradeOpen, generating, conversation?.running, conversation?.liveText, streamingText]);
  if (!open) return null;
  const messages = conversation?.messages || [];
  const lastAssistant = [...messages].reverse().find((message) => message.role === "assistant");
  const imageEnabled = Boolean(config && (config.defaultSupportsImages || config.visionAvailable));
  const archived = Boolean(conversation?.archived || conversation?.upgraded);
  const expanded = Boolean(messages.length || streamingText || generating);
  const copy = async () => {
    if (!lastAssistant) return;
    try {
      if (runtime.native) await runtime.native.writeClipboard(lastAssistant.text);
      else await navigator.clipboard.writeText(lastAssistant.text);
      toast(t("quick.copied"), "success");
    } catch (clipboardError) {
      setError(clipboardError.message);
    }
  };
  return /* @__PURE__ */ import_react7.default.createElement("div", { className: `df-overlay-root${runtime.native ? " df-native" : ""}` }, /* @__PURE__ */ import_react7.default.createElement(
    "section",
    {
      className: `df-quick ${expanded ? "expanded" : "compact"}${position ? " positioned" : ""}`,
      "aria-label": "Friday quick conversation",
      style: position ? { left: position.left, top: position.top, transform: "none" } : void 0,
      onPointerDown: startDrag,
      onPointerMove: moveDrag,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onDragOver: (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      },
      onDrop: (event) => {
        event.preventDefault();
        void addFiles(event.dataTransfer.files);
      }
    },
    expanded || runtime.native ? /* @__PURE__ */ import_react7.default.createElement("header", { className: "df-quick-head" }, /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-quick-brand" }, /* @__PURE__ */ import_react7.default.createElement("span", { className: "df-brand-dot" }), /* @__PURE__ */ import_react7.default.createElement("strong", null, conversation?.title || "Friday")), /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-quick-actions" }, /* @__PURE__ */ import_react7.default.createElement("button", { className: "df-btn", type: "button", onClick: openInbox }, /* @__PURE__ */ import_react7.default.createElement(Icon, { name: "inbox", size: 14 }), "Inbox"), /* @__PURE__ */ import_react7.default.createElement("button", { className: "df-icon-btn", type: "button", onClick: createNew, title: t("quick.new"), "aria-label": t("quick.new") }, /* @__PURE__ */ import_react7.default.createElement(Icon, { name: "plus" })), sessionId && messages.length && !archived ? /* @__PURE__ */ import_react7.default.createElement("button", { className: "df-icon-btn", type: "button", disabled: generating || conversation?.running, onClick: () => setUpgradeOpen(true), title: t("quick.upgrade"), "aria-label": t("quick.upgrade") }, /* @__PURE__ */ import_react7.default.createElement(Icon, { name: "upgrade" })) : null, /* @__PURE__ */ import_react7.default.createElement("button", { className: "df-icon-btn", type: "button", onClick: hide, title: t("quick.close"), "aria-label": t("quick.close") }, /* @__PURE__ */ import_react7.default.createElement(Icon, { name: "close" })))) : null,
    expanded ? /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-quick-transcript", ref: scrollRef }, /* @__PURE__ */ import_react7.default.createElement(MessageList, { conversation, sessionId, streamingText: streamingText || conversation?.liveText, streamingCitations: citations, t }), generating && !streamingText ? /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-thinking", "aria-label": t("quick.thinking") }, /* @__PURE__ */ import_react7.default.createElement("span", null)) : null) : null,
    lastAssistant && !generating ? /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-answer-actions" }, /* @__PURE__ */ import_react7.default.createElement("button", { type: "button", onClick: copy, title: t("quick.copy"), "aria-label": t("quick.copy") }, /* @__PURE__ */ import_react7.default.createElement(Icon, { name: "copy", size: 15 })), /* @__PURE__ */ import_react7.default.createElement("button", { type: "button", onClick: () => void runStream(true), title: t("quick.regenerate"), "aria-label": t("quick.regenerate") }, /* @__PURE__ */ import_react7.default.createElement(Icon, { name: "refresh", size: 15 }))) : null,
    /* @__PURE__ */ import_react7.default.createElement(ImageDrafts, { images, setImages }),
    error ? /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-error df-quick-error", role: "alert" }, error) : null,
    archived ? /* @__PURE__ */ import_react7.default.createElement("div", { className: "df-hint df-quick-error" }, t("inbox.upgraded")) : null,
    /* @__PURE__ */ import_react7.default.createElement(
      ConversationComposer,
      {
        t,
        draft,
        setDraft,
        images,
        addFiles,
        generating: generating || Boolean(conversation?.running),
        archived,
        imageEnabled,
        inputRef,
        onSubmit: () => runStream(false),
        onStop: stop,
        onEscape: hide
      }
    )
  ), upgradeOpen && sessionId ? /* @__PURE__ */ import_react7.default.createElement(UpgradeDialog, { sessionId, t, onClose: () => setUpgradeOpen(false) }) : null);
}

// src/client/settings.jsx
var import_react8 = __toESM(require("react"), 1);
var modelValue = (model) => model ? `${model.provider}\0${model.model}` : "";
var parseModel = (value) => {
  if (!value) return null;
  const [provider, model] = value.split("\0");
  return provider && model ? { provider, model } : null;
};
function SettingsForm({ t, view = "page" }) {
  const [state2, setState2] = (0, import_react8.useState)({ loading: true, models: [], native: null, error: null, saving: false });
  const [draft, setDraft] = (0, import_react8.useState)(null);
  (0, import_react8.useEffect)(() => {
    let active = true;
    api.config().then((data) => {
      if (!active) return;
      setState2({ loading: false, models: data.models || [], native: data.native || null, error: null, saving: false });
      setDraft({
        defaultModel: modelValue(data.config.defaultModel),
        visionModel: modelValue(data.config.visionModel),
        hotkey: data.config.hotkey,
        retentionDays: data.config.retentionDays
      });
    }).catch((error) => {
      if (!active) return;
      setState2((current) => ({ ...current, loading: false, error: error.message }));
      setDraft((current) => current || { defaultModel: "", visionModel: "", hotkey: "Alt+Space", retentionDays: 30 });
    });
    return () => {
      active = false;
    };
  }, []);
  if (view === "summary") return /* @__PURE__ */ import_react8.default.createElement("span", null, t("meta.description"));
  if (state2.loading) return /* @__PURE__ */ import_react8.default.createElement("div", { className: "df-settings-block" }, t("state.loading"));
  if (!draft) return /* @__PURE__ */ import_react8.default.createElement("div", { className: "df-error" }, state2.error || t("state.error"));
  const update = (patch) => setDraft((current) => ({ ...current, ...patch }));
  const save = async () => {
    setState2((current) => ({ ...current, saving: true, error: null }));
    try {
      const value = await api.saveConfig({
        defaultModel: parseModel(draft.defaultModel),
        visionModel: parseModel(draft.visionModel),
        hotkey: draft.hotkey,
        retentionDays: Number(draft.retentionDays)
      });
      const data = await api.config();
      setConfig(data);
      setState2((current) => ({ ...current, native: data.native || null, saving: false }));
      toast(t("settings.saved"), "success");
    } catch (error) {
      setState2((current) => ({ ...current, saving: false, error: error.message }));
    }
  };
  return /* @__PURE__ */ import_react8.default.createElement("div", { className: "df-settings-block" }, /* @__PURE__ */ import_react8.default.createElement("div", { className: "df-form-row" }, /* @__PURE__ */ import_react8.default.createElement("label", { htmlFor: "df-default-model" }, t("settings.defaultModel")), /* @__PURE__ */ import_react8.default.createElement("select", { id: "df-default-model", className: "df-input", value: draft.defaultModel, onChange: (event) => update({ defaultModel: event.target.value }) }, /* @__PURE__ */ import_react8.default.createElement("option", { value: "" }, t("settings.inherit")), state2.models.map((model) => /* @__PURE__ */ import_react8.default.createElement("option", { key: modelValue(model), value: modelValue(model) }, model.label))), /* @__PURE__ */ import_react8.default.createElement("span", { className: "df-hint" }, t("settings.defaultHint"))), /* @__PURE__ */ import_react8.default.createElement("div", { className: "df-form-row" }, /* @__PURE__ */ import_react8.default.createElement("label", { htmlFor: "df-vision-model" }, t("settings.visionModel")), /* @__PURE__ */ import_react8.default.createElement("select", { id: "df-vision-model", className: "df-input", value: draft.visionModel, onChange: (event) => update({ visionModel: event.target.value }) }, /* @__PURE__ */ import_react8.default.createElement("option", { value: "" }, t("settings.none")), state2.models.map((model) => /* @__PURE__ */ import_react8.default.createElement("option", { key: modelValue(model), value: modelValue(model) }, model.label))), /* @__PURE__ */ import_react8.default.createElement("span", { className: "df-hint" }, t("settings.visionHint"))), /* @__PURE__ */ import_react8.default.createElement("div", { className: "df-settings-grid" }, /* @__PURE__ */ import_react8.default.createElement("div", { className: "df-form-row" }, /* @__PURE__ */ import_react8.default.createElement("label", { htmlFor: "df-hotkey" }, t("settings.hotkey")), /* @__PURE__ */ import_react8.default.createElement("input", { id: "df-hotkey", className: "df-input", value: draft.hotkey, onChange: (event) => update({ hotkey: event.target.value }) }), /* @__PURE__ */ import_react8.default.createElement("span", { className: "df-hint" }, t("settings.hotkeyHint"))), /* @__PURE__ */ import_react8.default.createElement("div", { className: "df-form-row" }, /* @__PURE__ */ import_react8.default.createElement("label", { htmlFor: "df-retention" }, t("settings.retention")), /* @__PURE__ */ import_react8.default.createElement(
    "input",
    {
      id: "df-retention",
      className: "df-input",
      type: "number",
      min: "1",
      max: "365",
      value: draft.retentionDays,
      onChange: (event) => update({ retentionDays: event.target.value })
    }
  ), /* @__PURE__ */ import_react8.default.createElement("span", { className: "df-hint" }, t("settings.retentionHint")))), /* @__PURE__ */ import_react8.default.createElement("p", { className: `df-hint df-capability-note${state2.native?.hotkeyError || state2.native?.lastError ? " df-error" : ""}` }, state2.native?.hotkeyError || state2.native?.lastError || t("settings.globalLimit")), state2.error ? /* @__PURE__ */ import_react8.default.createElement("div", { className: "df-error", role: "alert" }, state2.error) : null, /* @__PURE__ */ import_react8.default.createElement("div", { className: "df-settings-actions" }, /* @__PURE__ */ import_react8.default.createElement("button", { className: "df-btn primary", type: "button", onClick: save, disabled: state2.saving }, state2.saving ? t("state.loading") : t("settings.save"))));
}

// src/client/styles.js
var CSS = String.raw`
.df-page, .df-quick, .df-modal, .df-settings-block, .df-toast { box-sizing: border-box; font: inherit; color: var(--dsw-alias-label-primary); }
.df-page *, .df-quick *, .df-modal *, .df-settings-block * { box-sizing: border-box; }
.df-page button, .df-quick button, .df-modal button, .df-settings-block button,
.df-page input, .df-page textarea, .df-quick textarea, .df-modal input, .df-modal select, .df-settings-block input, .df-settings-block select { font: inherit; }
.df-page h1, .df-page h2, .df-modal h2, .df-quick p { margin: 0; }
.df-page h1 { font-size: 22px; line-height: 1.3; letter-spacing: -.02em; }
.df-page-head p { margin: 5px 0 0; color: var(--dsw-alias-label-secondary); font-size: 13px; }
.df-btn, .df-icon-btn, .df-send, .df-answer-actions button, .df-tabs button {
  border: 1px solid var(--dsw-alias-border-l1); color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-1); border-radius: 8px; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  transition: background .15s ease, border-color .15s ease, transform .15s ease;
}
.df-btn { min-height: 32px; padding: 6px 11px; font-size: 12px; white-space: nowrap; }
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
.df-hint { color: var(--dsw-alias-label-secondary); font-size: 11px; line-height: 1.5; }
.df-error { color: var(--dsw-alias-state-error-primary); font-size: 12px; line-height: 1.5; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.df-inline { display: flex; align-items: center; gap: 8px; }
.df-form-row { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
.df-form-row > label { font-size: 12px; font-weight: 600; }

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
.df-tabs button { border: 0; border-bottom: 2px solid transparent; border-radius: 0; background: transparent; padding: 9px 12px 8px; color: var(--dsw-alias-label-secondary); font-size: 12px; }
.df-tabs button.active { color: var(--dsw-alias-label-primary); border-bottom-color: var(--dsw-alias-brand-primary); }
.df-page-error { margin: 10px 26px 0; }
.df-inbox-layout { flex: 1; min-height: 0; display: flex; }
.df-list { width: clamp(270px, 33%, 360px); flex: 0 0 auto; overflow-y: auto; border-right: 1px solid var(--dsw-alias-border-l1); padding: 10px; }
.df-inbox-row { width: 100%; display: flex; flex-direction: column; gap: 7px; text-align: left; padding: 12px; margin-bottom: 4px; border: 1px solid transparent; border-radius: 10px; background: transparent; color: var(--dsw-alias-label-primary); cursor: pointer; }
.df-inbox-row:hover { background: var(--dsw-alias-bg-layer-1); }
.df-inbox-row.selected { background: var(--dsw-alias-bg-layer-2); border-color: var(--dsw-alias-border-l1); }
.df-row-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.df-row-title, .df-row-top strong { font-size: 13px; font-weight: 600; line-height: 1.45; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.df-row-top time { flex: 0 0 auto; color: var(--dsw-alias-label-secondary); font-size: 10px; padding-top: 2px; }
.df-row-summary { color: var(--dsw-alias-label-secondary); font-size: 11px; line-height: 1.55; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.df-row-meta { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; color: var(--dsw-alias-label-secondary); font-size: 10px; }
.df-badge { display: inline-flex; align-items: center; gap: 3px; padding: 2px 5px; border-radius: 5px; background: var(--dsw-alias-bg-layer-1); border: 1px solid var(--dsw-alias-border-l1); }
.df-detail { flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column; background: var(--dsw-alias-bg-layer-1); }
.df-detail-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; padding: 17px 20px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.df-detail-head h2 { font-size: 15px; line-height: 1.45; margin-bottom: 4px; }
.df-detail-transcript { flex: 1; min-height: 0; overflow-y: auto; padding: 18px 20px 24px; }
.df-inline-chat { flex: 0 0 auto; padding: 8px 20px 14px; border-top: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); }
.df-inline-chat .df-composer { margin: 0; }
.df-inline-chat .df-image-drafts { padding: 0 0 8px; }
.df-inline-chat .df-error, .df-inline-chat > .df-hint { margin: 0 0 7px; }
.df-empty-state { min-height: 220px; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 10px; color: var(--dsw-alias-label-secondary); padding: 30px; }
.df-empty-state h2 { font-size: 14px; color: var(--dsw-alias-label-primary); }
.df-empty-state p { margin: 0; font-size: 12px; }
.df-empty-small { padding: 36px 16px; text-align: center; color: var(--dsw-alias-label-secondary); font-size: 12px; }

/* Quick conversation */
.df-overlay-root { position: fixed; inset: 0; z-index: 80; pointer-events: none; }
.df-quick { --dsw-alias-bg-layer-1: #fff; --dsw-alias-bg-overlay: rgba(246, 246, 249, .76); --dsw-alias-label-primary: rgba(28, 28, 32, .94); --dsw-alias-label-secondary: rgba(60, 60, 68, .64); pointer-events: auto; position: absolute; top: max(56px, 8vh); left: 50%; transform: translateX(-50%); width: min(720px, calc(100vw - 36px)); max-height: min(760px, 84vh); display: flex; flex-direction: column; overflow: hidden; border: 1px solid color-mix(in srgb, var(--dsw-alias-border-l2) 34%, transparent); border-radius: 18px; background: var(--dsw-alias-bg-layer-1); box-shadow: 0 0 0 8px color-mix(in srgb, var(--dsw-alias-bg-overlay) 22%, transparent), 0 18px 60px color-mix(in srgb, var(--dsw-alias-label-primary) 15%, transparent); animation: df-enter .16s ease-out; }
.df-quick.positioned { animation: df-fade .12s ease-out; }
.df-quick.compact { max-height: none; }
.df-quick.expanded { height: min(560px, calc(100vh - 72px)); min-height: 0; }
@keyframes df-enter { from { opacity: 0; transform: translate(-50%, -6px) scale(.99); } to { opacity: 1; transform: translate(-50%, 0) scale(1); } }
@keyframes df-fade { from { opacity: 0; } to { opacity: 1; } }
.df-quick-head { min-height: 46px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 7px 9px 7px 15px; border-bottom: 1px solid color-mix(in srgb, var(--dsw-alias-border-l1) 72%, transparent); cursor: grab; touch-action: none; }
.df-quick-head:active { cursor: grabbing; }
.df-quick-head button { cursor: pointer; }
.df-quick-brand { min-width: 0; display: flex; align-items: center; gap: 9px; }
.df-quick-brand strong { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 12px; font-weight: 600; }
.df-brand-dot { width: 8px; height: 8px; flex: 0 0 auto; border-radius: 50%; background: var(--dsw-alias-brand-primary); box-shadow: 0 0 0 4px color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent); }
.df-quick-actions { display: flex; align-items: center; gap: 2px; }
.df-quick-empty { padding: 24px 22px 15px; text-align: center; color: var(--dsw-alias-label-secondary); }
.df-quick-empty span { color: var(--dsw-alias-brand-primary); font-size: 22px; font-weight: 650; letter-spacing: -.03em; }
.df-quick-empty p { margin-top: 5px; font-size: 12px; }
.df-quick-transcript { flex: 1; min-height: 120px; overflow-y: auto; padding: 12px 15px; }
.df-composer { display: flex; align-items: center; gap: 8px; margin: 8px 10px 6px; padding: 6px; border: 1px solid color-mix(in srgb, var(--dsw-alias-border-l2) 82%, transparent); border-radius: 13px; background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 76%, transparent); }
.df-composer:focus-within { border-color: var(--dsw-alias-brand-primary); }
.df-composer button { line-height: 0; }
.df-composer button svg { display: block; }
.df-composer-attach { width: 34px; height: 34px; flex: 0 0 34px; }
.df-composer textarea { flex: 1; min-width: 0; min-height: 34px; max-height: 140px; resize: none; overflow-y: auto; border: 0; outline: 0; padding: 7px 4px; background: transparent; color: var(--dsw-alias-label-primary); line-height: 20px; }
.df-composer textarea:focus-visible { outline: 0; }
.df-composer textarea::placeholder { color: color-mix(in srgb, var(--dsw-alias-label-secondary) 62%, transparent); }
.df-search-field input::placeholder { color: var(--dsw-alias-label-secondary); }
.df-quick-error { margin: 5px 14px; }
.df-thinking { display: flex; align-items: center; gap: 8px; padding: 14px 4px; color: var(--dsw-alias-label-secondary); font-size: 12px; }
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
.df-native .df-quick.compact { height: auto; }
.df-native .df-quick.expanded { height: 560px; max-height: calc(100vh - 16px); }
.df-native .df-quick-head { flex: 0 0 46px; }
.df-native .df-modal-backdrop { background: color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent); }
.df-native-fatal { margin: 24px; padding: 14px; border-radius: 12px; color: var(--dsw-alias-state-error-primary); background: var(--dsw-alias-bg-overlay); font: 13px/1.5 -apple-system, BlinkMacSystemFont, sans-serif; }

/* Messages and safe Markdown */
.df-messages { display: flex; flex-direction: column; gap: 15px; }
.df-message { min-width: 0; padding: 0 2px; }
.df-message.user { padding: 11px 13px; border-radius: 11px; background: color-mix(in srgb, var(--dsw-alias-brand-primary) 8%, var(--dsw-alias-bg-layer-1)); border: 1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 15%, var(--dsw-alias-border-l1)); }
.df-message.assistant { padding: 2px 3px; }
.df-message-role { margin-bottom: 6px; color: var(--dsw-alias-label-secondary); font-size: 9px; font-weight: 650; text-transform: uppercase; letter-spacing: .08em; }
.df-markdown { font-size: 12px; line-height: 1.7; overflow-wrap: anywhere; }
.df-markdown p { margin: 0 0 9px; white-space: pre-wrap; }
.df-markdown p:last-child { margin-bottom: 0; }
.df-markdown h2, .df-markdown h3, .df-markdown h4 { margin: 15px 0 7px; line-height: 1.4; }
.df-markdown h2 { font-size: 16px; } .df-markdown h3 { font-size: 14px; } .df-markdown h4 { font-size: 12px; }
.df-markdown ul, .df-markdown ol { margin: 6px 0 10px; padding-left: 22px; }
.df-markdown li { margin: 3px 0; }
.df-markdown code { padding: 1px 4px; border-radius: 4px; background: var(--dsw-alias-bg-layer-2); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .92em; }
.df-markdown pre { margin: 10px 0; padding: 12px; overflow-x: auto; border: 1px solid var(--dsw-alias-border-l1); border-radius: 9px; background: var(--dsw-alias-bg-base); }
.df-markdown pre code { padding: 0; background: transparent; line-height: 1.55; }
.df-markdown a, .df-sources a { color: var(--dsw-alias-brand-primary); text-decoration: none; }
.df-markdown a:hover, .df-sources a:hover { text-decoration: underline; }
.df-markdown blockquote { margin: 9px 0; padding: 4px 10px; border-left: 3px solid var(--dsw-alias-border-l2); color: var(--dsw-alias-label-secondary); white-space: pre-wrap; }
.df-table-scroll { margin: 10px 0; overflow-x: auto; border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; }
.df-markdown table { width: 100%; border-collapse: collapse; font-size: 11px; }
.df-markdown th, .df-markdown td { padding: 7px 9px; text-align: left; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.df-markdown th { background: var(--dsw-alias-bg-layer-2); font-weight: 600; }
.df-markdown tr:last-child td { border-bottom: 0; }
.df-sources { margin-top: 10px; padding-top: 9px; border-top: 1px solid var(--dsw-alias-border-l1); }
.df-sources-title { color: var(--dsw-alias-label-secondary); font-size: 10px; font-weight: 600; }
.df-sources ol { margin: 6px 0 0; padding-left: 18px; }
.df-sources li { margin: 5px 0; font-size: 10px; }
.df-sources li span { display: block; margin-top: 2px; color: var(--dsw-alias-label-secondary); line-height: 1.45; }
.df-attachment-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 9px; }
.df-attachment { width: min(240px, 100%); min-height: 70px; display: grid; place-items: center; overflow: hidden; border: 1px solid var(--dsw-alias-border-l1); border-radius: 9px; background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); font-size: 10px; }
.df-attachment img { display: block; width: 100%; max-height: 320px; object-fit: contain; }

/* Dialogs and settings */
.df-modal-backdrop { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 22px; pointer-events: auto; background: color-mix(in srgb, var(--dsw-alias-label-primary) 20%, transparent); }
.df-modal { width: min(580px, 100%); max-height: min(740px, 90vh); display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2); border-radius: 14px; background: var(--dsw-alias-bg-overlay); box-shadow: 0 20px 70px color-mix(in srgb, var(--dsw-alias-label-primary) 20%, transparent); }
.df-modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 18px 18px 13px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.df-modal-head h2 { font-size: 15px; }
.df-modal-head p { margin: 6px 0 0; color: var(--dsw-alias-label-secondary); font-size: 11px; line-height: 1.55; }
.df-modal-body { overflow-y: auto; padding: 17px 18px; }
.df-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }
.df-upgrade-modal { width: min(720px, 100%); }
.df-upgrade-context textarea { width: 100%; min-height: 260px; max-height: 420px; resize: vertical; padding: 13px 14px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; outline: none; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); font: 13px/1.65 ui-monospace, SFMono-Regular, Menlo, monospace; }
.df-upgrade-context textarea:focus { border-color: var(--dsw-alias-brand-primary); }
.df-workspace-picker { align-items: flex-start; }
.df-workspace-choice { flex: 1; min-width: 0; }
.df-workspace-choice select { color: var(--dsw-alias-label-primary); font-weight: 550; }
.df-workspace-path { margin: 5px 2px 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--dsw-alias-label-secondary); font-size: 11px; font-weight: 400; }
.df-find-modal { width: min(660px, 100%); }
.df-find-results { max-height: 460px; overflow-y: auto; margin-top: 12px; }
.df-find-row { width: 100%; display: flex; flex-direction: column; gap: 5px; padding: 11px 8px; text-align: left; border: 0; border-bottom: 1px solid var(--dsw-alias-border-l1); background: transparent; color: var(--dsw-alias-label-primary); cursor: pointer; }
.df-find-row:hover { background: var(--dsw-alias-bg-layer-1); }
.df-find-row > span:not(.df-row-title) { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--dsw-alias-label-secondary); font-size: 11px; }
.df-find-row small { color: var(--dsw-alias-label-secondary); }
.df-settings-block { max-width: 760px; padding: 4px 0; }
.df-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.df-capability-note { padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; background: var(--dsw-alias-bg-layer-1); }
.df-settings-actions { display: flex; justify-content: flex-end; margin-top: 12px; }
.df-toast { position: fixed; right: 22px; bottom: 22px; z-index: 120; max-width: min(420px, calc(100vw - 44px)); padding: 10px 14px; pointer-events: auto; border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; background: var(--dsw-alias-bg-overlay); box-shadow: 0 8px 32px color-mix(in srgb, var(--dsw-alias-label-primary) 16%, transparent); font-size: 12px; }
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
  .df-detail-actions .df-btn { font-size: 0; gap: 0; }
  .df-detail-actions .df-btn svg { width: 17px; height: 17px; }
  .df-settings-grid { grid-template-columns: 1fr; gap: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .df-quick, .df-thinking span { animation: none; }
  .df-btn, .df-icon-btn, .df-send, .df-answer-actions button, .df-tabs button { transition: none; }
}
`;

// src/client/main.jsx
var NS = "dsh-friday";
var FridayBoundary = class extends import_react9.default.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error) {
    console.error("dsh-friday: view crashed", error);
  }
  render() {
    if (this.state.error) return /* @__PURE__ */ import_react9.default.createElement("div", { className: "df-page" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "df-error" }, "Friday: ", String(this.state.error.message || this.state.error)));
    return this.props.children;
  }
};
function InboxGlyph({ size = 18, active = false }) {
  return /* @__PURE__ */ import_react9.default.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", style: { display: "block" } }, /* @__PURE__ */ import_react9.default.createElement(
    "path",
    {
      d: "M3.5 13 6.2 6.4A2 2 0 0 1 8.1 5h7.8a2 2 0 0 1 1.9 1.4L20.5 13v5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-5Z",
      stroke: active ? "var(--dsw-alias-brand-primary)" : "currentColor",
      strokeWidth: "1.55",
      strokeLinejoin: "round"
    }
  ), /* @__PURE__ */ import_react9.default.createElement("path", { d: "M3.8 13.5h4.2l1.5 2.5h5l1.5-2.5h4.2", stroke: active ? "var(--dsw-alias-brand-primary)" : "currentColor", strokeWidth: "1.55", strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ import_react9.default.createElement("path", { d: "m16.8 2 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z", fill: active ? "var(--dsw-alias-brand-primary)" : "currentColor" }));
}
function Toast() {
  const value = useFridayState((state2) => state2.toast);
  if (!value) return null;
  return /* @__PURE__ */ import_react9.default.createElement("div", { className: `df-toast ${value.tone}`, role: "status" }, value.message);
}
function GlobalUI({ t }) {
  return /* @__PURE__ */ import_react9.default.createElement(import_react9.default.Fragment, null, /* @__PURE__ */ import_react9.default.createElement("style", null, CSS), /* @__PURE__ */ import_react9.default.createElement(QuickOverlay, { t }), /* @__PURE__ */ import_react9.default.createElement(Toast, null));
}
function translator() {
  const dictionary = String(navigator.language || "").toLowerCase().startsWith("zh") ? zh_default : en_default;
  return (key) => {
    const value = key.split(".").reduce((current, part) => current?.[part], dictionary);
    return typeof value === "string" ? value : key;
  };
}
var inject = ["slots", "locale", "layout", "uiWorkspace", "workspaces"];
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { en: en_default, zh: zh_default }), "dsh-friday: locale");
  const t = translator();
  runtime.layout = ctx.layout;
  runtime.uiWorkspace = ctx.uiWorkspace;
  runtime.workspaces = ctx.workspaces;
  let hotkey = parseHotkey();
  const loadHotkey = () => {
    api.config().then((data) => {
      hotkey = parseHotkey(data.config.hotkey);
      setConfig(data);
      if (data.nativePendingTask) {
        openTask(data.nativePendingTask);
        void api.ackNativeTask(data.nativePendingTask).catch(() => {
        });
      }
    }).catch(() => {
    });
  };
  loadHotkey();
  window.addEventListener("dsh-friday:config-changed", loadHotkey);
  window.addEventListener("focus", loadHotkey);
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
      if (getState().config?.native?.running && !getState().config?.native?.hotkeyError) return;
      if (event.defaultPrevented || event.repeat || !matchesHotkey(event, hotkey)) return;
      event.preventDefault();
      event.stopPropagation();
      if (getState().overlayOpen) closeOverlay();
      else openOverlay(void 0);
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("dsh-friday:config-changed", loadHotkey);
      window.removeEventListener("focus", loadHotkey);
    };
  }, "dsh-friday: window hotkey");
  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
    name: "sidebar.panellist",
    id: "inbox",
    order: 30,
    label: () => "Inbox"
  }, (props) => /* @__PURE__ */ import_react9.default.createElement(InboxGlyph, { size: props?.size || 18, active: Boolean(props?.active) })));
  ctx.slots.inject("main", () => ctx.slots.register({
    name: "main",
    key: "inbox"
  }, () => /* @__PURE__ */ import_react9.default.createElement(FridayBoundary, null, /* @__PURE__ */ import_react9.default.createElement("style", null, CSS), /* @__PURE__ */ import_react9.default.createElement(InboxPage, { t }))));
  ctx.slots.inject("plugins.row.config", () => ctx.slots.register({
    name: "plugins.row.config",
    key: "dsh-friday#friday"
  }, (props) => /* @__PURE__ */ import_react9.default.createElement(FridayBoundary, null, /* @__PURE__ */ import_react9.default.createElement("style", null, CSS), /* @__PURE__ */ import_react9.default.createElement(SettingsForm, { ...props, t }))));
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "dsh-friday.quick",
    order: 40,
    label: "Friday quick conversation"
  }, () => /* @__PURE__ */ import_react9.default.createElement(FridayBoundary, null, /* @__PURE__ */ import_react9.default.createElement(GlobalUI, { t }))));
}

    })(module, exports, require);
    return module.exports;
  },
});
