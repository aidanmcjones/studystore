#!/usr/bin/env bash
# Submit site URLs to IndexNow (Bing, Yandex, Seznam, Naver and others share submissions)
# so new pages get crawled without a human using a webmaster console.
#
# Usage:
#   tools/ping_sitemap.sh            submit every URL in sitemap.xml
#   tools/ping_sitemap.sh --new      submit only URLs added to sitemap.xml since the last commit
#   tools/ping_sitemap.sh URL [URL]  submit specific URLs
#
# Key: the key file is <key>.txt at the site root (its content is the key). It must be
# deployed (pushed and live) BEFORE this runs, because IndexNow fetches it to verify ownership.
# Run this AFTER git push and after the GitHub Pages deploy finishes.
set -euo pipefail
cd "$(dirname "$0")/.."
HOST="www.studystore.co"
KEYFILE=$(ls -1 ./*.txt 2>/dev/null | grep -E '/[0-9a-f]{32}\.txt$' | head -1 || true)
[ -n "$KEYFILE" ] || { echo "no IndexNow key file (32 hex chars .txt) at site root" >&2; exit 1; }
KEY=$(basename "$KEYFILE" .txt)
if [ "$(tr -d '[:space:]' < "$KEYFILE")" != "$KEY" ]; then echo "key file content does not match its name" >&2; exit 1; fi

if [ "$#" -gt 0 ] && [ "$1" != "--new" ]; then
  URLS=$(printf '%s\n' "$@")
elif [ "${1:-}" = "--new" ]; then
  URLS=$(git diff -U0 HEAD~1 -- sitemap.xml 2>/dev/null | grep -E '^\+.*<loc>' | sed -E 's@.*<loc>([^<]+)</loc>.*@\1@' || true)
  [ -n "$URLS" ] || { echo "no new URLs in sitemap since HEAD~1"; exit 0; }
else
  URLS=$(grep -oE '<loc>[^<]+</loc>' sitemap.xml | sed -E 's@</?loc>@@g')
fi

PAYLOAD=$(printf '%s\n' "$URLS" | python3 -c '
import sys, json
host, key = sys.argv[1], sys.argv[2]
urls = [u.strip() for u in sys.stdin if u.strip()]
print(json.dumps({"host": host, "key": key, "keyLocation": f"https://{host}/{key}.txt", "urlList": urls}))
' "$HOST" "$KEY")

echo "Submitting $(printf '%s\n' "$URLS" | wc -l | tr -d ' ') URL(s) to IndexNow"
RESP=$(mktemp)
CODE=$(curl -s -o "$RESP" -w '%{http_code}' -X POST "https://api.indexnow.org/IndexNow" \
  -H 'Content-Type: application/json; charset=utf-8' -d "$PAYLOAD")
echo "IndexNow HTTP $CODE (200 or 202 = accepted; 422/403 = key not yet reachable or mismatch)"
cat "$RESP"; echo; rm -f "$RESP"
[ "$CODE" = "200" ] || [ "$CODE" = "202" ]
