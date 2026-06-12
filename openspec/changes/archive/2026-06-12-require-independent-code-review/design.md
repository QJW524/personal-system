## Context

仓库已有 OpenSpec change、`npm run verify`、GitHub Actions CI 和 PR 模板，但这些机制主要验证规格结构与自动化质量门槛，无法替代对需求符合性、缺陷风险和测试缺口的独立代码审查。当前项目由个人维护，因此独立性需要来自 Codex reviewer 的上下文隔离，而不是另一个 GitHub 用户。

本次只调整版本化的仓库治理文件，不涉及 Next.js 运行时代码、数据库或部署路径，因此没有新的 Next.js 16 API 假设，也没有数据所有权或运行时失败处理变化。

## Goals / Non-Goals

**Goals:**

- 为所有代码变更建立完成前的独立 Codex code review 闸门。
- 明确定义独立 reviewer 的输入、输出和问题严重级别。
- 确保已确认的 `Critical` 和 `Important` 问题在完成前得到修复。
- 确保 review 结束且问题处理完成后重新运行完整仓库验证。
- 在 PR 中保留 reviewer、问题处置和最终验证的可追溯证据。

**Non-Goals:**

- 不要求另一个真人或 GitHub 用户提供 PR approval。
- 不配置 GitHub branch protection、ruleset 或 required approvals。
- 不编写自动解析 reviewer 输出或 PR body 的检查脚本。
- 不改变 `npm run verify` 的命令组成。
- 不要求所有 `Minor` 问题都在当前变更中修复。

## Decisions

1. 独立 reviewer 使用隔离的 Codex agent 或全新上下文。

   Reviewer 可以是专门派发的 Codex code-review agent，也可以是在不继承实现会话推理历史的全新上下文中执行的审查。输入应限制为变更目标、适用规格或任务、目标 diff、必要的仓库上下文和验证证据。这样既适合个人项目，也能减少实现者自证带来的确认偏差。

   备选方案是要求第二个 GitHub 用户审批。该方案在人力团队中更强，但会阻塞单人项目，因此明确排除。

2. 审查输出统一使用 `Critical`、`Important` 和 `Minor`。

   `Critical` 表示可能造成安全、数据损坏、严重不可用或核心需求失效的问题；`Important` 表示可能造成用户可见缺陷、行为回归、契约违反或关键测试缺口的问题；`Minor` 表示不阻塞完成的局部改进。Reviewer 应以 findings 为主，并提供文件和行号证据。

   统一级别让 agent 指令、PR 模板和后续处置规则可以引用同一套语言。

3. 已确认的高优先级问题必须闭环。

   所有有效的 `Critical` 和 `Important` finding 必须修复后才能把变更视为完成。若实现者认为 finding 不成立，必须提供代码、规格或测试证据，并由独立 reviewer 复审；不能仅在 PR 中标记为“不同意”后跳过。`Minor` 可以修复、记录为后续事项，或说明不处理理由。

4. Review 完成后始终重新运行 `npm run verify`。

   无论 review 是否产生代码修改，最终完成证据都必须来自 review 之后的一次完整验证。若修复引入新的 diff，应在必要时让 reviewer 对修复进行复审；任何新的 `Critical` 或 `Important` finding 继续遵循同一闭环。

5. PR 模板记录审查证据，但不把 GitHub approval 作为完成条件。

   PR 描述增加 reviewer 类型或上下文、findings 摘要与处置、review 后最终 `npm run verify` 结果。模板提供可追溯协议，不声称能够在 GitHub 平台层面自动强制。

## Risks / Trade-offs

- [Risk] 独立 Codex reviewer 仍可能漏报或误报。→ Mitigation：要求提供文件、行号和技术证据；争议高优先级问题通过独立复审解决。
- [Risk] 每个代码变更增加一次 review 和一次完整验证，延长个人开发周期。→ Mitigation：文档或纯 copy 等无代码变更可不触发 code review；对代码变更统一使用现有 `npm run verify`，不增加新的工具链。
- [Risk] 仓库文件无法保证开发者真的使用了全新上下文。→ Mitigation：通过 AGENTS 指令、baseline spec 和 PR 证据形成可审计约束；暂不增加复杂自动化。
- [Risk] Review 修复可能引入新问题。→ Mitigation：修复后完整验证，并在 diff 实质变化或 reviewer 要求时复审。

## Migration Plan

1. 在 `repository-sdd-workflow` 中增加独立 code review requirement。
2. 更新 `AGENTS.md`，把 review、问题闭环和 review 后验证加入完成流程。
3. 更新 `README.md`，记录个人项目的标准 SDD 收尾顺序。
4. 更新 PR 模板，增加独立 reviewer 和 findings disposition 证据。
5. 运行 OpenSpec strict validation，确认 delta spec 格式有效。
6. 实施完成后由独立 Codex reviewer 审查最终 diff，修复高优先级问题，并重新运行 `npm run verify`。

Rollback 时可通过后续 OpenSpec change 移除新增 requirement，并恢复对应文档与模板字段；不涉及运行时迁移或数据回滚。

## Open Questions

无。独立 reviewer 已确定为独立 Codex agent 或独立上下文，GitHub 人工 approval 明确不属于本次范围。
