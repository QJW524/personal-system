## ADDED Requirements

### Requirement: OpenSpec change workflow
The repository SHALL use OpenSpec as the source of truth for specification-driven changes. Current requirements SHALL live in `openspec/specs/`, and requirement deltas SHALL live under `openspec/changes/<change-name>/specs/` until archived.

#### Scenario: A developer starts a behavior change
- **WHEN** a developer begins work that changes observable system behavior
- **THEN** the developer creates an OpenSpec change with proposal, delta specs, design, and tasks before implementation is completed

#### Scenario: A developer completes a behavior change
- **WHEN** a change has been implemented and validated
- **THEN** the developer archives the OpenSpec change so its requirement deltas are merged into the current specs

### Requirement: Codex OpenSpec integration
The repository SHALL provide the generated OpenSpec Codex skills and SHALL document the `/opsx:*` workflow commands.

#### Scenario: A Codex session works in the repository
- **WHEN** Codex loads the repository after OpenSpec initialization
- **THEN** it can use `/opsx:explore`, `/opsx:propose`, `/opsx:apply`, and `/opsx:archive`

### Requirement: Repository development constraints
The repository SHALL keep durable agent guidance in `AGENTS.md` and SHALL keep OpenSpec artifact-generation context in `openspec/config.yaml`.

#### Scenario: An agent prepares a repository change
- **WHEN** an agent reads the repository instructions and generates OpenSpec artifacts
- **THEN** it receives the Next.js 16 documentation requirement, engineering baseline, quality gates, and artifact-specific rules

### Requirement: Strict OpenSpec validation
The repository SHALL validate OpenSpec changes and current specs with strict validation before completion.

#### Scenario: A change is ready for completion
- **WHEN** a developer prepares to archive or hand off a repository change
- **THEN** `openspec validate --all --strict` passes
