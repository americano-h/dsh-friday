# 0.1.2 故障排查与修复记录

> - 文档版本：0.1.2
> - 日期：2026-11-10
> - 用户反馈：Inbox 快捷对话框输入问题后无法正常回答，报错 `seed user/message at index 10 message must have role "user"`
> - 前置状态：0.1.1 已修复 `tools.restrict` unknown `web_search`
> - 处理方式：由 DeepSeek V4.1 Flash 子代理处理，主代理复核

## 根因证据

> - 校验位置：DSH `@deepseek-ai/dsh-session` 的 `lib/index.js`。
> - 入口链路：`assertSessionEventEnvelope` → `assertCurrentLlmShape` → `assertMessageEventShape`；恢复 seed 时传入 subject 前缀 `seed ${type} at index ${index}`。
> - 字段要求：`user/message` 的 `event.data` 本身必须包含非空字符串 `id`、`role: "user"`、`source.kind` 与数组 `content`；`assertMessageEventShape` 先检查 `id`，再检查 `role`，最后才报现有错误。
> - 写入链路：DSH `dsh-agent-loop` 的 `ReactLoopAgent.followup(input)` 直接 `send(input, 'next-turn', true)`，`ReactLoopInbox.splice` 将入参原样写入 `agent/inbox/spliced`，step 边界再原样写成 `user/message`；它不会替调用方补 `role`。
> - 插件缺陷：0.1.1 的 `src/host/chat.js` 调用 `agent.followup({ content, source: { kind: 'user' } })` 和重新生成的同类调用，均缺少 `id` / `role`。
> - 为什么有 `id` 却没有 `role`：当前 profile 启用的 `dsh-context` 插件在 `agent/pre-step` 中只给缺失 `id` 的消息补 `dshctx-<uuid>`，不补 `role`；因此本轮首次回答可能成功，但持久化事件已不合法，下次恢复时 seed 校验失败。
> - 真实日志证据：`$DSH_HOME/sessions/_no-cwd/friday-5da72040-fd8e-41ab-b17a-839d267ed026/session.v4.jsonl.zstd` 的 `user/message` `seq 10` 为 `{ content, source, id: "dshctx-3ee6d17a-..." }`，没有 `role`。
> - 真实校验复现：用真实日志事件调用真实 `@deepseek-ai/dsh-session` 的 `Session.create`，得到与用户完全一致的 `seed user/message at index 10 message must have role "user"`；仅补齐 `role` 后同一调用通过。

## 修复设计

> - 主修复：`src/host/chat.js` 新增 `userMessage(content, source)`，生成 `{ id: randomUUID(), role: 'user', content, source }`；普通提问和重新生成都只传该完整消息。
> - 兼容策略：`src/host/sessions.js` 新增 `normalizeSessionSeed()`，只补齐缺失的 `id` / `role`，保留合法事件的引用；`isSeedValidationError()` 精确识别 DSH seed 校验错误。
> - 恢复路径：读取被拒绝日志时改用 `ctx.sessionPersistence.open(id, 'read')` 的原始事件，避免再次触发 `Session.create` 校验；补齐后用 `ctx.agents.create({ seed })` 创建新的 `friday-` 原生会话。
> - 不删除日志：旧 Session 日志不删除、不改写、不截断；旧索引记录写入 `recoveredSessionId`、`recoveredAt`、`archivedAt`、`deletedAt`，只隐藏重复列表项。
> - 幂等：再次请求旧会话时优先复用已存在的恢复会话，不重复创建。
> - 安全边界不变：仅 `web_search`、Agent/global guard、DSH Connection 认证、Friday `friday-` 前缀与无 `cwd` 会话隔离均保持 0.1.1 行为。

## 修改文件

> - `src/host/chat.js`：完整 `UserMessage` 构造。
> - `src/host/sessions.js`：seed 归一化、seed 错误识别、原始日志读取、恢复与幂等。
> - `tests/chat.test.js`：新增 complete UserMessage 回归。
> - `tests/recovery.test.js`：新增 seed 归一化、合法日志不变、错误识别、损坏会话恢复与幂等 4 项测试。
> - `package.json`、`index.js`、`src/host/api.js`、`tests/static.test.js`：版本 0.1.1 → 0.1.2。
> - `README.md`、`CHANGELOG.md`、`docs/06-development-log.md`、`docs/07-test-report.md`、`docs/10-release-notes.md`、`docs/12-hotfix-0.1.2.md`：版本与记录同步。
> - `docs/archive/07-test-report-0.1.1.md`、`docs/archive/10-release-notes-0.1.1.md`：归档被取代的 0.1.1 文档，原 0.1.0 归档保留。

## 回归测试与验证

> - `pnpm run verify`：29/29 通过，0 失败。
> - 新增 6 项测试：完整 UserMessage 与重新生成 2 项，恢复相关 4 项。
> - Client 未修改，未重建 `client.js`；语法与模块包装检查继续通过。
> - 真实 DSH Session 校验：原始日志 `index 10` 被拒绝；`normalizeSessionSeed` 后通过。
> - 恢复测试覆盖：原始事件不被修改、旧日志映射写入、重复请求不重复创建、合法日志 `changed: false`。

## 主代理复核与安装验证

> - 复核代码改动与 `pnpm run verify`：29/29 通过，0 失败；`client.js` 未改动（90,220 bytes，mtime 与 0.1.1 一致）。
> - 修正 `docs/archive/07-test-report-0.1.1.md` 与 `10-release-notes-0.1.1.md` 内 4 处失效相对链接，符合归档规范。
> - 在 `docs/04-model-and-subagent-log.md` 补记本次子代理调用的模型标识、原因、输入范围与采纳情况。
> - 通过 `plugin_manager` 卸载并重新安装 `kimi/`，返回 `application: applied`、`version: 0.1.2`；`include:friday` 为 `fiberPhase: active`。
> - API 安全边界未回退：缺 `X-DSH-Friday` 返回 403，未通过 DSH Connection 认证返回 401；0.1.1 的 scoped `web_search`、deny、guard 与最终 schema 过滤代码保持不变。
> - 限制：本次 Client Cordis inspect 通道对所有 client provider 均报 `input must be an object`，无法实时重查 Slot；因 `client.js` 与 Slot 注册源码未修改，沿用 0.1.1 已验证的四个 Slot 结论。真实模型问答与已损坏会话实机续问需用户在已认证 DSH 页面重试。
