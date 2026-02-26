# upload-phd-documents

Uploads local `.phd` files to a Powerhouse switchboard. Works with **any** document type — auto-detects the type from the `.phd` header, creates a new document, replays all operations via `pushUpdates`, and verifies the final state.

## Requirements

- [Bun](https://bun.sh) runtime (Node.js is **not** supported)
- No external dependencies — uses only built-in modules (`node:zlib`, `node:fs`)

## Usage

```bash
bun scripts/upload-phd-documents/upload-phd-documents.ts <switchboard-url> <drive-id> <file.phd> [file2.phd ...]
```

### Examples

```bash
# Upload multiple documents
bun scripts/upload-phd-documents/upload-phd-documents.ts \
  http://localhost:4001 \
  preview-f80015b9 \
  "op hub.phd" \
  "oh service.phd"

# Upload a single document
bun scripts/upload-phd-documents/upload-phd-documents.ts \
  http://localhost:4001 \
  preview-f80015b9 \
  invoice.phd
```

## How it works

1. **Discover document types** — introspects the switchboard's GraphQL schema to find all available `_createDocument` mutations and maps them to document type IDs (e.g. `powerhouse/resource-template` → `ResourceTemplate_createDocument`).

2. **Read `.phd` files** — each `.phd` is a ZIP archive containing:
   - `header.json` — document ID, type, name, revision
   - `operations.json` — full operation history (global and local scopes)
   - `current-state.json` — expected final state for verification

3. **Create documents** — calls the type-specific `_createDocument` mutation to create an empty document in the target drive.

4. **Push operations** — replays all operations from the `.phd` file via `pushUpdates` on the drive endpoint (`/d/{driveId}`). Operations are pushed in batches of 50 with their original `index` and `skip` values preserved (important for correct state replay with compacted operation histories).

5. **Verify state** — queries the document's `stateJSON` and compares it against the `current-state.json` from the `.phd` file. Reports exact match or lists field-level differences.

## Output

```
Switchboard: http://localhost:4001
Drive:       preview-f80015b9
Files:       2

Discovering document types...
  Found 19 types: powerhouse/resource-template, powerhouse/service-offering, ...

────────────────────────────────────────────────────────────
  File:     op hub.phd
  Type:     powerhouse/resource-template
  Name:     Operational Hub
  Ops:      270 global, 0 local
  Creating ResourceTemplate document...
  Created:  <new-id>
    Pushing 270 global operations...
      [1/6] 50 ops -> revision 51
      ...
  Pushed:   270 operations
  Verifying state...
  State:    EXACT MATCH

============================================================
DONE
============================================================
  Uploaded:  2
  Failed:    0
  [OK] Operational Hub (powerhouse/resource-template) -> <id> (270 ops)
  [OK] OH Service (powerhouse/service-offering) -> <id> (1746 ops)
```

State mismatches (marked with `~`) are expected when uploading `.phd` files from an older schema version into a newer API — the operation reducers may produce slightly different output due to schema evolution.

## Notes

- API requests are rate-limited with a 200 ms delay between batches
- The script preserves original operation `index` and `skip` values — re-indexing from 0 would produce incorrect state for documents with compacted histories
- The switchboard URL can be provided with or without a trailing `/graphql`
