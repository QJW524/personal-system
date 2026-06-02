## Why

当前已登录后的体验仍然以首页 highlights 和通用认证入口为中心，这套基线适合作为工程起点，但还不足以支撑一个你愿意日常打开使用的个人产品。需要将系统升级为一个以项目状态为核心的工作台，让它真正承担“记录想法、推进项目、持续更新”的日常使用场景。

## What Changes

- 新增一个已登录后的项目工作台体验，核心围绕项目卡片、项目状态与下一步动作展开。
- 将当前认证后的首页重构为 Dashboard，包含状态总览、项目列表与最近更新。
- 新增项目详情工作区，用于承载单个项目的当前目标、下一步动作与更新记录。
- 在不改动底层认证流程的前提下，将登录页重构为项目工作台的产品入口页。
- 在正式编码前，先通过 Figma 完成登录页与工作台首页的页面重构设计。

## Capabilities

### New Capabilities

- `project-workbench`: 定义认证后的项目工作台、项目快速创建流程、项目详情工作区，以及面向工作台的登录入口体验。

### Modified Capabilities

- None. Existing baseline specs remain valid until implementation explicitly retires or migrates the highlight workflow.

## Impact

本次变更预计会影响首页 UI、登录页 UI、认证后的项目数据模型以及对应的项目 API。落地时大概率需要新增 Prisma schema 与数据库迁移，但不需要新增环境变量，也不涉及部署流程调整。
