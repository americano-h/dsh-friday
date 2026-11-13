# 测试与验证报告

> - 文档版本：0.1.3
> - 验证日期：2026-11-10
> - 被测包：`dsh-friday` 0.1.3
> - 源码目录：`kimi/`
> - 历史版本：[0.1.2 测试报告](07-test-report-0.1.2.md)、[0.1.1 测试报告](07-test-report-0.1.1.md)、[0.1.0 测试报告](07-test-report-0.1.0.md)

## 自动化结果

- 命令：`pnpm run verify`（`node --check index.js` + `scripts/check-client.mjs` + `node --test tests/*.test.js`）。
- 结果：32/32 通过，0 失败。
- Client：本次未修改 `client.js`（90,220 bytes，mtime 与 0.1.1 一致），语法与 `window.__ModuleLoader__` 包装检查通过。
- 覆盖：配置、快捷键、图片、消息/引用、工具策略、UserMessage 结构、历史日志恢复、Inbox 列表、存储、压缩升级、SSE 生命周期和静态安全约束。

## 0.1.3 回归用例

| 场景 | 验证结果 |
| --- | --- |
| 问答后 Inbox 存在 Friday 会话 | `repository.list()` 正常返回活动会话，不再抛 `record is not defined` |
| 混合持久化记录 | 带 `cwd` 的 Friday 会话与普通 `task-` 会话均被排除 |
| 畸形快照 | `header` 缺失或记录为 `null` 时列表不崩溃，仍返回合法 Friday 会话 |
| 关键词检索 | 问题与回答文本仍可命中并返回 `snippet` |

> - 新增 `tests/list.test.js` 3 项；总测试数由 29 增至 32。

## 全量测试组

- `list.test.js`：存在 Friday 会话时的列表、混合记录过滤、畸形快照、关键词检索。
- `chat.test.js`：SSE meta/delta/done、done 前 flush、断开响应不取消 Agent、完整 UserMessage 入参。
- `recovery.test.js`：seed 归一化、合法日志不变、seed 错误识别、损坏会话恢复与幂等。
- `config.test.js` / `hotkey.test.js`：默认配置、非法配置、NBSP 与自定义快捷键。
- `images.test.js`：格式、大小批次与 Attachments 路径。
- `policy.test.js`：allow、缺失全局搜索工具的 scoped 降级、deny、guard、最终 step schema。
- `sessions.test.js`：问题/回答/图片/HTTP(S) 引用派生，危险 URL 过滤。
- `store.test.js`：串行更新与损坏备份恢复。
- `upgrade.test.js` / `upgrade-service.test.js`：压缩无工具、重复升级拒绝、原任务恢复摘要。
- `static.test.js`：无 raw HTML 注入、无 Harness Client 导入、包版本与 Slot key 一致。

## 安装与运行时检查

| 项目 | 结果 |
| --- | --- |
| 0.1.0 Bundle 安装与四个 Slot | 已通过，详见[历史报告](07-test-report-0.1.0.md) |
| 0.1.1 回归测试与重装 | 23/23 通过，Host active，详见[历史报告](07-test-report-0.1.1.md) |
| 0.1.2 回归测试与重装 | 29/29 通过，Host active，详见[历史报告](07-test-report-0.1.2.md) |
| 0.1.3 自动化回归 | 32/32 通过 |
| 0.1.3 安装 | 主代理已卸载并重装：`application: applied`、`version: 0.1.3`、`include:friday` = `fiberPhase: active` |
| 0.1.3 API 安全 | 缺 `X-DSH-Friday` 请求头 403；未通过 DSH Connection 认证 401 |
| Client Slot 实时检查 | 本次 Client Cordis inspect 通道仍对所有 client provider 报 `input must be an object`，无法复查；`client.js` 与 Slot 注册源码未改动，沿用 0.1.1 已验证的四个 Slot 结论 |
| 真实问答与列表 | 待用户在已认证 DSH 页面重试；`record is not defined` 已由 3 项列表回归覆盖 |

## 验证边界

- 0.1.2 的根因已通过真实持久化日志和真实 `@deepseek-ai/dsh-session` 校验复现；0.1.3 的列表错误由模拟混合持久化快照的单元测试覆盖。
- 本次自动化不启动新的 DSH 实例，不修改 `~/.dsh` 既有会话日志。
- 浏览器视觉和真实模型端到端 QA 仍受已认证页面条件限制；安装后的实机验证由主代理完成，用户页面重试结果未由自动化代验。
