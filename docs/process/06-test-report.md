# dsh-friday · 测试报告

> - 测试日期：2026-11-09 至 2026-11-10
> - 版本：0.1.0
> - 环境：macOS 桌面端，DSH Web GUI，profile `desktop`
> - 源码：`deepseek-v4.1 flash/`
> - 方法：Host 单测 + 客户端 bundle 校验 + profile 实装 + API 集成 + 辅助功能树 UI 走查

## 1. 自动化结果

| 项目 | 命令 | 结果 |
| --- | --- | --- |
| Host 单测 | `node --test tests/*.test.js` | 11/11 通过 |
| 客户端 bundle/locale | `node scripts/check-client.mjs` | 通过 |
| Host 语法 | `node --check index.js` + 全部 `src/host/*.js` | 通过 |
| 客户端构建 | `node scripts/build-client.mjs` | 通过，`client.js` 95.8 KiB |

覆盖：消息归一化、引用提取、图片 ref、运行时上下文过滤、配置默认值/校验、热键格式、本地压缩、保留期边界、Inbox cwd 判定。

## 2. 安装与槽位

> - `install_bundle` 首次安装成功，`application: applied`。
> - `include:dsh-friday` 状态 active；无重复路由（第二次加载起使用 effect 释放路由）。
> - `sidebar.panellist` 中 `inbox` 注册 active，位于 dsh-context 之后、与插件/自动化任务/上下文洞察同级。
> - `main` key `inbox` 注册 active；`shell.overlay` 的 `dsh-friday.quick` active。
> - `plugins.bundle.config` key `dsh-friday` 在插件详情页渲染出默认模型/视觉模型/快捷键/保留期。
> - 插件详情页显示标题 `Friday Inbox`、描述与包名 `dsh-friday`。

## 3. API 集成

> - 认证：无 `X-DSH-Friday` 返回 403；带标记且浏览器 Cookie 通过 Connection 校验后返回 200。
> - `GET /config`：返回默认模型、模型目录、图片能力、Inbox 路径、最近会话。
> - `POST /config`：保存/归一化/校验；无效热键被拒绝。
> - `POST /chat`：SSE `meta`、`delta`、`reasoning`、`title`、`done` 正常；标题自动生成。
> - 工具白名单：新建会话的 `request/header.tools` 仅 `['web_search']`。
> - 引用：Web Search 后 `citations` 事件与对话历史均包含来源。
> - 图片：64×64 PNG 可提交，默认模型直接读图回答“红色”；历史返回 attachment ref；附件接口返回 data URL。
> - 视觉兜底：默认模型设为纯文本 `glm-5.3`、视觉模型设为 `mimo-v2.6-pro` 后，图片先生成描述再交默认模型，回答“绿色”；历史保留图片 ref。
> - 升级：模型摘要 `method: 'model'`；新任务 request/header 工具数 32；源会话归档且历史仍为 2 条消息（未被就地压缩）。
> - 重复升级：返回“已归档，不能再次升级”；恢复已升级会话返回 409。
> - 归档/恢复/删除：活动列表与归档列表切换正确；删除后不再出现。
> - 搜索：问题关键词与回答关键词均可命中（修复了 snippet 越界导致空摘要）。
> - 保留期：纯函数边界测试通过；未做 30 天真实计时集成。

## 4. UI 走查（辅助功能树 + 真实鼠标/键盘事件）

> - 侧栏 `Inbox` 可打开；列表显示标题、首问摘要、模型、时间、状态。
> - 详情显示标题、模型、时间、继续/升级/归档/删除按钮；消息正文可见。
> - 浮层可通过 `Option + Space` 打开（焦点在输入框时验证通过）；`Enter`/发送按钮可发起流式回答。
> - 浮层回答结束后，`打开 Inbox` 可切换到 Inbox，新会话出现在列表。
> - 插件详情页配置卡渲染四个配置项；在 Inbox 设置弹窗点击“保存”返回“已保存，下一段对话生效”。
> - 清空 Inbox 后显示空态“还没有对话。按 Option + Space 开始一段。”，活动列表归零。
> - 修复项：输入框自动增高、流式条件滚动、详情刷新不闪烁、操作栏换行、焦点态、减少动效。

## 5. 未完成/受限验证

> - 未取得系统级全局热键：Web 插件只能注册页面级 `keydown`；应用失焦时不触发，已作为已知限制。
> - 未做真实 30 天保留期等待；只验证边界函数与手动清理调用链。
> - 未对多图（>1 张）做端到端 UI 验证；API 端已按批次 `at` 分组。
> - 未做卸载插件后的 Slot 清理截图验证；路由/监听器均使用 effect/guard 释放，代码审查确认。
> - 未做跨站攻击的真实浏览器复现；认证路径已由 Opus 二审确认。
> - 截图不可用（macOS 屏幕录制权限受限），视觉走查基于辅助功能树与真实点击/键盘事件。

## 6. 结论

> - 0.1.0 主链路可用：唤起 → 流式问答 → Inbox 沉淀 → 搜索/续问 → 压缩升级。
> - P0 审阅发现的问题已修复并复测；剩余 P2 性能项与平台限制已记录在 README 与发布说明。

## 7. 最终实装状态

> - 交付前已清空测试用 Inbox 活动会话，最终 UI 显示空态“还没有对话。按 Option + Space 开始一段。”
> - `include:dsh-friday` 为 active；`sidebar.panellist` 的 `inbox`、`main` 的 `inbox`、`shell.overlay` 的 `dsh-friday.quick` 均 active。
> - 插件管理页配置卡与保存动作已实装验证。
> - 未删除测试产生的两个升级任务 Session（位于工作区），保留为升级链路证据；不影响 Inbox 空态。
