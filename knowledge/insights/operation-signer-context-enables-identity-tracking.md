---
summary: Operations carry ActionSigner context (wallet address, network, chain, app) at operation.action.context.signer — enabling audit trails, rate limiting, and signature verification
type: pattern
created: 2026-03-25
status: active
---

# operation signer context enables identity tracking

Every signed operation in the Reactor carries an `ActionSigner` at `operation.action.context.signer` with:

- **user**: `address` (e.g., EIP-155 format), `networkId`, `chainId`
- **app**: `name`, `key` (public key or DID)
- **signatures**: cryptographic signature tuples `[timestamp, publicKey, actionHash, prevStateHash, signature]`

This enables three recipe patterns:

1. **Audit trail** — Extract signer context, persist to database, query by user/document/time
2. **Rate limiting** — Count operations per `signer.user.address` in sliding windows, block on threshold
3. **Signature verification** — Verify with `verifyOperationSignature()` (low-level hex key) or `createSignatureVerifier()` (high-level DID)

Operations WITHOUT a signer are silently skipped by all three patterns — signing is opt-in per operation.

Signing uses ECDSA P-256 + SHA-256 via Renown SDK: `RenownCryptoSigner`, `RenownCryptoBuilder`, `MemoryKeyStorage`.

Source: recipes/audit-trail, recipes/rate-limiter, recipes/signed-operations-verifier

---

Relevant Insights:
- [[reactor-processors-run-post-ready-for-side-effects]] — audit trail and rate limiter are processor implementations

Topics:
- [[reactor-patterns]]
