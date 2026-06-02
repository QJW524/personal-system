## Context

The repository already keeps durable engineering guidance in `AGENTS.md`, operational documents in `docs/`, and behavior requirements in OpenSpec. The requested content is not a product feature; it is a maintained project narrative that should live with the codebase so future iterations of authentication, testing, deployment, or SDD workflow can be reflected in one place.

## Goals / Non-Goals

**Goals:**

- Add a single repository-owned document for resume and interview project introductions.
- Preserve the current Chinese summary in a structure that is easy to revise as capabilities evolve.
- Make the document discoverable from `README.md`.

**Non-Goals:**

- Change any application behavior, user-facing UI, API contract, or deployment flow.
- Introduce additional tooling, generators, or formatting automation for resume content.
- Duplicate the same long-form narrative across multiple repository files.

## Decisions

- Store the maintained summary in `docs/project-profile.md` to follow the repository's existing durable-document pattern.
- Keep the document in Chinese because the current target use case is resume writing and interview preparation in Chinese.
- Use stable sections for project name, project background, technical architecture, and core engineering achievements so future updates remain incremental instead of rewriting the whole document.
- Add only a lightweight README link rather than inlining the full content there, which keeps the main README focused on development and operations while still making the profile discoverable.

## Risks / Trade-offs

- [Risk] The summary can drift behind the codebase if it is treated as a one-off writing artifact. → Mitigation: keep one canonical file and link to it from `README.md`.
- [Risk] Resume wording may become too verbose for job-platform constraints. → Mitigation: store the richer source version in the repository and derive shorter variants from it later.
