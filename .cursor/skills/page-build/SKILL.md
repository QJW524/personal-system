---
name: page-build
description: Builds or updates Next.js pages for this repository with semantic layout, metadata, database-safe server rendering, and low-AI-tone copy. Use when creating new pages or revising homepage sections.
---

# Page Build

## Checklist

- Confirm page purpose and one primary user action.
- Use Server Component first; add `'use client'` only if browser interaction is required.
- Keep copy concrete and specific to real projects or progress.
- Ensure empty/error state exists when DB data is unavailable.
- Keep visual hierarchy simple and readable on mobile.

## Output Pattern

1. Update route file under `src/app/*`.
2. Keep styles in a colocated CSS module.
3. Add or update metadata in `layout.tsx` or route-level metadata.
4. Run `npm run lint` and fix obvious issues before finishing.
