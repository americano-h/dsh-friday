# hy4 · dsh-friday 开发隔离目录

> - 本目录是「dsh-friday」插件在本次开发中的**唯一源码与过程文件存放处**，与仓库根部的 `docs/`、`README.md` 需求基线物理隔离。
> - 隔离原因：用户将使用其他模型在平行目录做同一份开发，互不干扰、便于横向对比。
> - 需求基线：[归档 PRD](../docs/archive/PRD-0.3.0.md)（0.3.0，定稿）；本目录不修改需求基线。
> - 插件版本：`0.1.0`（首个可运行里程碑）；版本号遵循项目 `x.y.z` 规则。

## 目录

| 路径 | 用途 |
| --- | --- |
| `src/` | 插件包源码（bundle 包根，供 web profile 链接安装） |
| `docs/` | 开发过程文件：流程、分析、可行性、选型、架构、计划、评审、验收、变更、隔离 |
| `tests/` | 端到端冒烟脚本、结果 JSON、界面截图 |

## 快速入口

> - 现行需求：[PRD.md](../docs/PRD.md)
> - 技术选型结论：[03-技术路线与框架选型.md](docs/03-技术路线与框架选型.md)
> - 接口契约：[04-架构设计与接口契约.md](docs/04-架构设计与接口契约.md)
> - 子代理与模型选型记录：[05-子代理调用与模型选型记录.md](docs/05-子代理调用与模型选型记录.md)
> - 测试与验收：[07-测试与验收报告.md](docs/07-测试与验收报告.md)（[results.json](tests/results.json)）
> - 已实现与未实现边界：[08-已知限制与后续版本计划.md](docs/08-已知限制与后续版本计划.md)
> - 测试环境隔离：[10-测试环境隔离方案.md](docs/10-测试环境隔离方案.md)

## 安装方式

```bash
# 仅在 dsh web profile 安装（不要落到 desktop）
dsh plugin --profile web add /Users/mac/d/dsh-friday/hy4/src

# 独立端口启动测试实例（显式指定 profile 环境变量）
DSH_PROFILE=web DSH_PROFILE_DIR=/Users/mac/.dsh/profiles/web \
  dsh --profile web --no-open --host 127.0.0.1 --port 51777
```

> - 安装后 `dsh --profile web --dump-config` 出现唯一的 `dsh-friday-hy4` 行，侧栏功能导航区出现 `Inbox` 一级入口，插件管理页出现 `@local/dsh-friday-hy4`。
> - 本构建与 desktop 中另一模型的 `ds-v4.1-flash` 版完全隔离：独立包名、独立路由、独立 Slot id、按 profile 分区的数据目录；测试只在 `dsh web` profile 进行（见 [10-测试环境隔离方案.md](docs/10-测试环境隔离方案.md)）。
> - `src/` 为本地链接安装（`files` 不参与过滤），因此所有运行文件必须真实存在于该目录。
