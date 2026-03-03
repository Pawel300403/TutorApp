#!/bin/sh
set -eu

git pull
docker compose build
docker compose up -d

echo "Done. DB data preserved (volume pgdata)."