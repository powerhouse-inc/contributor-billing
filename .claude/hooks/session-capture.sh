#!/bin/bash
# Session capture hook — runs at session end
# Archives session state for future reference

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
VAULT_ROOT="$PROJECT_ROOT/knowledge"
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

echo "Session captured to knowledge/ops/sessions/$TIMESTAMP.json"

# Auto-prune: keep only the 10 most recent session files (excluding current.json)
SESSION_COUNT=$(find "$SESSION_DIR" -maxdepth 1 -name '*.json' ! -name 'current.json' | wc -l)
MAX_SESSIONS=10
if [ "$SESSION_COUNT" -gt "$MAX_SESSIONS" ]; then
  PRUNE_COUNT=$((SESSION_COUNT - MAX_SESSIONS))
  find "$SESSION_DIR" -maxdepth 1 -name '*.json' ! -name 'current.json' -print0 \
    | sort -z \
    | head -z -n "$PRUNE_COUNT" \
    | xargs -0 rm -f
  echo "Pruned $PRUNE_COUNT old session files (kept $MAX_SESSIONS most recent)"
fi
