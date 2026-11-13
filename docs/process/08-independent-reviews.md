# dsh-friday · 独立评审摘要

> - 用途：保留三轮独立评审的原始结论方向，便于后续模型/维护者追溯“为什么这样改”。
> - 完整调用原因与模型选择见 `03-model-and-subagent-log.md`。
> - 评审均未直接改代码；修复由本会话完成并复测。

## 评审 A · Opus 5.5（架构/安全，第一轮）

> - 结论：7 P0 / 7 P1 / 6 P2。
> - 核心 P0：
>   - API 缺少同源/认证，存在跨站触发高权限操作的风险。
>   - `restrict` deny 列表与内存集合对恢复/后注册 Agent 不可靠。
>   - 升级无幂等锁；`compactNow` 会破坏源会话历史。
>   - 索引损坏被空索引覆盖；卸载时防抖写入丢失。
> - 核心 P1：
>   - 自定义热键请求漏 `/v1`；Option+Space 的 `event.key` 为 NBSP；5 分钟恢复未实现。
>   - 归档/升级会话仍可继续；保留期/清空只扫 200 条。
>   - SSE 关闭清理与图片 PromptContentPart 边界。
> - 处置：全部 P0 修复；P1 除“列表性能”外修复；列表改为普通列表走索引、搜索回读日志。

## 评审 B · Kimi K3.1 Pro（视觉/交互）

> - 结论：2 P0 / 3 P1 + native 差距 + polish 列表。
> - 核心 P0：
>   - 多行输入不自动增高。
>   - 流式每个 delta 强制滚到底，用户无法回读。
> - 核心 P1：
>   - 详情操作栏拥挤/溢出；列表列宽固定。
>   - 刷新详情整块闪 loading。
>   - focus/hover 覆盖不全。
> - 处置：全部 P0/P1 修复；增加空态浮层紧凑、`prefers-reduced-motion`、确认框替代 `window.confirm`、字号/圆角部分归一化。

## 评审 C · Opus 5.5（实现后二审）

> - 结论：3 P1 + 若干 P2；工具策略与启动路径未发现新问题。
> - P1：
>   - 插件路由仍未复用 DSH Connection 认证；仅自定义头对 DNS rebinding/本地进程不足。
>   - attachment/cancel/archive/delete 未校验 Inbox 归属。
>   - 升级 prompt 失败会留下已标记但空的任务。
> - 处置：
>   - 增加 `connection.requestRejection()`；保留 `X-DSH-Friday` 与 JSON Content-Type。
>   - 增加 `isInboxSessionId` 到四个操作。
>   - 升级失败清理标记；已有任务可恢复；保留锁。
> - 保留 P2：
>   - 大 Inbox 搜索逐条读日志；崩溃窗口可能留下未完成任务；PTC 预设不支持 Web Search。
