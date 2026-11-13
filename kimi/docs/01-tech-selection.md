# 技术路线与框架选型

> - 文档版本：0.1.0
> - 决策日期：2026-11-10
> - 结论：Node ESM + DSH Cordis Services + 共享 React + esbuild + Node Test

## 决策表

| 领域 | 选择 | 原因 | 放弃的方案与原因 |
| --- | --- | --- | --- |
| Host | Node.js ESM，纯 JavaScript | 与 DSH 插件模板一致；可直接使用 Cordis Service；本地安装无编译和运行依赖 | TypeScript 需要额外 Host 构建链，对本规模收益不足 |
| Client | DSH 共享 React，JSX 源码 | 槽位组件天然使用 React；共享运行时避免重复 React 实例 | 不引入 Vue/Svelte，避免与宿主渲染体系不一致 |
| UI 组件 | 自有轻量控件 + `--dsw-alias-*` token | 官方规范禁止把 Client UI primitives 当稳定模块导入；自有控件可保持主题与生命周期可控 | 不复制宿主根节点，不引入第三方 Design System |
| Client 构建 | esbuild 0.25.10，CJS 包装为 `window.__ModuleLoader__.load` | 与当前模块加载协议一致；构建快；仅开发依赖；产物随包交付 | 不采用 CDN/UMD，避免网络依赖和全局冲突 |
| Host 通信 | DSH `webServer` 同源 API + SSE | 支持流式输出；当前 Web/桌面 WebView 均可使用；无需另起服务器 | 不启动独立 HTTP 服务；不使用无认证 localhost 端口 |
| 0.2.0 原生窗口 | Swift AppKit/WebKit/Carbon + 本地 JSON Lines | Web Slot 无系统热键/独立窗口 API；Carbon 提供真实全局唤起，AppKit 提供原生拖动与 Liquid Glass；复用既有 Host 和 QuickOverlay | 不修改 DSH 本体，不伪称浏览器可全局唤起，不另起服务器或私有聊天库 |
| API 安全 | `connection.requestRejection` + 自定义请求头 + JSON Content-Type | 复用 DSH Host/Origin/浏览器认证检查，并拒绝跨站简单请求 | 不仅凭同源猜测或路径保密 |
| 会话 | `ctx.agents` + 原生 Session/SessionPersistence | 获得原生日志、恢复、流式事件、附件和备份语义；无 `cwd` 时不进入工作区 | 不把聊天记录另存为私有数据库，避免失去 DSH 恢复能力 |
| Inbox 识别 | `friday-` Session ID 前缀 + 可重建 JSON 索引 | 前缀可在崩溃后重发现；索引只保存派生元数据，不是内容权威 | 不自定义不可迁移的 Session event type |
| 工具限制 | Agent 作用域 `restrict(allow)` + 执行 `guard` | 同时约束模型可见 schema 与最终执行，防御提示注入 | 不仅在前端隐藏按钮 |
| 图片 | DSH Attachments + 模型 modality 检测 | 统一格式/大小/数量校验和持久化；图片作为多模态内容而非工具读取 | 不用 `read` 等工具读取图片 |
| 升级压缩 | 独立 LLM 摘要请求 + 新正式 Agent | 保留源 Inbox 原貌；正式任务获得压缩初始输入与完整工具 | 不对源会话 `compactNow`，避免就地改写归档历史 |
| 测试 | `node:test` + 纯函数单元测试 + 实机 API/Slot 验证 | 无额外测试运行依赖；覆盖安全与数据派生逻辑 | 不以静态截图代替真实插件验证 |

## 为什么不是完整前端框架

- 该产品只有一个主页面、一个浮层和少量对话框，React 已足够。
- 引入路由、状态管理或组件库会增加包体与宿主主题适配成本。
- 客户端状态按浮层、Inbox、设置三个边界拆分，使用局部 React state 和一个小型发布订阅 store 即可。

## 配置策略

- 设置 UI 注册在 `plugins.row.config`，位于 DSH 插件管理页。
- 配置值通过受认证 Host API 保存到 `$DSH_HOME/dsh-friday-kimi/settings.json`，与其他模型的实现隔离。
- 不直接读写 profile 的 `cordis.patch.yml`，避免破坏用户其他插件配置。
- 默认模型为空时继承 DSH 默认模型；新建会话时固化路由，已有会话不因设置变化而改路由。
