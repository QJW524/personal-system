---
name: github-workflow
description: >-
  在本仓库使用 GitHub（Issues、Projects、PR）时的流程与检查清单。
  用于开 Issue、排期、写 PR 描述、关联工作项，或与 GitHub MCP 配合。
---

# GitHub 工作流（Issues / Projects / PR）

## 何时用 Issue

- Bug：含复现步骤、期望 vs 实际、环境（浏览器/Node 等）。
- 功能：含用户故事或验收标准、是否需设计/迁移。
- 技术债：说明风险与「不做」的代价；可标 `tech-debt`。

## 何时用 Project

- 需要按迭代或状态看整体进度时，把 Issue（及 PR）加入 Project 列。
- 列名与团队约定一致；卡片移动表示状态变更，与 Issue 的 `Open/Closed` 一致。

## PR 检查清单

- 标题清晰；正文说明动机与方案要点。
- 关联 Issue：`Fixes #n` 或 `Refs #n`（仅关联不关 Issue 时用 `Refs`）。
- 自测步骤；若有迁移或环境变量变更，写在正文或 `README`/`AGENTS` 约定处。
- 合并前：`npm run lint` 与 `npm run build` 通过（与本仓库规则一致）。

## GitHub MCP

- 个人在 Cursor 中配置 MCP（示例见仓库 `.cursor/mcp.json.example`）；勿把 PAT 提交进 Git。
- 有 MCP 时：读取/更新 Issue、PR 以远端为准；无 MCP 时仅根据用户粘贴的链接与编号操作。
