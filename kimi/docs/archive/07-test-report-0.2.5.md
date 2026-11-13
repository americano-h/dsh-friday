# 测试与验证报告

> - 文档版本：0.2.5
> - 验证日期：2026-11-11
> - 被测包：`dsh-friday` 0.2.5
> - 源码目录：`kimi/`
> - 历史版本：[0.2.0 测试报告](07-test-report-0.2.0.md)、[0.1.4 测试报告](07-test-report-0.1.4.md)、[0.1.3 测试报告](07-test-report-0.1.3.md)

## 自动化结果

- 命令：`pnpm run build && pnpm run verify`。
- 结果：**53/53 通过，0 失败**。
- `client.js` 约 105.2 KiB，DSH ModuleLoader 包装和语法检查通过；`native/window.js` 与 Swift arm64 辅助程序构建通过。
- 既有 Session、UserMessage、工具策略、附件、损坏日志隔离、存储和 SSE 回归全部保持通过。

## 0.2.5 新增/更新回归

| 测试 | 覆盖 |
| --- | --- |
| `cleanup.test.js` | 升级中断会话不进入活动清理；过期普通会话正常归档；clear/cleanup 不再报已升级删除错误；恢复映射保留 |
| `config-view.test.js` 2 项 | 最近会话读取失败仍返回模型与保留期配置；设置源码包含默认/视觉模型、快捷键、保留期和保存 |
| `upgrade-service.test.js` 4 项 | 预览不创建/唤醒任务；编辑摘要只注入一次；不调用 prompt/followup；中断恢复不重复创建；空摘要拒绝 |
| `native-transport.test.js` 5 项 | 既有桥接、流与 Abort，加升级预览及编辑摘要透传 |
| `native-static.test.js` 7 项 | 原生产物、拖动、输入区顺序、Inbox 内联续聊、极简白色浮窗、Friday 命名、可编辑升级与弱化路径 |

## 升级不自动执行的证据

- DSH `@deepseek-ai/dsh-agent-loop` 源码：`Agent.inject(input)` 调用 `send(input, 'next-step', false)`；`followup(input)` 才调用 `send(input, 'next-turn', true)`。
- 测试中的 `followup` 被设置为一旦调用即失败，升级仍成功，证明流程没有提交执行任务。
- `sessionController.prompt` 的调用计数为 0，`Agent.inject` 为 1，Session flush 为 1，源归档为 1。
- 确认时 LLM 压缩调用不增加；实际注入文本为用户编辑后的摘要。

## 安装与运行时检查

- 0.2.5 Bundle：`application: applied`、`version: 0.2.5`、enabled true。
- `sidebar.panellist#inbox`、`main#inbox`、`shell.overlay#dsh-friday.quick`、`plugins.row.config#dsh-friday#friday` 四个 Slot 均实时 active；Host `include:friday` 为 `fiberPhase: active`。
- API 带 Friday 请求头但未通过 DSH 认证为 **401**；缺请求头为 **403**。
- 原生辅助进程已启动；直接显示测试测得新建窗口 **736×78**，与 DSH 新建浮窗的 720×62 内容加 8px 外边距一致。
- 安装警告仍为既有 `llm-deepseek-account models is no longer configurable`，与 Friday 无关，未修改其配置。

## 验证限制

- 当前合成全局热键事件未触发辅助进程回调，虽然 `RegisterEventHotKey` 返回成功；本轮不将全局热键列为重新实测通过。热键实现未因本轮界面修复而改变。
- 当前截图文件取样为全黑，Vision OCR 无有效文本；未声称完成截图文案或玻璃材质视觉验收。结构测试验证不渲染底部提示、空态小字和 Friday Inbox 标题。
- 已认证页面中的设置控件点击、清理按钮、升级弹窗和正式任务等待状态仍需用户走查；自动化未创建或修改真实正式任务。
- 0.2.0 的全局热键与拖动实测见[历史报告](07-test-report-0.2.0.md)，不作为本轮新增视觉证据。
