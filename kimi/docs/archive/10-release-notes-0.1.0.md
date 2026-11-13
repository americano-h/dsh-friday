# Friday Inbox 0.1.0 发布说明

> - 发布日期：2026-11-10
> - 包名：`dsh-friday`
> - 版本：0.1.0
> - 安装源：`/Users/mac/d/dsh-friday/kimi`
> - 当前状态：已在 desktop profile 启用，Host fiber active

## 交付内容

- 一级 `Inbox` 侧栏入口、列表/详情、活动/升级归档视图。
- 页面内 Option+Space 浮层、流式 Markdown、多轮问答、停止/复制/重新生成。
- 图片粘贴、拖拽、原生文件框与视觉模型整轮兜底。
- 原生 Session 持久化、5 分钟恢复、检索、查找窗口和续问。
- 删除、清空、默认 30 天保留期和手动清理。
- 自动压缩升级、工作区选择、原生新建工作区、任务跳转与归档防重。
- 插件管理页默认模型、视觉模型、快捷键和保留期设置。
- DSH Connection 认证、Session/附件归属校验、仅 Web Search 的 schema 与执行约束。

## 验证摘要

- 22/22 自动化测试通过。
- Bundle 安装应用成功，Host active。
- 四个实时 Slot 注册通过。
- API 缺请求头 403、未认证 401。
- locale/icon/client 资源解析成功；图标 583 bytes。

## 使用入口

1. 在 DSH 左侧栏点击 `Inbox`。
2. 在 DSH 页面内按 `Option + Space`。
3. 在插件管理页打开 `dsh-friday` 的 `friday` 条目配置。

## 已知限制

- 仅页面内快捷键；不支持系统级全局唤起或独立置顶窗口。
- 删除/清理为 Inbox 隐藏 + 原生归档，不物理擦除 Session 日志。
- 已认证页面视觉走查和真实模型/Web Search 端到端 QA 尚未完成；详见 `07-test-report.md`。
- 既有 DeepSeek Account 插件配置错误可能影响账户模型调用，本发布未改动该用户配置。

## 后续优先级

1. 在已认证 DSH 页面完成真实问答、视觉、键盘、主题和升级走查。
2. 桌面壳提供正式全局快捷键/独立窗口扩展点后补齐系统级能力。
3. DSH 提供公开物理删除与保留期语义后再实现日志擦除，不直接操作私有存储文件。
