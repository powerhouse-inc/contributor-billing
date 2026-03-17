#!/bin/bash
# Measure average outgoing links per insight
# Target: 3+ links per insight for healthy graph density
# Usage: ./ops/scripts/link-density.sh

VAULT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTES_DIR="$VAULT_ROOT/insights"

TOTAL_LINKS=0
NOTE_COUNT=0

find "$NOTES_DIR" -name "*.md" -not -name "CLAUDE.md" -not -name "index.md" | while read -r f; do
  LINKS=$(grep -o '\[\[[^\]]*\]\]' "$f" 2>/dev/null | wc -l)
  NOTE_COUNT=$((NOTE_COUNT + 1))
  TOTAL_LINKS=$((TOTAL_LINKS + LINKS))
  echo "$NOTE_COUNT $TOTAL_LINKS" > /tmp/link-density-state
done

if [ -f /tmp/link-density-state ]; then
  read -r NOTE_COUNT TOTAL_LINKS < /tmp/link-density-state
  rm -f /tmp/link-density-state
  if [ "$NOTE_COUNT" -gt 0 ]; then
    AVG=$(echo "scale=1; $TOTAL_LINKS / $NOTE_COUNT" | bc 2>/dev/null || echo "N/A")
    echo "Insights: $NOTE_COUNT | Total links: $TOTAL_LINKS | Average: $AVG links/insight"
    if [ "$TOTAL_LINKS" -gt 0 ] && [ "$(echo "$TOTAL_LINKS / $NOTE_COUNT < 3" | bc 2>/dev/null)" = "1" ]; then
      echo "WARNING: Below healthy density threshold of 3 links/insight"
    fi
  else
    echo "No insights found."
  fi
else
  echo "No insights found."
fi
