#!/bin/bash
# Show queue status — pending tasks, phase distribution, stalled batches
# Usage: ./ops/scripts/queue-status.sh

VAULT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
QUEUE="$VAULT_ROOT/ops/queue/queue.json"

if [ ! -f "$QUEUE" ]; then
  echo "No queue file found at $QUEUE"
  exit 1
fi

echo "Queue Status:"
echo "---"

# Count tasks by status
TOTAL=$(cat "$QUEUE" | grep -o '"status"' | wc -l)
PENDING=$(cat "$QUEUE" | grep -o '"status": "pending"' | wc -l)
IN_PROGRESS=$(cat "$QUEUE" | grep -o '"status": "in_progress"' | wc -l)
DONE=$(cat "$QUEUE" | grep -o '"status": "done"' | wc -l)

echo "Total: $TOTAL | Pending: $PENDING | In Progress: $IN_PROGRESS | Done: $DONE"

if [ "$TOTAL" -eq 0 ]; then
  echo "Queue is empty. Capture content to inbox/ and run /distill to start."
fi
