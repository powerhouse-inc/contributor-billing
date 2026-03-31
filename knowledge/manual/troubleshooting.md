---
summary: Common issues and resolution patterns
type: manual
generated_from: "arscontexta-0.8.0"
---
# Troubleshooting

## Orphan Insights

**Problem:** Insights with no incoming links — invisible to traversal.
**Detection:** `./knowledge/ops/scripts/orphan-notes.sh` or /arscontexta:health
**Fix:** Run /arscontexta:connect to find appropriate maps and link targets.

## Dangling Links

**Problem:** Wiki links pointing to non-existent insights.
**Detection:** `./knowledge/ops/scripts/dangling-links.sh` or /arscontexta:health
**Fix:** Either create the missing insight or update the link to an existing one.

## Stale Content

**Problem:** Insights not updated in 30+ days with sparse connections.
**Detection:** `./knowledge/ops/scripts/stale-patterns.sh`
**Fix:** Run /arscontexta:revisit on the stale insights. The codebase may have evolved.

## Methodology Drift

**Problem:** System behavior diverging from what knowledge/ops/methodology/ specifies.
**Detection:** Run /arscontexta:rethink drift
**Fix:** /rethink compares actual behavior against methodology notes and proposes corrections.

## Inbox Overflow

**Problem:** Too many items accumulating in knowledge/inbox/.
**Detection:** /arscontexta:next surfaces this as a condition-based trigger
**Fix:** Run /arscontexta:distill on inbox items, or /arscontexta:pipeline for batch processing.

## Pipeline Stalls

**Problem:** Tasks stuck in knowledge/ops/queue/queue.json without progress.
**Detection:** /arscontexta:tasks status or /arscontexta:next
**Fix:** Check the stalled task's current_phase, resume from there.

## Common Mistakes

| Mistake | Correction |
|---------|-----------|
| Writing directly to knowledge/insights/ | Route through knowledge/inbox/ → /distill |
| Bare link lists in maps | Add context phrases explaining WHY each insight belongs |
| Missing summary field | Validate-note hook should catch this; add immediately |
| Generic titles ("notes about reducers") | Use prose-as-title ("reducer timestamps must come from action input") |
| Skipping /connect after /distill | Every new insight needs map membership and forward/backward links |

See [[meta-skills]] for /rethink and /remember. See [[configuration]] for threshold adjustments.
