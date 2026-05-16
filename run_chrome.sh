#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8123}"
URL="http://127.0.0.1:${PORT}"

# Start local server in background
python3 -m http.server "${PORT}" >/tmp/ouchi-chef-server.log 2>&1 &
SERVER_PID=$!

cleanup() {
  if kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" || true
  fi
}
trap cleanup EXIT

# Wait server up
for _ in {1..40}; do
  if curl -sSf "${URL}" >/dev/null 2>&1; then
    break
  fi
  sleep 0.1
done

# Open Chrome (prefer google-chrome, fallback to chromium)
if command -v google-chrome >/dev/null 2>&1; then
  google-chrome --new-window "${URL}" >/dev/null 2>&1 &
elif command -v google-chrome-stable >/dev/null 2>&1; then
  google-chrome-stable --new-window "${URL}" >/dev/null 2>&1 &
elif command -v chromium-browser >/dev/null 2>&1; then
  chromium-browser --new-window "${URL}" >/dev/null 2>&1 &
elif command -v chromium >/dev/null 2>&1; then
  chromium --new-window "${URL}" >/dev/null 2>&1 &
else
  echo "Chrome/Chromium が見つかりません。次のURLを手動で開いてください: ${URL}"
fi

echo "おうちシェフAIを起動しました: ${URL}"
echo "終了するにはこのターミナルで Ctrl+C を押してください。"
wait "$SERVER_PID"
