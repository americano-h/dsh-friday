# 测试与验证报告

> - 文档版本：0.1.4
> - 验证日期：2026-11-10
> - 被测包：`dsh-friday` 0.1.4
> - 源码目录：`kimi/`
> - 历史版本：[0.1.3 测试报告](07-test-report-0.1.3.md)、[0.1.2 测试报告](07-test-report-0.1.2.md)、[0.1.1 测试报告](07-test-report-0.1.1.md)、[0.1.0 测试报告](07-test-report-0.1.0.md)

## 自动化结果

- 命令：`pnpm run verify`（`node --check index.js` + `scripts/check-client.mjs` + `node --test tests/*.test.js`）。
- 结果：36/36 通过，0 失败。
- Client：本次未修改 `client.js`（90,220 bytes，mtime 与 0.1.1 一致），语法与 `window.__ModuleLoader__` 包装检查通过。
- 覆盖：配置、快捷键、图片、消息/引用、工具策略、UserMessage 结构、历史日志恢复、Inbox 列表、损坏持久化日志隔离、存储、压缩升级、SSE 生命周期和静态安全约束。

## 0.1.4 回归用例

| 场景 | 验证结果 |
| --- | --- |
| 识别 `stored session … failed validation` | `isSeedValidationError` 同时匹配 seed 前缀与持久化层校验前缀，拒绝无关错误 |
| Inbox 列表遇到损坏日志 | 跳过该会话、返回其他合法会话，不抛 `record`/`role` 类错误 |
| 损坏会话隔离 | 首次标记 `corruptedAt`，后续列表不再重复读取该日志 |
| 详情与续问降级 | `get` 返回 `null`，`ensureAgent` 给出「unreadable stored history」友好提示，不暴露 DSH 内部错误 |

> - 新增 `tests/corrupt-session.test.js` 4 项；总测试数由 32 增至 36。

## 全量测试组

- `corrupt-session.test.js`：持久化层校验错误识别、列表跳过、隔离缓存、详情/续问降级。
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
| 0.1.1 / 0.1.2 / 0.1.3 回归与重装 | 23/23、29/29、32/32 通过，Host active，详见[历史报告](07-test-report-0.1.3.md) |
| 0.1.4 自动化回归 | 36/36 通过 |
| 0.1.4 安装 | 主代理已卸载并重装：`application: applied`、`version: 0.1.4`、`include:friday` = `fiberPhase: active` |
| 0.1.4 API 安全 | 缺 `X-DSH-Friday` 请求头 403；未通过 DSH Connection 认证 401 |
| Client Slot 实时检查 | Client Cordis inspect 通道仍对所有 client provider 报 `input must be an object`，无法复查；`client.js` 与 Slot 注册源码未改动，沿用 0.1.1 已验证的四个 Slot 结论 |
| 真实问答与列表 | 待用户在已认证 DSH 页面重试；损坏日志隔离由 4 项回归覆盖 |

## 验证边界

- 0.1.1 遗留日志的物理内容无法通过 DSH 公开读 API 取回（持久化层自身拒绝校验），因此该条会话被隔离并从 Inbox 隐藏，不宣称读回或修复其内容；物理日志保留在磁盘。
- 本次自动化不启动新的 DSH 实例，不修改 `~/.dsh` 既有会话日志，不绕过持久化 API 直接改写存储文件。
- 浏览器视觉和真实模型端到端 QA 仍受已认证页面条件限制。
