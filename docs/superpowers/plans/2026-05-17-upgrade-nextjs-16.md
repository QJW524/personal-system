# Next.js 16 升级 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 personal-system 从 Next.js 15.3 升级到 16.x，通过官方 codemod + 验证门禁，保持认证/Prisma/Docker 行为不变。

**Architecture:** 使用 `@next/codemod upgrade` 升级依赖与可自动迁移的 API；params 已为 Promise 形态无需再改；升级后跑 vitest / lint / build 作为完成证据。

**Tech Stack:** Next.js 16, React 19, eslint-config-next 16, Vitest

---

### Task 1: 基线与分支

- [x] 记录基线：`npm run test:run` 全绿
- [x] 创建分支 `feat/upgrade-nextjs-16`

### Task 2: 官方升级

- [x] 运行 `npx @next/codemod@latest upgrade latest`（交互式 upgrade 未用；改为 `npm install` + 分项 codemod）
- [x] 确认 `package.json` 中 `next`、`eslint-config-next` 为 16.x

### Task 3: 手动收尾

- [x] 检查 `next.config.ts`、`proxy.ts`（原 middleware）、动态路由 API
- [x] `next lint` → `eslint .`，新增 `eslint.config.mjs`，移除 `.eslintrc.json`

### Task 4: 验证门禁

- [x] `npm run test:run` — 49 passed
- [x] `npm run lint` — 通过
- [x] `npm run build` — exit 0
