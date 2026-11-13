# Changelog

## 0.2.10 · 2026-11-11

### Fixed

- 修复普通提问无回答、Provider 报 `Tool names must be unique`：删除 Friday 多余的 `systemPrompt.tools()` 提供者，避免 `web_search` 被重复声明；`restrict()` 与执行 guard 继续只允许 `web_search`，并移除 `policy.prepare` 的 per-agent effect 泄漏。
- 修复 Friday 会话（含已归档的升级源会话）出现在 DSH 侧栏「未分组」：Agent 空闲约 1.5s 后 flush + dispose，聊天请求进行中以 reservation 保活，删除/归档/升级时强制释放。
- 修复升级后工作区只显示空白新对话：任务改为携带一条已完成、不调用模型的 seed turn 创建，释放临时 Agent 后由 DSH 以完整预设恢复；新增 `creating` → `published` 状态机与两种中断恢复，任务 ID 使用原生 `session-` 前缀。
- 修复升级后的对话无法删除（「已被占用」）：升级/归档会话在 Inbox 走软删除并保留 `upgradedSessionId`，同时强制释放 Agent；不可读历史行改为隐藏。
- 修复「清空过期」报 `readConfig is not defined`：`api.js` 补齐 `readConfig` 导入。

### Verification

- 60 项自动化测试通过（基线 53），新增 5 项 Agent 释放回归与 2 项升级 seed 回归；`node --check` 与 `scripts/check-client.mjs` 通过。
- 真实 DSH 库确认 seed 被接受且会话投影为非 blank；插件已在活动 profile 重载并 active。
- 未在已认证 GUI 端到端验证（Connection fence 返回 401，未提取启动 token）；待用户走查：提问、升级到工作区、删除升级后的对话、运行「清空过期」。

## 0.2.5 · 2026-11-11

### Fixed

- 统一全局唤起与 Inbox 新建浮窗的白色极简样式和尺寸，移除空态/底部提示小字；新建内容 720×62，外侧透明描边 8px。
- 插件管理、设置与模型身份统一命名为 Friday，Inbox 仅保留为左侧功能页名称。
- 修复已有升级映射但归档中断的会话参与 clear/cleanup 并报错的问题；此类会话不再进入活动清理，正常过期会话仍归档。
- 升级先展示可编辑压缩上下文，工作区路径弱化显示；确认后使用 `Agent.inject()` 注入编辑内容，不再通过 `sessionController.prompt()` 自动执行，正式对话等待用户指令。
- 设置页默认模型、视觉模型、快捷键与保留期始终显示并可保存；最近会话读取失败不再使配置表单消失。

### Verification

- 53 项自动化测试通过，覆盖只注入不执行、编辑摘要透传、清理状态、设置容错与统一界面结构。
- 安装 `application: applied`，原生新建窗口 736×78（含边距），API 401/403 未回退。
- 当前合成热键与截图 OCR 未形成有效视觉证据，浏览器操作和真实正式任务等待状态待用户走查。

## 0.2.0 · 2026-11-10

### Added

- 新增随 DSH Host 启动的 macOS 原生 Friday 面板，支持系统全局 `Option+Space`、自定义快捷键、任意拖动、跨 Space 显示与原生 Liquid Glass；DSH 内浮层也可拖动。
- 原生窗口通过本地 WebKit/JSON Lines 桥接复用既有 Friday Host、Session、Attachments、流式问答和升级服务，不新增聊天数据库或未认证监听端口。
- Inbox 详情底部新增固定输入框，在当前页面流式续问、停止和添加图片，不再打开快捷浮层。
- 快捷输入区抽为共享组件：灰色「向 Friday 提问」、左侧图片加号、右侧发送，统一图标尺寸、边距与对齐。

### Changed

- DSH 浮层提高透明度并加入背景模糊；Inbox 升级按钮简化为「升级」。
- 配置变更仅在快捷键实际变化时通知，避免重复配置加载。

### Verification

- 44 项自动化测试通过；Swift/AppKit/WebKit/Carbon 原生程序与两套 Client 构建通过。
- 实测系统热键唤起/收起、原生窗口坐标拖动、React 就绪与真实窗口 OCR 文案；0.2.0 安装 `application: applied`，API 401/403 未回退。
- 已认证浏览器视觉与真实模型端到端仍待用户页面走查。

## 0.1.4 · 2026-11-10

### Fixed

- 修复 Inbox 加载 0.1.1 遗留日志时报 `stored session "…" failed validation: Error: session event at seq 10 message must have role "user"`：DSH 持久化层在读取时即校验并拒绝该日志，0.1.2 的 `rawSnapshot()` 同样无法读回。现在识别该类错误、隔离损坏会话、跳过列表读取，并让详情与续问给出友好降级；不删除或改写物理日志。

### Verification

- 36 项自动化测试通过，新增 4 项损坏会话容错回归。
- 0.1.4 安装 `application: applied`、Host active；API 403/401 未回退；0.1.2/0.1.3 的修复保持不变。

## 0.1.3 · 2026-11-10

### Fixed

- 修复问答后 Inbox 显示 `record is not defined`：`list()` 的 `filter` 回调越界引用了 `map` 回调参数 `record`，改为先按记录对象过滤再映射 id，并对畸形快照使用可选链。

### Verification

- 32 项自动化测试通过，新增 3 项 Inbox 列表回归。
- 0.1.3 安装 `application: applied`、Host active；API 403/401 未回退；0.1.2 的 UserMessage 与历史日志恢复保持不变。

## 0.1.2 · 2026-11-10

### Fixed

- 修复 Inbox 快捷对话续问时 `seed user/message at index N message must have role "user"` 阻断回答的问题。`agent.followup()` 现在收到包含 `id`、`role: "user"`、`content`、`source` 的完整 `UserMessage`，不再把缺少 role 的对象写入原生 Session。
- 兼容 0.1.0/0.1.1 已写入的损坏历史：续问时从原始持久化事件补齐缺失的 `id` / `role`，以修正后的 seed 创建新会话；旧日志不删除、不改写，旧索引记录映射后隐藏重复项，重复请求幂等。

### Verification

- 29 项自动化测试通过，新增完整 UserMessage、seed 归一化、损坏日志恢复和幂等用例。
- 使用真实持久化日志和真实 `@deepseek-ai/dsh-session` 校验：原始日志在 `index 10` 被拒绝，补齐 role 后通过。
- 0.1.1 的 `web_search` scoped 注册、deny 已知全局工具、执行 guard 和 DSH Connection 认证保持不变。

## 0.1.1 · 2026-11-10

### Fixed

- 修复当前 profile 未全局注册 `web_search` 时，`tools.restrict({ allow: ['web_search'] })` 抛出 unknown-tool 并阻断全部快捷问答的问题。现在 Friday 会在 Agent 作用域注册仅使用 `ctx.web.search` 的搜索工具，并拒绝已知全局工具。
- 最终工具 schema 改用当前 step 的 `toolSet`，确保搜索 Provider 未就绪时不会绕过 `when` 条件继续展示工具。

### Verification

- 23 项自动化测试通过，新增无全局 `web_search`、搜索就绪检查和引用 metadata 回归用例。

## 0.1.0 · 2026-11-10

### Added

- 新增与 DSH 功能导航同级的一级 `Inbox` 入口和列表/详情页面。
- 新增页面内 `Option + Space` 浮层，支持流式 Markdown、多轮问答、5 分钟恢复、手动新建、停止、复制和重新生成。
- 新增图片粘贴、拖拽、原生文件框与视觉模型整轮兜底。
- 新增原生 Session 持久化、Web Search 引用、关键词/时间检索、查找窗口和续问。
- 新增删除、清空、30 天默认保留期和手动到期清理。
- 新增压缩升级、全部工作区选择、原生新建工作区、源会话归档与重复升级防护。
- 新增插件管理页默认模型、视觉模型、快捷键与保留期配置。
- 新增 DSH Connection API 认证、Session/附件归属校验和双层 Web Search 工具约束。

### Verification

- 22 项自动化测试通过。
- 本地 bundle 安装应用成功，Host fiber 为 active。
- `sidebar.panellist`、`main`、`shell.overlay`、`plugins.row.config` 实时注册检查通过。

### Known limits

- 系统级全局热键和独立置顶窗口需要桌面壳扩展。
- 删除与到期清理不提供 Session 日志物理擦除。
