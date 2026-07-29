---
summary: IProcessor handles side effects (webhooks, DB writes, notifications) after JOB_READ_READY, while IReadModel handles materialized views before it
type: pattern
created: 2026-03-25
status: active
---

# reactor processors run post-ready for side effects

The Reactor has two extension points for reacting to operations, split by when they execute relative to the JOB_READ_READY event:

**IReadModel** (pre-ready): `indexOperations()` completes BEFORE `JOB_READ_READY` fires. Use for materialized views that must be queryable immediately after a write — counters, search indexes, denormalized tables. Registered via `ReactorBuilder.withReadModel()`.

**IProcessor** (post-ready): `onOperations()` runs AFTER `JOB_READ_READY`. Use for side effects that don't need to be complete before reads return — webhooks, notifications, audit logging, saga dispatch. Registered via `processorManager.registerFactory()`.

Both receive `OperationWithContext[]` — the same data, different timing guarantees.

The factory pattern for processors returns `ProcessorRecord[]` with a `filter` (documentType, scope, branch) and `startFrom` ("beginning" for retroactive, "current" for new-only).

Source: recipes/custom-read-model, recipes/audit-trail, recipes/discord-webhook-processor

---

Relevant Insights:
- [[reactor-executeBatch-handles-dependency-ordering]] — batch operations interact with processor lifecycle

Topics:
- [[reactor-patterns]]
