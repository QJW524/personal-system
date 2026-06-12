## ADDED Requirements

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
