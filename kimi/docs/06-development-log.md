# 开发日志

> - 文档版本：0.1.2
> - 时区：Asia/Shanghai

## 2026-11-10

### 需求与平台勘察

- 读取 PRD 0.3.0，建立 L1/L2/L3 与横切配置的验收边界。
- 通过 Cordis Inspect 确认 `sidebar.panellist`、`main`、`shell.overlay`、`plugins.row.config` 的实时槽位。
- 确认 `agents`、`sessionPersistence`、`sessionQuery`、`llm`、`tools`、`attachments`、`workspaceRegistry`、`uiWorkspace` 的当前 API。
- 确认系统级全局快捷键和独立置顶窗口不属于 Web 插件能力，作为明确限制而非伪实现。

### 技术设计

- 选择 Node ESM、共享 React、esbuild、Node Test。
- 选择原生 Session 作为内容权威，JSON 仅作可重建索引。
- 选择同源 SSE 和 DSH Connection 认证，不启动新服务器。
- 选择独立摘要后创建正式任务，避免压缩操作改写源 Inbox。

### 实现

- 建立 `kimi/` 隔离目录、包清单、补丁、过程文档和测试计划。
- Host/Client 主链路进入编码。

### 构建、测试与安装

- 生成 87.7 KiB 的 `client.js`，模块包装和语法检查通过。
- 首轮测试 17/18；修正过窄的错误文案断言后，18/18 通过。
- pnpm 默认拦截 esbuild 安装脚本；使用 `pnpm install --ignore-scripts` 和已安装平台二进制完成构建，未申请额外脚本权限。
- 通过 `plugin_manager` 安装 `kimi/`，结果为 `application: applied`，Host fiber 为 active。
- 实时确认一级 Inbox、主页面、浮层和插件配置四个 Slot 注册。
- 浏览器自动化被 DSH 认证页拦截，未搜索访问令牌；视觉和真实问答仍需已认证页面走查。

### 发布前代码复核修正

- 正式任务改用原生 SessionController 创建，避免随 Friday 插件卸载而失去独立生命周期。
- 增加最终工具 schema 过滤及 Agent 作用域注册的双重释放。
- 最近会话在流式 meta 时立即更新，避免流式期间收起后恢复到旧会话。
- 引用 URL 在 Host/UI 双层限制为 HTTP(S)。
- 数据目录改为 `dsh-friday-kimi`，避免不同模型实现相互覆盖。

### 最终验证与交付

- 增加升级恢复与聊天生命周期测试，最终 22/22 通过。
- 修正模型继承、归档写入顺序、重复升级拒绝和摘要恢复状态。
- 重新安装最终包，Host active；侧栏、主页面、浮层和配置 Slot 均 active。
- API 拒绝路径实测：缺请求头 403、DSH 未认证 401。
- 完成测试报告、验收矩阵、自审记录、README、CHANGELOG 与发布说明。

### 0.1.2 续问 seed 校验故障修复（DeepSeek V4.1 Flash 子代理，主代理复核）

- 复现真实日志：0.1.1 写入的 `user/message` 在 `seq 10` 缺少 `role`，DSH `@deepseek-ai/dsh-session` 的 `assertMessageEventShape` 在恢复时以 `seed user/message at index 10 message must have role "user"` 拒绝。
- 定位写入链路：`agent.followup()` 原样写入，`dsh-context` 只补 `id` 不补 `role`；根因是 Friday 未构造完整 `UserMessage`。
- 修复：`src/host/chat.js` 生成 `{ id, role: 'user', content, source }`；重新生成同样使用完整消息。
- 兼容：`normalizeSessionSeed` 补齐旧日志缺失字段；损坏会话用原始持久化事件修正 seed 后创建新原生会话，旧日志保留，索引记录映射并幂等复用。
- 测试：新增 6 项，`pnpm run verify` 29/29 通过；用真实 DSH Session 校验确认修复前后结果。
- 文档：0.1.1 测试报告与发布说明归档为 `07-test-report-0.1.1.md`、`10-release-notes-0.1.1.md`，现行文档更新为 0.1.2。

### 0.1.2 主代理复核与交付

- 复核子代理改动并重跑 `pnpm run verify`：29/29 通过；0.1.1 的 `web_search` 降级、deny、guard 与认证边界未回退。
- 修正 `docs/archive/` 内 4 处失效相对链接；补齐 `docs/04-model-and-subagent-log.md` 的第 1 次子代理调用记录。
- 卸载并重新安装 `kimi/`：`application: applied`、`version: 0.1.2`、Host fiber active。
- API 拒绝路径实测：缺请求头 403、未认证 401；Client Cordis inspect 通道本次不可用，已如实记录验证边界，未声称实时 Slot 复查通过。

### 0.1.3 Inbox 列表 `record is not defined` 修复（主代理）

- 根因：`src/host/sessions.js` 的 `list()` 在 `filter` 回调中引用了 `map` 回调参数 `record`；短路求值使其只在存在 Friday 会话后触发，因此问答前空 Inbox 不报错。
- 修复：先按记录对象过滤再映射 id，可选链容错畸形快照；新增 `tests/list.test.js` 3 项回归。
- 验证：`pnpm run verify` 32/32；0.1.3 重装 `application: applied`、Host active；API 403/401。
- 归档：0.1.2 测试报告与发布说明移入 `docs/archive/`，修正副本内部相对链接；现行文档更新为 0.1.3。
- 本轮未调用子代理：单一作用域错误属低复杂度任务，由主代理直接修复。

### 0.1.4 损坏持久化日志容错隔离（主代理）

- 根因：DSH `session-persistence` 的 `validateStoredEvents()` 在读取已落盘日志时校验 `user/message.role`，0.1.1 遗留日志 `seq 10` 缺 role 被拒；0.1.2 的 `rawSnapshot()` 走同一读 API，同样被拒，错误冒泡到 `/inbox`。
- 修复：扩展错误识别；`snapshot()` 在读回失败时写 `corruptedAt` 并返回 null；`list()` 跳过并缓存损坏会话、对 `sessionPersistence.list()` 失败退回派生索引；详情与续问给出友好降级。不改写物理日志。
- 验证：`pnpm run verify` 36/36；0.1.4 重装 `application: applied`、Host active；API 403/401。
- 归档：0.1.3 测试报告与发布说明移入 `docs/archive/`，修正副本内部相对链接；现行文档更新为 0.1.4。
- 本轮未调用子代理：边界明确的运行时容错修复，由主代理直接处理。

### 0.2.0 全局原生弹窗与 Inbox 内联续聊（主代理）

- 勘察：实时 Host/Client Service 无全局热键或独立窗口 API；确认 `shell.overlay` 仍是页面内扩展点，因此不能仅靠浏览器 keydown/CSS 交付本轮要求。
- 选型：新增 Swift AppKit/WebKit/Carbon 辅助进程，Host 管理生命周期；Carbon 注册全局快捷键，AppKit 提供原生拖动和 Liquid Glass，WebKit 复用 QuickOverlay 与既有 Host 服务。理由与边界详见 `15-feature-0.2.0.md`。
- 界面：抽取共享 `ConversationComposer` 和图片草稿 hook；placeholder 改为「向 Friday 提问」，左加号右发送；浮层提高透明度并支持标题栏拖动。
- Inbox：移除续聊打开浮层的入口，详情底部固定输入框直接调用原 `streamChat`，支持图片、引用、停止和当前 Session 持久化；升级按钮简化为「升级」。
- 原生桥接：本地 JSON Lines 承载配置、Inbox、附件、聊天流、工作区和升级；不另开 HTTP 端口。独立页面使用自包含 React，DSH Client 仍共享宿主 React。
- 修正：配置通知仅在 hotkey 变化时触发；原生 React clientReady 与 HTML loaded 分离；就绪时重放窗口可见状态，避免早期热键唤起空白。
- 验证：`pnpm run build && pnpm run verify` 44/44；Swift 冒烟 `hotkeyError: null`、`pageReady: true`；安装后 HID 热键实测唤起/收起，拖动坐标 `(865,243)` → `(965,343)`；真实窗口 OCR 确认 placeholder。
- 安装：0.2.0 `application: applied`，原生进程启动，API 401/403；浏览器认证页限制与真实模型未自动验证已记录。
- 文档：0.1.4 测试报告与发布说明归档并修正链接；现行文档升级 0.2.0。未调用子代理，全程顺序执行。

### 0.2.5 一致性、清理、设置与升级修复（主代理）

- 浮窗：全局与 Inbox 新建共用同一 QuickOverlay，白色 720×62 内容与 8px 外边距；新建态仅保留 placeholder、图片加号和发送按钮，移除空态和底部提示。插件显示名统一 Friday。
- 清理：根据真实索引中 `upgradedSessionId` 已存在但 `archivedAt` 缺失的中断状态，修正 active/archived 分类，避免 clear/cleanup 调用 archive 删除升级会话；保留恢复摘要。
- 设置：`publicConfig` 不再让 recent 列表错误拖垮整个配置；Client 加载失败仍渲染默认模型、视觉模型、快捷键和保留期控件。
- 升级：新增 preview API 和可编辑摘要；确认时提交编辑文本，不重复压缩。依据 DSH Agent Loop 源码改用 `Agent.inject()`（next-step、wakeup=false）替代 `sessionController.prompt()`，注入后 flush、归档并打开任务，不自动执行。
- 测试：`pnpm run build && pnpm run verify` 53/53；覆盖清理、设置、预览编辑、只注入不 prompt/followup、恢复和原生桥接。
- 安装：0.2.5 `application: applied`，原生新建窗口直接显示尺寸 736×78，设置/浮窗 Slot active，API 401/403。
- 验证限制：本轮合成热键事件未触发回调，截图为全黑，OCR 不可用；未将其记为视觉或全局热键复验通过，已认证页面与真实任务等待状态留给用户走查。
- 文档：0.2.0 测试报告与发布说明归档并修正链接；新增 `16-fixes-0.2.5.md`。按五个修复条目从 0.2.0 累加到 0.2.5，未提升 y；未调用子代理。

## 2026-11-11

### 0.2.10 问答、侧栏分组、升级发布与删除修复（主代理 + 子代理）

- 问答：真实会话日志的 `request/header` 出现 `tools = [web_search, web_search]`；`systemPrompt.assemble()` 拼接所有全局与作用域 schema 提供者，而 `policy.js` 又注册了自己的 `systemPrompt.tools()`。移除该额外提供者，保留 `restrict()`、执行 guard 与 scoped 回退；同时移除 `policy.prepare` 的 per-agent effect 泄漏。
- 侧栏：DSH 隐藏无 `cwd` 的冷会话但始终列出 live 会话，而 Friday 从不 dispose 句柄。仓库改为 idle 约 1.5s 后 flush + dispose，聊天请求期间用 reservation 保活，删除/归档/升级强制释放；已知限制是一轮对话进行中仍可能短暂出现在未分组。
- 升级：`Agent.inject()` 只写 pending next-step 输入，列表投影在 `turn/start` 前把会话标为 blank。改为一条已完成、不调用模型的 seed turn，meta 带 `cwd` 与默认预设；释放临时 Agent 后 `attachSession` + `resolveAgent` 由 DSH 以完整预设恢复；状态机 `creating` → `published`，任务 ID 前缀 `session-`。
- 删除：Host 不再直接拒绝升级会话删除；Inbox 改为软删除并保留 `upgradedSessionId`，同时强制释放 Agent，使 `dsh-chat-manager` 的 live 检查放行；不可读历史行改为隐藏。
- 清空过期：`api.js` 只导入了 `saveConfig`，补齐 `readConfig` 后 `/inbox/cleanup` 不再抛 `ReferenceError`。
- 验证：`pnpm test` 60/60；`node --check` 与 `scripts/check-client.mjs` 通过；真实 DSH 库确认 `Session.create` 接受 seed 且 `applySessionListMetadata` 为 `blank=false`。
- 安装：插件通过 plugin manager 在活动 profile 重载并 active。
- 验证限制：执行代理浏览器无 DSH Web 会话（Connection fence 401），未提取启动 token；提问、升级、删除升级会话、清空过期四项留待用户 GUI 走查。
- 文档：0.2.5 测试报告与发布说明归档为 `07-test-report-0.2.5.md`、`10-release-notes-0.2.5.md`；新增 `17-fixes-0.2.10.md`；同步 CHANGELOG、README 与 `04-model-and-subagent-log.md`。五个修复条目由 0.2.5 累加到 0.2.10，未提升 y。

