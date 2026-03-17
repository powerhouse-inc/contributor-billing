#!/bin/bash
# Validate note hook — runs after Write tool
# Checks that insights have required YAML fields

VAULT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MARKER="$VAULT_ROOT/.arscontexta"

# Only run if this is an Ars Contexta vault
[ -f "$MARKER" ] || exit 0

# Get the file that was just written from the tool output
FILE="$TOOL_INPUT_FILE_PATH"

# Only validate files in insights/
case "$FILE" in
  */insights/*.md)
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
