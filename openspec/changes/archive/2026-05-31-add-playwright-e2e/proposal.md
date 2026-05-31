## Why

仓库目前已经有单元测试和 API 测试，但还缺少对关键登录链路的浏览器级证据。需要补上一套可控的本地 Playwright 基线，用真实浏览器验证登录跳转、会话 Cookie 和 Highlight CRUD，同时不重置现有开发数据库。

## What Changes

- 新增一套仅本地使用、只跑 Chromium 的 Playwright E2E 运行基线。
- 新增浏览器测试，覆盖受保护路由跳转、注册、登录、Highlight 新增/编辑/删除、登出以及登出后的路由保护。
- 新增测试辅助逻辑：创建唯一的 `e2e_*` 临时用户，并在清理阶段只删除当前测试创建的临时用户。
- 复用现有本地 PostgreSQL 和 Redis，不清空共享开发数据。
- 在测试失败时保留 Playwright trace、截图和视频。
- 补充本地安装与执行文档。
- 本次变更不接 GitHub Actions，也不增加独立 E2E 容器。

## Capabilities

### New Capabilities

- `browser-e2e-testing`：定义本地可控的 Playwright E2E 流程，以及临时测试数据的清理边界。

### Modified Capabilities

- None. Existing product behavior is verified, not changed.

## Impact

- 增加 `@playwright/test` 开发依赖和本地 Chromium 浏览器二进制。
- 增加 Playwright 配置、E2E 测试、辅助代码、npm 脚本、文档和忽略规则。
- 继续使用现有 `DATABASE_URL` 与 `REDIS_URL`；不引入新的环境变量、Prisma 迁移、生产部署变更或 GitHub Actions 变更。
