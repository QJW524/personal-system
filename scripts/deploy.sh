#!/usr/bin/env sh
set -eu

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

compose build --pull
compose up -d db
compose run --rm --no-deps migrate
compose up -d --remove-orphans web
compose ps
