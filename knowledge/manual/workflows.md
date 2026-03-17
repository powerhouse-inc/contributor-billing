---
summary: Processing pipeline, maintenance cycle, and session rhythm
type: manual
generated_from: "arscontexta-0.8.0"
---
# Workflows

## The Processing Pipeline

Content flows through four phases:

```
inbox/ → /distill → insights/ → /connect → /revisit → /validate
```

1. **Capture** — Drop raw content into inbox/. Zero friction, no structuring.
2. **Distill** — /arscontexta:distill reads the source, extracts insights with proper schema
3. **Connect** — /arscontexta:connect finds relationships, updates maps
4. **Validate** — /arscontexta:validate checks summary quality, schema, and links

### Pipeline Modes

| Mode | Behavior | When to Use |
|------|----------|-------------|
| Interactive | Invoke each phase manually | Learning the system, important sources |
| Orchestrated | /ralph runs phases with fresh context | Batch processing |
| Compressed | Phases run sequentially | Quick processing, minor sources |

## Session Rhythm

Every session: **Orient → Work → Persist**

1. Orient: Read self/, check conditions, check reminders (~2 min)
2. Work: Focus on one task. Discoveries go to inbox/, not tangents
3. Persist: Update goals, commit changes, session capture runs automatically

## Maintenance Cycle

Condition-based, not time-based. The system tells you what needs attention:

| Condition | Trigger | Action |
|-----------|---------|--------|
| Orphan insights | Any detected | /connect to link them |
| Dangling links | Any detected | Fix or create the target |
| Inbox pressure | Items >3 days old | /distill to process them |
| Observations accumulating | 10+ pending | /rethink to triage |
| Map too large | >40 insights | Split into sub-maps |

Run /arscontexta:next to see what needs attention based on current vault state.

## Batch Processing

For processing multiple sources:
1. /arscontexta:seed with each source → files to inbox
2. /arscontexta:ralph → orchestrates all phases with fresh context per phase
3. /arscontexta:tasks → monitor progress

See [[skills]] for command details. See [[configuration]] for pipeline settings.
