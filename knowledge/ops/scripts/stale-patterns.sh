#!/bin/bash
# Find pattern insights that may be stale (not modified in 30+ days)
# Usage: ./ops/scripts/stale-patterns.sh

VAULT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTES_DIR="$VAULT_ROOT/insights"

echo "Potentially stale patterns (not modified in 30+ days):"
echo "---"

find "$NOTES_DIR" -name "*.md" -mtime +30 -not -name "CLAUDE.md" -not -name "index.md" 2>/dev/null | while read -r f; do
  if grep -q '^type: pattern\|^type: solution' "$f" 2>/dev/null; then
    TITLE=$(basename "$f" .md)
    MODIFIED=$(stat -c %y "$f" 2>/dev/null | cut -d' ' -f1)
    CONNECTIONS=$(grep -o '\[\[[^\]]*\]\]' "$f" 2>/dev/null | wc -l)
    echo "$MODIFIED | $TITLE ($CONNECTIONS connections)"
  fi
done | sort

echo "---"
echo "These patterns may need revisiting — the codebase has likely evolved."
