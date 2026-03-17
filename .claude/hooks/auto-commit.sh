#!/bin/bash
# Auto-commit hook — runs after Write tool (async)
# Commits vault changes to git automatically

VAULT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MARKER="$VAULT_ROOT/.arscontexta"

# Only run if this is an Ars Contexta vault
[ -f "$MARKER" ] || exit 0

# Check if git auto-commit is enabled
GIT_ENABLED=$(grep -o 'git: *\(true\|false\)' "$MARKER" 2>/dev/null | awk '{print $2}')
[ "$GIT_ENABLED" = "false" ] && exit 0

cd "$VAULT_ROOT" || exit 0

# Only commit vault-related files
git add insights/ inbox/ archive/ self/ ops/ templates/ manual/ .arscontexta 2>/dev/null

# Check if there are staged changes
if git diff --cached --quiet 2>/dev/null; then
  exit 0
fi

git commit -m "chore(vault): auto-commit knowledge changes [skip ci]" --no-verify 2>/dev/null

exit 0
