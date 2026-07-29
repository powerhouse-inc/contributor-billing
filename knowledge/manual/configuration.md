---
summary: How to adjust your system via config.yaml and /architect
type: manual
generated_from: "arscontexta-0.8.0"
---
# Configuration

## config.yaml

The live configuration file at knowledge/ops/config.yaml controls system behavior. Key fields:

```yaml
dimensions:
  granularity: moderate    # How detailed each insight is
  processing: moderate     # How deep the pipeline goes
  automation: full         # Hook and skill support level

processing:
  depth: standard          # deep | standard | quick
  chaining: suggested      # manual | suggested | automatic
```

Changes take effect next session.

## Using /architect

For guided configuration changes, run /arscontexta:architect. It analyzes your vault state, compares against knowledge/ops/derivation.md, and suggests research-backed adjustments.

## What Your Preset Includes

Your system was configured as a **product engineering** vault with:
- Moderate granularity (complete patterns and decisions per insight)
- 5 insight types: decision, idea, pattern, context, solution
- 3-tier navigation with topic maps
- Full automation (hooks, skills, queue management)
- Condition-based maintenance

## Feature Toggling

In knowledge/ops/config.yaml, set features to true/false:
- `semantic-search: false` — Enable with qmd for large vaults
- `processing-pipeline: true` — The core pipeline (keep on)

## Dimensions Explained

| Dimension | Your Setting | What It Means |
|-----------|-------------|---------------|
| Granularity | moderate | Each insight is a complete idea, not atomic sub-claims |
| Organization | flat | No folder hierarchy, wiki links handle navigation |
| Processing | moderate | Standard depth, not heavy academic extraction |
| Navigation | 3-tier | Hub → topic maps → insights |
| Automation | full | Hooks and skills handle structure enforcement |

See [[meta-skills]] for /architect details. See [[troubleshooting]] for config issues.
