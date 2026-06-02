# 健康检查规格说明

## Purpose

定义一个带数据库感知能力的应用健康检查端点，用于在返回应用状态前确认 PostgreSQL 连接是否可用。

## Requirements

### Requirement: 数据库健康探针
系统 SHALL 暴露 `GET /api/health`，并 SHALL 在报告应用健康状态之前探测 PostgreSQL。

#### Scenario: PostgreSQL 响应探针请求
- **WHEN** PostgreSQL 成功执行健康检查查询
- **THEN** 该端点会返回 HTTP `200`，并带上 `status: "ok"`、`database: "connected"` 和 ISO 时间戳

#### Scenario: PostgreSQL 未响应探针请求
- **WHEN** PostgreSQL 健康检查查询抛出错误
- **THEN** 该端点会返回 HTTP `503`，并带上 `status: "error"`、`database: "disconnected"` 和 ISO 时间戳
