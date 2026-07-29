---
summary: Map of Reactor integration patterns learned from the official Powerhouse recipes — processors, read models, subscriptions, sagas, consistency
type: moc
created: 2026-03-25
status: active
---

# reactor-patterns

Patterns for extending the Powerhouse Reactor, distilled from the 13 official recipes in `recipes/`.

## Core Ideas

- [[reactor-processors-run-post-ready-for-side-effects]] — the fundamental IProcessor vs IReadModel split determines when your code runs relative to read consistency
- [[reactor-executeBatch-handles-dependency-ordering]] — batch operations with automatic parallel/sequential resolution replace manual job orchestration
- [[cross-document-subscriptions-enable-reactive-automation]] — subscribe-and-react pattern for business rules that cascade across documents, with saga formalization for traceability
- [[consistency-tokens-guarantee-read-after-write]] — the mechanism ensuring reads reflect prior writes, with two API levels (IReactor manual vs IReactorClient automatic)
- [[operation-signer-context-enables-identity-tracking]] — the ActionSigner context carried by operations enables audit, rate limiting, and verification

## Recipe Categories

**Database processors** (Kysely + PostgreSQL):
- audit-trail, full-text-search, relational-db-subgraph, saga — all extend IProcessor with DB persistence

**Event-driven automation**:
- cross-document-reactor (subscribe + react), saga (declared step chains), batch-progress (EventBus lifecycle)

**Monitoring & debugging**:
- sync-health-monitor (health dashboard), subscription-cli (live tail), document-snapshot-exporter (backup)

**Security & compliance**:
- signed-operations-verifier (ECDSA verification), audit-trail (who-did-what), rate-limiter (abuse prevention)

## Open Questions

- How do processors handle Reactor restarts? `startFrom: "beginning"` replays all ops — what about idempotency?
- Can subscriptions and processors compose? (e.g., processor writes to DB, subscription reads from it)
- What's the performance ceiling for processors on high-throughput drives?

## Billing Workflow Application

The contributor-billing pipeline (expense-report → billing-statement → invoice) maps naturally to:
1. **Saga pattern** for the full chain with traceability
2. **Audit trail** for compliance (who approved what)
3. **Full-text search** for finding expense reports across drives
4. **Discord webhook** for team notifications on approvals
