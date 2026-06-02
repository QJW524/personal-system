# VPS 部署规格说明

## Purpose

定义面向 VPS 的 GitHub Actions 与 Docker Compose 部署基线，覆盖自动触发、手动触发和远程发布顺序。

## Requirements

### Requirement: 部署触发方式
系统 SHALL 提供一个 GitHub Actions 部署工作流，可在向 `main` 推送代码时触发，也可通过手动 dispatch 触发。

#### Scenario: 代码被推送到 main
- **WHEN** 某个提交被推送到 `main` 分支
- **THEN** GitHub Actions 会通过 SSH 调用远程部署脚本

#### Scenario: 请求手动部署
- **WHEN** 操作员手动 dispatch 部署工作流
- **THEN** GitHub Actions 会通过 SSH 调用同一份远程部署脚本

### Requirement: 有序的 Docker Compose 发布流程
远程部署脚本 SHALL 更新 `main` 检出、构建镜像、启动 PostgreSQL 和 Redis、运行 Prisma 生产迁移，然后再更新 Web 服务。

#### Scenario: 某次部署成功运行
- **WHEN** 部署脚本在有效的 `APP_DIR` 下运行
- **THEN** 它会拉取 `origin/main`、构建镜像、启动 `db` 和 `redis`、运行 `migrate` 服务、启动 `web`，并输出服务状态

#### Scenario: 生产迁移失败
- **WHEN** Prisma 生产迁移以失败状态退出
- **THEN** 部署脚本会在更新 Web 服务之前退出

### Requirement: SSH 连接校验
系统 SHALL 提供一个可手动 dispatch 的 GitHub Actions 工作流，用于检查 VPS 的 SSH 访问与 Docker 可用性。

#### Scenario: 操作员运行连接检查
- **WHEN** 操作员手动 dispatch 连接校验工作流
- **THEN** GitHub Actions 会连接到 VPS，并报告基础主机信息与 Docker 信息
