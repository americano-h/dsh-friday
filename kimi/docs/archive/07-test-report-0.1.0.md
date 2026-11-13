# 测试与验证报告

> - 文档版本：0.1.0
> - 验证日期：2026-11-10
> - 被测包：`dsh-friday` 0.1.0
> - 源码目录：`kimi/`

## 自动化结果

- 命令：`pnpm run build && pnpm run verify`
- 结果：22/22 通过，0 失败。
- Client：88.1 KiB（最终文件 90,220 bytes），语法与 `window.__ModuleLoader__` 包装有效。
- 覆盖：配置、快捷键、图片解析与批次限制、消息/引用派生、工具策略、JSON 存储、压缩、升级成功与恢复、SSE 完成与断开生命周期、静态安全约束。

| 测试组 | 关键结论 |
| --- | --- |
| `config.test.js` | 默认 30 天；模型、快捷键和保留期校验有效 |
| `hotkey.test.js` | `Option+Space` 不依赖 NBSP `event.key`，自定义修饰键精确匹配 |
| `images.test.js` | 非图片/非法 data URL 拒绝；批次走 DSH Attachments |
| `policy.test.js` | 最终 schema 仅 `web_search`；其他工具执行拒绝；正式任务不受限 |
| `sessions.test.js` | 问题、回答、图片和 HTTP(S) 引用正确派生；危险 URL 被过滤 |
| `store.test.js` | 更新串行化；损坏索引备份后恢复，不静默覆盖证据 |
| `upgrade.test.js` | 压缩请求无工具；图片/URL 进入摘要；Provider 错误向上传递 |
| `upgrade-service.test.js` | 原生任务只创建一次；重复升级拒绝；缺失摘要可在原任务恢复 |
| `chat.test.js` | SSE meta/delta/done 正确；done 前 flush；SSE 断开不取消 Agent |
| `static.test.js` | 无 raw HTML 注入，无 Harness Client 包导入，Slot key 一致 |

## 安装与运行时检查

| 项目 | 结果 | 证据 |
| --- | --- | --- |
| Bundle 安装 | 通过 | `plugin_manager`: `application: applied` |
| Host 状态 | 通过 | `include:friday` = `fiberPhase: active` |
| 一级侧栏 | 通过 | `sidebar.panellist` 含 `id: inbox, order: 30, active: true` |
| 主页面 | 通过 | `main` 含 `key: inbox, active: true` |
| 浮层 | 通过 | `shell.overlay` 含 `id: dsh-friday.quick, active: true` |
| 配置页 | 通过 | `plugins.row.config` 含 `key: dsh-friday#friday, active: true` |
| 包信息 | 通过 | `dsh-friday` 0.1.0，profile 安装，source 指向 `kimi/` |
| 资源解析 | 通过 | `locale/en.json`、`locale/zh.json`、`icon`、`client` 均解析到本目录 |
| 图标约束 | 通过 | 原创 SVG，583 bytes，低于 256 KiB |
| API 缺请求头 | 通过 | HTTP 403，`Missing Friday request header` |
| API 未认证 | 通过 | HTTP 401，`Request was rejected by DSH Connection` |

## 浏览器与真实模型验证限制

- Ego Browser 打开当前 DSH URL 后显示 `dsh web authentication required`，没有可接管的已认证标签页。
- 按安全要求未搜索、提取或伪造访问令牌；浏览器任务已交还用户控制。
- 因此未声称完成浅色/深色实际视觉走查、真实快捷键键盘事件、三种图片输入的浏览器操作，以及真实模型/Web Search 端到端调用。
- 这些项目已实现并分别通过 Slot、静态检查、单元/运行时测试，但仍需在已认证 DSH 页面做最终人工或浏览器 QA。

## 环境提示

- 插件管理器反复报告既有 `@deepseek-ai/dsh-llm-deepseek-account` 配置错误：`models is no longer configurable`。
- 本任务未修改该用户级配置；此问题不属于 Friday 包，但可能影响使用账户模型的真实问答验证。
- pnpm 默认阻止 esbuild 安装脚本；`pnpm install --ignore-scripts` 成功，平台二进制可直接构建，未申请脚本例外。
