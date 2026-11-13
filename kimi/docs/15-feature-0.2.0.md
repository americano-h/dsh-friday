# 0.2.0 全局原生弹窗与 Inbox 内联续聊

> - 文档版本：0.2.0
> - 日期：2026-11-10
> - 类型：功能迭代；版本由 0.1.4 递增为 0.2.0
> - 范围：只实现用户本轮列出的唤起、移动、弹窗输入区、透明度、按钮文案和 Inbox 续聊调整

## 需求映射

| 用户要求 | 实现 |
| --- | --- |
| 不依赖 DSH 焦点的全局快捷键 | macOS Carbon `RegisterEventHotKey`；DSH Host 启动辅助进程后即注册，保存设置时重注册 |
| Option + Space 与自定义快捷键 | 沿用既有快捷键配置校验，默认 `Alt+Space`；修饰键和按键映射到 Carbon |
| 弹窗任意移动 | 原生面板顶部标题栏原生拖动；DSH 内浮层也增加 Pointer 拖动，并保留可视区域边界 |
| 输入框只显示「向 Friday 提问」 | 中文 placeholder 精确修改，无省略号；英文为 `Ask Friday` |
| 左加号、右发送 | 共享 `ConversationComposer`，顺序为加号 / textarea / 发送；加号只选择图片 |
| 图标与文字对齐 | 34px 按钮、18px 图标、8px 间距、统一行高和垂直居中 |
| 更透明的 Liquid Glass | DSH 浮层采用 token 透明混合和 backdrop blur；独立窗口使用 `NSGlassEffectView`，旧系统回退 `NSVisualEffectView` |
| Inbox 按钮只显示「升级」 | 仅修改 Inbox 文案；升级对话框和流程不变 |
| Inbox 当前页续聊 | 详情底部固定共享输入框，直接流式续写当前 Session，不再打开快捷浮层 |

## 技术路线选择与原因

### 为什么新增 macOS 原生辅助进程

- Cordis Inspect 的 Host/Client Service 目录没有系统全局热键或独立原生窗口接口；`shell.overlay` 只在当前 Web 页面内分配浮层。
- 浏览器 `keydown` 无法越过焦点边界，CSS 也不能创建 macOS 原生材质或跨应用窗口。继续只改 Web 代码会构成伪实现。
- 当前包已限定 darwin，且本机有 Swift/AppKit/WebKit/Carbon 工具链，因此选择随包交付一个由 Host 管理的轻量辅助进程，不要求修改 DSH 本体或安装另一个服务器。

### 为什么使用 WebKit + 本地桥接

- 原生窗口中的问答界面复用 `QuickOverlay`、共享输入组件、Markdown、图片和升级对话框，避免维护两套产品逻辑。
- `native/window.js` 是独立原生页面的自包含 React 构建；DSH Slot 的 `client.js` 仍使用宿主共享 React，不引入第二个 DSH React 实例。
- WebKit 只加载包内 `window.html/window.js`，CSP 禁止页面网络连接。请求通过 `WKScriptMessageHandler` 与 JSON Lines 到 Friday Host，由 Host 调用原有 Repository、ChatRuntime、UpgradeService 和 WorkspaceRegistry。
- 不新增 HTTP 监听端口，不绕开 DSH Connection，不另建聊天数据库；原生问答仍是相同的 `friday-*` 原生 Session，仍受 Web Search-only 策略约束。

### 窗口与生命周期

- `NSPanel` 使用 floating level、跨 Space 行为和可调整大小样式；隐藏不等于结束生成。
- 原生拖动由标题栏的 AppKit 事件监控执行，右侧动作按钮不触发拖动。
- `NSGlassEffectView` 提供 macOS 26 原生玻璃；部署目标较低时使用 `NSVisualEffectView` popover 材质。
- 插件卸载时先请求辅助进程退出，再兜底终止；辅助进程退出会关闭本地流订阅，但不直接取消 Agent。
- DSH 运行时全局热键可用；DSH 完全退出后不声称仍可用。

## Inbox 续聊设计

- 选中会话后，详情底部直接显示固定输入区；历史消息区域独立滚动。
- 复用原 `streamChat` 和当前 `sessionId`，支持 delta、citations、done、error、停止和图片。
- 切换会话只中止旧页面订阅，不取消旧 Agent；请求完成后再按当前选中 ID 刷新，避免旧响应覆盖新会话。
- 正在其他界面生成的会话仍按原有轮询方式刷新。
- 「继续问答」按钮移除；升级、删除、查找、过滤、清空、清理与新建逻辑保持。

## 复核发现与修正

- 配置事件原本会在每次 `setConfig` 时再次触发配置加载，形成重复请求；现在只在 hotkey 值实际变化时通知，避免初始加载和保存后的循环。
- 原生页面就绪与 HTML 导航完成分开上报；只有 React 根组件实际挂载并连接桥接后才标记 `pageReady`。
- 若全局热键在页面加载早期唤起，原生客户端就绪时会重放当前可见状态，避免空白面板。
- 原生打开正式任务通过 Host 生成 DSH 认证 URL，并由已连接页面确认待打开任务；未手工读取或保存认证令牌。

## 验证与边界

- 构建和 44/44 自动化测试通过；原生辅助进程独立冒烟确认 `hotkeyError: null`、`pageReady: true`。
- 安装后通过合成 HID 事件实测系统热键唤起/收起；窗口从 `(865,243)` 拖动到 `(965,343)`。
- 对真实原生窗口截图执行 OCR，确认「向 Friday 提问」、加号及既有 Friday 文案；没有用静态概念稿代替运行窗口。
- 当前主模型不支持图像输入，因此不声称人工查看了截图细节；OCR 与坐标作为可复查证据。
- 已认证 DSH 页面内的视觉、真实模型/Web Search 端到端和 Inbox 实际操作仍需用户页面走查；自动化浏览器停在 DSH 登录提示页，未搜索认证信息。
- 本轮未调用子代理，模型决策见 `04-model-and-subagent-log.md`。
