## Why

The repository still contains incomplete Cursor-era rules and skills, while ongoing development now uses Codex. A single OpenSpec workflow is needed so requirements, implementation tasks, validation, and archived decisions remain discoverable over time.

## What Changes

- Initialize the official OpenSpec Codex integration.
- Add project context and artifact rules for this Next.js 16 application.
- Add narrow baseline specs for stable authentication, highlights, health-check, and deployment behavior.
- Migrate durable engineering constraints into `AGENTS.md`.
- Remove obsolete `.cursor/` and `docs/superpowers/` workflow files.
- Document OpenSpec usage in `README.md`.

## Capabilities

### New Capabilities

- `repository-sdd-workflow`: Define the OpenSpec workflow, repository instruction sources, and strict validation gate for future changes.

### Modified Capabilities

- None. No user-visible requirements change.

## Impact

This change affects repository documentation, agent instructions, and SDD metadata only. It does not modify application runtime code, dependencies, database schema, environment variables, or deployment behavior.
