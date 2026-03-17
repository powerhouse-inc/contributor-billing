---
summary: Deep guide to /ask, /architect, /rethink, and /remember
type: manual
generated_from: "arscontexta-0.8.0"
---
# Meta-Skills

Meta-skills operate on the system itself, not on your content. They help the knowledge system evolve.

## /arscontexta:ask

Query the bundled research knowledge base (249 methodology notes) plus your local knowledge/ops/methodology/.

```
/arscontexta:ask "why does my system use condition-based maintenance?"
/arscontexta:ask "how should I handle insights that span multiple topics?"
```

Two knowledge layers:
- **Local** (knowledge/ops/methodology/) — "How does MY system work?"
- **Research graph** — "Why is this a good idea in general?"

## /arscontexta:architect

Research-backed configuration advice. Analyzes your vault health, compares against derivation rationale, and proposes specific changes.

When to use:
- Unsure which feature addresses your friction
- Want to simplify but don't know what to remove
- A new area of the codebase needs different treatment

## /arscontexta:rethink

Reviews accumulated observations (knowledge/ops/observations/) and tensions (knowledge/ops/tensions/). For each, decides:
- **PROMOTE** to knowledge/insights/ — crystallized into a genuine insight
- **IMPLEMENT** — update the context file or methodology
- **ARCHIVE** — no longer relevant
- **KEEP PENDING** — not enough evidence yet

Triggered when: 10+ observations or 5+ tensions accumulate (surfaced by /next).

## /arscontexta:remember

Capture friction and methodology learnings immediately during work.

```
/arscontexta:remember "searching for editor patterns always fails because insights are titled as decisions"
```

This creates an observation in knowledge/ops/observations/ for future /rethink processing. Also detectable automatically from session transcripts.

## How Meta-Skills Relate

```
Work session → notice friction → /remember (or auto-detect)
                                      ↓
                              knowledge/ops/observations/
                                      ↓ (10+ accumulated)
                                  /rethink
                                      ↓
                        PROMOTE / IMPLEMENT / ARCHIVE
```

See [[configuration]] for threshold adjustments. See [[troubleshooting]] for drift issues.
