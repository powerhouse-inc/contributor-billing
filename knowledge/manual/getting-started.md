---
summary: First session guide — creating your first insight and building connections
type: manual
generated_from: "arscontexta-0.8.0"
---
# Getting Started

## Your First Session

When you start a session, the orient hook runs automatically, showing you vault state — insight count, inbox items, and any conditions needing attention.

Read knowledge/self/identity.md and knowledge/self/goals.md to understand your context.

## Creating Your First Insight

1. Capture something in knowledge/inbox/ — an observation from a coding session, a pattern you noticed, a decision you made
2. Run /arscontexta:distill to extract it into a structured insight in knowledge/insights/
3. The distill process gives it a prose-as-title, summary, type, and proper schema

Example: You notice that document model reducers must be pure synchronous functions. Capture that observation, then distill it into an insight titled "reducer timestamps must come from action input because Date.now breaks determinism."

## How Connections Work

Every insight links to related insights via [[wiki links]]. When you write `since [[reducer timestamps must come from action input]]`, you're creating a graph edge.

Maps organize insights by topic — "reducer patterns", "editor architecture", etc. Every insight should appear in at least one map.

## The Session Rhythm

1. **Orient** — Read knowledge/self/, check conditions
2. **Work** — Focus on one task
3. **Persist** — Update goals, commit changes

## Next Steps

- Read [[workflows]] to understand the full pipeline
- Read [[skills]] to see all available commands
- Run /arscontexta:tutorial for a guided walkthrough
