#!/usr/bin/env sh
set -eu

# 部署脚本职责：
# 1) 在 VPS 拉取 main 最新代码
# 2) 重建镜像并确保数据库先启动
# 3) 执行 Prisma 生产迁移（migrate 服务）
# 4) 最后启动/更新 web 服务
#
# 关键约束：
# - APP_DIR 必须是服务器上的项目绝对路径（例如 /opt/personal-system）
# - 脚本同时兼容 'docker compose' 和 'docker-compose'
# - 迁移失败会直接退出，避免新代码配旧库

if docker compose version >/dev/null 2>&1; then
  COMPOSE_BIN='docker compose'
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_BIN='docker-compose'
else
  echo 'Docker Compose is required (docker compose or docker-compose)'
  exit 1
fi

compose() {
  if [ "$COMPOSE_BIN" = 'docker-compose' ]; then
    docker-compose "$@"
  else
    docker compose "$@"
  fi
}

if [ -z "${APP_DIR:-}" ]; then
  echo 'APP_DIR is required'
  exit 1
fi

cd "$APP_DIR"

if [ ! -d .git ]; then
  echo 'Target directory is not a git repository'
  exit 1
fi

git fetch --all --prune
git checkout main
git pull --ff-only origin main

# 先构建，再启动 db/redis，再迁移，最后更新 web
compose build --pull
compose up -d db redis
compose run --rm --no-deps migrate
compose up -d --remove-orphans web
compose ps
