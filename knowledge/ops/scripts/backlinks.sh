#!/bin/bash
# Count incoming links to a specific insight
# Usage: ./ops/scripts/backlinks.sh "insight title" [--count]

TITLE="$1"
COUNT_ONLY="$2"
VAULT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

if [ -z "$TITLE" ]; then
  echo "Usage: backlinks.sh \"insight title\" [--count]"
  exit 1
fi

if [ "$COUNT_ONLY" = "--count" ]; then
  grep -rl "\[\[$TITLE\]\]" "$VAULT_ROOT" --include="*.md" 2>/dev/null | wc -l
else
  grep -rl "\[\[$TITLE\]\]" "$VAULT_ROOT" --include="*.md" 2>/dev/null | while read -r f; do
    echo "$(basename "$f" .md)"
  done
fi
