## 1. Baseline Spec Hygiene

- [x] 1.1 Replace the placeholder Purpose in `openspec/specs/baseline-spec-localization/spec.md` with a concrete Simplified Chinese description.
- [x] 1.2 Replace the placeholder Purpose in `openspec/specs/browser-e2e-testing/spec.md` with a concrete Simplified Chinese description.
- [x] 1.3 Scan `openspec/specs/` for `TBD`, `TODO`, `待补充`, and equivalent placeholder text; resolve any remaining baseline placeholders or document why they are intentionally retained.

## 2. Unified Verification Entry

- [x] 2.1 Add a `verify` npm script that runs `openspec validate --all --strict`, `npm run test:run`, `npm run lint`, and `npm run build` in order.
- [x] 2.2 Confirm the new script exits non-zero when any underlying quality gate fails.
- [x] 2.3 Update any repository documentation or instructions that should point contributors to `npm run verify` as the default completion check.

## 3. CI Quality Gate

- [x] 3.1 Add `.github/workflows/ci.yml` for pull requests and `main` pushes.
- [x] 3.2 Configure the CI workflow to use Node, install dependencies with `npm ci`, and run `npm run verify`.
- [x] 3.3 Keep the new CI workflow separate from the existing deployment workflow.

## 4. PR Traceability

- [x] 4.1 Add `.github/pull_request_template.md` with fields for OpenSpec change, user-visible behavior, non-goals, database impact, environment variable impact, deployment impact, validation evidence, and archive status.
- [x] 4.2 Include checklist items that make authentication, permission, API contract, and deployment impacts explicit when relevant.

## 5. OpenSpec Alignment

- [x] 5.1 Validate the `repository-sdd-workflow` delta spec covers unified verification, CI quality gates, PR traceability, baseline completeness, and specification drift prevention.
- [x] 5.2 Confirm the change does not introduce new runtime behavior, database migrations, API contract changes, dependencies, or environment variables.

## 6. Final Verification

- [x] 6.1 Run `openspec validate --all --strict`.
- [x] 6.2 Run `npm run verify`.
- [x] 6.3 Review the final diff for unrelated changes.
- [x] 6.4 Mark completed tasks in this file before archiving the change.
