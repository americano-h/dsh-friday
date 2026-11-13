# 02 · 可行性研究（API 侦察）

> - 文档版本：0.1.0
> - 侦察时间：2026-11-09
> - 环境：DSH 0.2.2-rc.1，profile `desktop`，Web GUI `http://127.0.0.1:49454`
> - 手段：`cordis_inspect_list` / `cordis_inspect_query`（无参目录）、已安装第三方 bundle 源码、app.asar 内发行包源码与生成式 Typert schema

## 侦察工具的限制（已记录，影响结论置信度）

> - `cordis_inspect_query` 在本构建中**拒绝一切带 `input` 的调用**（对象、数组、字符串均报 `"input" must be an object`），因此无法用 `root` / `service` / `entry` 精确查询单个 Slot 或 Service 契约。
> - 补偿手段：无参目录 + 完整结果落盘文件 + app.asar 内 `lib/*.js` / `lib/typert.host.js` / `README.md` 源码核对；关键结论均由源码直接印证，而非猜测。
> - 影响：Slot 的 `props` 与 `occupants` 目录细节通过发行包 `lib/client.js` 源码确认；Service 精确入参通过生成式 Typert zod schema 确认。

## PRD §4.5 七项依赖逐条结论

| 依赖 | 结论 | 依据 | 本迭代处理 |
| --- | --- | --- | --- |
| 侧栏入口 | **支持** | Client Slot `sidebar.panellist`（list，`id`/`order`/`label`）；`dsh-client-ui-sidebar/lib/client.js` 中 `entriesOfSlot('sidebar.panellist')` 生成面板项，`selectPanel(id)` 打开；occupant 收到 `{size, active}` | 注册 `id = dsh-friday-hy4-inbox`，与 `main` 的 `key` 完全一致 |
| 全局唤起 | **不支持** | Host/Client Service 目录中无 globalShortcut / nativeWindow / tray / BrowserWindow 相关服务；`shell` 服务仅为 bash 执行 | 降级为应用内快捷键（capture 阶段 `Alt+Space`，`e.code === 'Space'`），不承诺系统级全局与独立置顶窗口 |
| 隔离会话 | **部分不支持** | 可创建不归属工作区的 Session（`session.create` 的 `workspaceId` 可选），但插件无法让该 Session 同时脱离工作区又纳入 DSH 备份/保留期治理 | 插件自有 JSON 域存储（`storages/dsh-friday-hy4/<profile>/`），明确写入限制清单 |
| 上下文压缩 | **不能直接复用** | `ctx.compaction` 的 `compactNow/compactRegion` 需要 `CompactionAgentContext`（Agent 上下文），插件侧没有 Agent | 插件自实现「单轮 LLM 摘要 + 确定性兜底」，算法在 `04` 明示 |
| 创建任务 | **支持** | `ctx.remote.session.create({workspaceId?,cwd?,sessionId?,agentPreset?}) → {sessionId}`；`session.prompt({requestId,sessionId,mode,content,clientTimeZone})`；`uiWorkspace.openSession` / `startSession(workspaceId,{prompt})`；`workspaces.create({path})`；`uiWorkspace.pickDirectory()`；Host `workspaceRegistry.list()` | 升级在 Client 侧串联 create→prompt→openSession，失败回退 startSession 草稿 |
| 配置承载 | **支持但换实现** | `plugins.bundle.config`（按包名 keyed，`{view:'page'}`）可承载自定义配置页；`export const Config` + settings 服务需 `@deepseek-ai/schemastery`，零构建本地 bundle 无法稳定解析 | 自定义配置页 + 独立 `settings.json`（带版本号与手写校验） |
| 归档态 | **插件自持** | 无插件可用的原生归档态服务；Inbox 会话非 DSH Session | 会话记录内 `status: active|archived` + `promotedTo`，升级前置写入防重复 |

## 其他关键 API 事实

> - `ctx.llm.stream({provider, model, messages, tools?, signal?, maxTokens?})` 产出 chunk：`text-delta{index,text}`、`tool-call-delta{index,id,name,argumentsDelta}`、`block-start/block-end/usage/finish`；`finish.reason` 形如 `{kind, failure}`。
> - 工具 schema 形如 `{name, description, parameters}`；`GenerateOptions.tools` 即为该数组。
> - `ctx.web.search({query, maxResults})` 返回带 `sources[]` 的结果；搜索结果必须按不可信数据处理。
> - Host `ctx.webServer.register({kind:'exact', path, handler(req,res)})` 是第三方 bundle（`dsh-chat-manager`）已验证的 Client↔Host 通道；准入用 `ctx.connection.requestRejection(req)`。
> - Client 主题 token 仅 `--dsw-alias-*`（14 个）与 `--dsw-specific-sidebar-fill`。
> - `ctx.remote.session.prompt` 的 `content` 为 `[{type:'text',text}] | [{type:'image',...}] | [{type:'file',receiptId}]`；`mode` 为 `queue|steer`。
> - 已安装 bundle 中 `dsh-cost-meter`、`dsh-context`、`dsh-chat-manager`、`dsh-better-sidebar` 提供了 `window.__ModuleLoader__.load` / schemastery Config / HTTP 路由 / `hostRouteUrl` 的真实范式。

## 可行性结论

> - 「带左侧栏入口」这一首要目标完全可行，且是一级导航项而非「更多」内的二级入口。
> - L1/L2/L3 主链路可通过已验证 API 组合实现；四项平台能力存在缺口，均已确定降级方案并写入 `08`。
> - 结论置信度：Slot 与 Session 契约由发行包源码直接确认（高）；`llm.stream` 工具循环由 `BlockAssembler` 源码确认（高）；`web.search` 返回细节按防御式解析（中）。
