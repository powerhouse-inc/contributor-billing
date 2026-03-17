---
summary: Complete reference for every available command
type: manual
generated_from: "arscontexta-0.8.0"
---
# Skills

## Processing Skills

| Command | Purpose | Example |
|---------|---------|---------|
| /arscontexta:distill | Extract insights from source material | `/arscontexta:distill inbox/pr-review-notes.md` |
| /arscontexta:connect | Find connections between insights | `/arscontexta:connect "reducer patterns map"` |
| /arscontexta:revisit | Refresh old insights with new context | `/arscontexta:revisit "oldest 5 insights"` |
| /arscontexta:validate | Verify insight quality (summary, schema, links) | `/arscontexta:validate insights/` |
| /arscontexta:check | Schema and link validation | `/arscontexta:check` |

## Orchestration Skills

| Command | Purpose | Example |
|---------|---------|---------|
| /arscontexta:seed | Initialize processing from a source | `/arscontexta:seed "article about document models"` |
| /arscontexta:ralph | Orchestrated batch processing | `/arscontexta:ralph` |
| /arscontexta:pipeline | Full pipeline execution | `/arscontexta:pipeline inbox/session-notes.md` |
| /arscontexta:tasks | Queue management | `/arscontexta:tasks status` |

## Navigation Skills

| Command | Purpose | Example |
|---------|---------|---------|
| /arscontexta:stats | Vault statistics | `/arscontexta:stats` |
| /arscontexta:analyze | Graph analysis | `/arscontexta:analyze triangles` |
| /arscontexta:next | Intelligent next-action recommendations | `/arscontexta:next` |

## Growth Skills

| Command | Purpose | Example |
|---------|---------|---------|
| /arscontexta:learn | Research a topic and grow the graph | `/arscontexta:learn "document model best practices"` |
| /arscontexta:remember | Capture friction and methodology learnings | `/arscontexta:remember "search for reducer patterns failed"` |

## Evolution Skills

| Command | Purpose | Example |
|---------|---------|---------|
| /arscontexta:rethink | Review accumulated observations and tensions | `/arscontexta:rethink` |
| /arscontexta:refactor | Restructure vault architecture | `/arscontexta:refactor` |

## Plugin Commands

| Command | Purpose |
|---------|---------|
| /arscontexta:ask | Query the methodology knowledge base |
| /arscontexta:architect | Get research-backed configuration advice |
| /arscontexta:health | Run vault health diagnostics |
| /arscontexta:help | See all available commands |
| /arscontexta:tutorial | Interactive walkthrough |

See [[workflows]] for how skills chain together.
