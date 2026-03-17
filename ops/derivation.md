---
description: How this knowledge system was derived -- enables architect and reseed commands
created: 2026-03-17
engine_version: "1.0.0"
---

# System Derivation

## Configuration Dimensions
| Dimension | Position | Conversation Signal | Confidence |
|-----------|----------|--------------------|--------------------|
| Granularity | moderate | "best patterns that fix issues", "architecture decisions", "feature ideas" | High |
| Organization | flat | default -- engineering repo, single domain | Inferred |
| Linking | explicit+implicit | patterns connect to features, decisions connect to context | High |
| Processing | moderate | continuous work sessions producing decisions and patterns, not heavy research | High |
| Navigation | 3-tier | multiple knowledge areas: patterns, architecture, features, debt | High |
| Maintenance | condition-based | "always evolving product that always improves" -- needs freshness checks | High |
| Schema | moderate | structured enough for 5 insight types, not dense academic schema | High |
| Automation | full | Claude Code platform, user wants continuous improvement | High |

## Personality Dimensions
| Dimension | Position | Signal |
|-----------|----------|--------|
| Warmth | neutral-helpful | default -- engineering context |
| Opinionatedness | neutral | default |
| Formality | professional | default -- engineering context |
| Emotional Awareness | task-focused | default |

## Vocabulary Mapping
| Universal Term | Domain Term | Category |
|---------------|-------------|----------|
| notes | insights | folder |
| inbox | inbox | folder |
| archive | archive | folder |
| note (type) | insight | note type |
| note (plural) | insights | note type |
| reduce | distill | process phase |
| reflect | connect | process phase |
| reweave | revisit | process phase |
| verify | validate | process phase |
| validate | check | process phase |
| rethink | rethink | process phase |
| MOC | map | navigation |
| topic map | map | navigation |
| hub | hub | navigation |
| description | summary | schema field |
| topics | topics | schema field |
| relevant_notes | related insights | schema field |
| cmd_reduce | /distill | command |
| cmd_reflect | /connect | command |
| cmd_reweave | /revisit | command |
| cmd_verify | /validate | command |
| cmd_rethink | /rethink | command |

## Platform
- Tier: Claude Code
- Automation level: full
- Automation: full (default)

## Active Feature Blocks
- [x] wiki-links -- always included (kernel)
- [x] maintenance -- always included (always)
- [x] self-evolution -- always included (always)
- [x] methodology-knowledge -- always included (always)
- [x] session-rhythm -- always included (always)
- [x] templates -- always included (always)
- [x] ethical-guardrails -- always included (always)
- [x] helper-functions -- always included (always)
- [x] graph-analysis -- always included (always)
- [x] processing-pipeline -- active (moderate processing)
- [x] schema -- active (moderate schema)
- [x] atomic-notes -- excluded (moderate granularity, not atomic)
- [ ] semantic-search -- excluded (can enable later with qmd)
- [ ] multi-domain -- excluded (single repo focus)
- [x] mocs -- active (3-tier navigation)
- [ ] self-space-personality -- excluded (neutral-helpful default)

## Coherence Validation Results
- Hard constraints checked: 3. Violations: none
- Soft constraints checked: 5. Auto-adjusted: none. User-confirmed: none
- Compensating mechanisms active: moderate granularity + moderate processing is balanced; 3-tier navigation handles projected volume

## Failure Mode Risks
1. Collector's Fallacy -- capturing insights without connecting them (mitigated by connect phase)
2. Temporal Staleness -- codebase evolves, old insights become wrong (mitigated by revisit/validate cycle)
3. Schema Erosion -- skipping metadata fields over time (mitigated by validate-note hook)
4. Orphan Drift -- insights created but never linked to maps (mitigated by condition-based maintenance)

## Generation Parameters
- Folder names: insights, inbox, archive, self, ops, templates, manual
- Skills to generate: all 16 -- vocabulary-transformed
- Hooks to generate: session-orient, session-capture, validate-note, auto-commit
- Templates to create: insight-note, map, source-capture, observation
- Insight types: decision, idea, pattern, context, solution
