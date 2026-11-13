# 0.1.1 故障排查与修复记录

> - 文档版本：0.1.1
> - 日期：2026-11-10
> - 用户反馈：`tools.restrict() names unknown global tool "web_search"; known global tools: load_workspace_dependencies, sidebar_open, working_directory`
> - 处理模型：Kimi k3.1-pro 主代理；未调用子代理

## 根因证据

1. 原策略无条件执行 `agentCtx.tools.restrict({ allow: ['web_search'] })`。
2. 当前 Cordis Config 显示 `@deepseek-ai/dsh-tool-web` 为 `inactive`。
3. 当前全局工具表只有用户错误中列出的三项，因此 allow 引用了未知名称，Agent setup 失败，整轮问答被阻断。
4. `web` Service 仍提供 `search` 和 `searchReady`，说明可以在 Friday 作用域提供受限搜索能力而无需修改用户全局插件配置。

## 修复设计

- 有全局 `web_search`：沿用 allow，避免重复注册。
- 无全局 `web_search`：注册 Friday scoped 搜索工具；对实际全局工具名集合执行 deny；空全局集合时不调用空 restrict。
- scoped 搜索只走 `ctx.web.search`，输入 1–4 个查询，最多 8 个来源，输出原生 sources metadata。
- `when` 按当前模型 Provider 调用 `searchReady`；最终 schema 使用当前 step `toolSet`，未就绪时不展示搜索。
- Agent/global guard 不变，其他工具继续硬拒绝。

## 修改文件

- `src/host/web-search.js`：新增 scoped 搜索实现与结果格式化。
- `src/host/policy.js`：按全局注册情况选择 allow/deny，使用 step `toolSet`。
- `index.js`：显式注入 `web` Service。
- `tests/policy.test.js`：新增故障场景回归。
- 包版本由 0.1.0 递增为 0.1.1（一个工具策略 bug 修复条目）。

## 验证与记录

- 23/23 自动化测试通过。
- 旧测试报告和发布说明已移入 `docs/archive/`，当前文档指向 0.1.1。
- 通过插件管理器卸载旧包并重新安装 `kimi/`，返回 `application: applied`、`bundle: dsh-friday`、`version: 0.1.1`。
- 最终 `include:friday` 为 `fiberPhase: active`；Inbox、快捷浮层和插件配置 Slot 均保持 active。
- API 未认证请求仍返回 401，未因修复放松认证。
- 未为此次定位、编码、测试或文档调用高能模型；没有并发子代理。
