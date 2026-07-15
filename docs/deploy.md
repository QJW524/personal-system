# 部署说明（VPS + Docker + GitHub Actions）

## 1. 本地准备

1. 初始化项目并推送到 `main`。
2. 确认仓库包含 `docker-compose.yml`、`Dockerfile`、`scripts/deploy.sh`。

## 2. VPS 准备

1. 安装 Docker 与 Docker Compose。
2. 创建部署目录（示例：`/opt/personal-system`）。
3. 将仓库克隆到该目录。
4. 确保部署用户对该目录有读写权限，并可执行 Docker。生产 `.env` 会由 GitHub Actions 自动同步，无需手工创建。

## 3. GitHub 连接

仓库 Actions Secrets 需要：

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `APP_DIR`
- `PRODUCTION_ENV`：完整的多行 dotenv 内容，至少包含且各出现一次：
  - `POSTGRES_DB`
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`

示例内容（不要把真实值提交到 Git）：

```dotenv
POSTGRES_DB=personal_system
POSTGRES_USER=personal_system
POSTGRES_PASSWORD=<strong-random-password>
```

在受信任设备维护一份已被 `.gitignore` 忽略的 `.env.production`，然后更新 GitHub Secret：

```powershell
Get-Content -Raw .env.production |
  gh secret set PRODUCTION_ENV --env product --repo QJW524/personal-system
```

GitHub 不提供 Secret 明文回读能力，因此更新时必须提交完整 dotenv 内容。

## 4. 首次部署

1. 在 `product` environment 配置全部五个 Secrets。
2. 手动触发 `verify-connection` 工作流，确认 SSH 正常。
3. 手动触发 `deploy` workflow。它会先同步并校验 `.env`，再执行服务器部署脚本。
4. 访问 `http://<your-domain-or-ip>/api/health` 验证连接。

## 5. 日常部署

- 推送到 `main` 后自动触发 `deploy` workflow。
- workflow 会先校验 `PRODUCTION_ENV`，上传远程临时文件，通过 `docker compose config -q` 后原子替换 `.env`。
- 当前 `.env` 会在替换前备份为 `.env.previous`，两个文件权限都保持为 `600`。
- 环境同步成功后，workflow 通过 SSH 调用 `scripts/deploy.sh` 完成拉取、迁移与重启。
- 只更新 GitHub Secret 不会自动触发 workflow；需要手动 dispatch 或同时推送代码。
- 新增应用变量时，同步更新 `.env.example`、`docker-compose.yml` 的容器注入声明以及完整的 `PRODUCTION_ENV`。

## 6. 回滚

```bash
git checkout <previous-commit>
docker compose up -d --build
```

然后再次检查 `/api/health`。

如果只需回滚生产环境配置：

```bash
cd /opt/personal-system
cp -p .env.previous .env
APP_DIR=/opt/personal-system sh scripts/deploy.sh
```

## 7. 环境同步失败排查

- `PRODUCTION_ENV is empty or unavailable`
  - Secret 未创建、名称不匹配，或 workflow 未绑定 `product` environment。
- `contains an invalid dotenv line`
  - 存在不符合 `KEY=value` 的非空行；注释必须以 `#` 开头。
- `must contain exactly one non-empty ... entry`
  - PostgreSQL 必需变量缺失、重复或值为空。
- 远端 `docker compose ... config -q` 失败
  - dotenv 可以解析，但与 Compose 插值不兼容。当前生产 `.env` 不会被覆盖。
