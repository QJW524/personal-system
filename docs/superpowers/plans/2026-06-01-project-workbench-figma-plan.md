# Project Workbench Figma Plan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 Personal System 产出一版可执行的 Figma 设计基线，覆盖登录页与项目工作台首页，并与 `add-project-workbench` OpenSpec 方向保持一致。

**Architecture:** 先基于现有代码和 OpenSpec 规格收敛页面信息架构，再在新的 Figma 设计文件中创建两个主页面：登录入口页与工作台首页。设计先聚焦结构、层级与日常使用节奏，不在第一轮扩展到完整设计系统和项目详情页。

**Tech Stack:** Figma MCP (`create_new_file`, `use_figma`, `get_screenshot`, `get_metadata`), OpenSpec, Next.js source files

---

### Task 1: Audit Product and UI Inputs

**Files:**
- Modify: `D:\project\personal-system\openspec\changes\add-project-workbench\proposal.md`
- Modify: `D:\project\personal-system\openspec\changes\add-project-workbench\design.md`
- Modify: `D:\project\personal-system\openspec\changes\add-project-workbench\specs\project-workbench\spec.md`
- Modify: `D:\project\personal-system\src\app\login\page.tsx`
- Modify: `D:\project\personal-system\src\app\page.tsx`
- Modify: `D:\project\personal-system\src\app\login\page.module.css`
- Modify: `D:\project\personal-system\src\app\page.module.css`

- [ ] **Step 1: Reconfirm the workbench narrative**

Review the approved direction:
- 登录页 = 产品入口页
- 首页 = 状态总览 + 项目卡片 + 最近更新
- V1 项目创建字段 = `项目名 + 状态 + 下一步动作`

- [ ] **Step 2: Extract page sections before drawing**

Create a section checklist:
- 登录页：品牌区、价值说明、登录/注册表单
- 工作台首页：顶部栏、状态总览、项目列表、最近更新

- [ ] **Step 3: Freeze first-round scope**

Keep Figma V1 limited to:
- 登录页桌面版
- 登录页移动版
- 工作台首页桌面版
- 工作台首页移动版

### Task 2: Create and Structure the Figma File

**Files:**
- Create: `Figma draft file: Personal System - Project Workbench V1`
- Test: `Figma screenshots for top-level frames`

- [ ] **Step 1: Create a new Figma design file**

Use the single available Figma plan and create:
- File name: `Personal System - Project Workbench V1`
- Editor type: `design`

- [ ] **Step 2: Create page structure**

Inside the file, create these top-level pages:
- `Cover`
- `Login`
- `Workbench`
- `Notes`

- [ ] **Step 3: Add cover context**

Place a lightweight cover frame that records:
- 产品名称
- 设计目标
- V1 范围
- 页面清单
- 如果 Figma plan 对 page 数有限制，则将说明性内容合并进 `Cover` 页，不额外创建 `Notes`

### Task 3: Design the Login Entry Page

**Files:**
- Modify: `Figma page: Login`
- Test: `Figma screenshot of desktop and mobile login frames`

- [ ] **Step 1: Build the desktop login frame**

Include:
- 左侧产品价值说明
- 右侧认证卡片
- 登录 / 注册切换
- 真实中文文案，不用口号式描述

- [ ] **Step 2: Build the mobile login frame**

Adapt the same hierarchy to a single-column mobile frame:
- 先品牌与定位
- 再表单
- 保证主要 CTA 清晰可见

- [ ] **Step 3: Validate the login page**

Check:
- 信息层级清楚
- 左侧不空泛
- 右侧表单简洁
- 移动端没有拥挤感

### Task 4: Design the Workbench Home Page

**Files:**
- Modify: `Figma page: Workbench`
- Test: `Figma screenshot of desktop and mobile workbench frames`

- [ ] **Step 1: Build the desktop workbench frame**

Include:
- 顶部用户栏
- 四状态总览卡
- 项目卡片列表
- 最近更新区

- [ ] **Step 2: Build the mobile workbench frame**

Adjust the layout for mobile:
- 状态卡可双列或单列
- 项目卡片保持可扫读
- 最近更新放在列表下方

- [ ] **Step 3: Validate the workbench page**

Check:
- 第一眼能看清状态总览
- 项目卡片能快速判断“是什么、现在在哪、下一步做什么”
- 整体更像日常工具而不是展示页

### Task 5: Capture Handoff Notes

**Files:**
- Modify: `D:\project\personal-system\docs\superpowers\plans\2026-06-01-project-workbench-figma-plan.md`
- Test: `OpenSpec and Figma alignment review`

- [ ] **Step 1: Record the final frame names and Figma file URL**

After frames are created, append:
- file key
- file URL
- frame names used for login/workbench desktop/mobile

- [ ] **Step 2: Record implementation handoff notes**

Summarize what engineering should preserve:
- 登录页文案结构
- 首页区块顺序
- 状态卡与项目卡片的字段优先级

- [ ] **Step 3: Decide next implementation slice**

Recommend the first coding slice:
- 项目模型与状态总览 API
- 或首页工作台 UI 骨架

---

## Progress Snapshot

- 已创建 Figma 设计文件：`Personal System - Project Workbench V1`
- Figma file key：`0qnQuKHE6TVzqUUNq5oVPn`
- Figma file URL：<https://www.figma.com/design/0qnQuKHE6TVzqUUNq5oVPn>
- 当前已创建页面：`Cover`、`Login`、`Workbench`
- `Cover` 页已写入项目目标、V1 范围与页面清单
- 由于当前 Figma Starter plan 仅支持 3 个 page，说明性内容已并入 `Cover`，不再单独创建 `Notes`

## Current Blocker

- 2026-06-01 在继续写入 `Login` 与 `Workbench` 页面时，Figma MCP 返回 Starter plan 工具调用限额错误
- 错误信息：`You've reached the Figma MCP tool call limit on the Starter plan`
- 结论：当前阻塞不是脚本逻辑错误，而是账号 MCP 调用额度已用尽
- 后续恢复方式：
  - 等待 Figma Starter 配额恢复后继续
  - 或升级对应团队计划

## Login Blueprint

### Desktop

- 画板名：`Login / Desktop`
- 画板尺寸：`1440 x 1024`
- 视觉方向：浅暖灰背景、白底认证卡、低饱和描边、克制层级
- 页面结构：
  - 左侧 `Brand Panel`
  - 右侧 `Auth Card`

#### Brand Panel

- Badge：`Personal System`
- 英文标题：`Project Workbench`
- 中文主标题：`把项目想法、推进状态和下一步动作收进一个地方。`
- 中文说明：`登录后先看状态总览，再回到每个项目的下一步动作。第一版不追求复杂知识库，而是让你每天都愿意打开。`
- 三个价值卡片：
  - `Capture Ideas`：先记下项目名、当前状态和下一步动作，不让想法散掉。
  - `Track Momentum`：首页直接看见想法中、进行中、已暂停、已完成四类分布。
  - `Stay Grounded`：更新记录和参考资料留到详情页，不把第一屏做成复杂后台。
- 底部深色说明卡：
  - 小标题：`Daily Rhythm`
  - 文案：`今天推进什么、暂停什么、下一步做什么，应该在 10 秒内就能回到上下文。`

#### Auth Card

- 英文标题：`Login`
- 中文主标题：`欢迎回来`
- 辅助说明：`输入账号信息，回到你的项目工作台。`
- Tab：
  - `Login` 激活态
  - `Register` 非激活态
- 状态横幅：`支持用户名或邮箱登录，成功后直接进入首页。`
- 输入项：
  - `用户名或邮箱`
  - `密码`
- 主按钮：`登录并进入首页`
- 注册提示区：
  - 英文标题：`Register`
  - 文案：`如果还没有账号，注册后可直接切换登录，继续把项目想法收进工作台。`
  - 次按钮：`创建账号`

### Mobile

- 画板名：`Login / Mobile`
- 画板尺寸：`390 x 844`
- 结构顺序：
  - Badge
  - 英文标题 `Project Workbench`
  - 中文标题 `先看状态，再继续项目。`
  - 中文说明 `登录后进入个人项目工作台，把想法、状态和下一步动作放回一个稳定入口。`
  - 单张价值卡 `Quick Start`
  - 单列认证卡
- 认证卡保留：
  - `Login / Register` tabs
  - 两个输入项
  - 主按钮 `登录并进入首页`
  - 底部说明 `还没有账号？注册后可直接回到登录流程。`

## Workbench Blueprint

### Desktop

- 画板名：`Workbench / Desktop`
- 画板尺寸：`1440 x 1280`
- 页面结构顺序：
  - 顶部用户栏 `Top Bar`
  - 首页概览说明 `Overview`
  - 四状态卡 `Status Grid`
  - 左侧项目列表 `Projects`
  - 右侧最近更新 `Recent Updates`

#### Top Bar

- 左侧：
  - 英文标题：`Project Workbench`
  - 中文说明：`今天先看状态，再决定把时间放到哪个项目。`
- 右侧：
  - 用户识别 `Qiu`
  - 操作入口 `Logout`

#### Overview

- 英文标题：`Overview`
- 中文标题：`先看全局，再进入具体项目。`
- 中文说明：`第一屏只回答四件事：现在有多少项目、哪些正在推进、哪些暂停了、哪些已经完成。`

#### Status Grid

- 四张状态卡，字段结构统一：
  - 状态名
  - 数量
  - 一句解释
- 状态内容：
  - `想法中`：`06`，先留住方向，先不要急着做完整方案。
  - `进行中`：`03`，这周真正投入时间推进的项目。
  - `已暂停`：`02`，暂时搁置，但仍保留下一步上下文。
  - `已完成`：`04`，已经做完并可沉淀经验的方法或产物。

#### Projects

- 英文标题：`Projects`
- 每张项目卡字段：
  - 项目名
  - 当前状态
  - `Next Step`
  - 最近更新时间
- 示例项目：
  - `Personal System 重构`
  - `AI 文档助手想法`
  - `部署链路整理`

#### Recent Updates

- 英文标题：`Recent Updates`
- 每条更新字段：
  - 项目名
  - 更新说明
  - 时间
- 作用：帮助快速回到最近上下文，而不是承担完整日志详情

### Mobile

- 画板名：`Workbench / Mobile`
- 画板尺寸：`390 x 1180`
- 页面结构顺序：
  - `Overview` 头部卡
  - 状态卡列表
  - `Projects`
  - `Recent Updates`
- 移动端约束：
  - 状态卡优先扫读，不必一次展示全部项目
  - 项目卡继续保留 `Next Step`
  - 最近更新至少保留 1 条示例，证明信息架构成立

## Engineering Handoff

- 登录页不是通用认证页，而是产品入口页
- 登录页左侧价值说明需要围绕“项目想法沉淀”而不是“个人站管理”
- 工作台首页第一视觉优先级必须是状态总览，而不是项目详情或介绍文案
- 项目卡片第一版只强制围绕 4 个字段：
  - 项目名
  - 状态
  - 下一步动作
  - 更新时间
- `Recent Updates` 只承担回到上下文的作用，不要在 V1 做成复杂时间线
- 视觉验收继续遵守 [design-principles.md](/D:/project/personal-system/docs/design-principles.md)

## Next Resume Point

- 配额恢复后，优先继续写入 `Login` 页桌面端与移动端画板
- 然后写入 `Workbench` 页桌面端与移动端画板
- 画完后补充：
  - frame 名称
  - 节点 ID
  - Figma 截图
  - 最终实现切片建议
