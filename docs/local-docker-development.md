# Windows 本机 Docker 开发

本项目的开发环境可完整运行在 Docker 中：Next.js、PostgreSQL 和 Redis 都由 Compose 管理，源码从 Windows 挂载到容器，Next.js 在容器内热更新。

## 1. 安装 Docker Desktop

推荐使用 Docker Desktop 的 WSL 2 后端。系统需要开启硬件虚拟化，并安装 WSL 2。

以管理员身份打开 PowerShell：

```powershell
wsl --install --no-distribution
```

按提示重启 Windows，然后从 [Docker 官方页面](https://docs.docker.com/desktop/setup/install/windows-install/) 安装 Docker Desktop。安装时保留“Use WSL 2 instead of Hyper-V”选项。启动 Docker Desktop，等待状态显示 Engine running，再验证：

```powershell
wsl --status
docker version
docker compose version
```

## 2. 首次启动

在项目目录执行：

```powershell
Copy-Item .env.example .env
npm run docker:db:deploy
npm run docker:db:seed
npm run docker:dev
```

访问 <http://localhost:3000>。首次拉取镜像和构建依赖会较慢，之后会使用缓存。

`docker:db:seed` 只应在需要初始化或重置开发数据时执行。已有数据时可跳过。

## 3. 日常使用

```powershell
# 前台启动并查看日志
npm run docker:dev

# 后台启动
npm run docker:dev:detached

# 停止并移除容器（保留数据库数据）
npm run docker:dev:down
```

修改 `src/` 等源码后，Windows 目录会映射到容器 `/app`，Next.js 自动重新编译。开发配置启用了 `WATCHPACK_POLLING`，以提高 Windows 文件变更监听的可靠性。

## 4. 依赖、迁移与清理

修改 `package.json` 或 `package-lock.json` 后，执行以下命令重建镜像和开发依赖卷：

```powershell
npm run docker:dev:down
docker volume rm personal-system_dev_node_modules
npm run docker:dev
```

新增 Prisma migration：

```powershell
docker compose -f docker-compose.yml -f docker-compose.dev.yml run --rm web npm run db:migrate -- --name <migration-name>
```

应用已有 migration：

```powershell
npm run docker:db:deploy
```

如需连同本地 PostgreSQL、Redis 数据一起清空：

```powershell
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
```

该命令会永久删除本项目的本地开发数据库和 Redis 数据，执行前请确认无需保留。

## 5. 常见问题

- 端口 `3000`、`5432` 或 `6379` 被占用：停止本机占用进程，或修改 `docker-compose.dev.yml` 左侧的宿主机端口。
- 修改代码后不热更新：确认 Docker Desktop 文件共享可访问当前项目目录，并查看 `web` 日志。
- 容器反复退出：运行 `docker compose -f docker-compose.yml -f docker-compose.dev.yml logs web db redis`。
- Docker 启动失败：确认 BIOS/UEFI 已开启虚拟化，并运行 `wsl --update` 后重启。
