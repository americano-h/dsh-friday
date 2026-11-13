# dsh-friday · 技术路线与框架选型

> - 状态：已定稿
> - 决策日期：2026-11-09
> - 适用版本：0.1.0
> - 结论：Host 用 Node ESM 原生 Cordis 插件；Client 用 React 18 + esbuild 打包为 DSH Module Loader 单文件；状态以 DSH Session 日志为唯一事实源，插件只保留派生索引

## 1. 约束条件

> - DSH 插件运行在既有 Host 进程与 Web 页面内，不能替换应用根、不能另起一套前端框架。
> - 侧栏入口、浮层、主面板、插件配置页都必须通过 Slot 注册，使用宿主主题 token 与交互习惯。
> - Client 模块只能通过宿主 Module Loader 提供的 React 与少量内置符号运行，不能直接 import 宿主 Client 包。
> - Host 侧可以注入 DSH Service（agents、llm、tools、attachments、sessionQuery、workspaceRegistry、compaction 等），但插件包不在 DSH 源码树内，不能依赖未随包发布的内部模块。
> - 会话必须实时持久化、可恢复、可被 DSH 会话管理检索；不能自建一套无法恢复的聊天数据库。

## 2. 选型结论

| 层 | 选择 | 原因 |
| --- | --- | --- |
| Host 运行时 | Node.js ESM，Cordis `apply(ctx, config)` 插件 | DSH 原生插件形态；无构建步骤，安装即可运行；便于直接注入 Host Service |
| Host 语言 | JavaScript（ESM）+ JSDoc | 插件包不携带 DSH 类型包，TypeScript 只能手写近似类型，收益低；以行内注释和模块边界保留可读契约，避免构建链 |
| Client 框架 | React 18 函数组件 | Module Loader 已内置 React；与宿主组件模型一致；无需重复安装 React |
| Client 语言/构建 | JSX + esbuild 打包为单文件 `client.js` | JSX 可读性显著高于 `createElement`；esbuild 零配置、产出符合 `window.__ModuleLoader__.load` 的 CJS 包装，避免运行期多文件加载 |
| UI 样式 | 原生 CSS + `--dsw-alias-*` 主题 token | 不引入 Tailwind/组件库，避免与宿主样式体系冲突；明暗主题自动跟随 |
| Markdown | 自研轻量解析器（GFM 子集） | 不能 import 宿主 Markdown 组件；流式渲染需要可控、无 XSS 的纯 React 输出 |
| 会话存储 | DSH Session 持久化 + sessionQuery | 满足实时持久化、可恢复、可检索、随 DSH 会话管理备份；不重复造轮子 |
| 插件自有状态 | `$DSH_HOME/storages/dsh-friday/` 下的 JSON 派生索引 | 只存归档关联、升级关联、图片摘要、配置；可由 Session 日志重建，不承载事实源 |
| Host↔Client 通道 | 同源 HTTP API + SSE | 插件无法生成 Typert Remote 命名空间；HTTP/SSE 与 dsh-better-sidebar 等既有插件一致，足够承载流式输出与文件上传 |
| 测试 | Node 原生 `node:test` + 手工 UI 验证 | 零额外依赖；Host 纯函数可单测；UI 以实装页面验证为准 |

## 3. 被否决的方案

> - **自建 LLM 聊天循环 + 自建 SQLite**：会绕开 DSH 的工具执行、权限、流式、标题、压缩与备份；与 PRD “复用 DSH 会话管理”直接冲突。
> - **完全依赖 Client 的 `ctx.remote.session` 远程接口**：浮层需要简化的流式协议，直接解析 Session 快照、assistant-stream 与投影成本高；Host 侧归一化后再 SSE 更稳。
> - **引入 Next/Vite/Tailwind 或组件库**：插件只渲染到 Slot，不需要路由与独立应用壳；额外依赖会放大安装与主题一致性风险。
> - **用 iframe 承载浮层/Inbox**：拿不到宿主主题 token 与 locale，还会破坏原生交互。
> - **系统级全局快捷键**：Web 页面无法注册 OS 级热键；本版本降级为 DSH 页面内全局快捷键，并在 README 与测试报告中明确记录。

## 4. 关键实现原则

> - Session 日志是唯一事实源；派生索引损坏时可以重建。
> - 工具白名单双层落实：模型可见层 `tools.restrict({ allow: ['web_search'] })` + 执行层 `tools.guard`。
> - 升级先压缩再建任务，不提供“原样升级”入口。
> - 升级后的原 Inbox 会话写入 DSH 原生归档集合，禁止重复升级。
> - 所有新增 UI 文案走 locale；所有颜色走主题 token。
