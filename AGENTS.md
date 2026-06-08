<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# OpenSpec SDD workflow

Use OpenSpec for behavior, architecture, data ownership, API contract, deployment, authentication, permission, or unclear multi-step repository changes.

OpenSpec is not required for small, well-scoped edits such as typo fixes, UI copy tweaks, localized styling, documentation cleanup, straightforward refactors with no observable behavior change, or small bug fixes with an obvious root cause.

If a small edit grows into a behavior, data model, API, security, deployment, or architecture change, pause and create an OpenSpec change before continuing.

When OpenSpec applies, use this workflow:

1. Explore an idea before implementation when requirements are unclear.
2. Start a change with `/opsx:propose <description>` or `openspec new change <kebab-case-name>`.
3. Keep proposal, delta specs, design, and tasks under `openspec/changes/<change-name>/`.
4. Implement with `/opsx:apply <change-name>`.
5. Validate with `openspec validate --all --strict`.
6. Archive completed work with `/opsx:archive <change-name>` or `openspec archive <change-name>`.

Current system behavior belongs in `openspec/specs/`. New behavior starts as a delta spec inside a change and is merged into the baseline when archived.

# Engineering baseline

- Prefer Server Components. Add Client Components only for browser state or event handlers.
- Keep Prisma access in `src/lib/*` or route handlers, not deeply nested UI components.
- For database-backed pages, choose an explicit rendering strategy and provide graceful fallback UI.
- Return stable JSON shapes and HTTP statuses from API routes.
- Keep environment variables explicit and update `.env.example` when adding one.
- Before finishing a code change, run `npm run test:run`, `npm run lint`, and `npm run build`.
- Use Conventional Commits and keep each pull request focused on one change.

# Knowledge maintenance

When fixing a non-trivial bug or production issue, append a concise Simplified Chinese entry to `docs/problem-solving-log.md` using its existing template. Keep UI copy concrete and layouts calm; refer to `docs/design-principles.md`.
