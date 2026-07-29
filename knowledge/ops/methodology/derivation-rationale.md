---
description: Why each configuration dimension was chosen — the reasoning behind initial system setup
category: derivation-rationale
created: 2026-03-17
status: active
---
# derivation rationale for contributor-billing

This knowledge system was derived for the Powerhouse contributor-billing ecosystem — a repository containing 7 document models, 7+ editors, processors, and subgraphs for contributor billing and invoicing workflows.

## Domain and Purpose

The user needs a system to support continuous work on this repo and evolve it into a production service. The focus is on capturing architecture decisions, proven patterns that fix issues, feature ideas for future development, and context about how different parts of the system connect. The system serves as a living memory that always improves the product.

## Dimension Choices

**Moderate granularity** — The user described wanting to track "best patterns that fix issues" and "new features." These are complete ideas, not atomic sub-claims. A pattern like "reducer timestamps must come from action input" is one insight, not three. This matches moderate granularity where each insight stands alone as a useful unit.

**Flat organization** — Single repository focus. No need for folder hierarchies when wiki links handle all navigation. The insights/ folder stays flat; maps provide the structure.

**Explicit+implicit linking** — Architecture decisions connect to the patterns they enable. Feature ideas connect to the technical debt that motivates them. Both deliberate connections (written during distill) and discoverable connections (found during connect) matter.

**Moderate processing** — This isn't academic research requiring heavy extraction. It's working knowledge from coding sessions, PRs, and brainstorming. Standard depth processing handles the volume and type.

**3-tier navigation** — The product has distinct knowledge areas: reducer patterns, editor architecture, billing workflow, production readiness, type safety, feature backlog. Each warrants its own map for navigation.

**Full automation** — Claude Code platform. The user wants continuous improvement with minimal ceremony. Full hook and skill support from day one.

**Moderate schema** — Five insight types (decision, idea, pattern, context, solution) provide useful querying without dense academic metadata. Fields serve retrieval, not bureaucracy.

**Condition-based maintenance** — The codebase moves fast. Time-based maintenance would be either too frequent or too rare. Condition-based triggers respond to actual state: orphans, stale insights, inbox pressure.

## Platform

Claude Code with full automation. All 16 skills vocabulary-transformed. Hooks for session orient, capture, validation, and auto-commit.

## Risk Mitigations

- **Collector's Fallacy** — High risk for engineering repos where "capture everything" feels productive. Mitigated by the connect phase requiring every insight to link.
- **Temporal Staleness** — High risk because the codebase evolves fast. Mitigated by revisit/validate cycle and condition-based freshness checks.
- **Schema Erosion** — Moderate risk during fast coding sessions. Mitigated by validate-note hook on write.
- **Orphan Drift** — Moderate risk during work sessions. Mitigated by condition-based orphan detection.

---

Topics:
- [[methodology]]
