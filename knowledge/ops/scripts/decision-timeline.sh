#!/bin/bash
# List architecture decisions chronologically
# Usage: ./ops/scripts/decision-timeline.sh

VAULT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTES_DIR="$VAULT_ROOT/insights"

echo "Architecture decisions timeline:"
echo "---"

grep -rl '^type: decision' "$NOTES_DIR" --include="*.md" 2>/dev/null | while read -r f; do
  TITLE=$(basename "$f" .md)
  DATE=$(grep '^created:' "$f" 2>/dev/null | sed 's/created: *//')
  STATUS=$(grep '^status:' "$f" 2>/dev/null | sed 's/status: *//')
  echo "$DATE | [$STATUS] $TITLE"
done | sort

echo "---"
echo "Active decisions are current. Archived decisions document historical context."
