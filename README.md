# Personal System

基于 `Next.js + Prisma + Postgres + Docker + GitHub Actions` 的个人网站工程基线。

## 本地开发

1. 安装依赖：

```bash
npm install
```

2. 启动数据库与 Redis：

```bash
docker compose up -d db redis
```

3. 初始化数据库：

```bash
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
```

4. 启动开发服务：

```bash
npm run dev
```

访问 `http://localhost:3000`。

## 登录模块（Redis 会话）

- 注册：`POST /api/auth/register`
- 登录：`POST /api/auth/login`
- 登出：`POST /api/auth/logout`
- 当前会话：`GET /api/auth/me`

请求参数：

- 注册：`{ username, email, password }`
- 登录：`{ identifier, password }`，`identifier` 支持用户名或邮箱

需要新增环境变量：

- `REDIS_URL`：Redis 连接串
- `SESSION_COOKIE_NAME`：会话 Cookie 名称
- `SESSION_TTL_SECONDS`：会话有效秒数（默认 7 天）

## 关键脚本

- `npm run db:generate`：生成 Prisma Client
- `npm run db:migrate`：本地开发迁移
- `npm run db:deploy`：生产环境迁移
- `npm run db:seed`：写入初始化数据

## 健康检查

- 路径：`/api/health`
- 数据库连通时返回 `200`，异常时返回 `503`。

## 自动化部署

- 连接检查：`.github/workflows/verify-connection.yml`
- 自动部署：`.github/workflows/deploy.yml`
- VPS 端部署脚本：`scripts/deploy.sh`

详见 `docs/deploy.md`。

## Cursor 规范

- 项目规则：`.cursor/rules/*`
- 项目技能：`.cursor/skills/*`
