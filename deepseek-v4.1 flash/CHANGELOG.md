# Changelog

## 0.1.0 — 2026-11-10

> - 首个可运行版本：侧栏 Inbox、快捷浮层、流式 Markdown、图片、引用、会话沉淀、搜索、升级、配置、保留期。

### Added

> - `Option + Space` 页面级全局快捷键与浮层；5 分钟恢复上一次会话。
> - Inbox 会话创建、恢复、实时持久化、标题生成。
> - 工具白名单：仅 `web_search`，模型可见层 restrict + 执行层 guard。
> - 流式回答、Markdown、Web Search 引用、图片粘贴/拖拽/文件选择。
> - Inbox 列表、详情、关键词搜索、查找窗口、归档、软删除、清空、保留期清理。
> - 升级：模型摘要压缩、工作区选择、新建工作区、创建完整工具集任务、源会话归档、禁止重复升级。
> - 插件管理页配置：默认模型、视觉模型、快捷键、保留期。
> - 中文/英文 locale、插件图标、派生索引与损坏恢复。

### Security

> - 同源 API + `X-DSH-Friday` 标记 + DSH Connection Host/Origin/浏览器认证。
> - 附件与取消等操作只允许 Inbox 会话。
> - 索引损坏自动备份为 `.corrupt-<timestamp>` 并重建。

### Known limitations

> - 系统级全局热键、物理删除 Session 日志、PTC 预设下的 Web Search 不在本版本范围。
