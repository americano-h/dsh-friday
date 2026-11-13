# 0.1.4 故障排查与修复记录

> - 文档版本：0.1.4
> - 日期：2026-11-10
> - 用户反馈：Inbox 页面出现 `stored session "friday-5da72040-fd8e-41ab-b17a-839d267ed026" failed validation: Error: session event at seq 10 message must have role "user"`
> - 处理方式：主代理直接修复（持久化层校验错误的容错隔离，未调用子代理）
> - 前置状态：0.1.2 已修复 UserMessage 缺 role 与历史恢复；0.1.3 已修复 Inbox 列表 `record is not defined`

## 根因证据

> - DSH `@deepseek-ai/dsh-session-persistence/lib/index.js` 的 `validateStoredEvents()` 对每条已落盘事件调用 `adoptSessionEvent` → `@deepseek-ai/dsh-session` 的 `validateSessionEventData(event, 'session event at seq N')` → `assertMessageEventShape`；缺 `role` 时抛 `message must have role "user"`，再包装成 `stored session "<id>" failed validation: …`。
> - `@deepseek-ai/dsh-session-persistence-jsonl/lib/index.js` 的 `decodeStoredLog()` 在 `readStoredLog()` 路径调用 `validateStoredEvents`，因此 `sessionPersistence.open(id, 'read').read()` 也无法读回损坏日志。
> - 0.1.2 的 `rawSnapshot()` 依赖该 read API；`snapshot()` 的 seed 容错分支因此在 `rawSnapshot` 处再次抛出，错误冒泡到 `/inbox` 列表 API，Client 把 `{ error }` 显示为页面文本。
> - 这是 0.1.1 写入 `user/message` 缺 `role` 的遗留日志；0.1.2 已阻止新日志产生同类问题，但持久化层自身会拒绝读旧日志，`normalizeSessionSeed` 无法取到原始事件。

## 修复设计

> - `isSeedValidationError()` 扩展识别 `stored session … failed validation` 与 `session event at seq`，同时保留原 seed 错误匹配。
> - `snapshot()`：`rawSnapshot` 也失败时写 `corruptedAt` 并返回 `null`，不再抛原始校验错误；开头按 `corruptedAt` 早返回，避免重复读取。
> - `list()`：`sessionPersistence.list()` 失败时退回 Friday 派生索引；循环跳过 `corruptedAt` / `deletedAt`，并对单条 `get` 的校验错误做隔离与缓存。
> - `get()`：损坏会话返回 `null`，`/inbox/:id` 因此返回友好的 404。
> - `ensureAgent()` / `recover()`：对不可读旧会话给出「unreadable stored history … Start a new conversation」提示，不暴露 DSH 内部错误。
> - 不删除、不改写物理日志；不绕过 DSH 持久化 API 直接操作存储文件。

## 修改文件

> - `src/host/sessions.js`：错误识别、snapshot 隔离、list 容错、ensureAgent/recover 降级。
> - `tests/corrupt-session.test.js`：新增 4 项回归。
> - `package.json`、`index.js`、`src/host/api.js`、`tests/static.test.js`、`README.md`、`CHANGELOG.md`：版本 0.1.3 → 0.1.4。
> - `docs/07-test-report.md`、`docs/10-release-notes.md`、`docs/14-hotfix-0.1.4.md`、`docs/06-development-log.md`、`docs/04-model-and-subagent-log.md`：记录同步。
> - `docs/archive/07-test-report-0.1.3.md`、`docs/archive/10-release-notes-0.1.3.md`：归档被取代的 0.1.3 文档，并修正副本内部相对链接。

## 回归测试与验证

> - `pnpm run verify`：36/36 通过，0 失败；新增 4 项损坏会话容错回归。
> - 0.1.4 安装 `application: applied`、`version: 0.1.4`、Host active。
> - API 缺请求头 403、未认证 401；0.1.1/0.1.2/0.1.3 的安全与恢复边界未回退。
> - `client.js` 未改动（90,220 bytes，mtime 与 0.1.1 一致）。
> - Client Cordis inspect 通道本次仍报 `input must be an object`，无法实时重查 Slot；沿用 0.1.1 已验证的四个 Slot 结论。

## 子代理调用说明

> - 本轮为持久化层校验错误的容错隔离，属边界明确的运行时容错修复；主代理直接处理，未调用子代理，也未并发。
> - 符合用户既定原则：高难度或审阅任务才考虑更高能模型，低难度重复任务不调遣更高能模型。
