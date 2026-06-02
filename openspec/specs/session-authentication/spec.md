# 会话认证规格说明

## Purpose

定义账户注册、由 Redis 支撑的登录会话、登出流程，以及对受保护页面和 API 的访问控制检查。

## Requirements

### Requirement: 账户注册
系统 SHALL 在注册账户时接受用户名、邮箱和密码。它 SHALL 校验输入、规范化邮箱、拒绝已被占用的用户名或邮箱、哈希密码，并在返回已创建账户时不暴露密码哈希。

#### Scenario: 访客提交有效且未被占用的账户信息
- **WHEN** 访客向 `POST /api/auth/register` 提交有效的用户名、邮箱和密码
- **THEN** 系统会创建该用户，并返回 HTTP `201` 以及账户标识、用户名、邮箱和创建时间戳

#### Scenario: 注册输入无效
- **WHEN** 访客提交违反用户名、邮箱或密码规则的注册信息
- **THEN** 系统会返回 HTTP `400`，并带上错误码 `VALIDATION_ERROR`

#### Scenario: 用户名或邮箱已被占用
- **WHEN** 访客提交一个已经属于其他用户的用户名或邮箱
- **THEN** 系统会返回 HTTP `409`，并带上错误码 `USER_ALREADY_EXISTS`

### Requirement: 账户登录
系统 SHALL 通过“用户名或邮箱 + 密码”的方式认证用户。它 SHALL 拒绝已禁用账户、临时锁定账户以及超出限制的登录尝试。

#### Scenario: 用户提交有效凭据
- **WHEN** 活跃用户向 `POST /api/auth/login` 提交有效的用户名或邮箱以及密码
- **THEN** 系统会创建或轮换 Redis 会话、重置失败状态，并返回认证后的用户 payload

#### Scenario: 登录尝试超过速率限制
- **WHEN** 某个 IP 地址或规范化标识的登录尝试超过 Redis 支撑的限制
- **THEN** 系统会返回 HTTP `429`，并带上错误码 `TOO_MANY_REQUESTS`

#### Scenario: 连续密码失败会锁定账户
- **WHEN** 某个用户连续十次密码校验失败
- **THEN** 系统会将该账户临时锁定十五分钟

### Requirement: 会话 Cookie
系统 SHALL 将会话标识符存放在一个 HTTP-only、same-site `lax` 的 Cookie 中。它 SHALL 根据 `SESSION_COOKIE_SECURE`、转发协议或请求 URL 协议来确定该 Cookie 的 `Secure` 标记。

#### Scenario: 通过 HTTPS 登录成功
- **WHEN** 某次登录请求被识别为 HTTPS
- **THEN** 返回的会话 Cookie 会被标记为 `Secure`

#### Scenario: 通过 HTTP 登录成功
- **WHEN** 某次登录请求被识别为 HTTP，且 `SESSION_COOKIE_SECURE` 没有强制启用安全 Cookie
- **THEN** 返回的会话 Cookie 不会被标记为 `Secure`

### Requirement: 会话检查与登出
系统 SHALL 暴露当前由 Redis 支撑的会话，并 SHALL 在登出时删除该会话。

#### Scenario: 请求携带有效的会话 Cookie
- **WHEN** 客户端携带一个存在于 Redis 中的会话 Cookie 调用 `GET /api/auth/me`
- **THEN** 系统会返回认证后的用户 payload

#### Scenario: 用户登出
- **WHEN** 客户端调用 `POST /api/auth/logout`
- **THEN** 系统会在 Redis 会话存在时将其删除，并让会话 Cookie 过期

### Requirement: 受保护路由重定向
系统 SHALL 将不带会话 Cookie 的请求从受保护页面重定向离开，并同时允许认证端点和健康检查端点继续访问。

#### Scenario: 访客在没有会话 Cookie 时请求受保护页面
- **WHEN** 一个没有配置会话 Cookie 的请求访问受保护页面
- **THEN** 系统会将其重定向到 `/login`，并在 `redirect` 查询参数中保留原始路径
