# Friday Inbox 0.1.1 发布说明

> - 发布日期：2026-11-10
> - 包名：`dsh-friday`
> - 版本：0.1.1
> - 安装源：`/Users/mac/d/dsh-friday/kimi`
> - 当前状态：0.1.1 已应用，Host fiber active
> - 历史版本：[0.1.0 发布说明](10-release-notes-0.1.0.md)

## 本次修复

### 快捷问答被 unknown `web_search` 阻断

- 问题：`tools.restrict({ allow: ['web_search'] })` 在当前 profile 中抛出 `names unknown global tool "web_search"`，导致输入问题后无法回答。
- 根因：当前 `@deepseek-ai/dsh-tool-web` 为 `inactive`，快捷 Agent 的全局工具表没有 `web_search`。
- 修复：当全局搜索工具缺失时，在 Friday Agent 作用域注册仅使用 `ctx.web.search` 的 `web_search`，并对实际存在的全局工具执行 deny；不再引用不存在的 allow 名称。
- 安全：其他工具仍被最终 schema 过滤和执行 guard 拒绝；搜索 `when` 继续使用 `ctx.web.searchReady(modelSelection.provider)`，不会绕过认证。

### Step 就绪过滤

- 最终工具 schema 现在读取 `agentCtx.tools.schemas(agent, context.toolSet)`。
- Provider 未就绪时返回空 `schemas` 和 `knownNames`，与 DSH 的工具准入语义一致。

## 验证

- 23/23 自动化测试通过。
- 新增无全局 `web_search`、deny 已知全局工具、搜索执行、引用 metadata 和未就绪 schema 为空的回归测试。
- 0.1.0 的安装、Host active、四个 Slot、资源解析和 API 拒绝路径验证继续有效；本次重新安装结果记录于[故障排查与修复记录](../11-hotfix-0.1.1.md)。

## 使用影响

- 新版本安装后，新建或恢复 Friday 会话都会经过修复后的 Agent setup。
- 用户无需修改全局 `tool-web` 配置，也不需要启用 `web_fetch` 或其他工具。

## 已知限制

- 页面内快捷键、物理 Session 删除和已认证视觉 QA 的限制与 0.1.0 相同。
- 搜索 Provider 未配置或未认证时，模型不会看到搜索工具，但仍可进行普通文本回答；实际联网结果取决于 Provider 状态。
