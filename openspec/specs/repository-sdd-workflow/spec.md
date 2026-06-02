# 仓库 SDD 工作流规格说明

## Purpose

定义仓库范围内的 OpenSpec 工作流、Codex 集成、指令来源，以及未来变更需要遵守的验证闸门。
## Requirements
### Requirement: OpenSpec 变更工作流
仓库 SHALL 使用 OpenSpec 作为规格驱动变更的真相来源。当前需求 SHALL 存放在 `openspec/specs/` 中，需求增量 SHALL 存放在 `openspec/changes/<change-name>/specs/` 下，直到归档完成。

#### Scenario: 开发者开始一个行为变更
- **WHEN** 开发者开始处理会改变系统可观察行为的工作
- **THEN** 开发者会在实现完成之前创建包含 proposal、delta spec、design 与 tasks 的 OpenSpec change

#### Scenario: 开发者完成一个行为变更
- **WHEN** 某个 change 已经完成实现并通过验证
- **THEN** 开发者会归档该 OpenSpec change，使其中的需求增量合并进当前基线 spec

### Requirement: Codex OpenSpec 集成
仓库 SHALL 提供生成好的 OpenSpec Codex skills，并 SHALL 记录 `/opsx:*` 工作流命令。

#### Scenario: Codex 会话在仓库中工作
- **WHEN** Codex 在 OpenSpec 初始化完成后加载该仓库
- **THEN** 它可以使用 `/opsx:explore`、`/opsx:propose`、`/opsx:apply` 和 `/opsx:archive`

### Requirement: 仓库开发约束
仓库 SHALL 将持久化的 agent 指南保存在 `AGENTS.md` 中，并 SHALL 将 OpenSpec artifact 生成上下文保存在 `openspec/config.yaml` 中。

#### Scenario: Agent 准备一个仓库变更
- **WHEN** 某个 agent 读取仓库说明并生成 OpenSpec artifact
- **THEN** 它会获得 Next.js 16 文档要求、工程基线、质量闸门以及 artifact 级规则

### Requirement: 严格 OpenSpec 校验
仓库 SHALL 在完成前对 OpenSpec change 与当前基线 spec 执行严格校验。

#### Scenario: 某个变更准备完成
- **WHEN** 开发者准备归档或交接一个仓库 change
- **THEN** `openspec validate --all --strict` 能够通过
