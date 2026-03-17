---
engine_version: "0.2.0"
research_snapshot: "2026-02-10"
generated_at: "2026-03-17T00:00:00Z"
platform: claude-code
kernel_version: "1.0"

dimensions:
  granularity: moderate
  organization: flat
  linking: explicit+implicit
  processing: moderate
  navigation: 3-tier
  maintenance: condition-based
  schema: moderate
  automation: full

active_blocks:
  - wiki-links
  - processing-pipeline
  - schema
  - maintenance
  - self-evolution
  - methodology-knowledge
  - session-rhythm
  - templates
  - ethical-guardrails
  - helper-functions
  - graph-analysis
  - mocs

coherence_result: passed

vocabulary:
  notes: "knowledge/insights"
  inbox: "knowledge/inbox"
  archive: "knowledge/archive"
  ops: "knowledge/ops"

  note: "insight"
  note_plural: "insights"

  description: "summary"
  topics: "topics"
  relevant_notes: "related insights"

  topic_map: "map"
  hub: "hub"

  reduce: "distill"
  reflect: "connect"
  reweave: "revisit"
  verify: "validate"
  validate: "check"
  rethink: "rethink"

  cmd_reduce: "/distill"
  cmd_reflect: "/connect"
  cmd_reweave: "/revisit"
  cmd_verify: "/validate"
  cmd_rethink: "/rethink"

  extraction_categories:
    - name: "solutions"
      what_to_find: "Proven fixes for specific problems in the codebase"
      output_type: "solution"
    - name: "decisions"
      what_to_find: "Architecture choices with reasoning — why something was built this way"
      output_type: "decision"
    - name: "patterns"
      what_to_find: "Recurring structures, bugs, or technical debt signals"
      output_type: "pattern"
    - name: "ideas"
      what_to_find: "Feature possibilities and improvements for later"
      output_type: "idea"
    - name: "context"
      what_to_find: "How different parts of the system connect and depend on each other"
      output_type: "context"

platform_hints:
  context: single
  allowed_tools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "Agent"]
  semantic_search_tool: null

personality:
  warmth: neutral-helpful
  opinionatedness: neutral
  formality: professional
  emotional_awareness: task-focused
---
