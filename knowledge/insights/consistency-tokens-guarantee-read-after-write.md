---
summary: IReactor returns ConsistencyToken from writes — pass to subsequent reads to guarantee they reflect the write, even if background indexing is behind
type: pattern
created: 2026-03-25
status: active
---

# consistency tokens guarantee read-after-write

The IReactor low-level API returns `ConsistencyToken` from write operations (via `JobAwaiter.waitForJob()`). Passing this token to subsequent reads ensures the read waits for indexing to catch up to at least that write position.

Two API levels demonstrate the trade-off:

**IReactor** (low-level): Manual token threading. `reactor.create()` returns JobInfo → `jobAwaiter.waitForJob()` returns completed job with `consistencyToken` → pass to `reactor.get(docId, undefined, token)`.

**IReactorClient** (high-level): Consistency handled automatically. `client.create()` returns the document directly, internally awaiting the job and managing tokens.

`getOperations()` also accepts tokens and returns different shapes: IReactor gives `Record<string, PagedResults>` (per-scope map), IReactorClient gives flat `PagedResults<Operation>`.

Source: recipes/document-snapshot-exporter

---

Relevant Insights:
- [[reactor-executeBatch-handles-dependency-ordering]] — batch jobs also return consistency tokens
- [[cross-document-subscriptions-enable-reactive-automation]] — reads inside subscription handlers benefit from tokens

Topics:
- [[reactor-patterns]]
