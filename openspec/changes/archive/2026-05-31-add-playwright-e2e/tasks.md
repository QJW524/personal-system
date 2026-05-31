## 1. Add Playwright tooling

- [x] 1.1 安装 `@playwright/test` 开发依赖。
- [x] 1.2 在获得明确批准后安装本地 Playwright Chromium 浏览器二进制。
- [x] 1.3 新增 `playwright.config.ts`，配置 Chromium、`webServer`、`baseURL` 和失败诊断保留策略。
- [x] 1.4 新增 `test:e2e` 和 `test:e2e:ui` npm 脚本，并忽略 Playwright 生成产物。

## 2. Add guarded test data cleanup

- [x] 2.1 在 `e2e/helpers/` 下新增 Prisma 清理辅助逻辑：拒绝非 `e2e_` 用户名，并且只删除一个精确匹配的临时用户。
- [x] 2.2 新增一个聚焦的 Vitest 测试，证明清理辅助逻辑会在调用 Prisma 删除前拒绝非 `e2e_*` 用户名。
- [x] 2.3 运行该清理 guard 的 Vitest 测试并确认通过。

## 3. Add the browser journey

- [x] 3.1 新增一个 Chromium Playwright 测试，验证未登录访问首页时会被重定向。
- [x] 3.2 将该测试扩展为完整流程：唯一 `e2e_*` 注册、登录、Highlight 新增/编辑/删除、登出、登出后重定向，以及 `finally` 清理。
- [x] 3.3 在现有本地 PostgreSQL 和 Redis 上运行 `npm run test:e2e`，并确认临时用户被删除。

## 4. Document and verify

- [x] 4.1 在 `docs/testing-playwright.md` 中补充本地 E2E 前置条件、执行步骤、共享开发库安全边界以及诊断产物位置。
- [x] 4.2 在 `README.md` 中链接 Playwright 使用说明。
- [x] 4.3 运行 `npm run test:run`、`npm run lint` 和 `npm run build`。
- [x] 4.4 运行 `openspec validate --all --strict`，并检查最终 diff，确保没有意外的产品行为、数据库、部署或 CI 变更。
