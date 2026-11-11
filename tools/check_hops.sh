#!/usr/bin/env bash
# Real redirect hop check: build, start `wrangler pages dev` on this checkout (static host + functions/_middleware.js),
# run tests/pages_dev_hops.mjs against it, stop the server. Exit 0 only if every URL form reaches its page in one 301.
# Usage: tools/check_hops.sh [port]      (about 30 s; needs network once for npx wrangler)
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${1:-8791}"
python3 build.py >/dev/null
LOG="$(mktemp)"
npx --yes wrangler@3.114.0 pages dev . --port "$PORT" --ip 127.0.0.1 >"$LOG" 2>&1 &
PID=$!
trap 'kill "$PID" 2>/dev/null || true; pkill -P "$PID" 2>/dev/null || true; rm -f "$LOG"' EXIT
for _ in $(seq 1 60); do
  curl -s -o /dev/null "http://127.0.0.1:$PORT/" && break
  sleep 1
done
DEV="http://127.0.0.1:$PORT" node tests/pages_dev_hops.mjs
