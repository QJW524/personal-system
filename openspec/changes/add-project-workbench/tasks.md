## 1. Product framing and design

- [x] 1.1 将已确认的项目工作台方向沉淀为最终 OpenSpec proposal、spec、design 与 tasks。
- [x] 1.2 基于已确认的信息架构，产出登录页和认证后 dashboard 的最终界面方案（Figma 或直接代码落稿均可）。
- [x] 1.3 评审最终界面方案，并在编码前确认 V1 的最终实现范围。

## 2. Data model and API foundation

- [x] 2.1 为项目与项目更新历史新增 Prisma 模型与迁移，并明确认证后的归属边界。
- [x] 2.2 为状态总览、项目列表、项目详情与更新历史补充聚焦的服务端数据访问逻辑。
- [x] 2.3 为项目快速创建、项目详情读取、状态筛选与项目更新创建补充认证 API 路由。
- [x] 2.4 为参数校验、归属校验与 not-found 行为补充聚焦测试。

## 3. Workbench UI implementation

- [x] 3.1 用项目工作台 dashboard 替换当前认证后首页，包含状态总览卡、项目列表与最近更新。
- [x] 3.2 增加项目详情页，承载概览字段、下一步动作与按时间排序的更新记录。
- [x] 3.3 在保留当前认证行为的前提下，重构登录页文案与布局，使其更符合项目工作台定位。
- [x] 3.4 为 dashboard 与项目详情流程补充空状态、加载态与错误兜底状态。

## 4. Validation

- [x] 4.1 Run `openspec validate --all --strict`.
- [x] 4.2 Run `npm run test:run`, `npm run lint`, and `npm run build`.
