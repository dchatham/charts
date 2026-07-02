#!/usr/bin/env bash
# One-command daily report update.
#   1. Merge one day (default: today.json) into the rolling 30-day window
#   2. Rebuild index.html
#   3. Commit ("Report: <date>") and push to main
#
# Usage:  bin/update-day.sh [day.json]
#
# Get the day file from candobro first — see DAILY_UPDATE.md for the exact
# message to send and the field definitions. Pull ONE day; never re-pull 30.
set -euo pipefail
cd "$(dirname "$0")/.."

DAY="${1:-today.json}"
if [ ! -f "$DAY" ]; then
  echo "No day file: $DAY"
  echo "Create it from candobro's JSON reply (see DAILY_UPDATE.md), then re-run."
  exit 1
fi

node merge.js "$DAY"
node build.js

DATE="$(node -e 'process.stdout.write(require("./data.json").lastUpdated)')"
git add data.json index.html
if git diff --cached --quiet; then
  echo "Nothing changed for $DATE; not committing."
  exit 0
fi
git commit -m "Report: $DATE"
git push origin HEAD:main
echo "Pushed report for $DATE."
