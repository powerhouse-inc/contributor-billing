# download-drive-documents

Downloads all documents from a Powerhouse switchboard as `.phd` files, preserving the drive's folder hierarchy.

## Requirements

- [Bun](https://bun.sh) runtime (Node.js is **not** supported)
- No external dependencies — uses only built-in modules (`node:zlib`, `node:fs`, `node:path`)

## Usage

```bash
# Download all documents from all drives
bun scripts/download-drive-documents.ts <switchboard-url>

# Download documents from a specific drive
bun scripts/download-drive-documents.ts <switchboard-url> <drive-id>
```

The switchboard URL can include or omit the `/graphql` suffix — both forms work.

### Examples

```bash
# All drives on dev
bun scripts/download-drive-documents.ts https://switchboard-dev.powerhouse.xyz

# Specific drive on staging
bun scripts/download-drive-documents.ts https://switchboard-staging.powerhouse.xyz powerhouse-network-admin-1
```

## Output

Files are saved to `./downloads/<drive-name>/`, mirroring the drive's folder structure:

```
./downloads/
  My Drive/
    document-a.phd
    Reports/
      document-b.phd
```

Each `.phd` file is a ZIP archive containing:

| File               | Description                                    |
| ------------------ | ---------------------------------------------- |
| `header.json`      | Document metadata (id, type, revision, timestamps) |
| `state.json`       | Initial empty state                            |
| `current-state.json` | Current document state from the API `stateJSON` |
| `operations.json`  | Full operation history (paginated via `first`/`skip`) |

## How it works

1. **Discover drives** — queries `{ drives }` at the switchboard's `/graphql` endpoint to list all drive IDs (or uses the one you specified).
2. **Fetch drive info** — for each drive, queries the drive-specific endpoint (`/d/<driveId>`) to get the drive name, folder tree, and file list.
3. **Download documents** — for each file node, fetches the full document including `stateJSON` and all operations (paginated in batches of 100).
4. **Create .phd files** — packages each document into a ZIP with the four JSON files described above.
5. **Verify** — reads back each saved `.phd`, extracts `current-state.json`, and compares its `global` field against the API's `stateJSON` to confirm integrity.
6. **Warn on empty state** — flags any documents where `stateJSON` is null or empty.

API requests are rate-limited with a 300ms delay between calls.

## Verbose output

The script logs detailed progress including:

- Drive metadata (name, slug, node counts)
- Folder structure
- Per-document fetch status, file size, and operation count
- Post-save verification result (OK or mismatch details)
- Warnings for documents with empty state
- Per-drive and global summaries with failure reasons
