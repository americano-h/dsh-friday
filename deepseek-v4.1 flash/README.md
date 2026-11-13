# Friday Inbox

> - 包名：`dsh-friday`
> - 版本：0.1.0
> - 形态：DSH Web 插件（Host + Client 两半）
> - 入口：左侧栏 `Inbox`；快捷浮层 `Option + Space`
> - 需求基线：仓库根目录 [归档 PRD](../docs/archive/PRD-0.3.0.md) 0.3.0

## 是什么

Friday Inbox 给 DSH 增加一条“即问即走”的轻量问答通道：

> - 用 `Option + Space` 唤起浮层，流式回答，默认附带 Web Search 引用。
> - 会话实时写入 DSH 原生 Session，并沉淀到独立的 Inbox，不进入任何工作区。
> - Inbox 支持列表、搜索、续问、归档、清理。
> - 任意 Inbox 会话可以一键压缩升级为所选工作区的正式任务，原会话归档且不可重复升级。
> - 默认模型、视觉模型、快捷键、保留期都在 DSH 插件管理页配置。

## 安装

> - 在 DSH 的插件管理页选择“从本地目录安装”，指向本目录。
> - 或用 `plugin_manager` 的 `install_bundle`，target 传本目录绝对路径。
> - 本包不依赖 npm 运行时包；`client.js` 已预构建，安装后无需再构建。

安装后：

> - 左侧栏出现 `Inbox` 图标入口。
> - 任意 DSH 页面按 `Option + Space` 打开快捷浮层。
> - 插件管理页的 Friday Inbox 页面出现四个配置项。

## 使用

### 快捷浮层

> - `Enter` 发送，`Shift + Enter` 换行，`Esc` 收起。
> - 支持粘贴、拖拽、原生文件框选图（png/jpeg/webp/gif，最多 4 张，每张 10 MB）。
> - 流式回答支持 Markdown；引用以来源 chip 展示。
> - 5 分钟内再次唤起会恢复上一段会话；超过 5 分钟默认新建。
> - 浮层收起不会中断生成；生成内容持续写入 Session。

### Inbox

> - 列表按最近更新倒序，显示标题、首问摘要、时间、模型、含图与状态。
> - 支持关键词搜索问题与回答；`查找对话` 打开查找窗口。
> - `继续对话` 以该会话重新打开浮层；`升级` 选择工作区创建正式任务。
> - 归档会话仍可查看；已升级会话不可再次升级、不可恢复为活动会话。
> - 删除与清空为软删除：写入 DSH 原生归档集合并从活动列表移除，不物理删除 Session 日志。

### 配置

插件管理页 → Friday Inbox：

> - **默认模型**：下一次对话生效；已有会话保持原模型。
> - **视觉模型**：默认模型不支持图片时，先用它生成图片描述，再交给默认模型。
> - **快捷键**：默认 `Alt+Space`（macOS 的 `Option + Space`），支持 `Meta+Shift+K` 等写法。
> - **保留期**：默认 30 天；到期自动归档，也可在 Inbox 手动清理。

## 技术结构

```text
index.js                 Host 入口（inject + 生命周期）
src/host/                API、会话、索引、策略、升级
src/client/              React 浮层、Inbox、设置、Markdown
client.js                预构建的 Client bundle
locale/                  en / zh 文案与插件元数据
cordis.patch.yml         Headless patch（insert 一行）
```

> - Host 使用 Node ESM + Cordis；Client 使用 React 18 + esbuild 打包。
> - 会话事实源是 DSH Session 日志；`$DSH_HOME/storages/dsh-friday/index.json` 只是可重建的派生索引。
> - 工具白名单双层：`tools.restrict({ allow: ['web_search'] })` + 基于 Inbox cwd 的 `tools.guard`。
> - 所有 API 走同源 `/dsh-friday/api/v1`，要求 `X-DSH-Friday: 1`，并复用 DSH Connection 的 Host/Origin 与浏览器认证。

## 开发

```bash
cd "deepseek-v4.1 flash"
node scripts/build-client.mjs     # 需要 esbuild（本仓库构建工具在 ../tools/build）
node --test tests/*.test.js
node scripts/check-client.mjs
```

> - 修改 Host 后，通过插件管理页禁用/启用一次即可重新加载。
> - 修改 Client 后需要重新构建 `client.js` 并刷新页面（或在开发环境的 HMR 下等待重载）。
> - 本目录的构建工具路径指向本机 `tools/build`，分发给其他机器时请自行安装 esbuild 或直接使用已构建产物。

## 已知限制

> - 系统级全局热键无法由 Web 插件注册：快捷键在 DSH 页面内全局生效，应用失焦时不触发。
> - 删除为软删除，不物理删除 DSH Session 日志。
> - 视觉兜底路径会把图片展示在 Inbox 历史中，但模型后续只消费图片描述。
> - 升级摘要优先使用当前会话模型的单次摘要；模型摘要失败时回退到本地启发式压缩。
> - PTC 模式（只暴露 `run_code` 的预设）下 Inbox 的 `web_search` 白名单不可用，本版本不支持。

## 数据位置

> - Inbox 会话 cwd：`$DSH_HOME/storages/dsh-friday/inbox`
> - 派生索引：`$DSH_HOME/storages/dsh-friday/index.json`
> - 插件配置：`$DSH_HOME/storages/dsh-friday/config.json`
> - Session 日志：由 DSH session persistence 管理，通常位于 `$DSH_HOME/sessions/--…dsh-friday-inbox--/`

## License

MIT
