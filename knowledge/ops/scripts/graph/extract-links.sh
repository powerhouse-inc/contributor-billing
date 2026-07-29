#!/bin/bash
# Extract all wiki links from a specific insight
# Usage: ./ops/scripts/graph/extract-links.sh "insight title"

TITLE="$1"
VAULT_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"

if [ -z "$TITLE" ]; then
  echo "Usage: extract-links.sh \"insight title\""
  exit 1
fi

FILE=$(find "$VAULT_ROOT" -name "$TITLE.md" -not -path "*/.git/*" -not -path "*/node_modules/*" 2>/dev/null | head -1)

if [ -z "$FILE" ]; then
  echo "Error: Could not find '$TITLE.md'"
  exit 1
fi

echo "Links from: $TITLE"
echo "---"
grep -o '\[\[[^\]]*\]\]' "$FILE" 2>/dev/null | sed 's/\[\[//;s/\]\]//' | sort -u
