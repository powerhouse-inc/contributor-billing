#!/bin/bash
# Auto-commit hook — runs after Write tool (async)
# Commits vault changes to git automatically

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
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

# Check if git auto-commit is enabled
GIT_ENABLED=$(grep -o 'git: *\(true\|false\)' "$MARKER" 2>/dev/null | awk '{print $2}')
[ "$GIT_ENABLED" = "false" ] && exit 0

cd "$PROJECT_ROOT" || exit 0

# Only commit vault-related files
git add knowledge/ 2>/dev/null

# Check if there are staged changes
if git diff --cached --quiet 2>/dev/null; then
  exit 0
fi

git commit -m "chore(vault): auto-commit knowledge changes [skip ci]" --no-verify 2>/dev/null

exit 0
