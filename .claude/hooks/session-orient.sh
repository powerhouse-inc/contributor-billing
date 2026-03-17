#!/bin/bash
# Session orientation hook — runs at session start
# Reads vault state and surfaces what needs attention

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
VAULT_ROOT="$PROJECT_ROOT/knowledge"
MARKER="$VAULT_ROOT/.arscontexta"

# Only run if this is an Ars Contexta vault
[ -f "$MARKER" ] || exit 0

# Session tracking
SESSION_DIR="$VAULT_ROOT/ops/sessions"
SESSION_ID="${CLAUDE_CONVERSATION_ID:-$(date +%Y%m%d-%H%M%S)}"
SESSION_FILE="$SESSION_DIR/current.json"

mkdir -p "$SESSION_DIR"

# Create/update session file
cat > "$SESSION_FILE" << EOF
{
  "session_id": "$SESSION_ID",
  "start_time": "$(date -Iseconds)",
  "notes_created": [],
  "notes_modified": [],
  "discoveries": [],
  "last_activity": "$(date -Iseconds)"
}
EOF

# Count vault state for orientation
INSIGHT_COUNT=$(find "$VAULT_ROOT/insights" -name "*.md" -not -name "CLAUDE.md" 2>/dev/null | wc -l)
INBOX_COUNT=$(find "$VAULT_ROOT/inbox" -name "*.md" 2>/dev/null | wc -l)
OBS_COUNT=$(find "$VAULT_ROOT/ops/observations" -name "*.md" 2>/dev/null | wc -l)
TENSION_COUNT=$(find "$VAULT_ROOT/ops/tensions" -name "*.md" 2>/dev/null | wc -l)

# Build orientation summary
echo "--- Vault State ---"
echo "Insights: $INSIGHT_COUNT | Inbox: $INBOX_COUNT | Observations: $OBS_COUNT | Tensions: $TENSION_COUNT"

# Check condition-based triggers
if [ "$INBOX_COUNT" -gt 0 ]; then
  OLDEST_INBOX=$(find "$VAULT_ROOT/inbox" -name "*.md" -mtime +3 2>/dev/null | head -1)
  [ -n "$OLDEST_INBOX" ] && echo "CONDITION: Inbox items older than 3 days — consider processing"
fi

if [ "$OBS_COUNT" -ge 10 ]; then
  echo "CONDITION: $OBS_COUNT pending observations — consider running /rethink"
fi

if [ "$TENSION_COUNT" -ge 5 ]; then
  echo "CONDITION: $TENSION_COUNT pending tensions — consider running /rethink"
fi

# Check for reminders
if [ -f "$VAULT_ROOT/ops/reminders.md" ]; then
  PENDING=$(grep -c '^\- \[ \]' "$VAULT_ROOT/ops/reminders.md" 2>/dev/null || true)
  PENDING=${PENDING:-0}
  [ "$PENDING" -gt 0 ] 2>/dev/null && echo "REMINDERS: $PENDING pending items in knowledge/ops/reminders.md"
fi

echo "--- Orient Complete ---"
