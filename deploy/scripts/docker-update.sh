#!/usr/bin/env bash

set -euo pipefail

APP_DIR="/opt/wedding-invite/app"

cd "$APP_DIR"

git pull --ff-only origin main
docker compose --env-file .env.production up -d --build
docker compose ps
