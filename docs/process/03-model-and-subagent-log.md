# dsh-friday · 子代理与模型调用记录

> - 记录日期：2026-11-09 至 2026-11-10
> - 原则：一次只调用一个子代理；高难度/审阅用高能模型，界面审美用审美模型，低难度重复任务不占用高能模型。
> - 调用方式：全部通过 `workflow` 的单 agent 脚本串行执行，未并发。
> - 记录范围：模型、调用原因、输入范围、产出、采纳情况。

## 调用总览

| # | 阶段 | 模型 | 任务类型 | 状态 | 主要产出 |
| --- | --- | --- | --- | --- | --- |
| 1 | 架构与安全评审 | OpenRouter / Claude Opus 5.5 | 高难度审阅 | 已完成 | 7 个 P0、7 个 P1、6 个 P2 |
| 2 | 视觉与交互评审 | Magpie / Kimi-K3.1-Pro | 前端审美 | 已完成 | 5 个高影响缺陷 + 3 组 native/polish 建议 |
| 3 | 实现后二审 | OpenRouter / Claude Opus 5.5 | 高难度审阅 | 已完成 | 3 个 P1、若干 P2，确认工具策略与启动路径无新问题 |

## 1. 架构与安全评审（Opus 5.5）

> - 原因：PRD 覆盖宿主机能、会话持久化、工具白名单、压缩升级与原生 UI，跨层决策密集；需要强推理模型独立找漏洞。
> - 未使用低阶模型的原因：普通模型容易只复述 PRD，难以发现 Host/Client 边界、DSH 生命周期与同源 API 的信任问题。
> - 输入范围：[归档 PRD](../archive/PRD-0.3.0.md)、`docs/process/01-tech-selection.md`、`docs/process/02-architecture.md`、Host/Client 全部源码。
> - 输出：P0/P1/P2 分级，附文件位置与最小修复建议。
> - 关键发现：
>   - 自建 API 缺少同源/认证校验，存在跨站触发 `/chat`、`/upgrade`、`/inbox/clear` 的风险。
>   - `tools.restrict` 的 deny 列表与内存集合可能漏掉后来注册/恢复的 Agent。
>   - 升级缺少幂等锁；原生 `compactNow` 会就地改写源会话，破坏归档历史。
>   - 索引损坏会被空索引覆盖；卸载时 220ms 防抖窗口内的写入会丢失。
>   - 自定义快捷键请求漏了 `/v1`；Option+Space 的 `event.key` 是 NBSP；5 分钟恢复规则未实现。
> - 采纳：
>   - 已改为 DSH Connection `requestRejection` + `X-DSH-Friday` + JSON Content-Type 校验。
>   - 已改为 `restrict({ allow: ['web_search'] })` + 基于 Inbox cwd 的 guard，并在启动/工具变更时重试。
>   - 已增加升级锁、任务标记先写、失败清理标记、模型摘要（不改写源会话）。
>   - 已增加索引损坏备份、卸载 flush、导入/导出/删除的 Inbox 限定。
>   - 已修复 `/v1`、`event.code === 'Space'`、5 分钟恢复、详情刷新与焦点样式。
> - 未采纳/降级：
>   - 「系统级全局热键」仍受 Web 插件能力限制，作为已知限制记录。
>   - 「物理删除 Session 日志」仍为软删除，避免绕过 DSH 会话管理。

## 2. 视觉与交互评审（Kimi K3.1 Pro）

> - 原因：浮层与 Inbox 是用户直接感知的产品门面，需要更强的排版、层次、动效与信息密度判断。
> - 未使用 Opus 的原因：该阶段是审美与界面语言任务，Kimi K3.1 Pro 更贴合；Opus 保留给架构与安全评审。
> - 输入范围：`styles.js`、`overlay.jsx`、`inbox.jsx`、`main.jsx`、`locale/zh.json`、PRD §4.1/4.2/4.4。
> - 输出：5 个高影响缺陷、3 组 DSH 原生差距、P0/P1/P2 polish 列表。
> - 采纳：
>   - 输入框自动增高（Shift+Enter 多行不再挤在 24px 内）。
>   - 流式期间仅在接近底部时自动滚动，用户向上阅读时不抢滚动位置。
>   - 详情操作栏允许换行，列表列宽改为 `clamp(260px, 32%, 340px)`。
>   - 详情刷新不再整块闪成 loading；保留当前详情并显示列表 loading。
>   - 扩展 `:focus-visible` 覆盖发送、tab、行、引用、工作区；补齐 hover 与 `prefers-reduced-motion`。
>   - 空态浮层不再强制预留 120px。
> - 未采纳/降级：
>   - 全量字号/圆角归一化留作 P2；已避免影响信息密度。
>   - `window.confirm` 已替换为原生风格确认框。
>   - 阴影与 `#fff` fallback 属于少数无 token 场景，保留并记录。

## 3. 实现后二审（Opus 5.5）

> - 原因：P0 修复涉及认证、工具白名单、升级幂等、SSE 生命周期与附件边界，需要独立复核修复是否引入新问题。
> - 输入范围：全部 Host/Client 源码 + 修复说明。
> - 输出：3 个 P1、若干 P2。
> - 采纳：
>   - 增加 DSH Connection 认证，移除易误伤的 `getOrigin()` 比较。
>   - 增加 Inbox-only 校验到 archive/delete/attachment/cancel。
>   - 升级失败时清除任务标记；已有标记可恢复；请求进行中加锁。
>   - SSE 卸载时通过 `entry.fail` 关闭连接；图片批次按 `at` 分组。
>   - 视觉兜底图片通过索引 `imageRefs` 回读。
>   - 客户端限制图片 MIME 为 png/jpeg/webp/gif。
> - 保留的 P2：
>   - 会话量很大时，Inbox 搜索仍需逐条读取日志；已优化普通列表走索引，搜索作为后续性能项。
>   - 崩溃窗口内可能留下一个未完成的任务会话；已通过标记恢复与失败清理缩小窗口。
>   - PTC 预设下 Web Search 白名单不可用，作为已知限制。

## 低难度任务说明

> - 没有为文件读写、重复构建、格式化、简单文案搬运调用高能模型。
> - 这些工作由当前会话直接完成；高能模型仅用于上述三次独立评审。
> - 子代理均串行调用，未为了速度并发。
