## Why

`openspec/specs/` 是仓库当前系统行为的基线真相来源，但现有内容以英文为主，阅读和维护时的理解成本偏高。仓库里已经出现中英混排的 spec，说明中文化需求真实存在；现在统一整理成简体中文，可以降低维护门槛，同时避免后续风格继续漂移。

## What Changes

- 将 `openspec/specs/` 下现有基线 spec 的 Purpose、Requirement、Scenario 名称与说明文字统一整理为简体中文。
- 保留 OpenSpec 校验依赖的结构关键字与目录约定，包括 `### Requirement:`、`#### Scenario:`、`SHALL`、`WHEN`、`THEN` 等规范锚点。
- 新增一个仓库级 capability，约束后续基线 spec 继续以简体中文维护，并明确“可读文本可翻译、结构关键字需保留”的边界。
- 本次变更不新增、删除或调整任何产品运行时行为，不涉及 API、数据库、环境变量或部署逻辑变更。

## Capabilities

### New Capabilities

- `baseline-spec-localization`: 定义 `openspec/specs/` 基线规格的简体中文维护要求，以及与 OpenSpec 校验兼容的结构保留规则。

### Modified Capabilities

- None. Existing product capabilities remain semantically unchanged; this change normalizes baseline spec presentation only.

## Impact

本次变更只影响 OpenSpec 文档层：

- `openspec/specs/*/spec.md` 的人类可读文本会被统一整理为简体中文。
- `openspec/changes/translate-baseline-specs-zh-cn/` 会新增 proposal、design、spec 与 tasks artifact。
- 不涉及代码逻辑、数据库迁移、环境变量调整或部署流程改动。
