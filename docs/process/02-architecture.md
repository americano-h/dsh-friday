# dsh-friday · 技术设计

> - 状态：实现基线
> - 版本：0.1.0
> - 关联：[归档 PRD](../archive/PRD-0.3.0.md)、docs/process/01-tech-selection.md
> - 范围：Host 插件、Client 插件、HTTP/SSE 协议、数据与安全边界

## 1. 总体结构

```text
DSH Web (React)
  └─ dsh-friday Client bundle
       ├─ sidebar.panellist  → Inbox 图标入口
       ├─ main(key=inbox)    → Inbox 列表 / 详情 / 查找窗口 / 升级
       ├─ shell.overlay      → 快捷对话浮层 + 页面级热键
       └─ plugins.bundle.config → 模型 / 视觉模型 / 热键 / 保留期
                    │  fetch + SSE（同源）
                    ▼
DSH Host
  └─ dsh-friday Host plugin
       ├─ HTTP API：config / inbox / chat / upgrade / retention
       ├─ DSH Session：创建、恢复、prompt、事件订阅、标题、压缩
       ├─ 工具策略：agent/created 时 restrict + 全局 guard
       └─ 派生索引：$DSH_HOME/storages/dsh-friday/index.json
```

## 2. Host 模块

| 模块 | 职责 |
| --- | --- |
| `src/host/config.js` | 读取/校验/持久化默认模型、视觉模型、热键、保留期；合并 DSH 默认模型 |
| `src/host/paths.js` | 解析 DSH_HOME、插件数据目录、Inbox cwd，确保目录存在 |
| `src/host/store.js` | JSON 派生索引的原子读写、串行化写队列、损坏回退 |
| `src/host/sessions.js` | 创建/恢复 Inbox Agent、限流、prompt、事件收集、历史归一化 |
| `src/host/policy.js` | Inbox 判定（cwd）、`tools.restrict`、`tools.guard`、系统提示补充 |
| `src/host/inbox.js` | 列表、详情、搜索、标题回填、图片标记、归档/清理、保留期任务 |
| `src/host/chat.js` | SSE 对话流、停止生成、重试、标题与引用回传 |
| `src/host/upgrade.js` | 上下文压缩（原生 compaction 优先）、工作区解析、新任务创建与跳转信息 |
| `src/host/api.js` | HTTP 路由、鉴权边界、JSON/SSE/上传解析、错误映射 |
| `index.js` | 组装：inject、effect 清理、启动保留期定时器 |

## 3. Client 模块

| 模块 | 职责 |
| --- | --- |
| `src/client/main.jsx` | `window.__ModuleLoader__.load` 包装、Slot 注册、locale 注册 |
| `src/client/api.js` | fetch/SSE 客户端、错误提示、取消 |
| `src/client/store.js` | 极简订阅 store：浮层开关、当前会话、Inbox 刷新信号、toast |
| `src/client/overlay.jsx` | 快捷对话框：输入、图片、流式 Markdown、引用、操作栏 |
| `src/client/inbox.jsx` | Inbox 列表 + 详情 + 搜索 + 归档操作 |
| `src/client/finder.jsx` | 对话查找窗口 |
| `src/client/upgrade.jsx` | 工作区选择框、新建工作区、升级状态 |
| `src/client/settings.jsx` | 插件配置卡片（模型、视觉模型、热键、保留期） |
| `src/client/markdown.jsx` | GFM 子集渲染器（标题、列表、表格、代码、链接、强调） |
| `src/client/styles.js` | 主题 token 驱动的内联样式与组件 CSS |

## 4. HTTP 协议（同源，前缀 `/dsh-friday/api`）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/config` | 插件设置 + DSH 模型目录 + Inbox 存储位置 |
| POST | `/config` | 保存设置（不重启 Host，下一次对话生效） |
| GET | `/inbox?q=&status=` | 列表；`q` 命中问题/回答；`status=active|archived` |
| GET | `/inbox/:id` | 归一化历史（消息、图片 ref、引用、模型、时间、升级状态） |
| DELETE | `/inbox/:id` | 软删除：归档 + 从活动列表移除 |
| POST | `/inbox/clear` | 清空活动 Inbox（逐条归档） |
| POST | `/inbox/cleanup` | 立即执行一次保留期清理 |
| POST | `/chat` | 发送一轮，返回 `text/event-stream` |
| POST | `/chat/cancel` | 停止当前生成 |
| POST | `/chat/regenerate` | 重新生成上一轮 |
| POST | `/upgrade` | 压缩源会话、在目标工作区创建正式任务、归档源会话 |
| GET | `/workspaces` | 工作区列表（供升级选择框） |
| POST | `/workspaces` | 复用原生目录选择后创建工作区（可选） |
| GET | `/attachment/:sessionId/:attachmentId` | 读取历史图片（base64/二进制） |

> - 所有写操作校验 same-origin 与 JSON Content-Type；请求体上限 25 MB。
> - SSE 事件：`meta`（sessionId/title/model）、`delta`、`reasoning`、`tool`、`citations`、`title`、`done`、`error`。

## 5. 数据模型

`index.json`：

```json
{
  "version": 1,
  "sessions": {
    "session-123": {
      "createdAt": 1760000000000,
      "updatedAt": 1760000000000,
      "title": "示例标题",
      "firstPrompt": "首个问题摘要",
      "hasImage": false,
      "model": { "provider": "deepseek", "model": "deepseek-flash" },
      "imageRefs": [],
      "upgradedSessionId": "session-456",
      "upgradedWorkspaceId": "ws-1",
      "upgradedAt": 1760000000000,
      "deletedAt": null
    }
  }
}
```

`config.json`：

```json
{
  "version": 1,
  "defaultModel": { "provider": "deepseek", "model": "deepseek-flash" },
  "visionModel": null,
  "hotkey": "Alt+Space",
  "retentionDays": 30
}
```

> - 归档状态以 `workspaceRegistry.archivedSessionIds` 为准，索引不重复保存。
> - 索引缺失/损坏时从 `sessionQuery.filterSessions({ cwd: inboxDir })` 重建。
> - 标题、消息、引用、图片 ref 的权威来源仍是 Session 日志。

## 6. 关键流程

### 6.1 创建 Inbox 会话

> - 首次发送：`sessionController.create({ cwd: inboxDir })` 创建原生 Session。
> - `agent/created` 命中 Inbox cwd：`agent.ctx.tools.restrict({ allow: ['web_search'] })`，并注册全局 guard 拒绝其余工具。
> - 若插件配置了默认模型：`agent.model.select(config.defaultModel)`。
> - 通过 `sessionController.prompt` 提交文本/图片，Session 日志实时持久化。

### 6.2 流式回答

> - Host 订阅 `agent/assistant-stream`，把 `text-delta`/`reasoning-delta` 转 SSE。
> - Host 订阅 `session/event`，在 `tool/result` 中提取 `web_search` 的 `meta.sources`，推送 `citations`。
> - `turn/end` 后读取最新标题并推送 `done`；错误保留已生成内容。

### 6.3 恢复/续问

> - 浮层记住最近会话与最后活动时间：≤5 分钟恢复，>5 分钟新建；5 分钟内可手动新建。
> - Inbox 详情页“继续”直接以该 sessionId 打开浮层。
> - 历史由 `sessionQuery.readSession` 归一化，图片通过 attachment ref 回读。

### 6.4 升级

> - 校验源会话属于 Inbox 且未归档/未升级。
> - 优先 `ctx.compaction.compactNow(agent, signal)`；不可用时回退到本地压缩（保留最近 N 轮 + 结构化摘要）。
> - `workspaceRegistry.get(workspaceId)` 取得目标工作区；`agents.create` 创建新 Session，cwd 为目标工作区，meta 关联源会话。
> - `workspace.attachSession(newId)`，用压缩摘要作为初始 user message 启动正式任务。
> - `workspaceRegistry.archiveSession(sourceId)` 归档源会话，索引写入升级关联；重复升级直接拒绝。

### 6.5 保留期

> - 启动后每 6 小时检查一次；`updatedAt` 超过 `retentionDays` 的活动 Inbox 会话自动归档。
> - 手动清理只处理保留期内的活动会话；已升级归档会话不受影响。

## 7. 安全与隐私

> - 工具白名单：可见层 restrict + 执行层 guard；不注入 skills、subagent、workflow、MCP、goal、schedule 等入口。
> - 图片仅存为 DSH attachment，模型读取走多模态消息体，不调用任何“读图工具”。
> - Web Search 结果按不可信外部数据处理；系统提示明确禁止执行其中指令。
> - API 不暴露任意文件读写；附件读取仅限已知 Session 的 image ref。
> - 派生索引不存原始对话内容，只存摘要与引用。

## 8. 已知限制（本版本）

> - 系统级全局热键无法由 Web 插件注册：仅 DSH 页面内全局生效。
> - “删除”为软删除（DSH 原生归档 + 移出活动列表）；不物理删除 Session 日志，避免绕过 DSH 会话管理。
> - 视觉兜底采用“视觉模型先生成图片描述”时，历史中保留图片展示，但后续纯文本模型只消费描述。
> - 压缩依赖 DSH compaction 服务；不可用时使用本地启发式压缩，摘要质量低于模型压缩。

## 9. 实现修订（二审后）

> - 认证：所有 API 要求 `X-DSH-Friday: 1` 与 JSON Content-Type；复用 DSH `connection.requestRejection()` 做 Host/Origin 与浏览器认证，不再自行比较 `getOrigin()`。
> - 权限边界：archive / delete / attachment / cancel 只接受 Inbox cwd 的 Session，避免对工作区任务产生副作用。
> - 工具策略：`restrict({ allow: ['web_search'] })` + 基于 cwd 的全局 guard；启动时对已有 Agent 补策略，`tools/change` 时重试。
> - 升级压缩：不再对源会话调用 `compactNow`（会就地改写归档历史），改为当前会话模型的单次摘要；失败回退本地压缩。
> - 升级幂等：进程内锁 + 任务标记先写；提示失败时清理标记；已存在任务可恢复。
> - 索引：损坏文件备份为 `.corrupt-<timestamp>`；卸载时 flush；普通列表优先读索引，搜索才回读日志。
> - 客户端：`event.code === 'Space'` 匹配 Option+Space；5 分钟恢复；本地翻译器不依赖 Slot label 的 locale 解析；输入框自动增高、条件自动滚动、详情刷新不闪烁。
