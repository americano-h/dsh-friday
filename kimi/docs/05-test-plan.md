# 测试计划

> - 文档版本：0.1.0
> - 对应需求：[归档 PRD](../../docs/archive/PRD-0.3.0.md) §6、§7
> - 测试原则：真实 API 优先，静态检查不冒充视觉或系统能力验证

## 自动化

| 类别 | 用例 |
| --- | --- |
| 配置 | 默认 30 天；非法快捷键/保留期/模型被拒绝；模型序列化；recent 失败仍显示设置参数 |
| Inbox 身份 | 仅 `friday-` 前缀且无 `cwd` 的 Session 被承认；普通/正式任务不可操作 |
| 消息派生 | 用户/助手文本、图片、Web 引用、首问摘要、时间排序、归档字段 |
| 检索 | 问题与回答均可命中；时间范围与状态过滤；删除项不出现 |
| 工具策略 | 模型 schema 仅 `web_search`；bash/read/MCP/skill/subagent/goal 等被 guard 拒绝；正式任务不受影响 |
| 快捷键 | `Option+Space` 使用 `event.code`，避免 NBSP；自定义修饰键；输入框 Esc；原生 Carbon 注册与冲突状态 |
| 原生桥接 | 配置/Inbox 映射、Host 错误、流式事件、完成与 Abort；本地页面 CSP；React clientReady |
| 原生窗口 | 系统热键唤起/收起、标题栏拖动坐标、NSGlassEffectView、真实窗口 OCR 文案 |
| Inbox 内联续聊 | 固定底部共享输入框，当前 Session 流式续问，不打开 QuickOverlay |
| 生命周期 | ≤5 分钟恢复、>5 分钟新建、手动新建；SSE 断开不取消 Agent |
| 图片 | data URL 严格解析；格式/大小/数量由 DSH 限制；视觉与描述兜底路由 |
| 升级 | 预览不创建任务、摘要可编辑、确认不重复压缩、inject 不 prompt/followup、恢复不重复注入、正式任务等待指令 |
| 清理 | 普通活动/过期会话归档；升级中断会话不参与 clear/cleanup，映射与摘要保留 |
| API 安全 | DSH Connection 拒绝、缺自定义头、非 JSON 写请求、越权 Session/附件 |

## 实机验证

1. 安装后 `sidebar.panellist` 出现 Inbox，`main` 有同名 keyed occupant。
2. 插件管理页显示 Friday 标题、描述、图标和配置表单。
3. 在其他应用焦点下按 Option+Space 唤起原生面板，拖动标题栏并再次收起；页面内快捷键与输入焦点保持可用。
4. 新建问答后检查任何现有工作区均无该 Session；重启/恢复后内容仍在 Inbox。
5. 粘贴、拖拽、文件框三种图片来源；无视觉模型时输入禁用并说明。
6. 搜索问题与回答，打开查找窗口并在详情底部固定输入框续问，确认不再弹出 QuickOverlay。
7. 升级时编辑压缩上下文并选择工作区，确认目标对话已注入但没有自动执行；源会话归档且不可重复升级。
8. 浅色/深色主题、键盘焦点、长回答滚动、空态与错误态。

## 明确验证限制

- 系统级全局快捷键与独立置顶窗口由 0.2.0 原生辅助进程提供；验证依赖 DSH Host 运行，不再以 Web API 缺失作为产品限制。
- 物理删除 Session 日志无公开 API，验证的是 Inbox 清理与原生归档，不声称物理擦除。
- 模型/Web Search 的实际结果受账户、网络与 Provider 状态影响，失败路径与成功路径分别记录。
