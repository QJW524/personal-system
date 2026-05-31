## Context

当前应用已经使用 Vitest 覆盖纯逻辑和带 mock 的 API 路由，但还缺少对 async Server Components、跳转、Cookie 持久化和客户端 Highlight 交互的浏览器级验证。本地开发环境目前只有一套 PostgreSQL 和一套 Redis，且仓库所有者已明确允许在这套开发数据库中创建并删除临时 `e2e_*` 账号。

本地 Next.js 16 Playwright 指南也建议对 async Server Components 优先使用 E2E 测试，并支持通过 Playwright 的 `webServer` 配置自动拉起应用。

## Goals / Non-Goals

**Goals:**

- 增加一套仅本地使用的 Chromium Playwright 基线，用于覆盖关键登录用户流程。
- 验证浏览器跳转、Cookie、登录后渲染、Highlight CRUD 和登出。
- 复用现有开发 PostgreSQL 和 Redis，同时禁止宽泛清理。
- 在失败时保留诊断产物以便排查。

**Non-Goals:**

- 不增加独立 E2E 容器，也不增加第二套数据库或 Redis。
- 不重置、截断或批量删除开发数据。
- 不运行 Firefox 或 WebKit。
- 不把 E2E 接入 GitHub Actions。
- 不修改产品行为、Prisma schema、环境变量或部署流程。

## Decisions

### Use Chromium only

第一版只启用 Chromium。这样可以在建立 E2E 结构的同时，把浏览器安装量和执行时间压到最低。等未来确实出现跨浏览器风险，再补 Firefox 和 WebKit。

备选方案：一开始就配置三种浏览器。未采用，因为当前更需要先验证流程本身可靠，而不是先扩大浏览器矩阵。

### Start Next.js with Playwright webServer

在 `playwright.config.ts` 中配置本地 `webServer` 命令和 `baseURL`。第一版优先使用开发服务器以获得更快的本地反馈；而生产风格的 `build` 和 `start` 仍然保留为独立质量门槛，由 `AGENTS.md` 约束。

备选方案：要求开发者手动启动 Next.js。未采用，因为这样可复现性更差，也更容易让测试命令在错误前提下运行。

### Use one serial browser journey

第一版实现一个串行浏览器流程测试，覆盖跳转、注册、登录、Highlight 新增/编辑/删除、登出和登出后的保护。账号名、邮箱、密码和 Highlight 文案都在本次运行内动态生成。

备选方案：把每一步拆成多个隔离测试。第一版未采用，因为每个可写测试都需要单独的建号和清理，会增加共享开发数据暴露面，但对第一版基线收益不大。

### Delete only the current temporary user

在 `e2e/helpers/` 下增加一个 TypeScript 清理辅助逻辑：只有当用户名以 `e2e_` 开头时才允许删除。删除用户后依赖 Prisma 的级联关系清理对应 Profile 和 Highlights。清理在浏览器操作和断言结束后的 `finally` 中执行。登出动作通过应用自身删除当前 Redis Session，清理辅助逻辑不会 flush Redis。

备选方案：测试前后重置数据库。未采用，因为当前方案明确共享本地开发服务。

### Retain diagnostics only on failure

配置 Playwright 仅在失败时保留 `trace`、`screenshot` 和 `video`。生成的报告目录和诊断目录加入 Git 忽略列表。

## Risks / Trade-offs

- [Risk] E2E 会写入开发数据库。→ 使用唯一 `e2e_*` 账号，只在 `finally` 中删除当前测试用户，并禁止宽泛清理。
- [Risk] 进程中断可能留下 `e2e_*` 残留账号。→ 通过唯一命名避免冲突；若残留变多，再补一个带前缀保护的清理命令。
- [Risk] 开发服务器行为与生产服务器并不完全一致。→ 保留 `npm run build` 作为完成门槛，后续再考虑增加生产模式 E2E。
- [Risk] 只跑 Chromium 可能漏掉浏览器特有问题。→ 仅在确有需要时再扩展 Firefox 和 WebKit。

## Migration Plan

1. 安装 `@playwright/test` 开发依赖，并在本地安装 Chromium。
2. 增加 Playwright 配置、辅助代码、E2E 测试、npm 脚本、忽略规则和文档。
3. 先运行清理辅助逻辑的 guard 测试，再在现有本地 PostgreSQL 和 Redis 上执行浏览器测试。
4. 运行现有单元测试、lint、build 和严格 OpenSpec 校验。

回滚时只需移除 Playwright 依赖、配置、E2E 文件、npm 脚本、忽略规则和文档，不涉及任何应用数据迁移。

## Open Questions

- 当前基线没有遗留开放问题。
