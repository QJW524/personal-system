# API Route 契约基线规格说明

## Purpose

定义本仓库在 API route JSON 响应 shape、HTTP status、错误语义、认证授权结果与客户端消费稳定性上的基线要求。

## Requirements

### Requirement: API route 契约
新增或修改的 API route SHALL 返回稳定的 JSON shape 与明确的 HTTP status。接口契约 SHALL 覆盖成功、认证失败、校验失败、资源不存在、资源不属于当前用户和服务器失败等可预期结果，并 SHALL 为客户端消费保持字段语义稳定。

#### Scenario: 客户端提交无效请求
- **WHEN** 客户端向新增或修改的 API route 提交无效 payload
- **THEN** 该接口会返回明确的 4xx HTTP status，并带有稳定的错误 JSON shape

#### Scenario: 客户端访问不存在或不属于自己的资源
- **WHEN** 客户端请求不存在或不属于当前用户的资源
- **THEN** 该接口会返回设计中声明的 HTTP status 与稳定 JSON shape，且不会泄露其他用户的数据

#### Scenario: 客户端请求成功
- **WHEN** 客户端请求通过认证、授权与校验
- **THEN** 该接口会返回设计中声明的成功 HTTP status 与稳定数据 JSON shape
