#!/bin/bash
# Validate all insights against template schema
# Usage: ./ops/scripts/validate-schema.sh

VAULT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTES_DIR="$VAULT_ROOT/insights"
PASS=0
WARN=0
FAIL=0

find "$NOTES_DIR" -name "*.md" -not -name "CLAUDE.md" -not -name "index.md" | while read -r f; do
  TITLE=$(basename "$f" .md)
  ISSUES=""

  # Check for summary field (required)
  if ! grep -q '^summary:' "$f" 2>/dev/null; then
    ISSUES="$ISSUES missing-summary"
    FAIL=$((FAIL + 1))
  fi

  # Check for Topics footer
  if ! grep -q '^Topics:' "$f" 2>/dev/null; then
    ISSUES="$ISSUES missing-topics"
    WARN=$((WARN + 1))
  fi

  # Check type enum validity
  TYPE=$(grep '^type:' "$f" 2>/dev/null | head -1 | sed 's/type: *//')
  if [ -n "$TYPE" ]; then
    case "$TYPE" in
      decision|idea|pattern|context|solution|moc) ;;
      *) ISSUES="$ISSUES invalid-type:$TYPE"; WARN=$((WARN + 1)) ;;
    esac
  fi

  if [ -n "$ISSUES" ]; then
    echo "[$TITLE] $ISSUES"
  else
    PASS=$((PASS + 1))
  fi

  echo "$PASS $WARN $FAIL" > /tmp/schema-validate-state
done

if [ -f /tmp/schema-validate-state ]; then
  read -r PASS WARN FAIL < /tmp/schema-validate-state
  rm -f /tmp/schema-validate-state
  echo "---"
  echo "PASS: $PASS | WARN: $WARN | FAIL: $FAIL"
fi
