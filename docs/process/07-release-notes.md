# dsh-friday · 发布说明

> - 版本：0.1.0
> - 发布日期：2026-11-10
> - 状态：可运行、已在本机 desktop profile 实装
> - 源码：`deepseek-v4.1 flash/`

## 1. 发布范围

> - L1 快捷对话：页面级 `Option + Space`、浮层、流式 Markdown、图片、引用、停止、5 分钟恢复。
> - L2 Inbox：侧栏入口、列表/详情、搜索、查找窗口、续问、归档、软删除、清空、保留期。
> - L3 升级：模型摘要压缩、工作区选择/新建、完整工具集任务、源会话归档、禁止重复升级。
> - 横切配置：默认模型、视觉模型、快捷键、保留期。
> - 安全：`web_search` 双层白名单；同源 API + DSH Connection 认证；Inbox-only 操作边界。

## 2. 安装与验证

> - `install_bundle` 目标：`/Users/mac/d/dsh-friday/deepseek-v4.1 flash`
> - 结果：`application: applied`，`include:dsh-friday` active
> - 侧栏 `Inbox` 与主面板 `inbox` 槽位 active
> - 浮层 `dsh-friday.quick` active
> - 插件管理页 `Friday Inbox` 配置卡可见
> - 测试报告：`docs/process/06-test-report.md`

## 3. 本版本的关键取舍

> - **热键**：Web 插件无法注册 OS 级全局热键，降级为 DSH 页面内全局；桌面端失焦时不触发。
> - **压缩**：DSH 原生 `compactNow` 会就地改写源会话，与“源会话归档可检索”冲突；改用当前会话模型的单次摘要，失败回退本地压缩。
> - **删除**：不物理删除 Session 日志，改为 DSH 原生归档 + 移出活动列表，避免绕过会话管理与备份。
> - **视觉兜底**：默认模型不支持图片时，由视觉模型先生成描述；历史仍展示原图。
> - **认证**：复用 DSH Connection 的 Host/Origin 与浏览器认证，附带 `X-DSH-Friday` 头与 JSON Content-Type 校验。

## 4. 已知限制

> - 系统级全局热键、Windows/Linux 映射、语音、LaTeX、会话内切换模型、导出：不在本版本。
> - PTC 预设下只暴露 `run_code`，Inbox 的 `web_search` 白名单不可用；本版本不支持。
> - 大 Inbox 的全文搜索仍逐条读取会话日志；普通列表已优先走索引。
> - 极端崩溃窗口可能留下一个未完成的任务会话；升级标记失败会清理，重启后可恢复已存在任务。

## 5. 后续计划

> - 0.2.0：Inbox 搜索改用 DSH `sessionQuery` 索引；多图批次与附件边界补测。
> - 0.3.0：物理删除或可配置保留策略；桌面壳全局热键适配。
> - 0.4.0：语音输入、LaTeX、导出、Windows/Linux。

## 6. 卸载记录（2026-11-10）

> - 原因：取消当前 DSH 版本中的插件安装，为后续版本腾出干净的 profile 空间。
> - 操作：`plugin_manager remove_bundle dsh-friday`，结果 `application: applied`。
> - 已清理 profile：
>   - `package.json` 依赖与 `dsh.profile.bundles` 中的 `dsh-friday` 条目
>   - `pnpm-lock.yaml` 中的链接依赖
>   - `node_modules/dsh-friday` 悬空软链
>   - `.plugin-manager/logs` 中本次安装/卸载的操作日志
> - 已清理插件数据：
>   - `$DSH_HOME/storages/dsh-friday/`
>   - `$DSH_HOME/sessions/--Users-mac-.dsh-storages-dsh-friday-inbox--/`（全部为测试会话）
> - 保留：
>   - 源码目录 `deepseek-v4.1 flash/`（供后续版本参考与复用）
>   - 升级测试产生的两个工作区任务 Session（位于 `dsh-friday` 工作区，不属于 profile 安装残留）
> - 验证：`Config.listConfigs(name=dsh-friday)` 返回空；侧栏 `Inbox` 入口消失；profile 内无 `dsh-friday` / `deepseek-v4.1 flash` 引用。
