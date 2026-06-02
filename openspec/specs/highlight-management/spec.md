# Highlight 管理规格说明

## Purpose

定义认证后的、按用户隔离的首页 Highlight CRUD 流程，以及与站点 Profile 归属相关的访问边界。

## Requirements

### Requirement: 用户归属的 Profile
系统 SHALL 将 Highlight 关联到认证用户的站点 Profile。当用户尚未拥有 Profile 时，它 SHALL 创建一个默认 Profile。

#### Scenario: 用户首次访问 Highlight
- **WHEN** 一个没有站点 Profile 的认证用户请求或创建 Highlight
- **THEN** 系统会先创建一个绑定到该用户的默认 Profile，再访问 Highlight

### Requirement: Highlight 列表
系统 SHALL 只列出属于认证用户 Profile 的 Highlight，并按创建时间升序排序。

#### Scenario: 认证用户列出 Highlight
- **WHEN** 认证用户调用 `GET /api/highlights`
- **THEN** 系统会返回该用户的 Highlight，并按从旧到新的顺序排列

#### Scenario: 未认证访客列出 Highlight
- **WHEN** 一个没有有效会话的访客调用 `GET /api/highlights`
- **THEN** 系统会返回 HTTP `401`

### Requirement: Highlight 创建
系统 SHALL 允许认证用户使用去除首尾空白后仍非空的标题和摘要来创建 Highlight。

#### Scenario: 认证用户提交有效 Highlight
- **WHEN** 认证用户使用非空标题和摘要调用 `POST /api/highlights`
- **THEN** 系统会在该用户的 Profile 下创建 Highlight，并返回 HTTP `201`

#### Scenario: Highlight 标题或摘要为空
- **WHEN** 认证用户提交空白标题或空白摘要
- **THEN** 系统会返回 HTTP `400`

### Requirement: Highlight 更新
系统 SHALL 允许认证用户更新属于自己 Profile 的 Highlight，并 SHALL 拒绝无效标识、空白内容或不可访问的记录。

#### Scenario: 用户更新自己拥有的 Highlight
- **WHEN** 认证用户针对自己拥有的 Highlight，携带非空内容调用 `PATCH /api/highlights/:id`
- **THEN** 系统会更新并返回该 Highlight

#### Scenario: 用户更新不属于自己的 Highlight
- **WHEN** 认证用户针对不存在或不属于自己的 Highlight 调用 `PATCH /api/highlights/:id`
- **THEN** 系统会返回 HTTP `404`

### Requirement: Highlight 删除
系统 SHALL 允许认证用户删除属于自己 Profile 的 Highlight。

#### Scenario: 用户删除自己拥有的 Highlight
- **WHEN** 认证用户针对自己拥有的 Highlight 调用 `DELETE /api/highlights/:id`
- **THEN** 系统会删除该 Highlight 并返回成功结果

#### Scenario: 用户删除不属于自己的 Highlight
- **WHEN** 认证用户针对不存在或不属于自己的 Highlight 调用 `DELETE /api/highlights/:id`
- **THEN** 系统会返回 HTTP `404`
