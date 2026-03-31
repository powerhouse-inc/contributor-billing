---
summary: ReactorClient.subscribe({}, handler) watches all document changes, enabling business rules that cascade actions across documents with re-entrancy guards
type: pattern
created: 2026-03-25
status: active
---

# cross-document subscriptions enable reactive automation

`client.subscribe({}, handler)` with an empty filter watches ALL document changes. Inside the handler, you can:

1. Filter by `DocumentChangeType` (Created, Updated, Deleted)
2. Inspect the changed document's state
3. Use `client.find()` to locate related documents
4. Use `client.rename()`, `client.execute()` etc. to trigger cascading actions

**Critical pattern: re-entrancy guard.** When your reaction modifies a document, it triggers the subscription again. Use a `let reacting = false` flag to skip handler execution while dispatching.

The saga recipe formalizes this into declared step definitions with `triggerActionType`, `triggerMatch()` predicate, `resolveTargetDocumentId()`, and `buildActions()` — linking all steps by a shared `saga_id` for traceability.

**Billing workflow application:** Expense report status changes to APPROVED → auto-create billing statement → auto-generate invoice. Each step traceable via saga_id.

Source: recipes/cross-document-reactor, recipes/saga

---

Relevant Insights:
- [[reactor-processors-run-post-ready-for-side-effects]] — processors are the other approach to reacting to operations
- [[consistency-tokens-guarantee-read-after-write]] — reads inside handlers need consistency awareness

Topics:
- [[reactor-patterns]]
- [[billing workflow]]
