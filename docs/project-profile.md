# 项目介绍素材

本文件用于沉淀当前项目的简历 / 面试介绍版本。后续如果项目能力继续迭代，优先在这里更新，再按不同投递场景压缩成更短版本。

## 项目名称

`Personal System｜个人内容管理与认证平台`

## 项目背景

为沉淀可复用的全栈工程能力，独立搭建个人系统项目，围绕账号认证、内容管理、测试验证与自动化部署构建完整工程闭环；同时引入 OpenSpec 落地 SDD（规格驱动开发）流程，使项目具备可持续迭代、可验证、可交付的工程化能力。

## 技术架构

`Next.js 16 + React 19 + TypeScript + Prisma + PostgreSQL + Redis + Vitest + Playwright + Docker Compose + GitHub Actions + OpenSpec`

## 核心攻坚与成果

### 1. 认证链路与会话管理

基于 `Redis Session + HttpOnly Cookie` 实现注册、登录、登出、会话校验与受保护路由跳转，支持用户名 / 邮箱登录、登录失败锁定、限流控制及 Cookie Secure 策略适配。  
针对生产环境登录成功但会话丢失的问题，结合 `x-forwarded-proto` 与请求协议动态处理 Cookie 安全属性，提升认证链路稳定性与线上可用性。

### 2. 数据建模与业务闭环

基于 `Prisma + PostgreSQL` 完成 `User / SiteProfile / Highlight` 数据模型设计与落地，支持用户级数据隔离、默认 Profile 自动创建及 Highlight CRUD 全流程。  
接口层统一返回稳定 JSON 结构与明确 HTTP 状态码，兼顾前端消费体验与后续业务扩展能力。

### 3. 测试体系与质量保障

搭建 `Vitest + Playwright` 测试体系，覆盖参数校验、会话逻辑、认证接口、健康检查及注册登录、首页访问、Highlight 增删改删、登出等关键浏览器链路。  
针对共享开发库场景设计 `e2e_*` 临时用户隔离与清理保护机制，避免 E2E 测试误删真实开发数据，增强测试可控性与安全性。

### 4. 自动化部署与工程化流程

建立 `Docker Compose + GitHub Actions + VPS` 自动化交付链路，实现代码推送后的远程部署、镜像构建、数据库 / Redis 启动、Prisma 迁移、Web 服务更新与健康检查验证。  
引入 OpenSpec 管理 `proposal`、`spec`、`design`、`tasks` 与严格校验流程，形成“需求设计 - 功能实现 - 测试验证 - 部署归档”的完整研发闭环，提升项目迭代规范性与可追溯性。
