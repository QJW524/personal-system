## 1. OpenSpec artifacts

- [x] 1.1 完成 proposal、design、delta spec 与 tasks，明确“中文化但不改语义”的范围、约束与非目标。

## 2. Baseline spec translation

- [x] 2.1 将仓库级与工程基线 spec 整理为简体中文，包括 `repository-sdd-workflow`、`browser-e2e-testing`、`health-check`、`project-profile-documentation` 与 `vps-deployment`。
- [x] 2.2 将产品与认证相关基线 spec 整理为简体中文，包括 `project-workbench`、`session-authentication` 与 `highlight-management`。
- [x] 2.3 统一术语并保留 `SHALL`、`WHEN`、`THEN`、`### Requirement:` 与 `#### Scenario:` 等结构关键字。

## 3. Validation

- [x] 3.1 Run `openspec validate --all --strict`.
- [x] 3.2 Run `npm run test:run`.
- [x] 3.3 Run `npm run lint`.
- [x] 3.4 Run `npm run build`.
