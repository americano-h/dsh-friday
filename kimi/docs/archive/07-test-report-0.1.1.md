# 测试与验证报告

> - 文档版本：0.1.1
> - 验证日期：2026-11-10
> - 被测包：`dsh-friday` 0.1.1
> - 源码目录：`kimi/`
> - 历史版本：[0.1.0 测试报告](07-test-report-0.1.0.md)

## 自动化结果

- 命令：`pnpm run build && pnpm run verify`
- 结果：23/23 通过，0 失败。
- Client：语法与 `window.__ModuleLoader__` 包装有效。
- 覆盖：配置、快捷键、图片、消息/引用、工具策略、存储、压缩升级、SSE 生命周期和静态安全约束。

## 0.1.1 回归用例

| 场景 | 验证结果 |
| --- | --- |
| 全局只有 `load_workspace_dependencies` / `sidebar_open` / `working_directory` | 不再调用含未知名称的 allow；这些全局工具被 deny，Agent 创建继续 |
| 全局无 `web_search` | Friday 作用域注册一个搜索工具，不注册 `web_fetch` |
| 搜索执行 | 仅调用 `ctx.web.search({ query, maxResults: 8 })`，结果与 sources metadata 正常 |
| Provider 未就绪 | `when` 返回 false，最终 `{ schemas: [], knownNames: [] }`，不绕过认证 |
| 全局已存在 `web_search` | 保持 `restrict({ allow: ['web_search'] })`，不重复注册 scoped 工具 |
| 其他工具调用 | Agent/global guard 继续硬拒绝，正式任务不受影响 |

## 全量测试组

- `chat.test.js`：SSE meta/delta/done、done 前 flush、断开响应不取消 Agent。
- `config.test.js` / `hotkey.test.js`：默认配置、非法配置、NBSP 与自定义快捷键。
- `images.test.js`：格式、大小批次与 Attachments 路径。
- `policy.test.js`：原有 allow、缺失全局搜索工具的 scoped 降级、deny、guard、最终 step schema。
- `sessions.test.js`：问题/回答/图片/HTTP(S) 引用派生，危险 URL 过滤。
- `store.test.js`：串行更新与损坏备份恢复。
- `upgrade.test.js` / `upgrade-service.test.js`：压缩无工具、重复升级拒绝、原任务恢复摘要。
- `static.test.js`：无 raw HTML 注入、无 Harness Client 导入、包版本与 Slot key 一致。

## 安装与运行时检查

| 项目 | 结果 |
| --- | --- |
| 0.1.0 Bundle 安装与四个 Slot | 已通过，详见[历史报告](07-test-report-0.1.0.md) |
| 0.1.1 回归测试 | 23/23 通过 |
| 0.1.1 重新安装 | `application: applied`，Host active；Inbox、浮层、配置 Slot active |

## 验证边界

- 全局缺少 `web_search` 的根因已通过当前 Cordis Inspect 确认：`@deepseek-ai/dsh-tool-web` 为 `inactive`，但 `ctx.web.search/searchReady` 正式 Service 可用。
- 浏览器视觉和真实模型端到端 QA 仍受已认证页面条件限制；不将单元测试或 Host active 冒充实际回答成功。
- 既有 `@deepseek-ai/dsh-llm-deepseek-account` 配置错误未由本任务修改。
