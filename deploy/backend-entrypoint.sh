#!/bin/sh
set -eu

echo "[backend] Waiting for DB..."
python - <<'PY'
import os, time, socket
host = os.getenv("DB_HOST", "db")
port = int(os.getenv("DB_PORT", "5432"))
for _ in range(60):
    try:
        with socket.create_connection((host, port), timeout=2):
            print("[backend] DB is up")
            break
    except OSError:
        time.sleep(2)
else:
    raise SystemExit("[backend] DB not reachable after 120s")
PY

echo "[backend] Running migrations..."
python manage.py migrate --noinput

echo "[backend] Collecting static..."
python manage.py collectstatic --noinput || true

echo "[backend] Starting gunicorn..."
exec gunicorn tutorapp.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 3 \
  --timeout 60