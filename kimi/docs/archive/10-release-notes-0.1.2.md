# Friday Inbox 0.1.2 发布说明

> - 发布日期：2026-11-10
> - 包名：`dsh-friday`
> - 版本：0.1.2
> - 安装源：`/Users/mac/d/dsh-friday/kimi`
> - 当前状态：0.1.2 已重新安装并应用，Host fiber active；真实问答待用户在已认证 DSH 页面重试
> - 历史版本：[0.1.1 发布说明](10-release-notes-0.1.1.md)、[0.1.0 发布说明](10-release-notes-0.1.0.md)

## 本次修复

### 续问时报 `seed user/message at index N message must have role "user"`

- 问题：Inbox 快捷对话首次回答后，再次续问或恢复最近会话时报 seed 校验错误，无法继续问答。
- 根因：`src/host/chat.js` 把 `{ content, source }` 直接传给 `agent.followup()`，没有构造完整 `UserMessage`。DSH Agent 会把该对象原样写入 `user/message` 事件，缺少 `role: "user"`，因此下次恢复时 seed 校验失败。
- 修复：新增 `userMessage()`，为普通提问和重新生成构造带 `id`、`role`、`content`、`source` 的完整消息。Agent 作用域 `web_search`、deny 已知全局工具和 guard 策略保持不变。
- 兼容：0.1.0/0.1.1 已写入的损坏日志不删除、不改写。续问时读取原始持久化事件，补齐缺失的 `id` / `role` 后用修正 seed 创建新的原生会话；旧索引记录保存 `recoveredSessionId` 并隐藏重复列表项，重复请求复用同一恢复会话。
- 安全：仍只允许 `web_search`；DSH Connection 认证、Friday 会话 ID 与工作区隔离不变；恢复逻辑仅处理 `friday-` 会话。

## 验证

- 29/29 自动化测试通过。
- 新增完整 UserMessage、seed 归一化、损坏日志恢复与幂等回归测试。
- 用真实持久化日志和真实 `@deepseek-ai/dsh-session` 复验：原始日志在 `index 10` 被拒绝，补齐 role 后通过。
- 0.1.1 的无全局 `web_search` 降级、deny、执行 guard 与最终 schema 过滤继续由原测试覆盖。
- 主代理复核并安装：29/29 通过；`application: applied`、版本 0.1.2、Host active；API 缺请求头 403、未认证 401。
- 本次 Client Cordis inspect 通道异常，无法实时重查 Slot；`client.js` 与 Slot 注册源码未修改，沿用 0.1.1 已验证结论。

## 使用影响

- 新版本安装后，后续新会话不再写入缺少 role 的事件。
- 已有损坏会话在下次续问时自动迁移到新的原生会话；旧日志保留在磁盘，可在 DSH 原生存储中追溯。
- 无需修改全局 `tool-web` 配置，也无需清理现有 Inbox。

## 已知限制

- 物理 Session 删除、已认证视觉 QA 和页面内快捷键限制与 0.1.1 相同。
- 恢复会创建一个新的 Session ID 并隐藏旧列表项，不重写原日志；用户看到的是可继续对话的新会话。
