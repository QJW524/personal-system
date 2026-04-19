---
name: deploy-ops
description: Handles Docker Compose and GitHub Actions deployment workflow for this repository. Use when setting up server deployment, connection checks, rollout, or rollback procedures.
---

# Deploy Ops

## Standard Flow

1. Verify GitHub Actions secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `APP_DIR`.
2. Run manual connection workflow: `.github/workflows/verify-connection.yml`.
3. Ensure server path has repository and `docker-compose.yml`.
4. Trigger deploy workflow or push to `main`.
5. Validate with `docker compose ps` and `/api/health`.

## Rollback Baseline

- On VPS, checkout previous commit.
- Run `docker compose up -d --build`.
- Re-check `/api/health` and logs.
