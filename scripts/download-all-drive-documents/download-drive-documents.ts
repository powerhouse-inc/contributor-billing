#!/usr/bin/env bun
/**
 * Download all documents from a Powerhouse switchboard as .phd files.
 *
 * REQUIRES: Bun runtime (https://bun.sh) — Node.js is NOT supported.
 *
 * Usage:
 *   bun scripts/download-drive-documents.ts <switchboard-url> [drive-id]
 *
 * Examples:
 *   # Download all documents from all drives
 *   bun scripts/download-drive-documents.ts https://switchboard-dev.powerhouse.xyz
 *
 *   # Download documents from a specific drive
 *   bun scripts/download-drive-documents.ts https://switchboard-dev.powerhouse.xyz layer-resources-drive
 *
 * Output structure:
 *   ./downloads/<drive-name>/
 *     ├── document-a.phd
 *     ├── FolderName/
 *     │   └── document-b.phd
 *     └── ...
 *
 * The .phd files are ZIP archives containing:
 *   - header.json       — document metadata (id, type, timestamps)
 *   - state.json        — initial empty state
 *   - current-state.json — current document state
 *   - operations.json   — operation history (global scope)
 *
 * No external dependencies required — uses only Node.js built-in modules.
 */

import { deflateRawSync, inflateRawSync } from "node:zlib";
import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DriveInfo {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

interface FileNode {
  id: string;
  name: string;
  kind: "file";
  documentType: string;
  parentFolder: string | null;
}

interface FolderNode {
  id: string;
  name: string;
  kind: "folder";
  parentFolder: string | null;
}

type DriveNode = FileNode | FolderNode;

interface GqlOperation {
  id: string;
  type: string;
  index: number;
  timestampUtcMs: string;
  hash: string;
  skip: number | null;
  inputText: string | null;
  error: string | null;
}

interface GqlDocument {
  id: string;
  name: string;
  documentType: string;
  revision: number;
  createdAtUtcIso: string;
  lastModifiedAtUtcIso: string;
  operations: GqlOperation[];
  stateJSON: unknown;
}

// ---------------------------------------------------------------------------
// Minimal ZIP implementation (DEFLATE, no external deps)
// ---------------------------------------------------------------------------

function crc32(buf: Buffer): number {
  // Standard CRC-32 lookup table
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createZipBuffer(files: Map<string, string>): Buffer {
  const entries: {
    name: Buffer;
    data: Buffer;
    compressed: Buffer;
    crc: number;
    offset: number;
  }[] = [];
  let offset = 0;
  const localHeaders: Buffer[] = [];

  for (const [name, content] of files) {
    const nameBytes = Buffer.from(name, "utf-8");
    const data = Buffer.from(content, "utf-8");
    const compressed = deflateRawSync(data);
    const crc = crc32(data);

    // Local file header (30 bytes + name + compressed data)
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); // signature
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0, 6); // flags
    local.writeUInt16LE(8, 8); // compression: DEFLATE
    local.writeUInt16LE(0, 10); // mod time
    local.writeUInt16LE(0, 12); // mod date
    local.writeUInt32LE(crc, 14); // crc-32
    local.writeUInt32LE(compressed.length, 18); // compressed size
    local.writeUInt32LE(data.length, 22); // uncompressed size
    local.writeUInt16LE(nameBytes.length, 26); // filename length
    local.writeUInt16LE(0, 28); // extra length

    entries.push({ name: nameBytes, data, compressed, crc, offset });
    localHeaders.push(local, nameBytes, compressed);
    offset += 30 + nameBytes.length + compressed.length;
  }

  // Central directory
  const centralDir: Buffer[] = [];
  let centralSize = 0;
  const centralOffset = offset;

  for (const entry of entries) {
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); // signature
    central.writeUInt16LE(20, 4); // version made by
    central.writeUInt16LE(20, 6); // version needed
    central.writeUInt16LE(0, 8); // flags
    central.writeUInt16LE(8, 10); // compression: DEFLATE
    central.writeUInt16LE(0, 12); // mod time
    central.writeUInt16LE(0, 14); // mod date
    central.writeUInt32LE(entry.crc, 16); // crc-32
    central.writeUInt32LE(entry.compressed.length, 20); // compressed size
    central.writeUInt32LE(entry.data.length, 24); // uncompressed size
    central.writeUInt16LE(entry.name.length, 28); // filename length
    central.writeUInt16LE(0, 30); // extra length
    central.writeUInt16LE(0, 32); // comment length
    central.writeUInt16LE(0, 34); // disk start
    central.writeUInt16LE(0, 36); // internal attrs
    central.writeUInt32LE(0, 38); // external attrs
    central.writeUInt32LE(entry.offset, 42); // local header offset

    centralDir.push(central, entry.name);
    centralSize += 46 + entry.name.length;
  }

  // End of central directory
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // signature
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // start disk
  eocd.writeUInt16LE(entries.length, 8); // entries on disk
  eocd.writeUInt16LE(entries.length, 10); // total entries
  eocd.writeUInt32LE(centralSize, 12); // central dir size
  eocd.writeUInt32LE(centralOffset, 16); // central dir offset
  eocd.writeUInt16LE(0, 20); // comment length

  return Buffer.concat([...localHeaders, ...centralDir, eocd]);
}

/**
 * Read a single file entry from a ZIP buffer by name.
 * Returns the decompressed content as a Buffer, or null if not found.
 */
function readZipEntry(zipBuf: Buffer, entryName: string): Buffer | null {
  let offset = 0;
  while (offset + 30 <= zipBuf.length) {
    const sig = zipBuf.readUInt32LE(offset);
    if (sig !== 0x04034b50) break; // not a local file header

    const compressionMethod = zipBuf.readUInt16LE(offset + 8);
    const compressedSize = zipBuf.readUInt32LE(offset + 18);
    const nameLen = zipBuf.readUInt16LE(offset + 26);
    const extraLen = zipBuf.readUInt16LE(offset + 28);

    const nameStart = offset + 30;
    const name = zipBuf
      .subarray(nameStart, nameStart + nameLen)
      .toString("utf-8");
    const dataStart = nameStart + nameLen + extraLen;
    const dataEnd = dataStart + compressedSize;

    if (name === entryName) {
      const raw = zipBuf.subarray(dataStart, dataEnd);
      if (compressionMethod === 8) {
        // DEFLATE
        return Buffer.from(inflateRawSync(raw));
      }
      // stored (method 0) — return as-is
      return Buffer.from(raw);
    }

    offset = dataEnd;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Verification
// ---------------------------------------------------------------------------

interface VerifyResult {
  valid: boolean;
  reason?: string;
}

function verifyPhdFile(
  filePath: string,
  expectedStateJSON: unknown,
): VerifyResult {
  const zipBuf = fs.readFileSync(filePath);
  const currentStateBuf = readZipEntry(zipBuf, "current-state.json");
  if (!currentStateBuf) {
    return { valid: false, reason: "current-state.json not found in .phd" };
  }

  let savedState: { global?: unknown };
  try {
    savedState = JSON.parse(currentStateBuf.toString("utf-8"));
  } catch {
    return { valid: false, reason: "Failed to parse current-state.json" };
  }

  const savedGlobal = JSON.stringify(savedState.global ?? {});
  const expectedGlobal = JSON.stringify(expectedStateJSON ?? {});

  if (savedGlobal === expectedGlobal) {
    return { valid: true };
  }

  return {
    valid: false,
    reason: `State mismatch — saved global has ${savedGlobal.length} chars, API stateJSON has ${expectedGlobal.length} chars`,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const REQUEST_DELAY_MS = 300;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalize the base URL: strip trailing slashes and common suffixes like
 * "/graphql" so that both "https://sb.xyz" and "https://sb.xyz/graphql" work.
 */
function normalizeBaseUrl(raw: string): string {
  return raw.replace(/\/+$/, "").replace(/\/graphql$/i, "");
}

async function gqlQuery<T>(
  endpoint: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    let body = "";
    try {
      body = await res.text();
    } catch {
      /* ignore */
    }
    const detail = body ? `\n  Response: ${body.slice(0, 500)}` : "";
    throw new Error(
      `GraphQL request failed: ${res.status} ${res.statusText} (${endpoint})${detail}`,
    );
  }

  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new Error(
      `GraphQL errors:\n${json.errors.map((e) => `  - ${e.message}`).join("\n")}`,
    );
  }

  if (!json.data) {
    throw new Error("No data returned from GraphQL query");
  }

  return json.data;
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

async function fetchDrives(baseUrl: string): Promise<string[]> {
  const data = await gqlQuery<{ drives: string[] }>(
    `${baseUrl}/graphql`,
    `{ drives }`,
  );
  return data.drives;
}

async function fetchDriveInfo(
  baseUrl: string,
  driveId: string,
): Promise<{ drive: DriveInfo; nodes: DriveNode[] }> {
  const data = await gqlQuery<{
    drive: DriveInfo;
    driveDocument: {
      state: { name: string; icon: string | null; nodes: DriveNode[] };
    };
  }>(
    `${baseUrl}/d/${driveId}`,
    `{
      drive { id name slug icon }
      driveDocument {
        state {
          name icon
          nodes {
            ... on DocumentDrive_FileNode {
              id name kind documentType parentFolder
            }
            ... on DocumentDrive_FolderNode {
              id name kind parentFolder
            }
          }
        }
      }
    }`,
  );

  return {
    drive: data.drive,
    nodes: data.driveDocument.state.nodes,
  };
}

async function fetchDocument(
  baseUrl: string,
  driveId: string,
  docId: string,
): Promise<GqlDocument> {
  // First fetch document metadata + stateJSON + first batch of operations
  const BATCH_SIZE = 100;
  const data = await gqlQuery<{ document: GqlDocument }>(
    `${baseUrl}/d/${driveId}`,
    `query ($id: String!, $first: Int, $skip: Int) {
      document(id: $id) {
        id name documentType revision
        createdAtUtcIso lastModifiedAtUtcIso
        operations(first: $first, skip: $skip) {
          id type index timestampUtcMs hash skip inputText error
        }
        stateJSON
      }
    }`,
    { id: docId, first: BATCH_SIZE, skip: 0 },
  );

  const doc = data.document;
  const allOps = [...doc.operations];

  // Paginate through remaining operations if first batch was full
  while (allOps.length > 0 && allOps.length % BATCH_SIZE === 0) {
    await sleep(REQUEST_DELAY_MS);
    const moreData = await gqlQuery<{
      document: { operations: GqlOperation[] };
    }>(
      `${baseUrl}/d/${driveId}`,
      `query ($id: String!, $first: Int, $skip: Int) {
        document(id: $id) {
          operations(first: $first, skip: $skip) {
            id type index timestampUtcMs hash skip inputText error
          }
        }
      }`,
      { id: docId, first: BATCH_SIZE, skip: allOps.length },
    );

    const batch = moreData.document.operations;
    if (batch.length === 0) break;
    allOps.push(...batch);
  }

  doc.operations = allOps;
  return doc;
}

// ---------------------------------------------------------------------------
// Folder path resolution
// ---------------------------------------------------------------------------

function buildFolderPaths(nodes: DriveNode[]): Map<string, string> {
  const folders = nodes.filter(
    (n): n is FolderNode => n.kind === "folder",
  );

  const folderMap = new Map<string, FolderNode>();
  for (const f of folders) {
    folderMap.set(f.id, f);
  }

  const pathCache = new Map<string, string>();

  function resolve(folderId: string): string {
    if (pathCache.has(folderId)) return pathCache.get(folderId)!;

    const folder = folderMap.get(folderId);
    if (!folder) return "";

    const parentPath = folder.parentFolder ? resolve(folder.parentFolder) : "";
    const fullPath = parentPath
      ? path.join(parentPath, sanitize(folder.name))
      : sanitize(folder.name);
    pathCache.set(folderId, fullPath);
    return fullPath;
  }

  for (const f of folders) {
    resolve(f.id);
  }

  return pathCache;
}

function getNodePath(
  node: DriveNode,
  folderPaths: Map<string, string>,
): string {
  if (!node.parentFolder) return "";
  return folderPaths.get(node.parentFolder) ?? "";
}

function sanitize(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "unnamed";
}

// ---------------------------------------------------------------------------
// .phd file creation
// ---------------------------------------------------------------------------

function gqlOperationToInternal(op: GqlOperation, scope: string) {
  let input: unknown = {};
  if (op.inputText) {
    try {
      input = JSON.parse(op.inputText);
    } catch {
      input = op.inputText;
    }
  }

  return {
    id: op.id,
    index: op.index,
    skip: op.skip ?? 0,
    hash: op.hash,
    timestampUtcMs: op.timestampUtcMs,
    error: op.error ?? undefined,
    action: {
      id: op.id,
      type: op.type,
      timestampUtcMs: op.timestampUtcMs,
      input,
      scope,
    },
  };
}

function createPhdFile(doc: GqlDocument): Buffer {
  const header = {
    id: doc.id,
    sig: { publicKey: {}, nonce: "" },
    documentType: doc.documentType,
    createdAtUtcIso: doc.createdAtUtcIso,
    slug: doc.id,
    name: doc.name,
    branch: "main",
    revision: { global: doc.revision },
    lastModifiedAtUtcIso: doc.lastModifiedAtUtcIso,
    meta: {},
  };

  const initialState = {
    auth: {},
    document: {
      version: 0,
      hash: { algorithm: "sha1", encoding: "base64" },
    },
    global: {},
    local: {},
  };

  const currentState = {
    auth: {},
    document: {
      version: 0,
      hash: { algorithm: "sha1", encoding: "base64" },
    },
    global: doc.stateJSON ?? {},
    local: {},
  };

  const operations = {
    global: doc.operations.map((op) => gqlOperationToInternal(op, "global")),
  };

  const files = new Map<string, string>();
  files.set("header.json", JSON.stringify(header, null, 2));
  files.set("state.json", JSON.stringify(initialState, null, 2));
  files.set("current-state.json", JSON.stringify(currentState, null, 2));
  files.set("operations.json", JSON.stringify(operations, null, 2));

  return createZipBuffer(files);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function downloadDrive(
  baseUrl: string,
  driveId: string,
  outputBase: string,
) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`DRIVE: ${driveId}`);
  console.log(`${"=".repeat(60)}`);
  console.log(`  Endpoint: ${baseUrl}/d/${driveId}`);

  console.log(`  Fetching drive info...`);
  const { drive, nodes } = await fetchDriveInfo(baseUrl, driveId);
  const driveName = sanitize(drive.name || driveId);
  const driveDir = path.join(outputBase, driveName);

  console.log(`  Name:  ${drive.name}`);
  console.log(`  Slug:  ${drive.slug}`);
  console.log(`  Icon:  ${drive.icon ?? "(none)"}`);

  const folders = nodes.filter(
    (n): n is FolderNode => n.kind === "folder",
  );
  const files = nodes.filter(
    (n): n is FileNode => "documentType" in n && n.kind === "file",
  );

  console.log(
    `  Nodes: ${nodes.length} total (${files.length} files, ${folders.length} folders)`,
  );

  if (folders.length > 0) {
    console.log(`  Folders:`);
    const folderPaths = buildFolderPaths(nodes);
    for (const folder of folders) {
      const resolvedPath = folderPaths.get(folder.id) ?? folder.name;
      const parent = folder.parentFolder
        ? ` (parent: ${folder.parentFolder})`
        : " (root)";
      console.log(`    /${resolvedPath}${parent}`);
    }

    // Create folder structure
    for (const folderPath of folderPaths.values()) {
      fs.mkdirSync(path.join(driveDir, folderPath), { recursive: true });
    }
  }

  // Build a map of document ID -> file node for name/path resolution
  const fileNodes = new Map<string, FileNode>();
  for (const node of nodes) {
    if ("documentType" in node && node.kind === "file") {
      fileNodes.set(node.id, node);
    }
  }

  if (files.length > 0) {
    console.log(`  Files:`);
    for (const file of files) {
      const folderPaths = buildFolderPaths(nodes);
      const filePath = file.parentFolder
        ? `${folderPaths.get(file.parentFolder) ?? ""}/${file.name}`
        : file.name;
      console.log(`    ${file.id} -> /${filePath} (${file.documentType})`);
    }
  }

  const docIds = [...fileNodes.keys()];
  console.log(`\n  Downloading ${docIds.length} documents...`);

  let saved = 0;
  let failed = 0;
  let verified = 0;
  let verifyFailed = 0;
  let emptyState = 0;
  const failures: { id: string; name: string; reason: string }[] = [];
  const verifyFailures: { id: string; name: string; reason: string }[] = [];
  const emptyStateIds: { id: string; name: string; documentType: string }[] =
    [];

  for (const docId of docIds) {
    const fileNode = fileNodes.get(docId);
    const nodeName = fileNode?.name ?? docId;

    try {
      if (saved + failed > 0) await sleep(REQUEST_DELAY_MS);
      console.log(
        `    [${saved + failed + 1}/${docIds.length}] Fetching "${nodeName}" (${docId})...`,
      );
      const doc = await fetchDocument(baseUrl, driveId, docId);

      // Warn about empty stateJSON
      const stateIsEmpty =
        doc.stateJSON == null ||
        (typeof doc.stateJSON === "object" &&
          Object.keys(doc.stateJSON).length === 0);
      if (stateIsEmpty) {
        emptyState++;
        emptyStateIds.push({
          id: docId,
          name: nodeName,
          documentType: doc.documentType,
        });
        console.warn(
          `           WARNING: stateJSON is empty for "${nodeName}" (${doc.documentType})` +
            ` — the downloaded .phd will have an empty global state`,
        );
      }

      const folderPaths = buildFolderPaths(nodes);
      const subDir = fileNode ? getNodePath(fileNode, folderPaths) : "";
      const docName = sanitize(doc.name || docId);
      const fileName = `${docName}.phd`;
      const fullDir = path.join(driveDir, subDir);
      const filePath = path.join(fullDir, fileName);

      fs.mkdirSync(fullDir, { recursive: true });

      const data = createPhdFile(doc);
      fs.writeFileSync(filePath, data);

      const relativePath = path.relative(outputBase, filePath);
      const sizeKb = (data.length / 1024).toFixed(1);
      const opsCount = doc.operations.length;
      console.log(
        `           Saved ${relativePath} (${doc.documentType}, ${opsCount} ops, ${sizeKb} KB)`,
      );

      // Post-save verification: read back the .phd and compare state
      const vResult = verifyPhdFile(filePath, doc.stateJSON);
      if (vResult.valid) {
        verified++;
        console.log(`           Verified OK`);
      } else {
        verifyFailed++;
        verifyFailures.push({
          id: docId,
          name: nodeName,
          reason: vResult.reason!,
        });
        console.warn(`           VERIFY FAILED: ${vResult.reason}`);
      }

      saved++;
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      console.error(`           SKIP "${nodeName}": ${reason}`);
      failures.push({ id: docId, name: nodeName, reason });
      failed++;
    }
  }

  console.log(`\n  Summary for "${drive.name}":`);
  console.log(`    Saved:          ${saved}`);
  console.log(`    Skipped:        ${failed}`);
  console.log(`    Verified OK:    ${verified}`);
  console.log(`    Verify failed:  ${verifyFailed}`);
  console.log(`    Empty stateJSON: ${emptyState}`);
  if (failures.length > 0) {
    console.log(`    Reasons for skipped documents:`);
    for (const f of failures) {
      console.log(`      - "${f.name}" (${f.id})`);
      console.log(`        ${f.reason}`);
    }
  }
  if (verifyFailures.length > 0) {
    console.log(`    Verification failures:`);
    for (const f of verifyFailures) {
      console.log(`      - "${f.name}" (${f.id})`);
      console.log(`        ${f.reason}`);
    }
  }
  if (emptyStateIds.length > 0) {
    console.log(`    Documents with empty stateJSON:`);
    for (const d of emptyStateIds) {
      console.log(`      - "${d.name}" (${d.id}) [${d.documentType}]`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(
      "Usage: bun scripts/download-drive-documents.ts <switchboard-url> [drive-id]",
    );
    console.log("\nExamples:");
    console.log(
      "  bun scripts/download-drive-documents.ts https://switchboard-dev.powerhouse.xyz",
    );
    console.log(
      "  bun scripts/download-drive-documents.ts https://switchboard-dev.powerhouse.xyz layer-resources-drive",
    );
    process.exit(1);
  }

  const baseUrl = normalizeBaseUrl(args[0]);
  const driveIdArg = args[1];
  const outputBase = path.resolve("./downloads");

  console.log(`Switchboard: ${baseUrl}`);
  console.log(`Output dir:  ${outputBase}`);

  console.log(`\nFetching drive list...`);
  const driveIds = driveIdArg ? [driveIdArg] : await fetchDrives(baseUrl);
  console.log(`Found ${driveIds.length} drive(s): ${driveIds.join(", ")}`);

  let drivesProcessed = 0;
  let drivesFailed = 0;
  const driveFailures: { id: string; reason: string }[] = [];

  for (let i = 0; i < driveIds.length; i++) {
    if (i > 0) await sleep(REQUEST_DELAY_MS);
    const driveId = driveIds[i];
    try {
      await downloadDrive(baseUrl, driveId, outputBase);
      drivesProcessed++;
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      console.error(`\n${"=".repeat(60)}`);
      console.error(`DRIVE: ${driveId} — FAILED`);
      console.error(`${"=".repeat(60)}`);
      console.error(`  Reason: ${reason}`);
      driveFailures.push({ id: driveId, reason });
      drivesFailed++;
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`DONE`);
  console.log(`${"=".repeat(60)}`);
  console.log(`  Output:           ${outputBase}`);
  console.log(`  Drives processed: ${drivesProcessed}`);
  console.log(`  Drives skipped:   ${drivesFailed}`);
  if (driveFailures.length > 0) {
    console.log(`  Reasons for skipped drives:`);
    for (const f of driveFailures) {
      console.log(`    - "${f.id}"`);
      console.log(`      ${f.reason}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
