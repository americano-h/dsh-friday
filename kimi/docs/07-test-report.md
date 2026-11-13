# 测试与验证报告

> - 文档版本：0.2.10
> - 验证日期：2026-11-11
> - 被测包：`dsh-friday` 0.2.10
> - 源码目录：`kimi/`
> - 历史版本：[0.2.5 测试报告](archive/07-test-report-0.2.5.md)、[0.2.0 测试报告](archive/07-test-report-0.2.0.md)、[0.1.4 测试报告](archive/07-test-report-0.1.4.md)、[0.1.3 测试报告](archive/07-test-report-0.1.3.md)

## 自动化结果

- 命令：`pnpm run verify`（等价于 `pnpm run check && pnpm test`）。
- 结果：**60/60 通过，0 失败**；基线为 0.2.5 的 53 项，净增 7 项。
- `node --check index.js`、`node --check src/host/native-window.js`、`node scripts/check-client.mjs`、`node --check native/window.js` 全部通过。
- 测试使用 Node 内置 `node:test`；本轮未改 Client 源码，`client.js` 与 `native/window.js` 未重建。

## 0.2.10 新增/更新回归

| 测试 | 覆盖 |
| --- | --- |
| `release.test.js` 5 项（新增） | 空闲句柄只释放一次并返回是否释放；运行中需 `force`；预留期间保持加载、解除后释放；`agent/status` idle 事件约 1.5s 后延迟释放；已归档升级会话可归档、保留 `upgradedSessionId` 并释放句柄 |
| `policy.test.js` 4 项（更新） | `systemPrompt.tools` 不被调用、schema 由 tools service 提供；缺失全局 `web_search` 时 scoped 回退仍注册并执行；全局 guard 不影响普通工作区任务 |
| `upgrade-service.test.js` 6 项（更新） | seed 为连续、已完成且不调用模型的一轮；发布流程与重复升级拒绝；`creating` 重发布与缺失会话重建两种恢复；空摘要拒绝；压缩不携带工具 |
| `static.test.js` 2 项（更新） | `package.json` 版本断言为 0.2.10；manifest、row id 与设置 Slot key 对齐 |
| `cleanup.test.js` 1 项（保持） | 升级中断会话不进入活动 clear/cleanup；过期普通会话正常归档；恢复映射保留 |

## 各修复的验证证据

- **0.2.6 重复工具名**：真实会话日志的 `request/header` 出现 `tools = [web_search, web_search]`；`policy.test.js` 断言 Friday 不再注册 `systemPrompt.tools()` 提供者，且作用域注册不再依赖 per-agent effect。
- **0.2.7 侧栏未分组**：`release.test.js` 覆盖空闲、运行中、预留、idle 事件与归档五条释放路径；释放前 flush，释放后句柄移除。
- **0.2.8 空白任务**：用真实 DSH 库（以 Node 方式运行 Electron 并读取 `app.asar`）确认 `Session.create` 接受该 seed，真实 `applySessionListMetadata` 得到 `blank=false`；旧的 inject-only 路径得到 `blank=true`。
- **0.2.9 无法删除**：宿主不再对升级会话直接抛错；软删除保留 `upgradedSessionId` 并强制释放 Agent，使 `dsh-chat-manager` 的 live 检查不再拦截。
- **0.2.10 清空过期**：`api.js` 补齐 `readConfig` 导入；静态检查与全量回归通过。

## 安装与运行时检查

- 0.2.10 已通过 plugin manager 在活动 profile 中重载，插件处于 active。
- 未在已认证 GUI 中验证：执行代理的浏览器没有 DSH Web 会话，Connection fence 返回 **401**；启动 token 未被刻意提取，因此没有绕过认证重试。

## 验证限制

- 已认证 GUI 的端到端走查仍待用户完成：提一个问题、升级到工作区、删除升级后的对话、运行「清空过期」。
- 0.2.7 的已知限制保留：一轮对话进行中，live 的 Friday 会话仍可能短暂出现在 DSH 未分组桶；DSH 没有受支持的方式隐藏无 `cwd` 的 live 会话。
- 0.2.10 没有直接调用 `/inbox/cleanup` 路由的自动化用例，该修复目前只有静态与全量回归证据。
- 0.2.5 的热键合成事件与截图 OCR 限制沿用，不作为本轮新增证据；历史结论见[0.2.5 测试报告](archive/07-test-report-0.2.5.md)。
