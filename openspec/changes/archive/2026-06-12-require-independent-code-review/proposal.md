## Why

当前仓库已经统一了 OpenSpec、测试、lint、build 和 PR 追溯清单，但代码审查仍停留在非强制习惯：实现者可以在没有独立审查上下文、没有处理高优先级问题、也没有在修复后重新验证的情况下把变更视为完成。个人项目仍需要一条轻量、可追溯且不依赖第二个 GitHub 账号的审查闭环。

## What Changes

- 要求代码变更在完成前由独立 Codex reviewer 或独立上下文进行审查。
- 统一审查问题等级为 `Critical`、`Important` 和 `Minor`。
- 要求所有已确认的 `Critical` 和 `Important` 问题在完成前修复；有争议的问题必须通过复审或技术证据解决。
- 要求审查修复完成后重新运行 `npm run verify`，并记录最终审查与验证证据。
- 更新仓库 agent 指令、SDD 文档和 PR 模板，使流程要求在本地、Codex 会话和 PR 中保持一致。
- 明确个人项目不要求另一个 GitHub 用户提供 PR approval，也不在本次变更中引入 branch protection。

## Capabilities

### New Capabilities

无。

### Modified Capabilities

- `repository-sdd-workflow`: 增加独立 Codex code review、高优先级问题处置、修复后重新验证和审查证据要求。

## Impact

- 受影响文件：`AGENTS.md`、`README.md`、`.github/pull_request_template.md` 和 `repository-sdd-workflow` 规格。
- 不修改 Next.js 运行时代码、API contract、认证或权限行为。
- 不修改数据库 schema，不新增 migration。
- 不新增或修改环境变量。
- 不修改部署流程或 GitHub branch protection。
- 不新增依赖。
