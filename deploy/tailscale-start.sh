#!/bin/sh
set -eu

# Start daemon
tailscaled --state="${TS_STATE_DIR}" --socket=/var/run/tailscale/tailscaled.sock &
sleep 1

# Login
tailscale up \
  --authkey="${TS_AUTHKEY}" \
  --hostname="tutorapp" \
  --accept-dns=false

# Reverse proxy HTTPS -> nginx:80 (nginx działa w tym samym network namespace)
tailscale serve reset || true
tailscale serve --https=443 http://127.0.0.1:80

echo "[tailscale] Serve status:"
tailscale serve status || true

# Keep container running
tail -f /dev/null