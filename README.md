# Personal System

基于 `Next.js + Prisma + Postgres + Docker + GitHub Actions` 的个人网站工程基线。

## 本地开发

1. 安装依赖：

```bash
npm install
```

2. 启动数据库（自动创建 `POSTGRES_DB` 对应库）：

```bash
docker compose up -d db
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
