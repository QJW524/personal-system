# 页面架构基线规格说明

## Purpose

定义本仓库在 Next.js 页面编写、Server Component / Client Component 边界、数据库驱动页面渲染策略与 fallback UI 上的基线要求。

## Requirements

### Requirement: 页面组件边界
仓库中的新页面或重大页面改动 SHALL 优先使用 Next.js Server Components，并 SHALL 仅在需要浏览器状态、事件处理或浏览器专用 API 时引入 Client Components。数据库驱动页面 SHALL 在设计中声明渲染策略，并 SHALL 提供数据库或会话不可用时的 graceful fallback UI。

#### Scenario: 开发者设计新的数据库驱动页面
- **WHEN** 某个变更新增或重构需要读取数据库的页面
- **THEN** 该变更的设计会说明 Server Component 与 Client Component 的边界、页面渲染策略、数据加载位置和 fallback UI

#### Scenario: 页面需要浏览器交互状态
- **WHEN** 某个页面区域需要事件处理、表单交互、乐观状态或浏览器专用 API
- **THEN** 该交互会被隔离到 Client Component 中，并保持数据库访问位于服务端边界
