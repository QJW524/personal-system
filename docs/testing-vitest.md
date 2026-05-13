# Vitest 测试接入说明（personal-system）

> **Notion 摘要页**（挂在「Personal System｜技术文档」下）：[Vitest 测试接入与维护（personal-system）](https://www.notion.so/35fc804be45881449a44f1cfa30636a5)

本文说明本仓库 **Vitest 3** 的配置、脚本、测试分布与常用 API，便于维护与扩展。

## 脚本

| 命令 | 说明 |
|------|------|
| `npm test` | 启动 Vitest **监听**模式，改代码即重跑相关用例 |
| `npm run test:run` | **单次**跑完全部用例并退出（适合 CI / 提交前自检） |

依赖：`devDependencies` 中的 `vitest`（与 `package-lock.json` 中锁定版本一致）。

## 配置：`vitest.config.ts`

- **`test.environment`**：`node`。适合 `src/lib` 纯逻辑与带 mock 的 API 测试；若以后测 React 组件，可再引入 `jsdom` 与 `@vitejs/plugin-react`。
- **`test.include`**：`src/**/*.test.ts`、`src/**/*.test.tsx`。
- **`resolve.alias['@']`**：指向 `./src`，与 `tsconfig.json` 里 `@/*` 一致，测试中可写 `import { x } from '@/lib/...'`。

## 测试文件分布（约 49 条用例）

| 文件 | 覆盖内容 |
|------|----------|
| `src/lib/validators/auth.test.ts` | `loginSchema` / `registerSchema` |
| `src/lib/http/cookie-parse.test.ts` | `getCookieValue` |
| `src/lib/http/client-ip.test.ts` | `getClientIpFromRequest` |
| `src/lib/auth/login-identifier.test.ts` | `normalizeLoginIdentifier` |
| `src/lib/auth/cookies.test.ts` | `getSessionCookieOptions`（含 `vi.stubEnv`） |
| `src/lib/auth/password.test.ts` | `hashPassword` / `verifyPassword`（真实 bcrypt，较慢） |
| `src/lib/auth/session.test.ts` | `generateSessionId`、`createSession`、`getSession`、`deleteSession`、`rotateSession`（mock Redis） |
| `src/lib/auth/rate-limit.test.ts` | `isLoginRateLimited`（mock Redis） |
| `src/lib/auth/request-session.test.ts` | `getSessionFromRequest`（mock `getSession`） |
| `src/lib/highlights/parse-record-id.test.ts` | `parsePositiveIntRecordId` |
| `src/lib/redis.test.ts` | 无 `REDIS_URL` 时 `getRedis()` 抛错（`vi.resetModules` + 动态 `import`） |
| `src/app/api/health/route.test.ts` | `GET` 健康检查（mock `prisma.$queryRaw`） |
| `src/app/api/auth/logout/route.test.ts` | `POST` 登出与 `deleteSession`（`beforeEach` 里 `mockClear`） |
| `src/app/api/auth/me/route.test.ts` | `GET` 当前用户（mock `getSession`） |
| `src/app/api/auth/auth-routes-validation.test.ts` | 登录/注册 **仅校验** 返回 400（不连库） |

## 为可测性抽取的 `src/lib` 模块

路由内重复或纯函数逻辑抽到 `lib`，便于单测、路由保持较薄：

- `src/lib/http/cookie-parse.ts` — `getCookieValue`（`logout` / `me` / `request-session` 使用）
- `src/lib/http/client-ip.ts` — `getClientIpFromRequest`（登录路由）
- `src/lib/auth/login-identifier.ts` — `normalizeLoginIdentifier`（登录路由）
- `src/lib/highlights/parse-record-id.ts` — `parsePositiveIntRecordId`（`highlights/[id]`）

## 常用 Vitest API（读懂测试的最小集）

| 符号 | 作用 |
|------|------|
| `describe` / `it` | 分组与单条用例 |
| `expect` | 断言（`toBe`、`toEqual`、`resolves`、`rejects` 等） |
| `vi.fn()` | 假函数，可链式 `mockResolvedValueOnce` 等 |
| `vi.mock('模块', factory)` | 整模块替换（常 mock `@/lib/redis`、`@/lib/prisma`） |
| `vi.mocked(x)` | 类型收窄，便于对 mock 补全方法 |
| `beforeEach` / `afterEach` | 每条用例前/后清理（如 `mockClear`、`vi.unstubAllEnvs`） |
| `vi.stubEnv` / `vi.unstubAllEnvs` | 临时改环境变量并恢复 |
| `vi.spyOn` | 监视如 `console.error` 避免测试污染 stderr |
| `vi.resetModules` | 清模块缓存，配合动态 `import` 测「冷启动」行为 |

## CI 与质量门槛

建议在合并前至少执行：`npm run test:run` 与仓库既有要求 `npm run lint`、`npm run build`（见 `.cursor/rules`）。

## 未覆盖与后续方向

- **登录成功、注册成功、highlights CRUD 全链路**：依赖 Prisma/真实或测试数据库，当前未做集成层单测；可后续接 **test DB**、**Testcontainers** 或把校验再下沉到 `lib` 后补测。
- **组件/UI**：需在 Vitest 中启用 `jsdom`（及可选 React Testing Library）。

## 更新记录

- **2026-05-13**：接入 Vitest 最小配置并补充上述用例与 `lib` 抽取。
