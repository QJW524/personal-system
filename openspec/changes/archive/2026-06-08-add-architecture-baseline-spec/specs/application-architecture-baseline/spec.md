## ADDED Requirements

### Requirement: 页面组件边界
仓库中的新页面或重大页面改动 SHALL 优先使用 Next.js Server Components，并 SHALL 仅在需要浏览器状态、事件处理或浏览器专用 API 时引入 Client Components。数据库驱动页面 SHALL 在设计中声明渲染策略，并 SHALL 提供数据库或会话不可用时的 graceful fallback UI。

#### Scenario: 开发者设计新的数据库驱动页面
- **WHEN** 某个变更新增或重构需要读取数据库的页面
- **THEN** 该变更的设计会说明 Server Component 与 Client Component 的边界、页面渲染策略、数据加载位置和 fallback UI

#### Scenario: 页面需要浏览器交互状态
- **WHEN** 某个页面区域需要事件处理、表单交互、乐观状态或浏览器专用 API
- **THEN** 该交互会被隔离到 Client Component 中，并保持数据库访问位于服务端边界

### Requirement: 数据访问与模型设计边界
数据库支持的新行为 SHALL 将 Prisma 访问保持在 `src/lib/*` 或 route handlers 中，而不是深层 UI 组件中。新增或修改数据模型时，设计 SHALL 说明数据归属、用户隔离、迁移影响、级联或清理策略，以及数据库失败时的处理方式。

#### Scenario: 开发者新增数据库模型
- **WHEN** 某个变更新增 Prisma model、relation、enum 或 migration
- **THEN** 该变更的设计会说明数据归属、访问边界、迁移与部署影响、关联数据清理策略和失败处理方式

#### Scenario: 开发者实现数据库写入行为
- **WHEN** 某个变更新增创建、更新或删除数据的行为
- **THEN** 该实现会通过服务端数据访问边界执行 Prisma 操作，并在测试或任务中覆盖归属校验与失败语义

### Requirement: API route 契约
新增或修改的 API route SHALL 返回稳定的 JSON shape 与明确的 HTTP status。接口契约 SHALL 覆盖成功、认证失败、校验失败、资源不存在、资源不属于当前用户和服务器失败等可预期结果，并 SHALL 为客户端消费保持字段语义稳定。

#### Scenario: 客户端提交无效请求
- **WHEN** 客户端向新增或修改的 API route 提交无效 payload
- **THEN** 该接口会返回明确的 4xx HTTP status，并带有稳定的错误 JSON shape

#### Scenario: 客户端访问不存在或不属于自己的资源
- **WHEN** 客户端请求不存在或不属于当前用户的资源
- **THEN** 该接口会返回设计中声明的 HTTP status 与稳定 JSON shape，且不会泄露其他用户的数据

#### Scenario: 客户端请求成功
- **WHEN** 客户端请求通过认证、授权与校验
- **THEN** 该接口会返回设计中声明的成功 HTTP status 与稳定数据 JSON shape
