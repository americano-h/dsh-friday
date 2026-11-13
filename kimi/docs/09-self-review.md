# 自审与缺陷修正记录

> - 文档版本：0.1.0
> - 审阅者：Kimi k3.1-pro 主代理
> - 子代理：未调用；原因与模型决策见 `04-model-and-subagent-log.md`

## 审阅范围

- PRD 全量 FR 与异常边界。
- Host API、Session/Agent 生命周期、工具策略、附件、模型路由、升级事务。
- Client Slot、快捷键、浮层、Inbox、查找、设置、Markdown 与主题。
- 构建、包资源、安装结果、API 拒绝路径和自动化测试。

## 已修正

| 问题 | 风险 | 修正 |
| --- | --- | --- |
| 正式任务由 Friday Context 持有 | 插件卸载会影响任务独立生命周期 | 改为原生 `sessionController.create/prompt` |
| Agent 作用域注册只有单所有者 | 插件卸载可能残留策略 | 插件 effect 与 Agent disposal 双重释放 |
| `restrict` 不排除其他 scoped schema | 模型可能看到非 Web Search 工具 | 增加 `systemPrompt.tools` 最终过滤 |
| 流式期间最近会话只在 done 更新 | 收起再唤起可能恢复旧会话 | meta 到达即更新 recent |
| 引用 URL 未限制协议 | 不可信结果可能产生危险链接 | Host/UI 仅允许 HTTP(S) |
| 继承默认模型被设置表单固化 | 改快捷键会意外改变默认模型语义 | 原始配置与 effective 模型分离 |
| 归档标记先于原生成功 | 归档失败时源会话提前消失 | 成功后才写 `archivedAt`，失败保留恢复映射 |
| 任务创建与摘要提交间存在恢复空洞 | 可能空任务或重复任务 | `created/submitted` 状态 + 日志查重 + 原任务补交 |
| 归档后重复调用仍执行归档 | 不符合明确拒绝语义 | 已完成升级直接报错，仅恢复路径允许继续 |
| 测试夹具未派生 archived | 重复升级测试出现假失败 | 夹具按 `archivedAt` 计算，与真实 Repository 一致 |

## 保留风险

- Web 插件没有系统级全局热键与独立原生窗口扩展点；0.2.0 已通过独立辅助进程解决，不再把 Web-only 方案冒充全局能力。
- SessionPersistence 不提供物理删除；本版不绕过公开 API 直接删日志。
- 真实模型/视觉/浏览器操作仍需已认证 DSH 页面验证。
- 大规模历史下关键词检索逐条读取 surface，后续可利用 SessionQuery 全文索引优化，但不在本次未实测情况下提前改变数据边界。

## 0.2.0 增补自审

- 原生进程没有另开 HTTP 端口，页面 CSP 禁止网络；聊天与附件仍通过原 Host 服务，未绕开 Friday 身份或工具策略。
- 原生与 DSH Client 的 React 运行时已隔离：Slot 仍共享宿主 React，只有独立 WebKit 页面打包自己的 React。
- 配置通知改为值变化才触发，避免原生状态加入后扩大重复请求。
- Inbox 旧请求完成后按当前选中 ID 提交状态，避免快速切换时覆盖新详情；中止订阅不取消 Agent 的语义保持。
- 全局热键、拖动和收起均用真实 HID/CGWindow 验证；浏览器认证和真实模型仍保留为明确限制。
- 本轮未调用子代理，未并发，详见 `04-model-and-subagent-log.md`。

## 子代理复核决策

- 本轮主代理能够基于实时 Cordis Inspect、运行时安装结果和 22 项测试完成证据闭环，因此未额外调用高能模型。
- 没有把低难度文件修改、样式、测试或文档任务分派给高能模型。
- 未为速度并发调用任何子代理。
