# 数据库设计基线规格说明

## Purpose

定义本仓库在 Prisma 访问边界、数据库模型设计、数据归属、迁移影响、级联或清理策略，以及数据库失败处理上的基线要求。

## Requirements

### Requirement: 数据访问与模型设计边界
数据库支持的新行为 SHALL 将 Prisma 访问保持在 `src/lib/*` 或 route handlers 中，而不是深层 UI 组件中。新增或修改数据模型时，设计 SHALL 说明数据归属、用户隔离、迁移影响、级联或清理策略，以及数据库失败时的处理方式。

#### Scenario: 开发者新增数据库模型
- **WHEN** 某个变更新增 Prisma model、relation、enum 或 migration
- **THEN** 该变更的设计会说明数据归属、访问边界、迁移与部署影响、关联数据清理策略和失败处理方式

#### Scenario: 开发者实现数据库写入行为
- **WHEN** 某个变更新增创建、更新或删除数据的行为
- **THEN** 该实现会通过服务端数据访问边界执行 Prisma 操作，并在测试或任务中覆盖归属校验与失败语义
