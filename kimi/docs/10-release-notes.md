# Friday 0.2.10 发布说明

> - 发布日期：2026-11-11
> - 包名：`dsh-friday`
> - 版本：0.2.10
> - 安装源：`/Users/mac/d/dsh-friday/kimi`
> - 当前状态：已在活动 profile 中重载并处于 active；60 项测试通过；已认证 GUI 端到端走查待用户完成
> - 历史版本：[0.2.5 发布说明](archive/10-release-notes-0.2.5.md)、[0.2.0 发布说明](archive/10-release-notes-0.2.0.md)、[0.1.4 发布说明](archive/10-release-notes-0.1.4.md)

## 本次修复

### 普通提问恢复回答（0.2.6）

- 问题：普通提问返回后没有答案，Provider 报 `Tool names must be unique`。
- 根因：`systemPrompt.assemble()` 拼接所有全局与作用域提供者的 schema，而 Friday 自己又注册了 `systemPrompt.tools()`，与 tools service 重复声明 `web_search`。
- 修复：移除 Friday 的额外提供者；`restrict()` 与执行 guard 仍只允许 `web_search`，并移除 `policy.prepare` 的 per-agent effect 泄漏。

### 侧栏不再堆积未分组会话（0.2.7）

- 问题：Friday 会话（含已归档的升级源会话）出现在 DSH 侧栏「未分组」。
- 根因：DSH 隐藏无 `cwd` 的冷会话但始终列出 live 会话，而 Friday 从不 dispose 已创建或恢复的 Agent。
- 修复：空闲约 1.5s 后 flush + dispose；请求进行中用 reservation 保活；删除、归档、升级时强制释放。

### 升级后的任务可见（0.2.8）

- 问题：升级后所选工作区只显示一个完全空白的新对话。
- 根因：`Agent.inject()` 只写入 pending next-step 输入，不产生 turn；DSH 在 `turn/start` 前把会话标为 blank，侧栏隐藏非当前 blank 会话。
- 修复：任务改为带一条已完成、不调用模型的 seed turn 创建，再由 DSH 以完整预设恢复；状态机为 `creating` → `published`，中断可重发布或按保存的 brief 重建，任务 ID 使用原生 `session-` 前缀。

### 升级后的对话可删除（0.2.9）

- 问题：升级后的对话无法删除，提示「已被占用」。
- 根因：Friday Host 直接拒绝删除升级会话；同时 `dsh-chat-manager` 在会话仍 live 时拒绝删除，而 Friday 不释放 Agent。
- 修复：Inbox 对升级/归档会话改为软删除并保留 `upgradedSessionId`，同时强制释放 Agent；不可读历史行改为隐藏。

### 清空过期可用（0.2.10）

- 问题：「清空过期」报 `readConfig is not defined`。
- 根因：`api.js` 只导入了 `saveConfig`。
- 修复：补齐 `readConfig` 导入。

## 已知限制

- 一轮对话进行中，live 的 Friday 会话仍可能短暂出现在 DSH 未分组桶；DSH 没有受支持的方式隐藏无 `cwd` 的 live 会话。
- 已认证 GUI 尚未端到端验证：执行代理的浏览器没有 DSH Web 会话（Connection fence 返回 401），启动 token 未被提取。
- 0.2.10 没有直接调用 `/inbox/cleanup` 路由的自动化用例，清空过期仍以静态检查和全量回归为证据。

## 验证

- **60/60 自动化测试通过**，基线 53 项；`node --check` 与 `scripts/check-client.mjs` 通过。
- 插件已通过 plugin manager 在活动 profile 中重载并 active。
- 真实 DSH 库确认 seed 可用、`applySessionListMetadata` 得到 `blank=false`，旧 inject-only 路径为 `blank=true`。
- 待用户走查：提一个问题、升级到工作区、删除升级后的对话、运行「清空过期」。
- 详细证据与边界见[测试报告](07-test-report.md)与[0.2.10 修复记录](17-fixes-0.2.10.md)。
