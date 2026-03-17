#!/bin/bash
# Find connected components — groups of insights that link to each other
# Usage: ./ops/scripts/graph/find-clusters.sh [--components]

VAULT_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
NOTES_DIR="$VAULT_ROOT/insights"

echo "Analyzing graph structure..."
echo ""

# Build adjacency and find components using BFS
TEMP_DIR=$(mktemp -d)
VISITED="$TEMP_DIR/visited"
touch "$VISITED"

COMPONENT=0

find "$NOTES_DIR" -name "*.md" -not -name "CLAUDE.md" -not -name "index.md" | while read -r f; do
  TITLE=$(basename "$f" .md)

  if grep -q "^$TITLE$" "$VISITED" 2>/dev/null; then
    continue
  fi

  COMPONENT=$((COMPONENT + 1))
  QUEUE="$TITLE"
  MEMBERS=""

  while [ -n "$QUEUE" ]; do
    CURRENT=$(echo "$QUEUE" | head -1)
    QUEUE=$(echo "$QUEUE" | tail -n +2)

    if grep -q "^$CURRENT$" "$VISITED" 2>/dev/null; then
      continue
    fi

    echo "$CURRENT" >> "$VISITED"
    MEMBERS="$MEMBERS $CURRENT"

    # Find neighbors (outgoing links)
    CURRENT_FILE=$(find "$NOTES_DIR" -name "$CURRENT.md" 2>/dev/null | head -1)
    if [ -n "$CURRENT_FILE" ]; then
      NEIGHBORS=$(grep -o '\[\[[^\]]*\]\]' "$CURRENT_FILE" 2>/dev/null | sed 's/\[\[//;s/\]\]//')
      for N in $NEIGHBORS; do
        if ! grep -q "^$N$" "$VISITED" 2>/dev/null; then
          QUEUE="$QUEUE
$N"
        fi
      done
    fi
  done

  COUNT=$(echo "$MEMBERS" | wc -w)
  echo "Component $COMPONENT ($COUNT insights):$MEMBERS"
done

rm -rf "$TEMP_DIR"
echo ""
echo "A healthy vault is one large connected component."
