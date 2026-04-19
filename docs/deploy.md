# 部署说明（VPS + Docker + GitHub Actions）

## 1. 本地准备

1. 初始化项目并推送到 `main`。
2. 确认仓库包含 `docker-compose.yml`、`Dockerfile`、`scripts/deploy.sh`。

## 2. VPS 准备

1. 安装 Docker 与 Docker Compose。
2. 创建部署目录（示例：`/opt/personal-system`）。
3. 将仓库克隆到该目录。
4. 在目录创建 `.env`，至少包含：
   - `POSTGRES_DB`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`

## 3. GitHub 连接

仓库 Actions Secrets 需要：

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `APP_DIR`

## 4. 首次部署

1. 手动触发 `verify-connection` 工作流，确认 SSH 正常。
2. 在 VPS 目录执行一次：

```bash
docker compose build --pull
docker compose up -d --remove-orphans
```

3. 访问 `http://<your-domain-or-ip>/api/health` 验证连接。

## 5. 日常部署

- 推送到 `main` 后自动触发 `deploy` workflow。
- workflow 会通过 SSH 调用 `scripts/deploy.sh` 完成拉取与重启。

## 6. 回滚

```bash
git checkout <previous-commit>
docker compose up -d --build
```

然后再次检查 `/api/health`。
