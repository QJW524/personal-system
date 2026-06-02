# project-workbench Specification

## Purpose

Define the authenticated personal project workbench experience, including quick capture, dashboard summary, and project detail tracking.
## Requirements
### Requirement: Workbench login entry page
The system SHALL present `/login` as the product entry page for the personal project workbench while keeping both login and registration actions available on a single screen.

#### Scenario: A logged-out visitor opens the login page
- **WHEN** a visitor navigates to `/login`
- **THEN** 页面会明确说明该系统是个人项目工作台，并在同一页面内提供登录与注册两个入口

#### Scenario: A protected-page redirect reaches the login page
- **WHEN** a visitor is redirected to `/login` with a safe `redirect` query parameter
- **THEN** 用户登录成功后会回到保留的站内目标路径

### Requirement: Workbench dashboard summary
The system SHALL provide an authenticated dashboard home page that summarizes project counts across the statuses `想法中`, `进行中`, `已暂停`, and `已完成`.

#### Scenario: An authenticated user opens the dashboard
- **WHEN** an authenticated user visits `/`
- **THEN** 页面会展示四个状态总览区块，并显示该用户各状态下的项目数量

#### Scenario: An unauthenticated visitor requests the dashboard
- **WHEN** a visitor without a valid session requests `/`
- **THEN** 系统会将该访客重定向到 `/login`

### Requirement: Quick project capture
The system SHALL let an authenticated user create a project from the dashboard using only a project name, a status, and a next action.

#### Scenario: A user submits a valid quick-create form
- **WHEN** an authenticated user submits a non-empty project name, one of the allowed statuses, and a non-empty next action
- **THEN** 系统会创建该项目，并在用户的 dashboard 中展示出来

#### Scenario: A user submits an incomplete quick-create form
- **WHEN** an authenticated user submits a blank required field or an unsupported status
- **THEN** 系统会以 HTTP `400` 拒绝该请求

### Requirement: Project listing and filtering
The system SHALL show only the authenticated user's projects in the dashboard list and SHALL support filtering them by status.

#### Scenario: A user views all projects
- **WHEN** an authenticated user opens the project list without a status filter
- **THEN** dashboard 只展示该用户自己的项目，并按最近更新时间倒序排列

#### Scenario: A user filters by status
- **WHEN** an authenticated user applies one of the allowed status filters
- **THEN** dashboard 只展示该用户在所选状态下的项目

### Requirement: Project detail workspace
The system SHALL provide a project detail page that shows the project's current status, current goal, next action, and update history.

#### Scenario: A user opens one of their own projects
- **WHEN** an authenticated user navigates to a project they own
- **THEN** 详情页会展示该项目的概览信息以及更新历史

#### Scenario: A user opens a missing or unowned project
- **WHEN** an authenticated user requests a project identifier that does not exist or is not owned by them
- **THEN** 系统会返回 HTTP `404` 或框架等价的 not-found 响应

### Requirement: Project update history
The system SHALL let an authenticated user append chronological update entries to a project and SHALL surface recent updates in the dashboard.

#### Scenario: A user adds a project update
- **WHEN** an authenticated user submits a non-empty update entry for one of their projects
- **THEN** 系统会保存该更新，展示在项目历史中，并同步反映到最近更新区块

#### Scenario: A user submits a blank update
- **WHEN** an authenticated user submits an empty project update entry
- **THEN** 系统会以 HTTP `400` 拒绝该请求
