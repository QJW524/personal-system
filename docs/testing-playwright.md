# Playwright 本地 E2E 说明（personal-system）

本文说明本仓库的本地 Playwright E2E 基线、共享开发库的安全边界，以及失败诊断产物的位置。

## 目标

- 用真实浏览器验证未登录跳转、注册、登录、会话 Cookie、生效后的首页渲染、Highlight CRUD 和登出。
- 补上 Vitest 无法覆盖的浏览器级证据。

## 前置条件

执行前请确保：

- 本地 PostgreSQL 已可用，且 `.env` 中的 `DATABASE_URL` 指向当前开发库。
- 本地 Redis 已可用，且 `.env` 中的 `REDIS_URL` 可连接。
- 已安装 Playwright 依赖与 Chromium 浏览器二进制。

常见启动方式：

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db redis
```

## 命令

```bash
npm run test:e2e
npm run test:e2e:ui
```

Playwright 会通过 `webServer` 自动启动一个运行在 `3001` 端口的 Next.js 本地服务。

## 安全边界

本仓库当前不使用独立 E2E 容器，而是复用现有本地开发数据库和 Redis。因此必须遵守以下边界：

- E2E 只允许创建临时 `e2e_*` 用户。
- 清理逻辑只允许删除当前测试创建的精确 `e2e_*` 用户。
- 清理逻辑拒绝删除任何不以 `e2e_` 开头的用户名。
- E2E 不允许重置数据库、截断表、批量删除开发数据或 flush Redis。

测试用户删除后，会依赖 Prisma 级联关系一并清理关联的 Profile 和 Highlights。

## 失败诊断

测试失败时会保留：

- `trace`
- `screenshot`
- `video`

这些产物保存在本地忽略目录：

- `playwright-report/`
- `test-results/`

## 当前范围

第一版只跑 Chromium，只覆盖关键登录与 Highlight 流程，不接入 GitHub Actions。
