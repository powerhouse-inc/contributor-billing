#!/bin/bash
# Workboard reconciliation — check condition-based maintenance triggers
# Idempotent: safe to run any number of times
# Usage: ./ops/scripts/reconcile.sh

VAULT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTES_DIR="$VAULT_ROOT/insights"
INBOX_DIR="$VAULT_ROOT/inbox"
OBS_DIR="$VAULT_ROOT/ops/observations"
TENSION_DIR="$VAULT_ROOT/ops/tensions"

echo "Reconciling maintenance conditions..."
echo "---"

ISSUES=0

# Check orphan insights
ORPHANS=$(find "$NOTES_DIR" -name "*.md" -not -name "CLAUDE.md" -not -name "index.md" 2>/dev/null | while read -r f; do
  title=$(basename "$f" .md)
  grep -rq "\[\[$title\]\]" "$VAULT_ROOT" --include="*.md" 2>/dev/null || echo "$title"
done | wc -l)
if [ "$ORPHANS" -gt 0 ]; then
  echo "CONDITION FIRED: $ORPHANS orphan insight(s) — run /connect (consequence: session)"
  ISSUES=$((ISSUES + 1))
fi

# Check dangling links
DANGLING=$(grep -roh '\[\[[^\]]*\]\]' "$VAULT_ROOT" --include="*.md" 2>/dev/null | \
  sed 's/\[\[//;s/\]\]//' | sort -u | while read -r title; do
    find "$VAULT_ROOT" -name "$title.md" -not -path "*/.git/*" -not -path "*/node_modules/*" 2>/dev/null | grep -q . || echo "$title"
  done | wc -l)
if [ "$DANGLING" -gt 0 ]; then
  echo "CONDITION FIRED: $DANGLING dangling link(s) — fix or create targets (consequence: session)"
  ISSUES=$((ISSUES + 1))
fi

# Check inbox pressure
INBOX_OLD=$(find "$INBOX_DIR" -name "*.md" -mtime +3 2>/dev/null | wc -l)
if [ "$INBOX_OLD" -gt 0 ]; then
  echo "CONDITION FIRED: $INBOX_OLD inbox item(s) older than 3 days — run /distill (consequence: session)"
  ISSUES=$((ISSUES + 1))
fi

# Check observation accumulation
OBS_COUNT=$(find "$OBS_DIR" -name "*.md" 2>/dev/null | wc -l)
if [ "$OBS_COUNT" -ge 10 ]; then
  echo "CONDITION FIRED: $OBS_COUNT pending observations — run /rethink (consequence: slow)"
  ISSUES=$((ISSUES + 1))
fi

# Check tension accumulation
TENSION_COUNT=$(find "$TENSION_DIR" -name "*.md" 2>/dev/null | wc -l)
if [ "$TENSION_COUNT" -ge 5 ]; then
  echo "CONDITION FIRED: $TENSION_COUNT pending tensions — run /rethink (consequence: slow)"
  ISSUES=$((ISSUES + 1))
fi

if [ "$ISSUES" -eq 0 ]; then
  echo "All conditions satisfied. No maintenance needed."
fi

echo "---"
echo "Reconciliation complete. $ISSUES condition(s) fired."
