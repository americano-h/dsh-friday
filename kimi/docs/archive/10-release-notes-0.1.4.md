# Friday Inbox 0.1.4 发布说明

> - 发布日期：2026-11-10
> - 包名：`dsh-friday`
> - 版本：0.1.4
> - 安装源：`/Users/mac/d/dsh-friday/kimi`
> - 当前状态：0.1.4 已重新安装并应用，Host fiber active；真实问答与 Inbox 列表待用户在已认证 DSH 页面重试
> - 历史版本：[0.1.3 发布说明](10-release-notes-0.1.3.md)、[0.1.2 发布说明](10-release-notes-0.1.2.md)、[0.1.1 发布说明](10-release-notes-0.1.1.md)、[0.1.0 发布说明](10-release-notes-0.1.0.md)

## 本次修复

### Inbox 显示 `stored session "…" failed validation: Error: session event at seq 10 message must have role "user"`

- 问题：Inbox 页面加载时，0.1.1 遗留的一条会话日志被 DSH 持久化层拒绝读取，整页显示内部校验错误而不是对话列表。
- 根因：`@deepseek-ai/dsh-session-persistence` 的 `validateStoredEvents()` 在**读取已落盘日志时**逐事件校验 `user/message` 的 `role`；0.1.1 写入的 `seq 10` 缺 `role`，被包装成 `stored session "<id>" failed validation`。0.1.2 的 `rawSnapshot()` 仍通过 `sessionPersistence.open(id, 'read')` 读取原始事件，而 `decodeStoredLog()` 同样调用该校验，因此错误从 `snapshot()` 冒泡到 `/inbox` API。
- 修复：
  - `isSeedValidationError()` 扩展识别 `stored session … failed validation` 与 `session event at seq`。
  - `snapshot()`：当原始日志读取也被 DSH 拒绝时，写 `corruptedAt` 并返回 `null`，不再抛内部错误；开头按该标记早返回，避免反复读取。
  - `list()`：`sessionPersistence.list()` 失败时退回 Friday 派生索引；循环跳过 `corruptedAt` / `deletedAt`，单条读取遇到校验错误时隔离该会话。
  - `get()` 返回 `null` 使详情接口给出友好的 404；`ensureAgent()` / `recover()` 给出「unreadable stored history … Start a new conversation」提示。
- 影响：这条 0.1.1 遗留损坏会话会被隔离并从 Inbox 隐藏；DSH 自身不允许读回它，插件不删除、不改写、不绕过持久化 API 直接操作物理日志。**新会话与合法历史会话正常显示。**
- 安全边界不变：仅 `web_search`、DSH Connection 认证、Friday 会话隔离、0.1.2 的 UserMessage 与恢复逻辑均保持。

## 验证

- 36/36 自动化测试通过；新增 [corrupt-session.test.js](<../../tests/corrupt-session.test.js>) 4 项回归。
- 0.1.4 安装：`application: applied`、`version: 0.1.4`、Host `fiberPhase: active`。
- API 缺请求头 403、未认证 401，认证边界未回退。
- `client.js` 未改动（90,220 bytes，mtime 与 0.1.1 一致）；Client Cordis inspect 通道本次仍不可用，沿用 0.1.1 已验证的四个 Slot 结论。

## 使用影响

- 刷新页面后 Inbox 不再显示该错误，合法对话正常列出；被隔离的旧会话不再出现在列表，其物理日志仍保留。
- 若尝试续问该旧会话，会提示历史不可读并建议新建对话，而不是显示 DSH 内部错误。
- 无需清理或重建 Inbox，既有索引与会话日志保持不变。

## 已知限制

- 物理 Session 删除、已认证视觉 QA、页面内快捷键与系统级全局热键限制与此前版本相同。
- 0.1.1 遗留损坏日志的内容无法通过公开 DSH API 取回；若需恢复该条历史，需要 DSH 提供日志修复/迁移能力，本插件不擅自改写存储文件。
