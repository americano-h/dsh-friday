# DSH Friday 1.1.4

[English](README.en.md) · [更新日志](CHANGELOG.md)

Friday 把 Jarvis 的 macOS 粒子光球和桌面面板接到 DSH 的 Inbox。点光球或按 `Option + Space` 提问，按需调用 `web_search`。收起面板后，回答继续生成，可从 DSH 侧栏或桌面面板的 Inbox 找回。

## 安装与使用

1. 在 macOS 14 及以上、装有 Swift 6 工具链和 Node.js 22.18 及以上版本的机器上，在本目录执行 `npm ci`、`npm run build`。构建会生成 DSH 客户端、原生窗口页面与可执行面板。
2. 在 DSH 插件管理页从本地目录安装本仓库。已有 Friday 安装使用相同包名，请通过更新本地来源切换到本目录；已有短期会话和升级映射继续按原 ID 读取。
3. 在「插件 → Friday → 配置」选择默认模型并保存，也可选择继承 DSH 当前默认模型。保存后，新对话使用所选模型，已有对话保留原模型。视觉模型、系统热键、Inbox 保留期在同页设置。字号沿用 DSH「设置 → 通用」的正文与代码字号，侧栏 Inbox 和光球面板会同步更新。使用网页检索需要 DSH 已配置可用的搜索服务。
4. 在快捷面板输入问题或附图。打开 Inbox 可搜索问题与回答，在详情底部续问。每条回答的「引用来源」默认折叠，点击可展开链接列表。「快捷面板」可把选中的会话带回光球旁。默认在最近一轮结束后五分钟内恢复同一段活动对话。
5. 点「升级」，审阅和编辑压缩摘要，选择或新建工作区，再点「压缩并新建」。正式任务的第一条消息包含已编辑的摘要，等待下一条指令。原会话进入「已升级归档」，其中的「打开任务」可再次定位正式任务。

快捷面板跟随 DSH 的浅色、深色或系统外观。插件配置中的「桌面光球」可以预览颜色、亮度、不透明度和大小，保存后应用到桌面。点击「快捷键」中的当前组合，再按下新组合即可录制。默认在快捷面板按 `Option + N` 开始新对话，之前的问答可在 Inbox 找回。

## 验证

更新已有安装时，在 DSH 插件管理页关闭并重新启用 Friday 即可重载。在已认证的 DSH 窗口内，带 `X-DSH-Friday: 1` 请求头访问 `/dsh-friday/api/v1/health`，响应中的 `version` 即为宿主实际加载的版本。此次重载的 Inbox 与设置保留核验见 [1.1.4 更新日志](CHANGELOG.md)。

- `npm test` 运行 Friday 宿主、工具策略、会话恢复及发布测试。
- `npm run test:upstream` 运行保留的 Jarvis 测试；`swift test --package-path macos` 运行原生套件，需要带 XCTest 的 Xcode。
- 本地 DSH 集成验证使用独立 profile 和本地模型、搜索夹具。已观察到真实搜索工具调用、可打开的引用、经审阅的工作区首条消息和源会话归档。
- 当前 DSH 在生成期间可能将无工作目录的活动会话短暂列入「未分组」，释放会话后消失。保留期清理使用 DSH 归档及 Inbox 隐藏语义。

桌面窗口使用 Jarvis 的 OrbPanel、OrbMetalView、OverlayPanel 和 Placement。问答、附件、搜索和升级经 Friday 宿主处理。产品保留上游 MIT 许可与署名。[上游文档归档](docs/archive/README-0.7.1.md) · [LICENSE](LICENSE)
