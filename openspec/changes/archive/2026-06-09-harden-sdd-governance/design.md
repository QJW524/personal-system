## Context

仓库已经有 OpenSpec baseline specs、Codex skills、AGENTS.md 约束，以及本地 `npm run test:run`、`npm run lint`、`npm run build` 等质量门槛。当前缺口是这些门槛没有统一入口，也没有在 GitHub Actions 的 PR/merge 阶段自动执行；现有部署 workflow 在 `main` push 后直接触发远程部署，无法从仓库内看到“合并前验证证据”。

这次变更是 SDD 治理增强，不涉及 Next.js 页面、API、Prisma schema 或生产数据路径，因此不需要阅读新的 Next.js API 文档，也不引入运行时代码变更。

## Goals / Non-Goals

**Goals:**

- 用一个 npm 脚本统一本地、CI 和 agent 收尾验证入口。
- 在 GitHub Actions 中新增 PR/`main` push CI，强制执行 OpenSpec strict validation、Vitest、lint 和 build。
- 通过 PR 模板沉淀 OpenSpec change、影响范围、测试证据和归档状态，提升评审可追溯性。
- 清理 baseline spec 的 Purpose 占位，让规格基线更像长期真相来源。
- 在 SDD 基线中声明规格漂移防护：环境变量、数据库、API、部署或认证变化必须有对应规格或明确非目标说明。

**Non-Goals:**

- 不改业务功能、API response shape、数据库 schema 或部署脚本执行顺序。
- 不把 Playwright E2E 接入默认 CI；当前 E2E 依赖本地 PostgreSQL 和 Redis，适合保留为手动或后续独立增强。
- 不引入新依赖、CodeQL、Dependabot 或 branch protection 配置；这些可以作为后续硬化项。

## Decisions

1. 新增 `npm run verify` 作为唯一默认验证入口。

   该脚本顺序执行 `openspec validate --all --strict`、`npm run test:run`、`npm run lint` 和 `npm run build`。这样 AGENTS.md、CI、PR 模板和开发者本地检查都可以引用同一个命令，减少“文档说一套，CI 跑一套”的漂移。

   备选方案是只在 CI YAML 中逐步写出四个命令。这样可读性高，但本地与 CI 容易分叉；统一 npm 脚本更适合当前仓库规模。

2. 新增 `ci.yml`，触发范围为 pull request 和 `main` push。

   CI 使用 Node setup、`npm ci` 和 `npm run verify`。`main` push 也执行验证，是为了给直接 push 或合并后的部署提供一份仓库侧证据；部署 workflow 本次不改，避免把发布逻辑和治理增强揉在同一个变更里。

   备选方案是直接修改 `deploy.yml`，在 SSH 前跑验证。该方案能立刻阻断部署，但会让部署 workflow 同时承担验证和发布职责，后续演进不如独立 CI 清晰。

3. PR 模板采用核对清单，而不是复杂表格。

   模板要求填写 OpenSpec change、影响范围、数据库/环境变量/部署影响、验证命令和归档状态。清单足够轻，不会压垮个人项目节奏，但能让企业级评审关心的问题被固定问出来。

4. Purpose 占位清理作为文档质量任务处理，不建单独 requirement delta。

   `baseline-spec-localization` 和 `browser-e2e-testing` 的 Requirements 不变，只补齐 Purpose 文本。真正的行为要求变化集中到 `repository-sdd-workflow` delta spec，避免 OpenSpec capability 边界被无意义扩大。

## Risks / Trade-offs

- [Risk] `npm run verify` 会让每次 CI 都执行 `next build`，耗时比单测和 lint 更长。→ Mitigation: 这是默认合并门槛；Playwright E2E 暂不进入默认 CI，控制总成本。
- [Risk] CI 环境缺失构建所需环境变量会导致 build 失败。→ Mitigation: 当前 `.env.example` 已提供默认开发值；如果 Next build 后续需要 secrets，应在对应 change 中显式记录环境变量影响。
- [Risk] PR 模板无法真正强制填写完整内容。→ Mitigation: 模板先建立评审协议；后续如需要，可增加脚本检查 PR body 或 GitHub branch protection。
- [Risk] 规格漂移防护仍有人工判断成分。→ Mitigation: 先用 OpenSpec requirement 和 PR 清单固定判断点，后续再考虑自动扫描 `.env.example`、Prisma migration 和 API route 变更。

## Migration Plan

1. 补齐 `baseline-spec-localization` 与 `browser-e2e-testing` 的 Purpose。
2. 新增 `verify` npm 脚本。
3. 新增 GitHub Actions CI workflow。
4. 新增 PR 模板。
5. 更新 `repository-sdd-workflow` delta spec 与 tasks。
6. 运行 `npm run verify` 和 `openspec validate --all --strict` 确认治理链路可用。

Rollback 策略：如果 CI 成本或环境兼容性不合适，可以在后续 change 中先移除 `ci.yml` 或调整 `verify` 脚本；PR 模板和 Purpose 补齐可以保留。

## Open Questions

- 是否要在下一轮把 Playwright E2E 拆成独立的手动 GitHub Actions workflow，目前先不纳入本次范围。
- 是否要对 GitHub branch protection 做仓库外配置，本次只准备仓库内可版本化文件。
