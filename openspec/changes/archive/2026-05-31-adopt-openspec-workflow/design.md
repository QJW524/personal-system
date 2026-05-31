## Context

The repository is an existing Next.js 16 personal system with authentication, highlights, tests, Docker deployment, and several Cursor-specific workflow files. The Cursor files mix durable engineering guidance with editor-specific instructions. Codex is now the active development environment.

## Goals / Non-Goals

**Goals:**

- Make OpenSpec the only SDD workflow for future repository changes.
- Preserve useful engineering constraints without retaining Cursor-specific files.
- Seed a small set of baseline specs for stable existing behavior.
- Keep the workflow compatible with the official OpenSpec CLI and generated Codex skills.

**Non-Goals:**

- Reverse-engineer every current implementation detail into specs.
- Change application behavior, dependencies, infrastructure, or deployment.
- Introduce a project-local custom OpenSpec schema.

## Decisions

- Use OpenSpec's built-in `spec-driven` schema: proposal, delta specs, design, and tasks.
- Keep current behavior in `openspec/specs/` and future deltas in `openspec/changes/<name>/specs/`.
- Store repository-wide constraints in `AGENTS.md`; store artifact-generation context and rules in `openspec/config.yaml`.
- Preserve durable documents under `docs/`, including the production troubleshooting log.
- Remove `.cursor/` and `docs/superpowers/` because their useful content is represented in the new entry points.

## Risks / Trade-offs

- Baseline specs intentionally cover only stable, high-value capabilities. Less important behavior remains undocumented until a future change touches it.
- OpenSpec Codex commands become visible after the Codex environment reloads. The CLI remains immediately usable.
