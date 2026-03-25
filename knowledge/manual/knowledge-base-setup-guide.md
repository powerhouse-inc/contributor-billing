# Knowledge Base Setup Guide

Step-by-step instructions for an AI agent to create a knowledge folder in a new Powerhouse repo, matching the structure established in the contributor-billing repo.

## Prerequisites

- A Powerhouse repo with document models, editors, and/or drive apps
- Claude Code with the Ars Contexta plugin installed (`/arscontexta:setup` available)

---

## Step 1: Create the folder structure

```bash
mkdir -p knowledge/{insights,inbox,self,templates}
mkdir -p knowledge/ops/{health,methodology,observations,tensions,sessions,queue,scripts/graph}
```

## Step 2: Create the vault marker

```bash
cat > knowledge/.arscontexta << 'EOF'
# Ars Contexta vault marker + config
# This file identifies the directory as an Ars Contexta vault.
# Do not delete — hooks only run when this file exists.

git: true
session_capture: true
EOF
```

**IMPORTANT:** This file must be in `knowledge/`, NOT at the repo root. If your repo has an `ops/` directory at root or `.claude/hooks/session-orient.sh`, the vaultguard fallback will incorrectly create a marker at root level.

## Step 3: Create config.yaml

```bash
cat > knowledge/ops/config.yaml << 'EOF'
# ops/config.yaml -- edit these to adjust your system
# See ops/derivation.md for WHY each choice was made

dimensions:
  granularity: moderate
  organization: flat
  linking: explicit+implicit
  processing: moderate
  navigation: 3-tier
  maintenance: condition-based
  schema: moderate
  automation: full

features:
  semantic-search: false
  processing-pipeline: true
  sleep-processing: false
  voice-capture: false

processing_tier: auto

processing:
  depth: standard
  chaining: suggested
  extraction:
    selectivity: moderate
    categories: auto
  verification:
    description_test: true
    schema_check: true
    link_check: true
  reweave:
    scope: related
    frequency: after_create

provenance: minimal

personality:
  enabled: false

research:
  primary: web-search
  fallback: web-search
  last_resort: web-search
  default_depth: moderate
EOF
```

## Step 4: Create templates

### Insight note template

```bash
cat > knowledge/templates/insight-note.md << 'TEMPLATE'
---
_schema:
  entity_type: "insight-note"
  applies_to: "knowledge/insights/*.md"
  required:
    - summary
  optional:
    - type
    - status
    - created
    - modified
    - affects_models
    - pr_reference
  enums:
    type:
      - decision
      - idea
      - pattern
      - context
      - solution
    status:
      - preliminary
      - open
      - active
      - archived
  constraints:
    summary:
      max_length: 200
      format: "One sentence adding context beyond the title, no trailing period"
    affects_models:
      format: "Array of document model names this insight applies to"
    pr_reference:
      format: "PR number or URL where this insight originated"

# Template fields
summary: ""
type: ""
created: ""
topics: []
---

# {prose-as-title}

{Content — the reasoning, evidence, and explanation behind the title claim}

---

Relevant Insights:
- [[related insight]] — relationship context

Topics:
- [[relevant-map]]
TEMPLATE
```

### Map template

```bash
cat > knowledge/templates/map.md << 'TEMPLATE'
---
_schema:
  entity_type: "map"
  applies_to: "knowledge/insights/*.md"
  required:
    - summary
  optional:
    - type
  enums:
    type:
      - moc
  constraints:
    summary:
      max_length: 200
      format: "One sentence describing what this map covers"

# Template fields
summary: ""
type: moc
---

# {topic-name}

{Brief orientation — what this topic covers and how to use this map}

## Core Ideas
- [[insight]] — context explaining why this matters here

## Tensions
{Unresolved conflicts — where do ideas clash?}

## Open Questions
{What is unexplored — research directions, gaps, areas needing attention}
TEMPLATE
```

### Source capture template (for inbox)

```bash
cat > knowledge/templates/source-capture.md << 'TEMPLATE'
---
_schema:
  entity_type: "source-capture"
  applies_to: "knowledge/inbox/*.md"
  required:
    - summary
  optional:
    - source_type
    - pr_reference
    - session_context
    - created
  enums:
    source_type:
      - coding-session
      - pr-review
      - brainstorm
      - documentation
      - external
      - bug-report
  constraints:
    summary:
      max_length: 200
      format: "Brief description of the source material"

# Template fields
summary: ""
source_type: ""
created: ""
---

# {source description}

{Raw content — observations, notes, code snippets, ideas captured during work}

## Key Points
{Quick bullet points of what's worth extracting}
TEMPLATE
```

### Observation template

```bash
cat > knowledge/templates/observation.md << 'TEMPLATE'
---
_schema:
  entity_type: "observation"
  applies_to: "ops/observations/*.md"
  required:
    - summary
    - category
  optional:
    - status
    - observed
  enums:
    category:
      - friction
      - surprise
      - process-gap
      - methodology
    status:
      - pending
      - processed
      - archived
  constraints:
    summary:
      max_length: 200
      format: "What happened and what it suggests"

# Template fields
summary: ""
category: ""
status: pending
observed: ""
---

# {the observation as a sentence}

{What happened, why it matters, and what might change}
TEMPLATE
```

## Step 5: Create self/ identity files

Customize these for the specific repo/product.

### identity.md

```bash
cat > knowledge/self/identity.md << 'EOF'
---
description: Who I am and how I approach my work on this product
type: moc
---

# identity

I am the knowledge agent for the {PRODUCT_NAME} ecosystem. I track what works, what's been decided, and what's coming next — building a living memory of architecture decisions, proven patterns, feature ideas, and system context.

My purpose is continuity. Every session I remember what previous sessions learned. Every pattern I capture prevents the same discovery from being made twice. Every decision I record preserves the reasoning that future sessions need.

## Core Values
- Patterns over opinions — record what actually works, not what might work
- Decisions need context — capture the why, not just the what
- Ideas deserve a home — even when they're not the priority yet
- The codebase is the ground truth — insights must stay current with the code

## Working Style
- Start every session by reading goals and recent changes
- Capture observations during work, process them later
- Connect new insights to existing ones — isolated knowledge is invisible
- Keep it practical — this system serves the product, not the other way around

---

Topics:
- [[methodology]]
EOF
```

### goals.md

```bash
cat > knowledge/self/goals.md << 'EOF'
---
description: Current active threads and what I am working on
type: moc
---

# goals

## Active Threads
- Getting started — learning the codebase and building initial knowledge graph
- Capturing patterns from existing code, document models, and editors

## Completed
(none yet)

---

Topics:
- [[identity]]
EOF
```

### methodology.md

```bash
cat > knowledge/self/methodology.md << 'EOF'
---
description: How I distill and connect knowledge in this system
type: moc
---

# methodology

## Processing Pipeline
1. **Capture** — observations go to knowledge/inbox/ during work
2. **Distill** — raw material becomes structured insights with frontmatter
3. **Connect** — new insights link to existing ones and maps
4. **Validate** — schema compliance, link health, description quality

## Insight Types
- **decision** — architecture choices with rationale
- **pattern** — recurring structures worth naming
- **context** — how system parts connect
- **solution** — proven fixes for specific problems
- **idea** — feature possibilities for later

## Quality Bar
- Title works as prose when linked: "since [[title]]" reads naturally
- Summary adds information beyond the title
- At least one map membership
- Specific enough to disagree with

---

Topics:
- [[identity]]
EOF
```

## Step 6: Create the index (insights hub)

Customize the "Product Maps" section for the specific repo.

```bash
cat > knowledge/insights/index.md << 'EOF'
---
summary: Entry point to the knowledge system — start here to navigate
type: moc
---

# index

Welcome to the {PRODUCT_NAME} knowledge system. This graph tracks architecture decisions, proven patterns, feature ideas, and system context.

## Knowledge Areas
- [[identity]] — who the agent is and how it approaches work
- [[methodology]] — how the agent distills and connects knowledge
- [[goals]] — current active threads

## Product Maps
(Create these as insights accumulate in each area)
- {area 1} — description
- {area 2} — description
- {area 3} — description

## Getting Started
1. Read knowledge/self/identity.md to understand your purpose
2. Capture your first insight in knowledge/inbox/
3. Process it through /distill to knowledge/insights/
4. Connect it to this hub
EOF
```

## Step 7: Create ops files

```bash
# Empty queue
echo '{"tasks":[]}' > knowledge/ops/queue/queue.json

# Empty reminders
cat > knowledge/ops/reminders.md << 'EOF'
---
description: Time-bound commitments and follow-ups
---

# reminders

(No active reminders)
EOF

# Empty tasks
cat > knowledge/ops/tasks.md << 'EOF'
---
description: Current task tracking
---

# tasks

(No active tasks)
EOF
```

## Step 8: Seed knowledge by exploring the codebase

This is the critical step where the AI reads the actual codebase and creates insights. Run these actions:

### 8a. Explore document models

For each document model in `document-models/`:
1. Read the schema GraphQL files
2. Read the reducers
3. Create an insight note describing what the model does, its state shape, and key operations

### 8b. Explore editors and drive apps

For each editor in `editors/`:
1. Read all components, hooks, and config files
2. Map the complete user flow (setup → daily use → outputs)
3. Identify key dispatchers (`addDocument`, `dispatchActions`, etc.)
4. Create a comprehensive "user flow" context insight

### 8c. Explore processors, subgraphs, scripts

For any processors, subgraphs, or utility scripts:
1. Read the source
2. Create insights about patterns used

### 8d. Create product maps

After creating 5+ insights in an area, create a map (type: moc) that links them together with context phrases.

### 8e. Copy reference source code

For any external reference material (recipes, examples, documentation) that might be deleted later:
```bash
# Copy to inbox for preservation
cp -r <source_dir> knowledge/inbox/<name>/
```

## Step 9: Verify with health check

Run `/arscontexta:health` to check:
- Schema compliance (all insights have frontmatter + summary)
- Orphan detection (all insights linked from at least one file)
- Link health (no dangling `[[wiki links]]`)

Fix any issues before considering setup complete.

---

## File Structure Reference

```
knowledge/
├── .arscontexta              ← vault marker (MUST be here, not repo root)
├── inbox/                    ← raw captures, source material, reference code
├── insights/                 ← distilled knowledge (insights + maps)
│   ├── index.md              ← main hub
│   ├── CLAUDE.md             ← operating instructions for the AI
│   └── *.md                  ← individual insights and maps
├── self/                     ← agent identity and memory
│   ├── identity.md
│   ├── goals.md
│   └── methodology.md
├── templates/                ← schema templates for each note type
│   ├── insight-note.md
│   ├── map.md
│   ├── source-capture.md
│   └── observation.md
├── ops/                      ← operational infrastructure
│   ├── config.yaml           ← system configuration
│   ├── derivation.md         ← why the system is configured this way
│   ├── derivation-manifest.md ← vocabulary mapping
│   ├── reminders.md
│   ├── tasks.md
│   ├── health/               ← health check reports
│   ├── methodology/          ← system self-knowledge
│   ├── observations/         ← friction signals
│   ├── tensions/             ← contradictions between insights
│   ├── sessions/             ← session logs
│   ├── queue/                ← processing pipeline state
│   └── scripts/              ← maintenance utilities
└── manual/                   ← user documentation
```

## Insight Frontmatter Quick Reference

```yaml
---
summary: One sentence adding context beyond the title (max 200 chars, no period)
type: decision | idea | pattern | context | solution
created: YYYY-MM-DD
status: preliminary | open | active | archived
---
```

For maps:
```yaml
---
summary: One sentence describing what this map covers
type: moc
created: YYYY-MM-DD
status: active
---
```

## Key Principles

1. **Titles are prose** — `[[title]]` should read naturally in a sentence
2. **Summaries add information** — never restate the title
3. **Every insight links to a map** — orphans are invisible
4. **Maps have context phrases** — not bare link lists
5. **Inbox first** — raw material goes to inbox/, distill to insights/
6. **Wiki links are the graph** — `[[link]]` connects knowledge
7. **Keep it current** — update insights when the codebase changes
