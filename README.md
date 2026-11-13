[English](README.en.md)

# Friday Inbox · DSH 快捷问答插件

当前桌面插件为 **DSH Friday 1.1.4**。[安装与使用](dsh-friday/README.md) · [更新日志](dsh-friday/CHANGELOG.md)

## 早期 Web 实现

> - 产品名：Friday Inbox（侧栏入口统一为 `Inbox`）
> - 包名：`dsh-friday`
> - 本页所述插件实现：0.1.0（可运行）
> - 现行产品需求：[DSH Friday PRD 1.0.0](docs/PRD.md)
> - 源码隔离目录：`deepseek-v4.1 flash/`

## 项目简介

Friday Inbox 为 DSH 提供一条“即问即走”的轻量通道：

> - macOS 页面内按下 `Option + Space` 唤起浮层，以仅含 Web Search 的受限工具集完成流式多模态问答。
> - 会话实时持久化到 DSH 原生 Session，并沉淀到侧栏新增的 `Inbox`，不进入任何工作区。
> - Inbox 会话可检索、可续问，并可自动压缩升级为所选工作区的正式任务；原会话归档且不可重复升级。

## 当前状态

> - 阶段：0.1.0 已完成开发、安装、集成测试与三轮独立评审。
> - 可用性：主链路可用；宿主 profile 实装为 active。
> - 源码：`deepseek-v4.1 flash/`，已包含预构建 `client.js`，安装后无需构建。
> - 验证：Host 单测 11/11 通过；API/UI 走查记录见 `docs/process/06-test-report.md`。
> - 已知限制：系统级全局热键受 Web 插件能力限制；删除为软删除；PTC 预设不支持 Web Search 白名单。

## 已实现功能

> - **L1 快捷对话**：页面级全局快捷键、紧凑浮层、流式 Markdown、停止生成、5 分钟恢复、新建对话、图片粘贴/拖拽/原生文件框、默认引用。
> - **L2 Inbox**：侧栏一级入口、列表/详情、关键词搜索（问题与回答）、查找窗口、续问、归档、软删除、清空、30 天保留期。
> - **L3 升级**：模型摘要压缩、工作区选择框、新建工作区、创建完整工具集任务、源会话归档、禁止重复升级。
> - **横切配置**：默认模型、视觉模型、快捷键、保留期；插件管理页内配置。
> - **安全**：`web_search` 双层白名单；同源 API + DSH Connection 认证；附件/取消/归档仅限 Inbox 会话。

## 文档索引

- [需求文档 PRD（1.0.0，现行）](docs/PRD.md)
- [历史版本 0.3.0（本页所述实现的需求基线）](docs/archive/PRD-0.3.0.md)
- [历史版本 0.2.0](docs/archive/PRD-0.2.0.md)
- [历史版本 0.1.0](docs/archive/PRD-0.1.0.md)
- [项目启动记录](docs/process/00-project-kickoff.md)
- [技术路线与框架选型](docs/process/01-tech-selection.md)
- [技术设计与实现修订](docs/process/02-architecture.md)
- [子代理与模型调用记录](docs/process/03-model-and-subagent-log.md)
- [开发计划](docs/process/04-plan.md)
- [测试计划](docs/process/05-test-plan.md)
- [测试报告](docs/process/06-test-report.md)
- [发布说明](docs/process/07-release-notes.md)
- [独立评审摘要](docs/process/08-independent-reviews.md)
- [插件 README（安装/使用/开发）](deepseek-v4.1%20flash/README.md)

## 目录结构

```text
.
├── README.md
├── README.en.md
├── AGENTS.md
├── docs/
│   ├── PRD.md
│   ├── archive/
│   └── process/
├── deepseek-v4.1 flash/      # 本模型隔离源码与构建产物
│   ├── index.js
│   ├── client.js
│   ├── src/host/
│   ├── src/client/
│   ├── locale/
│   ├── tests/
│   └── README.md
└── tools/                    # 开发期 ASAR 读取与构建工具（非插件运行依赖）
```

## 快速开始

1. 在 DSH 插件管理页从本地目录安装 `deepseek-v4.1 flash/`。
2. 在任意 DSH 页面按 `Option + Space` 开始一段快捷对话。
3. 打开左侧栏 `Inbox` 查看、搜索、继续或升级会话。
4. 在插件管理页的 Friday Inbox 配置默认模型、视觉模型、快捷键与保留期。

## 版本与后续

> - 版本号统一 `x.y.z`；本版本为 0.1.0。
> - 后续版本：Windows/Linux 映射、语音输入、LaTeX、导出、物理删除与更细的保留期策略。
> - 详见 [发布说明](docs/process/07-release-notes.md)。

## License

MIT
