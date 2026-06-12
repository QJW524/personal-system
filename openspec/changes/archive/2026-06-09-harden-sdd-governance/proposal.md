## Why

当前仓库已经建立了 OpenSpec SDD 基线，但关键质量闸门仍主要依赖人工和 agent 自觉执行；部署工作流也没有独立的 PR/merge 前验证链路。将 SDD 治理规则进一步自动化，可以降低规格漂移、未验证变更进入主干、以及发布前风险未显式暴露的概率。

## What Changes

- 补齐现有 baseline spec 中遗留的 Purpose 占位文本，避免基线真相来源出现 `TBD` 或 `待补充`。
- 新增仓库级验证入口，用一条 npm 脚本串联 OpenSpec strict validation、Vitest、lint 和 build。
- 新增 GitHub Actions CI workflow，在 pull request 和 `main` push 上执行同一套验证入口。
- 新增 PR 模板，要求提交者显式声明 OpenSpec change、影响范围、数据库/环境变量/部署影响、测试证据和归档状态。
- 更新 SDD 工作流基线，要求行为或治理类变更在合并前具备可追溯的规格、验证和评审证据。
- 非目标：不改业务运行时代码，不新增数据库表或迁移，不改变现有 API 行为，不把本地 Playwright E2E 强制接入每次 CI。

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `repository-sdd-workflow`: 增加企业级 SDD 治理要求，覆盖统一验证入口、CI 强制校验、PR 追溯清单、baseline spec 占位清理和规格漂移防护。

## Impact

- 影响文件：`package.json`、`.github/workflows/ci.yml`、`.github/pull_request_template.md`、`openspec/specs/*/spec.md`、`openspec/changes/harden-sdd-governance/*`。
- API 影响：无。
- 数据库迁移影响：无。
- 环境变量影响：无新增变量；该变更会要求后续发现 `.env.example` 与 baseline spec 明显不一致时显式记录或清理。
- 部署影响：新增 CI 不改变现有部署脚本；后续可将 `main` 部署建立在 CI 通过和分支保护之上。
