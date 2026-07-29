---
summary: 13 Reactor recipe patterns from the official Powerhouse recipes repo — processors, read models, sagas, subscriptions, and CLI tools
source_type: documentation
created: 2026-03-25
---

# Powerhouse Recipes — Full Catalog

Source: `/home/p/Powerhouse/demos/contributor-billing/recipes/`

## Key Points
- 13 recipes demonstrating Reactor integration patterns
- Core abstraction: IProcessor (post-operation side effects) vs IReadModel (pre-ready materialized views)
- All DB recipes use Kysely for type-safe SQL with PostgreSQL
- Factory pattern for processor registration via `processorManager.registerFactory()`
- Operations carry `OperationWithContext` with signer identity, document type, scope, branch

---

## Recipe Summaries

### 1. audit-trail
Processor that captures cryptographic signer context (wallet address, network, chain ID) from every signed operation and persists to PostgreSQL. Exposes GraphQL queries by user, document, or time range. Uses `operation.action.context.signer` for identity extraction. Batch inserts for efficiency. PGlite for tests.

### 2. batch-progress
Demonstrates `reactor.executeBatch()` for atomic multi-document creation with dependency ordering. Budget + Scope run parallel, Project waits for both, Drive waits for Project. Real-time progress via EventBus subscription to JOB_PENDING/RUNNING/WRITE_READY/READ_READY/FAILED events. JobAwaiter for terminal state polling.

### 3. cross-document-reactor
Event-driven automation: subscribe to all document changes via `client.subscribe({}, handler)`, implement business rules as filters. Demo: invoice marked PAID triggers task CLOSED. Uses re-entrancy guard flag to prevent infinite loops. Key APIs: ReactorClientBuilder, client.find(), client.rename().

### 4. custom-read-model
Simplest IReadModel — in-memory Map counting operations by document type. Demonstrates pre-ready guarantee: read model completes before JOB_READ_READY fires. Registered via `ReactorBuilder.withReadModel()`. IReadModel vs IProcessor: read models run pre-ready (materialized views), processors run post-ready (side effects).

### 5. discord-webhook-processor
IProcessor that formats operations as Discord embeds and POSTs to webhook. Batches (Discord max 10 embeds/request). HMAC-SHA256 signing via X-Reactor-Signature header. Configurable filter by documentType, scope, branch. startFrom: "current" (new ops only).

### 6. document-snapshot-exporter
CLI comparing two API levels: IReactor (low-level, manual consistency tokens, per-scope operation maps) vs IReactorClient (high-level, automatic consistency, flat operations). Consistency tokens guarantee read-after-write: token captures write position, reads wait for indexing to catch up.

### 7. full-text-search
Processor that flattens document state to text, upserts to PostgreSQL with tsvector. GIN index for fast search. ts_rank() + plainto_tsquery() for relevance ranking. Deduplicates operations per document (keeps latest). Handles DELETE_DOCUMENT by removing from index. 100K char cap.

### 8. rate-limiter
Pairs RateLimiterProcessor (counts ops per signer address in sliding window) with AuthService (gate checking isAllowed()). Configurable: maxOperations, windowMs, cooldownMs. Returns retryAfterMs for client guidance. Operations without signer silently skipped.

### 9. relational-db-subgraph
Extends RelationalDbProcessor for denormalized document catalog with tags. Kysely migrations for documents + document_tags tables. GraphQL subgraph with queries: documents, documentById, documentsByType, documentsByTag. Tag sync via delete/re-insert.

### 10. saga
Distributed saga coordination: operations on doc A trigger actions on doc B, linked by saga_id in saga_log table. Steps defined declaratively: triggerActionType, triggerMatch() predicate, resolveTargetDocumentId(), buildActions(). Re-entrancy guard prevents infinite loops. Dispatches via IReactor.execute().

### 11. signed-operations-verifier
Standalone demo: build ECDSA P-256 signed operations, verify signatures, detect tampering. Signature tuple: [timestamp, publicKey, actionHash, prevStateHash, signature]. Two verification paths: low-level verifyOperationSignature() with hex key, high-level createSignatureVerifier() with DID format.

### 12. subscription-cli
CLI tool: connects to Reactor GraphQL subscriptions via WebSocket. Filters by document type, parent ID, job ID. Real-time document change monitoring. Uses graphql-ws library. Optional Bearer auth. SIGINT clean shutdown.

### 13. sync-health-monitor
Subscribes to 5 sync event types: SYNC_PENDING, SYNC_SUCCEEDED, SYNC_FAILED, DEAD_LETTER_ADDED, CONNECTION_STATE_CHANGED. Health status: healthy (all connected, failure ratio <=10%), degraded (disconnected/reconnecting, ratio >10%), unhealthy (error state). GraphQL subgraph for metrics.

---

## Common Patterns Across All Recipes

- **IProcessor**: `onOperations(ops: OperationWithContext[])` + `onDisconnect()` — post-ready side effects
- **IReadModel**: `indexOperations(ops: OperationWithContext[])` — pre-ready materialized views
- **ProcessorFactory**: factory function returning ProcessorRecord[] with filter and startFrom
- **OperationWithContext**: operation + context (documentId, documentType, scope, branch, ordinal)
- **ReactorBuilder**: fluent builder for reactor with `.withDocumentModels()`, `.withReadModel()`
- **ReactorClientBuilder**: wraps ReactorBuilder, adds convenience (auto-consistency, direct returns)
- **JobAwaiter**: polls `reactor.getJobStatus()` via EventBus subscription
- **EventBus**: subscribe to ReactorEventTypes (JOB_*, SYNC_*) for lifecycle hooks
- **Kysely**: type-safe SQL query builder for all DB recipes
- **graphql-yoga**: GraphQL server for subgraph recipes

## Billing Workflow Relevance

| Recipe | Application |
|--------|-------------|
| cross-document-reactor | Expense report approved → auto-create billing statement |
| saga | Full chain: expense-report → billing-statement → invoice with traceability |
| audit-trail | Compliance: who approved what expense, when |
| subscription-cli | Debug drive changes during development |
| document-snapshot-exporter | Backup with consistency guarantees (replaces manual download.sh) |
| discord-webhook | Team notifications on expense report submissions |
| rate-limiter | Protect API from bulk operations abuse |
| full-text-search | Search across all expense reports, invoices, billing statements |
