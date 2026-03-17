#!/bin/bash
# Find insights with no incoming wiki links (orphans)
# Usage: ./ops/scripts/orphan-notes.sh

VAULT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTES_DIR="$VAULT_ROOT/insights"
ORPHAN_COUNT=0

find "$NOTES_DIR" -name "*.md" -not -name "CLAUDE.md" -not -name "index.md" | while read -r f; do
  title=$(basename "$f" .md)
  if ! grep -rq "\[\[$title\]\]" "$VAULT_ROOT" --include="*.md" 2>/dev/null; then
    echo "Orphan: $title"
    ORPHAN_COUNT=$((ORPHAN_COUNT + 1))
  fi
done

echo "---"
echo "Scan complete."
