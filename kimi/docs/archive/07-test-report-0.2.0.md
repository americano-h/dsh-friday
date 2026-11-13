# 测试与验证报告

> - 文档版本：0.2.0
> - 验证日期：2026-11-10
> - 被测包：`dsh-friday` 0.2.0
> - 源码目录：`kimi/`
> - 历史版本：[0.1.4 测试报告](07-test-report-0.1.4.md)、[0.1.3 测试报告](07-test-report-0.1.3.md)、[0.1.2 测试报告](07-test-report-0.1.2.md)、[0.1.1 测试报告](07-test-report-0.1.1.md)、[0.1.0 测试报告](07-test-report-0.1.0.md)

## 自动化结果

- 命令：`pnpm run build && pnpm run verify`。
- 结果：**44/44 通过，0 失败**。
- Web Client：`client.js` 约 102.9 KiB，`window.__ModuleLoader__` 包装、语法及禁止 Harness Client 模块导入检查通过。
- 原生 Client：`native/window.js` 自包含 React 构建完成，`native/window.html` 仅加载本地资源，CSP 禁止页面网络连接。
- 原生辅助程序：Swift 6.3.3 编译成功，目标当前 darwin arm64，包含 AppKit/WebKit/Carbon 框架。
- 既有配置、Session、UserMessage、恢复、工具策略、图片、升级、存储和 SSE 测试全部保持通过。

## 0.2.0 新增回归

| 测试组 | 覆盖 |
| --- | --- |
| `native-transport.test.js` 4 项 | 配置/Inbox 请求映射、Host 错误传播、原生流事件与完成、Abort 仅关闭订阅 |
| `native-static.test.js` 4 项 | 可执行产物和 CSP、Carbon/AppKit 全局能力、加号-输入-发送顺序与精确文案、Inbox 固定内联输入框 |

## 原生运行验证

| 项目 | 实测结果 |
| --- | --- |
| 独立辅助进程冒烟 | 输出 `hotkeyError: null`、`pageReady: true`，证明 Carbon 注册和 React 桥接客户端均就绪 |
| 插件安装后启动 | `native/friday-native` 进程由当前 Host 启动 |
| 系统全局唤起 | 通过 HID 合成 Option+Space，在 DSH 页面未聚焦的情况下出现独立窗口，CGWindow 尺寸 760×560 |
| 任意拖动 | 标题栏拖动后窗口坐标由 `(865,243)` 变为 `(965,343)`，变化量 `(100,100)` 与拖动一致 |
| 全局收起 | 再次 Option+Space 后该辅助进程的 on-screen 窗口数为 0；测试后恢复隐藏 |
| 可见文本 | 对真实窗口截图 OCR 识别到 `Friday Inbox`、`向Friday 提问`、发送提示和 `Web Search only`，placeholder 无省略号；加号已显示 |
| 原生材质 | 实际运行窗口由 `NSGlassEffectView` 承载；当前模型无图片输入，未声称人工看图审查玻璃细节 |

## 安装与 DSH 检查

- 0.2.0 Bundle 安装结果：`application: applied`、`bundle: dsh-friday`、`version: 0.2.0`、enabled true；`include:friday` 的 Host `fiberPhase: active`。
- `sidebar.panellist#inbox`、`main#inbox`、`shell.overlay#dsh-friday.quick`、`plugins.row.config#dsh-friday#friday` 四个实时 occupant 均 active。
- API 带 `X-DSH-Friday` 但无 DSH 认证返回 **401**；缺该请求头返回 **403**，既有认证边界未回退。
- 安装警告仍为既有 `llm-deepseek-account models is no longer configurable`，与 Friday 无关，未修改该插件配置。

## 验证限制

- ego-browser 的 TaskSpace 5 打开当前 GUI 仍显示 `dsh web authentication required; reopen the URL printed by dsh web.`，已交还用户；未查找、提取或保存认证令牌。
- 因此，Inbox 内联输入框的浏览器视觉和点击操作、DSH 内浮层拖动视觉、浅/深色主题对比未由本轮自动化走查。
- 未创建额外测试对话来调用真实模型；真实模型/Web Search 的原生端到端结果仍需用户在正式环境验证。既有 ChatRuntime 测试与新增桥接流测试已覆盖接口链路。
- 物理 Session 日志删除仍无公开 API，本版未改变归档/隐藏语义。
