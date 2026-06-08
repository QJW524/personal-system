## Why

当前仓库已经在 `AGENTS.md` 与 `openspec/config.yaml` 中记录了页面、数据库与 API 的工程约束，但这些约束尚未作为可验证的 OpenSpec 基线能力存在。将它们收编为架构基线规格，可以让后续变更在 proposal、design、spec 与 review 阶段有一致的判断标准。

## What Changes

- 新增 `application-architecture-baseline` capability，用于描述跨功能的应用架构约束。
- 明确客户端页面编写基线：优先 Server Components，仅在浏览器状态或事件处理需要时引入 Client Components，并为数据库页面声明渲染策略与 fallback。
- 明确数据库设计基线：Prisma 访问边界、数据归属、迁移影响、级联或清理策略必须在设计中说清楚。
- 明确接口开发基线：API route 必须返回稳定 JSON shape、明确 HTTP status，并覆盖认证、校验、not found 与权限失败等一致语义。
- 非目标：不新增运行时代码、不调整现有 API 行为、不新增数据库表或迁移、不把所有编码风格细节搬进 OpenSpec。

## Capabilities

### New Capabilities

- `application-architecture-baseline`: 定义 Next.js 页面、数据库建模与 API route 开发在本仓库中的跨功能架构基线。

### Modified Capabilities

- 无。

## Impact

- 影响范围：`openspec/changes/add-architecture-baseline-spec/` 下的 proposal、design、delta spec 与 tasks。
- 归档后影响：新增 `openspec/specs/application-architecture-baseline/spec.md` 作为未来变更的架构判断依据。
- 代码影响：无应用代码变更。
- API 影响：无现有接口行为变更。
- 数据库影响：无 Prisma schema 或迁移变更。
- 环境变量影响：无新增环境变量。
- 部署影响：无部署流程或基础设施变更。
