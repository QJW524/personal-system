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

### Requirement: 统一仓库验证入口
仓库 SHALL 提供一个仓库级 npm 验证脚本，用于按固定顺序执行 OpenSpec strict validation、单元测试、lint 和 production build。该入口 SHALL 作为本地收尾、agent 交接和 CI 验证的默认质量门槛。

#### Scenario: 开发者执行统一验证
- **WHEN** 开发者或 CI 执行仓库级验证脚本
- **THEN** 该脚本会执行 `openspec validate --all --strict`、`npm run test:run`、`npm run lint` 和 `npm run build`

#### Scenario: 任一质量门槛失败
- **WHEN** 统一验证入口中的任一命令失败
- **THEN** 整个验证入口会以失败状态退出，并阻止该变更被视为完成

### Requirement: CI 强制质量门槛
仓库 SHALL 提供 GitHub Actions CI workflow，在 pull request 和 `main` push 上安装依赖并执行统一仓库验证入口。CI workflow SHALL 与部署 workflow 分离，使验证证据和发布动作保持清晰边界。

#### Scenario: Pull request 被创建或更新
- **WHEN** 某个 pull request 针对仓库主干创建或更新
- **THEN** GitHub Actions 会运行统一仓库验证入口，并在失败时标记该 CI run 失败

#### Scenario: Main 分支收到提交
- **WHEN** 某个提交进入 `main` 分支
- **THEN** GitHub Actions 会运行统一仓库验证入口，为后续部署提供主干验证证据

### Requirement: PR 追溯清单
仓库 SHALL 提供 pull request 模板，要求贡献者声明关联 OpenSpec change、用户可见影响、数据库影响、环境变量影响、部署影响、验证证据和归档状态。

#### Scenario: 贡献者准备提交 PR
- **WHEN** 贡献者打开新的 pull request
- **THEN** PR 描述模板会提示填写 OpenSpec change、影响范围和验证证据

#### Scenario: 变更包含特殊影响面
- **WHEN** 某个 PR 涉及数据库、环境变量、部署、认证、权限或 API contract
- **THEN** PR 描述会提供对应清单项，用于显式记录影响和评审关注点

### Requirement: Baseline 规格完整性
仓库 SHALL 避免在 `openspec/specs/` 的基线规格中保留 `TBD`、`TODO`、`待补充` 或等价占位文本。归档 change 或修改 baseline spec 时，贡献者 SHALL 补齐 Purpose 和可读说明，使基线规格能够作为长期真相来源阅读。

#### Scenario: 贡献者检查 baseline specs
- **WHEN** 贡献者准备完成某个会影响 OpenSpec 基线的变更
- **THEN** `openspec/specs/` 中不应遗留 Purpose 或 Requirement 层面的占位文本

#### Scenario: Change 归档后产生新的 baseline spec
- **WHEN** 某个 OpenSpec change 归档并生成或更新 baseline spec
- **THEN** 归档后的 baseline spec 会包含明确 Purpose，并继续通过严格 OpenSpec 校验

### Requirement: 规格漂移防护
仓库 SHALL 在 OpenSpec proposal、design、tasks 或 PR 描述中显式记录环境变量、数据库 schema、API contract、部署、认证和权限影响。若实现或配置暴露出尚未纳入 baseline spec 的稳定系统能力，贡献者 SHALL 新增或修改对应 OpenSpec capability，或明确说明该能力不属于本次范围。

#### Scenario: 变更修改环境变量示例
- **WHEN** 某个变更新增、删除或改变 `.env.example` 中的环境变量语义
- **THEN** 对应 proposal、design、tasks 或 PR 描述会记录环境变量影响，并在需要时更新相关 baseline spec

#### Scenario: 变更发现未规格化的稳定能力
- **WHEN** 贡献者发现仓库中存在稳定运行能力但 `openspec/specs/` 没有对应基线规格
- **THEN** 贡献者会创建或更新 OpenSpec change 来补齐该能力，或在当前 change 中明确记录为何暂不纳入范围

### Requirement: 独立 Codex Code Review 闸门
仓库 SHALL 要求代码变更在被视为完成前，由独立 Codex reviewer 或不继承实现推理历史的独立上下文进行审查。Reviewer SHALL 根据适用需求、OpenSpec artifacts、目标 diff 和验证证据检查缺陷、行为回归、契约违反与测试缺口，并 SHALL 使用 `Critical`、`Important` 和 `Minor` 对 findings 分级。`Critical` SHALL 表示安全暴露、数据丢失或损坏、严重不可用或核心需求失效；`Important` SHALL 表示用户可见缺陷、行为回归、契约违反或关键行为测试缺口；`Minor` SHALL 表示局部且不阻塞完成的可维护性或清晰度改进。

#### Scenario: 代码变更准备完成
- **WHEN** 实现者完成某个包含代码修改的仓库变更
- **THEN** 独立 Codex reviewer 或独立上下文会在该变更被视为完成前审查适用需求与目标 diff

#### Scenario: Reviewer 报告审查结果
- **WHEN** 独立 reviewer 完成审查
- **THEN** 审查结果会优先列出 findings，并为每个问题标记 `Critical`、`Important` 或 `Minor` 严重级别以及对应代码证据

#### Scenario: 审查未发现问题
- **WHEN** 独立 reviewer 没有发现可操作问题
- **THEN** 审查结果会明确记录没有 findings，并说明仍存在的测试缺口或残余风险

### Requirement: 高优先级审查问题闭环
仓库 SHALL 要求所有已确认的 `Critical` 和 `Important` findings 在代码变更被视为完成前修复。若实现者对高优先级 finding 有异议，SHALL 提供规格、代码或测试证据并交由独立 reviewer 复审，直到该 finding 被修复或由 reviewer 确认不成立。

#### Scenario: Reviewer 发现有效的高优先级问题
- **WHEN** 独立 reviewer 报告一个已确认的 `Critical` 或 `Important` finding
- **THEN** 实现者会修复该问题，并且不会在修复前把变更视为完成

#### Scenario: 实现者对高优先级问题有异议
- **WHEN** 实现者认为某个 `Critical` 或 `Important` finding 不成立
- **THEN** 实现者会提供技术证据并请求独立复审，而不是单方面忽略该 finding

#### Scenario: Reviewer 仅发现 Minor 问题
- **WHEN** 独立 reviewer 只报告 `Minor` findings
- **THEN** 实现者可以修复、记录后续事项或说明不处理理由，而不会仅因未修复的 `Minor` finding 阻止变更完成

### Requirement: Review 后最终验证与证据
仓库 SHALL 要求独立 review 完成且 findings 处理后重新运行 `npm run verify`。代码变更的 PR 或交接记录 SHALL 记录独立 reviewer 类型或上下文、findings 处置结果和 review 后最终验证结果。仓库 SHALL NOT 将另一个 GitHub 用户的 PR approval 作为个人项目的默认完成条件。

#### Scenario: Review 和问题处理完成
- **WHEN** 独立 review 已完成且所有阻塞 findings 已处理
- **THEN** 实现者会在 review 之后重新运行 `npm run verify`，并以该次结果作为最终验证证据

#### Scenario: Review 修复产生新的实质性 diff
- **WHEN** 为处理 findings 所做的修复实质改变了目标 diff
- **THEN** 实现者会在需要时请求独立 reviewer 复审修复，并继续处理任何新的 `Critical` 或 `Important` finding

#### Scenario: 贡献者准备 PR 或交接记录
- **WHEN** 包含代码修改的变更准备提交 PR 或交接
- **THEN** 记录会包含独立 reviewer、findings 处置和 review 后 `npm run verify` 的结果

#### Scenario: 个人项目完成代码变更
- **WHEN** 独立 Codex review 闭环和 review 后验证均已完成
- **THEN** 该变更无需另一个 GitHub 用户提供 PR approval 即可满足仓库默认完成条件
