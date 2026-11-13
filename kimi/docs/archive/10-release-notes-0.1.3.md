# Friday Inbox 0.1.3 发布说明

> - 发布日期：2026-11-10
> - 包名：`dsh-friday`
> - 版本：0.1.3
> - 安装源：`/Users/mac/d/dsh-friday/kimi`
> - 当前状态：0.1.3 已重新安装并应用，Host fiber active；真实问答与 Inbox 列表待用户在已认证 DSH 页面重试
> - 历史版本：[0.1.2 发布说明](10-release-notes-0.1.2.md)、[0.1.1 发布说明](10-release-notes-0.1.1.md)、[0.1.0 发布说明](10-release-notes-0.1.0.md)

## 本次修复

### 问答后 Inbox 显示 `record is not defined`

- 问题：浮层问答成功后，Inbox 页面不显示对话记录，页面呈现 `record is not defined`。
- 根因：[sessions.js](<../../src/host/sessions.js>) 的 `list()` 把 `records.map((record) => record.header.id)` 与 `.filter((id) => isFridayId(id) && !record.header.cwd)` 链式调用；`record` 只属于 `map` 回调，`filter` 回调引用它会抛 `ReferenceError`。短路条件 `isFridayId(id) &&` 使该引用只在存在 Friday 会话时被求值，因此空 Inbox 阶段不报错，首次成功问答后立即出现。
- 修复：先按记录对象过滤 `isFridayId(record?.header?.id) && !record?.header?.cwd`，再映射 id；对畸形快照使用可选链。
- 回归：新增 [list.test.js](<../../tests/list.test.js>) 3 项，覆盖存在 Friday 会话、混合工作区/普通会话、畸形快照与关键词检索。
- 安全边界不变：仅 `web_search`、DSH Connection 认证、Friday 会话隔离与 0.1.2 的 UserMessage/历史日志恢复逻辑均保持。

## 验证

- 32/32 自动化测试通过。
- 0.1.3 安装：`application: applied`、`version: 0.1.3`、Host `fiberPhase: active`。
- API 缺请求头 403、未认证 401，认证边界未回退。
- `client.js` 未改动（90,220 bytes，mtime 与 0.1.1 一致）；Client Cordis inspect 通道本次仍不可用，沿用 0.1.1 已验证的四个 Slot 结论。

## 使用影响

- 安装后 Inbox 会正常列出问答产生的对话；无需清理或重建 Inbox，既有索引与会话日志保持不变。
- 0.1.2 已修复的完整 UserMessage 与损坏历史恢复继续有效。

## 已知限制

- 物理 Session 删除、已认证视觉 QA、页面内快捷键与系统级全局热键限制与此前版本相同。
- 真实模型问答与已认证页面的 Inbox 列表刷新仍需用户重试确认，自动化无法代替。
