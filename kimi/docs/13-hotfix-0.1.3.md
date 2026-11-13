# 0.1.3 故障排查与修复记录

> - 文档版本：0.1.3
> - 日期：2026-11-10
> - 用户反馈：弹出窗口问答之后，Inbox 页面内没有对话记录，而是显示 `record is not defined`
> - 处理方式：主代理直接修复（单一变量作用域错误，未调用子代理）
> - 前置状态：0.1.2 已修复 `UserMessage` 缺 role 与历史日志恢复

## 根因证据

> - 全包唯一引用 `record` 的位置：`src/host/sessions.js` 的 `createRepository.list()`。
> - 原代码：`records.map((record) => record.header.id).filter((id) => isFridayId(id) && !record.header.cwd)`。
> - `filter` 回调的参数名是 `id`，`record` 只属于 `map` 回调；在 `filter` 内访问会抛 `ReferenceError: record is not defined`。
> - 短路条件 `isFridayId(id) && ...` 使该引用只在存在 `friday-` 会话时被求值，因此空 Inbox 阶段不报错，首次成功问答产生记录后立即出现。
> - Host API 将该异常作为 `{ error: 'record is not defined' }` 返回，Client 的 `df-error` 区域呈现该文本，列表则为空。

## 修复设计

> - 改为先按记录对象过滤、再映射 id：`records.filter((record) => isFridayId(record?.header?.id) && !record?.header?.cwd).map((record) => record.header.id)`。
> - 可选链同时容错 `header` 缺失或 `null` 快照。
> - Inbox 隔离语义不变：带 `cwd` 的 Friday 会话与普通 `task-` 会话继续排除。

## 修改文件

> - `src/host/sessions.js`：修正 `list()` 过滤链。
> - `tests/list.test.js`：新增 3 项回归。
> - `package.json`、`index.js`、`src/host/api.js`、`tests/static.test.js`、`README.md`、`CHANGELOG.md`：版本 0.1.2 → 0.1.3。
> - `docs/07-test-report.md`、`docs/10-release-notes.md`、`docs/13-hotfix-0.1.3.md`、`docs/06-development-log.md`、`docs/04-model-and-subagent-log.md`：记录同步。
> - `docs/archive/07-test-report-0.1.2.md`、`docs/archive/10-release-notes-0.1.2.md`：归档被取代的 0.1.2 文档，并修正副本内部相对链接。

## 回归测试与验证

> - `pnpm run verify`：32/32 通过，0 失败；新增 3 项列表回归。
> - 0.1.3 安装 `application: applied`、`version: 0.1.3`、Host active。
> - API 缺请求头 403、未认证 401；0.1.1/0.1.2 的安全与恢复边界未回退。
> - `client.js` 未改动（90,220 bytes，mtime 与 0.1.1 一致）。
> - Client Cordis inspect 通道本次仍报 `input must be an object`，无法实时重查 Slot；沿用 0.1.1 已验证的四个 Slot 结论。

## 子代理调用说明

> - 本轮故障为单一变量作用域错误，属于低复杂度定位与修复；由主代理直接处理，未调用 DeepSeek V4.1 Flash 或其他高能模型子代理，也未并发。
> - 符合用户既定原则：高难度或审阅任务才考虑更高能模型，低难度重复任务不调遣更高能模型。
