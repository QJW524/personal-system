#!/usr/bin/env sh
set -eu

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

docker compose build --pull
docker compose up -d db
docker compose run --rm --no-deps web npm run db:deploy
docker compose up -d --remove-orphans web
docker compose ps
