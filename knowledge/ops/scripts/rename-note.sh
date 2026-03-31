#!/bin/bash
# Safe rename — renames an insight and updates all wiki links
# Usage: ./ops/scripts/rename-note.sh "old title" "new title"

OLD="$1"
NEW="$2"

if [ -z "$OLD" ] || [ -z "$NEW" ]; then
  echo "Usage: rename-note.sh \"old title\" \"new title\""
  exit 1
fi

VAULT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OLD_FILE=$(find "$VAULT_ROOT" -name "$OLD.md" -not -path "*/.git/*" -not -path "*/node_modules/*" | head -1)

if [ -z "$OLD_FILE" ]; then
  echo "Error: Could not find '$OLD.md'"
  exit 1
fi

DIR=$(dirname "$OLD_FILE")
NEW_FILE="$DIR/$NEW.md"

# Rename with git mv
cd "$VAULT_ROOT" || exit 1
git mv "$OLD_FILE" "$NEW_FILE" 2>/dev/null || mv "$OLD_FILE" "$NEW_FILE"

# Update all wiki links across the vault
find "$VAULT_ROOT" -name "*.md" -not -path "*/.git/*" -not -path "*/node_modules/*" -exec \
  sed -i "s|\[\[$OLD\]\]|\[\[$NEW\]\]|g" {} \;

# Verify no dangling links remain
REMAINING=$(grep -r "\[\[$OLD\]\]" "$VAULT_ROOT" --include="*.md" 2>/dev/null | grep -v ".git" | wc -l)
if [ "$REMAINING" -gt 0 ]; then
  echo "WARNING: $REMAINING references to [[$OLD]] still remain"
else
  echo "Renamed '$OLD' -> '$NEW' and updated all wiki links"
fi
