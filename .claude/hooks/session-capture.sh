#!/bin/bash
# Session capture hook — runs at session end
# Archives session state for future reference

VAULT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MARKER="$VAULT_ROOT/.arscontexta"

# Only run if this is an Ars Contexta vault
[ -f "$MARKER" ] || exit 0

# Check if session capture is enabled
SESSION_CAPTURE=$(grep -o 'session_capture: *\(true\|false\)' "$MARKER" 2>/dev/null | awk '{print $2}')
[ "$SESSION_CAPTURE" = "false" ] && exit 0

SESSION_DIR="$VAULT_ROOT/ops/sessions"
CURRENT="$SESSION_DIR/current.json"

# Only capture if a session file exists
[ -f "$CURRENT" ] || exit 0

# Archive the session
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
cp "$CURRENT" "$SESSION_DIR/$TIMESTAMP.json"

echo "Session captured to ops/sessions/$TIMESTAMP.json"
