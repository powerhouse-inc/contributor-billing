#!/bin/bash
# Find which document models have the most/least insights about them
# Usage: ./ops/scripts/model-coverage.sh

VAULT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTES_DIR="$VAULT_ROOT/insights"

echo "Document model coverage in insights:"
echo "---"

for MODEL in invoice billing-statement expense-report accounts account-transactions snapshot-report operational-hub-profile; do
  COUNT=$(grep -rl "$MODEL" "$NOTES_DIR" --include="*.md" 2>/dev/null | wc -l)
  echo "$MODEL: $COUNT insights"
done

echo "---"
echo "Low-coverage models may need dedicated exploration sessions."
