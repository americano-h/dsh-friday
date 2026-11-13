# 架构与接口设计

> - 文档版本：0.1.0
> - 状态：主链路设计基线
> - 权威需求：[归档 PRD](../../docs/archive/PRD-0.3.0.md) 0.3.0

## 组件

```text
QuickOverlay / InboxPage / SearchDialog / UpgradeDialog / SettingsForm
                              │ fetch + SSE
                    /dsh-friday/api/v1/*
                              │
                     DSH Connection admission
                              │
macOS NativePanel (WebKit) ── local JSON Lines ── FridayNativeWindow
                              │
        ┌─────────────────────┼──────────────────────┐
        │                     │                      │
  FridayRuntime         InboxRepository        UpgradeService
        │                     │                      │
  Agent/Session APIs    derived JSON index      LLM summary + new Agent
        │                     │                      │
  web_search-only       friday-* Session IDs    workspace cwd + full tools
```

## 数据权威与隔离

- 会话问题、回答、图片引用、工具结果、标题和模型请求头均以 DSH Session 日志为权威。
- Inbox Session 使用 `friday-<uuid>`，创建时不传 `cwd`，因此不会归属已有工作区。
- `$DSH_HOME/dsh-friday-kimi/index.json` 仅缓存标题、摘要、归档/删除/升级映射等派生状态；损坏时备份并从 Session 重建。
- 已升级源会话通过 `workspaceRegistry.archiveSession` 原生归档；删除和到期清理采用 Inbox 隐藏 + 原生归档。当前 SessionPersistence 无物理删除 API，物理擦除明确列为平台限制。

## 问答流程

1. 新对话读取一次当前默认模型并创建 Agent；历史对话沿用其已记录路由。
2. Agent setup 注册 Friday prompt、`tools.restrict({ allow: ['web_search'] })` 与 Agent 作用域 guard。
3. 图片经 `attachments.saveImages` 验证和持久化；默认模型支持视觉时直接接收图片，否则整个带图轮次路由到配置的视觉模型，原始图片仍保存在 Session 中。
4. `agent/assistant-stream` 仅用于实时渲染；`session/event` 的持久事实用于最终状态和引用。
5. SSE 断开只停止当前页面订阅，不取消 Agent，因此收起浮层仍继续生成。
6. 每轮结束调用 Session flush，保证已生成内容进入持久化屏障。

## 检索与续问

- 列表从索引和 Session header 派生，按 `updatedAt` 倒序。
- 关键词检索读取当前 surface，覆盖用户问题与助手回答；时间筛选在列表层执行。
- 对话查找窗口复用同一列表/搜索 API。
- 续问恢复同一 Session，保留图片引用、引用和原生消息历史。

## 升级流程

1. 点击升级后先读取当前 surface，使用独立 LLM 请求生成可预览、可编辑的压缩摘要；此阶段不创建任务。
2. 用户确认时提交编辑后的摘要与目标工作区，以 Session ID 加锁保证幂等，确认阶段不重复压缩。
3. 验证工作区有效，通过原生 `sessionController.create` 创建带其 `cwd` 的正式 Session；不写 Friday 工具限制。
4. 通过 `sessionController.resolveAgent` 获取正式 Agent，使用 `Agent.inject()` 将完整上下文写入 next-step 并 flush；该 API 不唤醒 Agent，任务等待用户下一步指令。
5. 原子记录升级映射并归档源会话；Client 通过 `uiWorkspace.openSession` 跳转。
6. `created/injected` 分别恢复注入与归档；事件查重避免重复注入，不重复创建任务。

## 主要 API

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/config` | 配置、模型目录、图片能力、最近会话 |
| PUT | `/config` | 保存默认/视觉模型、快捷键、保留期 |
| GET | `/inbox?q=&from=&to=&status=` | 列表与检索 |
| GET | `/inbox/:id` | 会话详情 |
| DELETE | `/inbox/:id` | 隐藏并归档单条活动会话 |
| POST | `/inbox/clear` | 清空活动 Inbox |
| POST | `/inbox/cleanup` | 执行到期清理 |
| POST | `/chat` | SSE 流式问答 |
| POST | `/chat/cancel` | 停止生成 |
| POST | `/chat/regenerate` | 重新生成最后一轮 |
| GET | `/workspaces` | 全部已有工作区 |
| POST | `/upgrade/preview` | 生成可编辑压缩上下文，不创建任务 |
| POST | `/upgrade` | 注入编辑后的上下文，创建等待指令的正式对话 |
| GET | `/attachment/:sessionId/:attachmentId` | 读取受限 Inbox 图片 |

## 平台边界

- 0.1.0 的 Web-only 边界在 0.2.0 由随包 macOS 辅助进程扩展：`shell.overlay` 继续服务 DSH 页面，独立 NativePanel 通过本地桥接复用同一 Host。
- 系统全局快捷键、独立置顶窗口与 Liquid Glass 只在 DSH Host 运行时有效；DSH 完全退出后不保留后台常驻能力。
- 原生页面没有网络访问权限，不新增 HTTP 监听；Session、工具策略和附件仍由上述原生 DSH 数据路径约束。
