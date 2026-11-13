# Friday

> - 版本：0.2.10
> - 包名：`dsh-friday`
> - 平台：macOS 上的 DeepSeek Harness Web/Desktop WebView
> - 需求基线：仓库 [归档 PRD](../docs/archive/PRD-0.3.0.md) 0.3.0
> - 状态：已在活动 profile 中重载并 active；60 项自动化测试通过；已认证 GUI 端到端走查待用户完成
> - 当前资料：[0.2.10 修复记录](docs/17-fixes-0.2.10.md)、[测试报告](docs/07-test-report.md)、[发布说明](docs/10-release-notes.md)

Friday 在 DSH 中提供轻量快捷问答：极简浮层流式回答、仅限 Web Search、多模态图片、原生 Session 持久化、侧栏 Inbox 检索与续问，以及可编辑上下文升级为等待指令的正式对话。

## 使用

1. 在 DSH 插件管理页安装本目录并启用 `dsh-friday`。
2. 保持 DSH 运行，在任意应用中按 `Option + Space` 唤起原生 Friday 面板；也可点击左侧栏 `Inbox`。
3. 输入问题；可粘贴、拖拽图片，或点击图片按钮打开 macOS 原生文件选择框。
4. 在 Inbox 中搜索并选中会话，直接在详情底部续问；也可删除、清空或清空过期会话。
5. 点击「升级」，查看并编辑压缩上下文，选择工作区后点击「压缩并新建」；正式对话带上上下文并等待下一步指令。
6. 在 Friday 插件条目的配置页设置默认模型、视觉模型、快捷键和 1–365 天保留期。

## 安全与数据

- Friday 会话使用 `friday-` ID 且不包含工作区 `cwd`。
- 工具 schema 与执行层均仅允许 `web_search`；搜索内容按不可信数据处理。
- 会话正文、图片引用和引用信息由 DSH 原生 Session/Attachments 管理。
- `$DSH_HOME/dsh-friday-kimi/` 只保存设置与可重建索引，避免与其他实现混用。
- API 复用 DSH Connection 认证，并要求自定义请求头与 JSON 写请求；原生窗口通过本地桥接复用同一 Host，不另开监听端口。

## 已知平台限制

- 全局快捷键与独立 Liquid Glass 面板由随包 macOS 辅助进程提供，DSH Host 退出后不可用；当前交付二进制为 arm64，其他 Mac 可用源码重新构建。
- SessionPersistence 没有物理删除 API；删除、清空和到期清理表现为 Inbox 隐藏 + DSH 原生归档，不声称物理擦除日志。
- 一轮对话进行中，live 的 Friday 会话仍可能短暂出现在 DSH 侧栏「未分组」；DSH 不提供受支持的方式隐藏无 `cwd` 的 live 会话（header `origin` 只接受 `subagent`）。空闲约 1.5s 后会释放，列表随即恢复干净。
- 已认证 GUI 的端到端走查尚未完成：提一个问题、升级到工作区、删除升级后的对话、运行「清空过期」四项仍需用户在真实页面确认。
- 语音、Windows/Linux 快捷键、LaTeX、会话内模型切换和导出按 PRD 延期。

## 开发

```bash
pnpm install --ignore-scripts
pnpm run build
pnpm run verify
```

- Host：无运行时第三方依赖的 Node ESM；管理 macOS 辅助进程和本地 JSON Lines 桥接。
- Client：DSH 共享 React + JSX，esbuild 生成 `client.js`；独立原生页面生成自包含 `native/window.js`。
- Native：Swift/AppKit/WebKit/Carbon，使用 `NSGlassEffectView` 并提供旧系统材质回退。
- 测试：Node 内置 `node:test`。
- esbuild 的安装脚本被显式忽略；其平台二进制可直接完成构建，插件安装不需要执行构建脚本。

## 过程资料

- `docs/00-project-kickoff.md`：启动与范围。
- `docs/01-tech-selection.md`：选型理由。
- `docs/02-architecture.md`：架构、数据与接口。
- `docs/03-development-plan.md`：计划和状态。
- `docs/04-model-and-subagent-log.md`：模型与子代理决策台账。
- `docs/05-test-plan.md`：测试计划。
- `docs/06-development-log.md`：开发日志。
- `docs/07-test-report.md`：现行 0.2.10 自动化与实装验证结果；0.2.5 及更早版本在 `docs/archive/`。
- `docs/08-acceptance-matrix.md`：PRD 逐项验收矩阵。
- `docs/09-self-review.md`：自审和缺陷修正记录。
- `docs/10-release-notes.md`：现行 0.2.10 发布说明；0.2.5 及更早版本在 `docs/archive/`。
- `docs/11-hotfix-0.1.1.md`：`web_search` 未注册故障的根因与修复记录。
- `docs/12-hotfix-0.1.2.md`：`UserMessage` 缺 role 导致 seed 校验失败及历史日志恢复记录。
- `docs/13-hotfix-0.1.3.md`：Inbox 列表 `record is not defined` 作用域错误修复记录。
- `docs/14-hotfix-0.1.4.md`：持久化层 `stored session failed validation` 容错隔离记录。
- `docs/15-feature-0.2.0.md`：全局原生弹窗、Liquid Glass、共享输入组件与 Inbox 内联续聊设计。
- `docs/16-fixes-0.2.5.md`：浮窗/命名统一、清理、设置参数与可编辑且不自动执行的升级流程修复。
- `docs/17-fixes-0.2.10.md`：重复工具名、未分组会话、升级空白任务、升级会话删除与清空过期五项修复记录。
- `docs/archive/`：被取代的 0.1.0–0.1.4、0.2.0、0.2.5 测试报告及发布说明。

## License

MIT；图标为本项目原创 SVG。
