# Workbench UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将登录页和认证后首页重构为“项目工作台”体验，同时暂时复用现有认证与 Highlight 数据链路。

**Architecture:** 保持 `src/app/login/page.tsx` 作为 Client Component，保留登录/注册交互，只重构文案层级与布局。保持 `src/app/page.tsx` 作为 Server Component，继续在服务端读取 session 和 profile/highlights，但将页面结构改成状态概览、项目卡片区和最近更新导向的工作台首页；`HighlightCrud` 作为当前项目卡片的过渡承载层同步调整文案和视觉样式。

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules

---

### Task 1: Refactor the login page into a product entry page

**Files:**
- Modify: `D:\project\personal-system\src\app\login\page.tsx`
- Modify: `D:\project\personal-system\src\app\login\page.module.css`

- [ ] **Step 1: Rewrite the login page copy hierarchy**
- [ ] **Step 2: Replace the bright SaaS split-screen styling with a calmer workbench entry layout**
- [ ] **Step 3: Preserve current login and register behaviors while tightening button hierarchy and empty state messaging**

### Task 2: Refactor the authenticated home page into a workbench shell

**Files:**
- Modify: `D:\project\personal-system\src\app\page.tsx`
- Modify: `D:\project\personal-system\src\app\page.module.css`

- [ ] **Step 1: Replace the profile-intro hero with a workbench header and overview structure**
- [ ] **Step 2: Add an honest status-summary section that frames the intended workflow without fabricating backend status data**
- [ ] **Step 3: Reorganize the page into overview, project cards, and recent-updates-oriented sections**

### Task 3: Reframe HighlightCrud as the first project-card layer

**Files:**
- Modify: `D:\project\personal-system\src\components\highlight-crud.tsx`
- Modify: `D:\project\personal-system\src\components\highlight-crud.module.css`

- [ ] **Step 1: Rewrite labels, placeholders, and button copy around project capture and next-action language**
- [ ] **Step 2: Restyle the create form and item cards to fit the new workbench dashboard**
- [ ] **Step 3: Keep create, update, and delete behaviors unchanged**

### Task 4: Validate and update the active OpenSpec change

**Files:**
- Modify: `D:\project\personal-system\openspec\changes\add-project-workbench\tasks.md`

- [ ] **Step 1: Run `openspec validate --all --strict`**
- [ ] **Step 2: Run `npm run test:run`**
- [ ] **Step 3: Run `npm run lint`**
- [ ] **Step 4: Run `npm run build`**
- [ ] **Step 5: Mark the completed UI tasks in `add-project-workbench/tasks.md`**
