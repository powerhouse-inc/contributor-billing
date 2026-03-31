#!/bin/bash
# Find wiki links pointing to non-existent files
# Usage: ./ops/scripts/dangling-links.sh

VAULT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

grep -roh '\[\[[^\]]*\]\]' "$VAULT_ROOT" --include="*.md" 2>/dev/null | \
  sed 's/\[\[//;s/\]\]//' | sort -u | while read -r title; do
    if ! find "$VAULT_ROOT" -name "$title.md" -not -path "*/.git/*" -not -path "*/node_modules/*" 2>/dev/null | grep -q .; then
      echo "Dangling: [[$title]]"
    fi
  done

echo "---"
echo "Scan complete."
