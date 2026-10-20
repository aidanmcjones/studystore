#!/bin/bash
# Build the site and deploy it to Cloudflare Pages project "studystore".
# Allowlist copy into .deploy/: built HTML, sitemap/robots, the IndexNow key, experiments.json,
# assets/ (style, js, preview images) and media/ (social videos, posters, pins; media/manifest.json stays out). Nothing that is sold may ever be deployed:
# the guard below aborts if a paid-file type or source file slips in.
# functions/ (Pages Functions) is picked up from the repo root by wrangler.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 build.py
rm -rf .deploy && mkdir .deploy
rsync -a --prune-empty-dirs \
  --exclude '.*' --exclude '__pycache__/' --exclude '/tools/*.sh' --exclude '/tools/*.py' --exclude 'templates/' --exclude 'content/' \
  --exclude 'db/' --exclude 'functions/' --exclude 'node_modules/' \
  --include '*/' --include '*.html' --include 'sitemap.xml' --include 'robots.txt' \
  --include '[0-9a-f]*[0-9a-f].txt' --include 'experiments.json' --include '/_redirects' --include '/_headers' \
  --include 'assets/**.css' --include 'assets/**.js' --include 'assets/**.png' --include 'assets/**.jpg' \
  --include 'assets/**.webp' --include 'assets/**.svg' \
  --include '/media/**.mp4' --include '/media/**.jpg' --include '/media/**.png' --include '/media/**.webp' \
  --exclude '*' ./ .deploy/
BAD="$(find .deploy -type f \( -iname '*.apkg' -o -iname '*.zip' -o -iname '*.pdf' -o -iname '*.colpkg' \
  -o -name 'cards.json' -o -name 'questions.json' -o -iname '*guide*' -o -iname '*.md' -o -iname '*.py' \
  -o -iname '*full*' -o -iname '*render*' \) -print)"
if [ -n "$BAD" ]; then echo "REFUSING TO DEPLOY, paid or source files found:" >&2; echo "$BAD" >&2; exit 3; fi
# Social videos in media/ (tools/gen_social.py) are allowed up to 2.5 MB; everything else keeps the 1.5 MB cap.
BIG="$( { find .deploy -type f -size +1500k ! -path '.deploy/media/*.mp4' -print; find .deploy/media -type f -name '*.mp4' -size +2500k -print 2>/dev/null; } )"
if [ -n "$BIG" ]; then echo "REFUSING TO DEPLOY, unexpectedly large files (check they are not full renders):" >&2; echo "$BIG" >&2; exit 3; fi
npx --yes wrangler@3.114.0 pages deploy .deploy --project-name studystore --branch main --commit-dirty=true "$@"
