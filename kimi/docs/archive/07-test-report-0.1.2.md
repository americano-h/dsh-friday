# 测试与验证报告

> - 文档版本：0.1.2
> - 验证日期：2026-11-10
> - 被测包：`dsh-friday` 0.1.2
> - 源码目录：`kimi/`
> - 历史版本：[0.1.1 测试报告](07-test-report-0.1.1.md)、[0.1.0 测试报告](07-test-report-0.1.0.md)

## 自动化结果

- 命令：`pnpm run verify`（`node --check index.js` + `scripts/check-client.mjs` + `node --test tests/*.test.js`）
- 结果：29/29 通过，0 失败。
- Client：本次未修改 `client.js`，语法与 `window.__ModuleLoader__` 包装检查继续通过。
- 覆盖：配置、快捷键、图片、消息/引用、工具策略、UserMessage 结构、历史日志恢复、存储、压缩升级、SSE 生命周期和静态安全约束。

## 0.1.2 回归用例

| 场景 | 验证结果 |
| --- | --- |
| 普通提问调用 `agent.followup` | 入参是完整 `UserMessage`：包含 `id`、`role: "user"`、`content`、`source` |
| 重新生成调用 `agent.followup` | 同样使用完整 `UserMessage`，只改变 `source.kind` |
| 旧日志 `user/message` 缺 `role` | `normalizeSessionSeed` 补齐 `role: "user"`，保留已有 `id` |
| 旧日志 inbox 插入消息缺 `id` / `role` | 补齐 UUID 与 user role，事件顺序和数量不变 |
| 合法日志再次归一化 | `changed: false`，未修改的事件保持引用不变 |
| DSH seed 错误识别 | 精确匹配 `seed ... at index N`、`message must have role`、`lacks an identified message` |
| 真实损坏会话恢复 | 原始日志不删除、不改写；用修正后的 seed 创建新原生会话，旧索引记录映射后隐藏 |
| 恢复幂等 | 同一会话再次请求复用已恢复会话，不重复创建 |
| 真实 DSH 校验 | 真实 0.1.1 日志在 `index 10` 被拒绝；仅补齐 role 后同一 `Session.create` 通过 |

## 全量测试组

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
| 0.1.2 自动化回归 | 29/29 通过 |
| 0.1.2 安装 | 主代理已卸载并重装：`application: applied`、`version: 0.1.2`、`include:friday` = `fiberPhase: active` |
| 0.1.2 API 安全 | 缺 `X-DSH-Friday` 请求头 403；未通过 DSH Connection 认证 401 |
| Client Slot 实时检查 | 本次 Client Cordis inspect 通道对所有 client provider 均报 `input must be an object`，无法复查；`client.js` 未改动（90,220 bytes，mtime 与 0.1.1 一致），沿用 0.1.1 已验证的四个 Slot 结论 |
| 真实问答 | 待用户在已认证 DSH 页面重试；已修复的 UserMessage 与历史日志恢复由 29/29 自动化测试覆盖 |

## 验证边界

- 根因已通过真实持久化日志和真实 `@deepseek-ai/dsh-session` 校验复现：原日志在 `index 10` 报 `message must have role "user"`，补齐字段后通过。
- 本次自动化不启动新的 DSH 实例，不修改 `~/.dsh` 既有会话日志；恢复逻辑只在用户再次续问时创建新会话。
- 浏览器视觉和真实模型端到端 QA 仍受已认证页面条件限制；安装后的实机验证由主代理完成。
