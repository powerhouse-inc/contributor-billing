---
summary: executeBatch resolves job dependencies automatically — parallel where possible, sequential where declared via dependsOn arrays
type: pattern
created: 2026-03-25
status: active
---

# reactor executeBatch handles dependency ordering

`reactor.executeBatch()` accepts a batch request with multiple jobs, each declaring `dependsOn: ["key1", "key2"]`. The reactor automatically:

1. Runs independent jobs in parallel (e.g., Budget and Scope simultaneously)
2. Holds dependent jobs until their dependencies complete (Project waits for both)
3. Propagates failures — if a dependency fails, dependent jobs fail too

Each job specifies: `key` (human-readable reference), `documentId`, `scope` ("document" or "global"), `branch`, `actions[]`, and `dependsOn[]`.

Progress tracking uses EventBus subscriptions to 5 event types: JOB_PENDING → JOB_RUNNING → JOB_WRITE_READY → JOB_READ_READY (or JOB_FAILED). JobAwaiter polls `reactor.getJobStatus()` for terminal state confirmation.

Source: recipes/batch-progress

---

Relevant Insights:
- [[reactor-processors-run-post-ready-for-side-effects]] — processors receive operations after batch jobs complete
- [[cross-document-subscriptions-enable-reactive-automation]] — subscriptions react to batch results

Topics:
- [[reactor-patterns]]
