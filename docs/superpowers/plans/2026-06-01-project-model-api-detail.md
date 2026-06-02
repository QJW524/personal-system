# Project Model API Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `add-project-workbench` 同一个 change 内，把首页工作台接上真实 `Project` 数据，并补齐 `Project / ProjectUpdate` 模型、认证 API 与项目详情页。

**Architecture:** 在 Prisma 中新增 `Project` 与 `ProjectUpdate`，将项目直接归属到 `User`。服务端通过 `src/lib/projects/*` 收敛 dashboard 查询、详情查询与项目更新写入；API 走 App Router Route Handlers，继续沿用认证 cookie + `getSessionFromRequest` 边界；UI 层把首页从 Highlight 过渡承载切到真实 Project 数据，并新增 `app/projects/[id]/page.tsx` 作为详情页。

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Prisma, PostgreSQL, Vitest, CSS Modules

---

### Task 1: Add Prisma project models and shared validators

**Files:**
- Modify: `D:\project\personal-system\prisma\schema.prisma`
- Create: `D:\project\personal-system\src\lib\validators\projects.ts`
- Create: `D:\project\personal-system\src\lib\validators\projects.test.ts`
- Create: `D:\project\personal-system\src\lib\projects\parse-record-id.ts`
- Create: `D:\project\personal-system\src\lib\projects\parse-record-id.test.ts`

- [ ] **Step 1: Write validator and record-id tests first**
- [ ] **Step 2: Add `ProjectStatus`, `Project`, and `ProjectUpdate` to Prisma schema**
- [ ] **Step 3: Add project payload schemas for quick create, filter, overview update, and update-entry create**
- [ ] **Step 4: Add a focused positive-int parser for project IDs**

### Task 2: Add project query helpers and authenticated API routes

**Files:**
- Create: `D:\project\personal-system\src\lib\projects\queries.ts`
- Create: `D:\project\personal-system\src\app\api\projects\route.ts`
- Create: `D:\project\personal-system\src\app\api\projects\route.test.ts`
- Create: `D:\project\personal-system\src\app\api\projects\[id]\route.ts`
- Create: `D:\project\personal-system\src\app\api\projects\[id]\route.test.ts`
- Create: `D:\project\personal-system\src\app\api\projects\[id]\updates\route.ts`
- Create: `D:\project\personal-system\src\app\api\projects\[id]\updates\route.test.ts`

- [ ] **Step 1: Write failing API tests for unauthorized, invalid payload, and not-found behaviors**
- [ ] **Step 2: Add dashboard/detail query helpers under `src/lib/projects/queries.ts`**
- [ ] **Step 3: Implement `GET /api/projects` with optional status filter and `POST /api/projects` quick create**
- [ ] **Step 4: Implement `GET /api/projects/[id]` and `PATCH /api/projects/[id]` for detail reads and overview edits**
- [ ] **Step 5: Implement `POST /api/projects/[id]/updates` for chronological update entries**

### Task 3: Replace Highlight dashboard data with Project data and add the detail page

**Files:**
- Modify: `D:\project\personal-system\src\app\page.tsx`
- Modify: `D:\project\personal-system\src\app\page.module.css`
- Create: `D:\project\personal-system\src\components\project-workbench.tsx`
- Create: `D:\project\personal-system\src\components\project-workbench.module.css`
- Create: `D:\project\personal-system\src\app\projects\[id]\page.tsx`
- Create: `D:\project\personal-system\src\app\projects\[id]\page.module.css`
- Create: `D:\project\personal-system\src\components\project-detail-editor.tsx`
- Create: `D:\project\personal-system\src\components\project-detail-editor.module.css`

- [ ] **Step 1: Replace homepage dashboard data reads from Highlight with real Project dashboard data**
- [ ] **Step 2: Move quick capture, filter, and project list interactions into a dedicated `ProjectWorkbench` client component**
- [ ] **Step 3: Add `/projects/[id]` detail page with overview, current goal, next action, and update history**
- [ ] **Step 4: Add a focused client editor for overview updates and new update entries**
- [ ] **Step 5: Preserve graceful empty, loading, and not-found states throughout**

### Task 4: Migrate, verify, and update the active change

**Files:**
- Modify: `D:\project\personal-system\openspec\changes\add-project-workbench\tasks.md`

- [ ] **Step 1: Run Prisma generate and create the migration for the new project tables**
- [ ] **Step 2: Run `openspec validate --all --strict`**
- [ ] **Step 3: Run `npm run test:run`**
- [ ] **Step 4: Run `npm run lint`**
- [ ] **Step 5: Run `npm run build`**
- [ ] **Step 6: Mark the completed data/API/detail tasks in `add-project-workbench/tasks.md`**
