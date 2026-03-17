#!/bin/bash
# Find open triadic closures — synthesis opportunities
# A links to B, A links to C, but B and C don't link to each other
# Usage: ./ops/scripts/graph/find-triangles.sh

VAULT_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
NOTES_DIR="$VAULT_ROOT/insights"

echo "Finding synthesis opportunities (open triangles)..."
echo ""

find "$NOTES_DIR" -name "*.md" -not -name "CLAUDE.md" -not -name "index.md" | while read -r f; do
  A=$(basename "$f" .md)
  # Get all outgoing links from A
  LINKS_A=$(grep -o '\[\[[^\]]*\]\]' "$f" 2>/dev/null | sed 's/\[\[//;s/\]\]//' | sort -u)

  # For each pair of links from A, check if they link to each other
  echo "$LINKS_A" | while read -r B; do
    [ -z "$B" ] && continue
    B_FILE=$(find "$NOTES_DIR" -name "$B.md" 2>/dev/null | head -1)
    [ -z "$B_FILE" ] && continue

    echo "$LINKS_A" | while read -r C; do
      [ -z "$C" ] && continue
      [ "$B" = "$C" ] && continue
      # Check if B links to C
      if ! grep -q "\[\[$C\]\]" "$B_FILE" 2>/dev/null; then
        C_FILE=$(find "$NOTES_DIR" -name "$C.md" 2>/dev/null | head -1)
        [ -z "$C_FILE" ] && continue
        # Check C doesn't link to B either
        if ! grep -q "\[\[$B\]\]" "$C_FILE" 2>/dev/null; then
          echo "Triangle via [$A]: [$B] <-> [$C] (not connected)"
        fi
      fi
    done
  done
done | sort -u

echo ""
echo "Each line shows two insights that share a parent but aren't directly connected."
echo "These are candidates for new connections — apply judgment before linking."
