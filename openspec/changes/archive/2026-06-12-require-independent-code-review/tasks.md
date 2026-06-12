## 1. Repository Review Instructions

- [x] 1.1 Update `AGENTS.md` so code changes require an independent Codex reviewer or independent context before completion.
- [x] 1.2 Document the `Critical` / `Important` / `Minor` severity model and require confirmed `Critical` and `Important` findings to be resolved through fixes or evidence-backed independent re-review.
- [x] 1.3 Require `npm run verify` to run again after review and finding remediation, using the post-review run as final completion evidence.

## 2. Contributor Workflow Documentation

- [x] 2.1 Update `README.md` with the repository SDD completion sequence: initial verification, independent Codex review, high-priority finding remediation, and post-review verification.
- [x] 2.2 State that the personal project does not require approval from another GitHub user when the independent Codex review and final verification gates are complete.

## 3. Pull Request Traceability

- [x] 3.1 Update `.github/pull_request_template.md` to record the independent reviewer or context used.
- [x] 3.2 Add checklist fields for `Critical` and `Important` finding disposition, evidence-backed re-review of disputed findings, and the post-review `npm run verify` result.
- [x] 3.3 Keep GitHub human approval and branch protection outside the template's required completion conditions.

## 4. Validation And Independent Review

- [x] 4.1 Run `openspec validate --all --strict` after implementing the repository workflow files.
- [x] 4.2 Run an initial `npm run verify` and record the result before independent review.
- [x] 4.3 Dispatch an independent Codex reviewer or use an independent context to review the approved requirements and final target diff, with findings classified as `Critical`, `Important`, or `Minor`.
- [x] 4.4 Fix every confirmed `Critical` and `Important` finding; submit disputed high-priority findings for evidence-backed independent re-review until resolved.
- [x] 4.5 Re-run `npm run verify` after review and finding remediation, and use this post-review run as the final validation evidence.
- [x] 4.6 Review the final diff for unrelated changes and confirm the PR evidence fields match the completed review workflow.
