# dsh-friday（mimo-v2.6-pro 实现）

> - 产品：Inbox 快捷问答插件（需求基线 [归档 PRD](../docs/archive/PRD-0.3.0.md)，0.3.0 定稿版）
> - 实现模型：mimo-v2.6-pro；源码与过程文件全部隔离在本目录，供多模型并行开发对照
> - 形态：DSH 插件 bundle（Host + Client 双半），带左侧栏 **Inbox** 一级入口
> - 状态：源码完成、静态验证通过；**安装延后**（用户决策：不执行 `install_bundle`，由用户择一安装）

## 目录结构

```text
mimo-v2.6-pro/
├── README.md                    # 本文件：总览、构建与使用说明
├── docs/                        # 过程文件与记录
│   ├── 01-需求分析与实现范围.md   # PRD 解读、FR → 实现映射、范围裁剪
│   ├── 02-技术选型与架构设计.md   # 技术路线与框架选型（含选择原因）
│   ├── 03-平台可行性评估.md       # PRD §4.5 七项平台依赖逐条确认
│   ├── 04-迭代计划与验收.md       # 迭代里程碑、验收矩阵骨架
│   ├── 05-子代理调用记录.md       # 子代理调用与模型选型原因
│   └── 06-开发日志.md             # 追加式开发日志
├── plugin/                      # 可安装的 bundle（安装时以该目录为目标）
│   ├── package.json
│   ├── cordis.patch.yml
│   ├── index.js                 # Host 半（ESM，零依赖）
│   ├── client.js                # Client 半（构建产物，亦入库）
│   ├── icon.svg                 # 原创图标
│   ├── locale/{zh,en}.json      # meta + UI 文案
│   └── src/
│       ├── shared/              # Host/Client 共享纯逻辑（markdown、格式化）
│       ├── host/                # Host 模块（会话、存储、路由、升级、保留期）
│       └── client/              # Client 源模块（构建为 client.js）
├── scripts/
│   ├── build-client.mjs         # 将 src/client/* 拼接生成 client.js
│   └── check.mjs                # 语法检查 + 构建产物一致性检查
└── tests/                       # node --test 单元测试（纯逻辑）
```

## 构建、检查与测试

```bash
node scripts/build-client.mjs   # 由 plugin/src/client/* 重新生成 plugin/client.js
node scripts/check.mjs          # node --check 全部 JS + client.js 与源一致
node --test tests/*.test.js     # 纯逻辑单元测试（markdown / 存储 / 保留期 / 拼接器）
```

## 安装（延后执行，命令已备好）

```bash
# 在 DSH 会话中调用 plugin_manager，或由用户手动选择安装哪一份实现：
#   action: install_bundle
#   target: /Users/mac/d/dsh-friday/mimo-v2.6-pro/plugin
```

> - 包名按用户指定为 `dsh-friday`；若与并行开发实现共存安装，可将 `plugin/package.json`
>   的 `name` 与 `cordis.patch.yml` 的 `id`/`name` 一并改为 `@mimo/dsh-friday`（详见 docs/02 §8）
> - 安装位置是共享 profile，两个实现同时启用会出现两个侧栏入口，便于对照；也可只启用其一

## 功能与需求对照

| PRD 层 | 功能 | 实现入口 |
| --- | --- | --- |
| L1 快捷对话 | 浮层唤起、受限问答（仅 Web Search）、流式 Markdown、多轮、图片 | `plugin/src/client/quick-ask.js` + `plugin/src/host/sessions.js` |
| L2 Inbox | 侧栏入口、列表/详情、检索、续问、查找窗口、管理 | `plugin/src/client/inbox-page.js` + `plugin/src/host/store.js` |
| L3 升级 | 上下文压缩、工作区选择框、新建工作区、归档 | `plugin/src/host/upgrade.js` |
| 横切 | 默认/视觉模型、快捷键、保留期、原生 UI | `plugin/src/host/config.js`、`plugin/src/client/config-page.js` |

逐条验收口径与结论见 [docs/04-迭代计划与验收.md](docs/04-迭代计划与验收.md)。
