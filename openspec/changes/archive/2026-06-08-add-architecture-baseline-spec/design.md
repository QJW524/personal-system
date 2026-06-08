## Context

仓库当前已经通过 `AGENTS.md` 与 `openspec/config.yaml` 记录了 Next.js 16、React 19、Prisma、PostgreSQL、Redis sessions、Vitest 与部署相关约束。现有 baseline specs 主要覆盖认证、Highlight、项目工作台、健康检查、E2E 与部署等具体能力；跨功能的页面组件边界、数据库设计边界与 API route 契约还没有独立规格。

这次变更不改变运行时代码，而是把已存在的工程基线整理为 OpenSpec capability。目标是让未来功能变更在 proposal、design、spec 与 review 中能引用同一套架构判断，而不是依赖分散的上下文提示。

## Goals / Non-Goals

**Goals:**

- 为 Next.js 页面编写建立可验证的 Server Component / Client Component 边界。
- 为数据库设计建立可验证的数据归属、Prisma 访问、迁移与清理策略要求。
- 为 API route 开发建立可验证的 JSON 响应 shape、HTTP status 与错误语义要求。
- 保持规格粒度足够窄，只覆盖会影响系统一致性、数据安全和接口契约的架构规则。

**Non-Goals:**

- 不修改任何应用代码、Prisma schema、数据库迁移或部署配置。
- 不规定所有编码风格、CSS 命名、组件拆分细节或文件排序规则。
- 不重写现有功能 specs 的业务需求。
- 不替代 `AGENTS.md` 中对工具、质量闸门和知识维护的操作性说明。

## Decisions

### 新增独立 capability，而不是扩写 repository-sdd-workflow

`repository-sdd-workflow` 关注 OpenSpec 流程、Codex 集成和验证闸门；页面、数据与 API 契约属于应用架构基线。拆成 `application-architecture-baseline` 可以让未来变更在“工作流规则”和“应用架构规则”之间保持清晰边界。

备选方案是把这些要求追加到 `repository-sdd-workflow`。该方案改动更小，但会让流程规格承载过多工程细节，后续阅读和归档语义都会变钝。

### 只规格化跨功能契约，不规格化普通风格偏好

本 change 只写入会影响行为一致性或维护安全性的要求：Server/Client 边界、数据库归属与迁移影响、API JSON/status 契约。普通代码风格仍留在既有文档或 review 习惯中。

备选方案是创建更全面的工程规范 capability。该方案看似完整，但会让 OpenSpec 混入难以验证的偏好条目，降低规格的信噪比。

### 以未来变更的设计产物作为主要验证点

这些规则大多不是单一运行时测试能完全证明的行为，因此 spec scenarios 聚焦在未来开发者创建页面、数据模型或 API route 时必须在设计、实现和测试中显式处理的内容。能自动化验证的部分，例如 API status、JSON shape 和数据库 fallback，仍应在具体功能 change 的任务中落实测试。

备选方案是要求本 change 立即新增 lint rule 或架构测试。考虑到当前目标是归纳 baseline，且没有新增运行时代码，自动化约束可以作为后续独立增强，而不是本次前置条件。

## Risks / Trade-offs

- 规格过宽导致未来变更负担变重 -> 通过只覆盖页面、数据、API 三类高价值边界来控制范围。
- 规则停留在文档层面、不够强制 -> 在 scenarios 中要求未来 change 的 design/spec/tasks 显式体现这些边界，并在具体功能中补测试。
- 与 `AGENTS.md` 或 `openspec/config.yaml` 内容重复 -> 保留少量重复是有意的：OpenSpec baseline 作为长期需求真相来源，agent/config 文档作为执行入口。
- Next.js 16 API 可能继续变化 -> 要求未来涉及 Next.js 行为假设的变更继续阅读 `node_modules/next/dist/docs/` 并在 design 中记录假设。

## Migration Plan

1. 创建 `application-architecture-baseline` delta spec。
2. 验证 `add-architecture-baseline-spec` change 能通过严格校验。
3. 后续归档时将 delta spec 合并为 `openspec/specs/application-architecture-baseline/spec.md`。

Rollback 策略：如果该 baseline 被认为过早或过宽，可以在归档前删除此 change；如果已归档，则通过新的 OpenSpec change 修改或移除具体 requirements。

## Open Questions

- 暂无阻塞问题。后续如果需要把部分规则自动化为 lint、架构测试或模板检查，应作为独立 change 处理。
