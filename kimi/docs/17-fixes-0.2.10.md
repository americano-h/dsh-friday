# 0.2.10 问答、侧栏分组、升级发布、删除与清空过期修复记录

> - 文档版本：0.2.10
> - 日期：2026-11-11
> - 类型：五项 bug 修复，不包含新功能；y 保持 2，z 由 5 按条目累加至 10
> - 主模型：`anthropic/claude-opus-5.5` 负责根因分析、方案设计与核心编码；子代理 `deepseek-official/deepseek-flash` 承担机械改动与本轮文档

## 修复条目与版本计数

| 修复条目 | 版本计数 | 处理 |
| --- | --- | --- |
| 普通提问无回答，Provider 报 `Tool names must be unique` | 0.2.6 | 删除 Friday 额外的 `systemPrompt.tools()` 提供者；`restrict()` 与执行 guard 继续只允许 `web_search`，并移除 `policy.prepare` 的 per-agent effect 泄漏 |
| Friday 会话出现在 DSH 侧栏「未分组」 | 0.2.7 | Agent 空闲约 1.5s 后 flush + dispose；请求进行中用 reservation 保活；删除、归档、升级时强制释放 |
| 升级后工作区只显示空白新对话 | 0.2.8 | 用一条已完成、不调用模型的 seed turn 创建并发布任务；新状态机 `creating` → `published` |
| 升级后的对话无法删除（「已被占用」） | 0.2.9 | Inbox 对升级/归档会话改为软删除并保留 `upgradedSessionId`，同时强制释放 Agent；不可读历史行改为隐藏 |
| 「清空过期」报 `readConfig is not defined` | 0.2.10 | `api.js` 补齐 `readConfig` 导入 |

> - 版本号按仓库 `AGENTS.md` 的“每个 bug 修复条目 +1”规则由 0.2.5 累加至 0.2.10，不是跳过的发布或五次独立安装。

## 0.2.6 普通提问无回答

### 根因

- `systemPrompt.assemble()` 会拼接**所有**全局与 Agent 作用域 `systemPrompt.tools()` 提供者返回的 schema。
- DSH tools service 已经提供（受限的）schema；Friday 的 `policy.js` 又注册了自己的作用域提供者，于是 `web_search` 在 request/header 中被声明两次。
- 真实会话日志已复现：`tools = [web_search, web_search]`。
- 该 profile 关闭了 `tool-web`，因此 Friday 的 scoped 回退 `web_search` 是唯一搜索工具；重复声明来自 Friday 自己的提供者，不是其他插件或全局工具。
- Provider 拒绝重复工具名后整轮请求失败，用户侧表现为“普通提问没有回答”。

### 修复

- 删除 Friday 额外的 `systemPrompt.tools()` 提供者；schema 由 tools service 统一提供。
- `restrict()` 与执行 guard 保持不变，仍只允许 `web_search`。
- 没有全局 `web_search` 时照旧注册 scoped 回退实现，但同样不再注册第二个 schema 提供者。
- 移除 `policy.prepare` 中 per-agent `ctx.effect` 泄漏；作用域注册统一由 `agent/disposed` 与插件 teardown 释放，避免重复注册与残留。

### 验证边界

- `policy.test.js` 断言 `systemPrompt.tools` 调用次数为 0、`schemas()` 未被调用，且缺失全局搜索时 scoped 回退仍可注册并执行。
- 根因结论来自真实会话日志中的 `request/header`，不是推测。

## 0.2.7 侧栏「未分组」出现 Friday 会话

### 根因

- DSH 的会话列表隐藏没有 `cwd` 的**冷**会话，但始终列出 **LIVE** 会话。
- Friday 保留它创建或恢复的每个 Agent 句柄，从不 dispose，因此这些会话一直 live。
- 已归档的被升级源会话同样保留句柄，也会被列出。

### 修复

- 仓库在 `agent/status` 变为 idle 后约 1.5s 执行 flush + dispose，释放 Friday 自有 Agent。
- 聊天请求进行中通过 reservation 计数阻止释放；释放前再次检查运行状态与预留。
- 删除、归档与升级路径强制释放，不受空闲等待限制。

### 已知限制

- 一轮对话仍在进行时，live 的 Friday 会话仍可能短暂出现在 DSH 未分组桶。
- DSH 不提供受支持的方式隐藏无 `cwd` 的 live 会话；header `origin` 只接受 `subagent`，Friday 不能改用它规避。

### 验证边界

- `release.test.js` 覆盖：空闲句柄只释放一次、运行中需 `force`、预留期间不释放、idle 事件延迟释放、归档已归档升级会话。
- 未对真实侧栏做前后截图比对；该结论来自 DSH 列表投影行为加单元测试。

## 0.2.8 升级后工作区只显示空白新对话

### 根因

- 0.2.4 使用 `Agent.inject()`，它只存储 pending 的 next-step 输入，不产生任何 turn。
- DSH 的列表投影在 `turn/start` 之前把会话标记为 blank；侧栏会隐藏 blank 会话（除非它是当前会话），因此任务没有可见内容。

### 修复

- 任务改为带 seed 创建：一条已完成、不调用模型的一轮。
- seed 为 `turn/start`、`user/message`（已审阅 brief 加一句简短的 “wait for my next instruction” 前缀）、`turn/end` completed，seq 连续。
- meta 为 `{ cwd: 工作区路径, agentPreset: 默认预设 }`。
- 释放 Friday 的临时 Agent，再调用 `workspace.attachSession(taskId)` 与 `sessionController.resolveAgent(taskId)`，由 DSH 以完整预设恢复该会话。
- 标题取自 Friday 会话标题；全程不调用模型。
- 新状态机：`creating` → `published`。
- 恢复：`creating` 且会话已存在则重新发布；会话缺失则用保存的 brief 重建。
- 任务 ID 前缀改为 `session-`（原生）。

### 验证边界

- 用真实 DSH 库验证（以 Node 方式运行 Electron 并读取 `app.asar`）：`Session.create` 接受该 seed；真实 `applySessionListMetadata` 得到 `blank=false`，旧的 inject-only 路径得到 `blank=true`。
- `upgrade-service.test.js` 断言 seed 是连续已完成轮次、发布流程、重复升级拒绝与两种中断恢复分支。
- 未在已认证 GUI 中实际打开升级后的工作区。

## 0.2.9 升级后的对话无法删除

### 根因

- 原因一：Friday Host 显式抛出 `An upgraded conversation cannot be deleted`。
- 原因二：`dsh-chat-manager` 在 `sessions.get` / `agents.get` 显示会话仍 live 时拒绝删除（`该会话仍被宿主加载或有活动`），而 Friday 从不释放它。

### 修复

- Inbox 对升级/归档会话的删除改为软删除，保留 `upgradedSessionId`，使其永远不能再次升级。
- 同时强制释放 Agent，让原生删除工具可以继续。
- 历史不可读的索引行改为隐藏，不再让整个删除请求失败。

### 验证边界

- `release.test.js` 的归档用例断言：已归档升级会话可归档、保留 `upgradedSessionId`、释放句柄、不重复调用原生归档。
- `dsh-chat-manager` 的原生删除未在 GUI 中实测；结论依赖其公开的 live 检查规则与自动化中对释放行为的断言。

## 0.2.10 「清空过期」报 `readConfig is not defined`

### 根因

- `/inbox/cleanup` 处理函数调用 `readConfig(configStore)`。
- `api.js` 只导入了 `saveConfig`，运行时抛 `ReferenceError: readConfig is not defined`，清理请求整体失败。

### 修复

- `api.js` 的导入改为 `import { readConfig, saveConfig } from './config.js'`。

### 验证边界

- `node --check` 与 `scripts/check-client.mjs` 通过，60/60 测试通过。
- 现有自动化没有直接调用 `/inbox/cleanup` 路由的用例，因此该修复只做了静态检查与全量回归；路由行为待 GUI 走查确认。

## 验证边界汇总

- 自动化：60/60 通过，基线为 0.2.5 的 53 项。
- `node --check` 与 `scripts/check-client.mjs` 通过。
- 插件已通过 plugin manager 在活动 profile 中重载，处于 active。
- 未在已认证 GUI 中端到端验证：执行代理的浏览器没有 DSH Web 会话，Connection fence 返回 401，且没有刻意提取启动 token。
- 待用户 GUI 走查：提一个问题、升级到工作区、删除升级后的对话、运行「清空过期」。
