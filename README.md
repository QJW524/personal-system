# Personal System

基于 `Next.js + Prisma + Postgres + Docker + GitHub Actions` 的个人网站工程基线。

## 本地开发

Windows 上推荐使用完整 Docker 开发环境（支持源码热更新）。安装、首次初始化、日常命令和故障排查见 [`docs/local-docker-development.md`](docs/local-docker-development.md)。

快速启动：

```powershell
Copy-Item .env.example .env
npm run docker:db:deploy
npm run docker:db:seed
npm run docker:dev
```

以下步骤保留给“仅数据库与 Redis 使用 Docker、Next.js 在宿主机运行”的混合开发方式。

1. 安装依赖：

```bash
npm install
```

2. 启动数据库与 Redis（需把 Redis 映射到本机供 `npm run dev`，见 `docker-compose.dev.yml`）：

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db redis
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
- `npm run verify`：执行 OpenSpec 严格校验、Vitest、lint 和 production build

## 健康检查

- 路径：`/api/health`
- 数据库连通时返回 `200`，异常时返回 `503`。

## 自动化部署

- 连接检查：`.github/workflows/verify-connection.yml`
- 自动部署：`.github/workflows/deploy.yml`
- VPS 端部署脚本：`scripts/deploy.sh`
- 生产变量：由 GitHub `product/PRODUCTION_ENV` 多行 Secret 在部署前自动同步，VPS 无需手工编辑 `.env`

详见 `docs/deploy.md`。

## OpenSpec SDD

本仓库使用 [OpenSpec](https://github.com/Fission-AI/OpenSpec) 管理规格驱动开发：

- 当前系统规格：`openspec/specs/*/spec.md`
- 进行中的变更：`openspec/changes/<change-name>/`
- 已归档的变更：`openspec/changes/archive/`
- 项目级约束：`AGENTS.md` 与 `openspec/config.yaml`

常用流程：

```bash
openspec new change <change-name>
openspec status --change <change-name>
openspec validate --all --strict
openspec archive <change-name>
```

在 Codex 中可直接使用 `/opsx:explore`、`/opsx:propose`、`/opsx:apply` 与 `/opsx:archive`。

代码变更的默认收尾流程：

1. 实现完成后先运行 `npm run verify`。
2. 由独立 Codex reviewer 或不继承实现推理历史的独立上下文审查需求、OpenSpec artifacts、目标 diff 和验证证据。
3. 修复所有已确认的 `Critical` 与 `Important` findings；有争议的高优先级问题需提供技术证据并交由独立 reviewer 复审。
4. Review 和问题处理完成后重新运行 `npm run verify`，将这次结果作为最终验证证据。
5. 在 PR 或交接记录中填写 reviewer、findings 处置和最终验证结果。

`Minor` findings 可以修复、记录后续事项或说明不处理理由。当前是个人项目，完成独立 Codex review 和 review 后验证即可，不要求另一个 GitHub 用户提供 PR approval。

## 浏览器 E2E

本地 Playwright E2E 使用说明见 `docs/testing-playwright.md`。

## 项目介绍素材

简历 / 面试使用的项目介绍沉淀在 `docs/project-profile.md`，后续能力迭代时优先更新该文档。
