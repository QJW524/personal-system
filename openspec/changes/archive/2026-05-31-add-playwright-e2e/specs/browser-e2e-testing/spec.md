## ADDED Requirements

### Requirement: Local Chromium E2E runner
仓库 SHALL 提供一套本地 Playwright E2E 运行器，默认使用 Chromium，并通过 Playwright 的 `webServer` 集成启动 Next.js 应用。

#### Scenario: A developer runs the E2E suite
- **WHEN** 开发者在本地 PostgreSQL 和 Redis 已可用的前提下执行文档中的 E2E 命令
- **THEN** Playwright 会启动 Next.js 应用、执行 Chromium 测试集，并在任一浏览器场景失败时以失败状态退出

### Requirement: Critical authenticated browser journey
Playwright 测试集 SHALL 通过真实浏览器交互验证受保护路由跳转、账号注册、账号登录、基于会话的首页访问、Highlight 新增/编辑/删除流程、登出以及登出后的路由保护。

#### Scenario: An unauthenticated browser requests the homepage
- **WHEN** 一个没有会话 Cookie 的浏览器访问 `/`
- **THEN** 应用会将该浏览器重定向到 `/login`

#### Scenario: A temporary user completes the authenticated workflow
- **WHEN** E2E 测试集为一个唯一的临时用户执行注册、登录、创建 Highlight、编辑、删除和登出
- **THEN** 浏览器能够看到每一步预期的 UI 状态，并在登出后再次被重定向到 `/login`

### Requirement: Temporary E2E user namespace
E2E 测试集 SHALL 为每一次会写入数据的浏览器流程创建一个带 `e2e_` 前缀的唯一用户名。清理逻辑 SHALL 只删除当前测试流程创建的临时用户，并依赖数据库关联级联清理该用户的 Profile 和 Highlights。

#### Scenario: A writable browser workflow starts
- **WHEN** 某个测试需要执行注册和 Highlight CRUD
- **THEN** 该测试会生成一个以 `e2e_` 开头的唯一用户名

#### Scenario: A writable browser workflow finishes successfully
- **WHEN** 测试完成全部断言
- **THEN** 清理逻辑只删除该流程创建的临时 `e2e_*` 用户

#### Scenario: A writable browser workflow fails
- **WHEN** 在临时用户已创建之后，某个断言或浏览器操作失败
- **THEN** 清理逻辑仍然会尝试只删除该流程创建的临时 `e2e_*` 用户

### Requirement: Destructive cleanup guard
清理辅助逻辑 SHALL 拒绝删除任何用户名不以 `e2e_` 开头的用户。整个 E2E 流程 SHALL NOT 对共享开发环境中的 PostgreSQL 或 Redis 执行重置、截断表或批量删除。

#### Scenario: Cleanup receives a non-E2E username
- **WHEN** 清理辅助逻辑收到一个不带 `e2e_` 前缀的用户名
- **THEN** 它会在发出数据库删除操作之前直接抛出错误

#### Scenario: The E2E suite runs against development services
- **WHEN** Playwright 使用现有本地 `DATABASE_URL` 和 `REDIS_URL`
- **THEN** 它不会触碰原有开发用户、Profile、Highlights 以及无关的 Redis 数据

### Requirement: Failure diagnostics
Playwright 运行器 SHALL 为失败测试保留 trace、截图和视频。

#### Scenario: A browser scenario fails
- **WHEN** 某个 Playwright 测试失败
- **THEN** 生成的诊断产物会被保存在已忽略的本地目录中，供后续排查使用
