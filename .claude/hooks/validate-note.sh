#!/bin/bash
# Validate note hook — runs after Write tool
# Checks that insights have required YAML fields

PROJECT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || cd "$(dirname "$0")/../.." && pwd)"
VAULT_ROOT="$PROJECT_ROOT/knowledge"
MARKER="$VAULT_ROOT/.arscontexta"
ROOT_MARKER="$PROJECT_ROOT/.arscontexta"

# If an older generator wrote the marker to repo root, move it into knowledge/
# and keep the root clean going forward.
if [ -f "$ROOT_MARKER" ]; then
  mkdir -p "$VAULT_ROOT"
  if [ ! -f "$MARKER" ]; then
    mv "$ROOT_MARKER" "$MARKER"
  else
    rm -f "$ROOT_MARKER"
  fi
fi

# Only run if this is an Ars Contexta vault
[ -f "$MARKER" ] || exit 0

# Get the file that was just written from the tool output
FILE="$TOOL_INPUT_FILE_PATH"

# Only validate files in knowledge/insights/
case "$FILE" in
  */knowledge/insights/*.md)
    # Skip the CLAUDE.md and index
    case "$FILE" in
      */CLAUDE.md|*/index.md) exit 0 ;;
    esac

    # Check for summary field
    if ! grep -q '^summary:' "$FILE" 2>/dev/null; then
      echo "WARN: $FILE is missing 'summary' field in YAML frontmatter"
    fi

    # Check for Topics footer
    if ! grep -q '^Topics:' "$FILE" 2>/dev/null; then
      echo "WARN: $FILE is missing Topics footer section"
    fi
    ;;
esac

exit 0
