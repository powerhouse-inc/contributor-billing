#!/usr/bin/env bun
/**
 * Upload local .phd documents to a Powerhouse switchboard.
 *
 * Works with ANY document type — reads header.json and operations.json from
 * the .phd file, auto-detects the document type, creates a new document via
 * the matching _createDocument mutation, then replays all operations via
 * pushUpdates on the drive endpoint.
 *
 * REQUIRES: Bun runtime (https://bun.sh)
 *
 * Usage:
 *   bun scripts/upload-phd-documents/upload-phd-documents.ts <switchboard-url> <drive-id> <file.phd> [file2.phd ...]
 *
 * Examples:
 *   bun scripts/upload-phd-documents/upload-phd-documents.ts http://localhost:4001 preview-f80015b9 "op hub.phd" "oh service.phd"
 *   bun scripts/upload-phd-documents/upload-phd-documents.ts http://localhost:4001 preview-f80015b9 invoice.phd
 */

import { inflateRawSync } from "node:zlib";
import fs from "node:fs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PhdHeader {
  id: string;
  documentType: string;
  name: string;
  revision: { global?: number; document?: number };
}

interface PhdOperation {
  id: string;
  index: number;
  skip: number;
  hash: string;
  timestampUtcMs: string;
  error?: string | null;
  action: {
    id: string;
    type: string;
    timestampUtcMs: string;
    input: unknown;
    scope: string;
  };
}

interface PhdOperations {
  global?: PhdOperation[];
  local?: PhdOperation[];
}

interface PhdCurrentState {
  global: Record<string, unknown>;
}

interface UploadResult {
  file: string;
  documentType: string;
  docId: string;
  name: string;
  operationsPushed: number;
  stateMatch: boolean;
}

// ---------------------------------------------------------------------------
// ZIP reader (from download script)
// ---------------------------------------------------------------------------

function readZipEntry(zipBuf: Buffer, entryName: string): Buffer | null {
  let offset = 0;
  while (offset + 30 <= zipBuf.length) {
    const sig = zipBuf.readUInt32LE(offset);
    if (sig !== 0x04034b50) break;

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
        return Buffer.from(inflateRawSync(raw));
      }
      return Buffer.from(raw);
    }

    offset = dataEnd;
  }
  return null;
}

function readPhdJson<T>(filePath: string, entryName: string): T {
  const zipBuf = fs.readFileSync(filePath);
  const buf = readZipEntry(zipBuf, entryName);
  if (!buf) throw new Error(`${entryName} not found in ${filePath}`);
  return JSON.parse(buf.toString("utf-8")) as T;
}

// ---------------------------------------------------------------------------
// GraphQL helper
// ---------------------------------------------------------------------------

const REQUEST_DELAY_MS = 200;
const PUSH_BATCH_SIZE = 50;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function gql<T>(
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
    const body = await res.text().catch(() => "");
    throw new Error(`GraphQL ${res.status}: ${body.slice(0, 500)}`);
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

  if (!json.data) throw new Error("No data returned from GraphQL");
  return json.data;
}

// ---------------------------------------------------------------------------
// Document type -> mutation prefix mapping
// ---------------------------------------------------------------------------

/**
 * Discover available _createDocument mutations by introspecting the API.
 * Returns a map of documentType -> mutation prefix.
 * e.g. "powerhouse/resource-template" -> "ResourceTemplate"
 */
async function discoverDocumentTypes(
  endpoint: string,
): Promise<Map<string, string>> {
  const data = await gql<{
    __schema: {
      mutationType: { fields: { name: string }[] };
    };
  }>(endpoint, `{ __schema { mutationType { fields { name } } } }`);

  const map = new Map<string, string>();
  for (const field of data.__schema.mutationType.fields) {
    if (!field.name.endsWith("_createDocument")) continue;
    const prefix = field.name.replace("_createDocument", "");
    // Convert PascalCase prefix to kebab-case document type
    const kebab = prefix.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    const docType = `powerhouse/${kebab}`;
    map.set(docType, prefix);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Create document via type-specific _createDocument mutation
// ---------------------------------------------------------------------------

async function createDocument(
  endpoint: string,
  driveId: string,
  mutationPrefix: string,
  name: string,
): Promise<string> {
  const mutationName = `${mutationPrefix}_createDocument`;
  const data = await gql<Record<string, string>>(
    endpoint,
    `mutation ($name: String!, $driveId: String) {
      ${mutationName}(name: $name, driveId: $driveId)
    }`,
    { name, driveId },
  );
  return data[mutationName];
}

// ---------------------------------------------------------------------------
// Push operations via pushUpdates on the drive endpoint
// ---------------------------------------------------------------------------

async function pushOperations(
  driveEndpoint: string,
  driveId: string,
  docId: string,
  documentType: string,
  operations: PhdOperations,
): Promise<number> {
  let totalPushed = 0;

  for (const scope of ["global", "local"] as const) {
    const scopeOps = operations[scope];
    if (!scopeOps?.length) continue;

    console.log(`    Pushing ${scopeOps.length} ${scope} operations...`);

    for (let i = 0; i < scopeOps.length; i += PUSH_BATCH_SIZE) {
      const batch = scopeOps.slice(i, i + PUSH_BATCH_SIZE);
      const inputOps = batch.map((op) => ({
        index: op.index,
        skip: op.skip,
        type: op.action.type,
        id: op.id,
        actionId: op.action.id || op.id,
        input: JSON.stringify(op.action.input),
        hash: op.hash,
        timestampUtcMs: op.timestampUtcMs,
        error: op.error ?? null,
      }));

      const strand = {
        driveId,
        documentId: docId,
        documentType,
        scope,
        branch: "main",
        operations: inputOps,
      };

      if (i > 0) await sleep(REQUEST_DELAY_MS);

      const result = await gql<{
        pushUpdates: {
          revision: number;
          status: string;
          error: string | null;
        }[];
      }>(
        driveEndpoint,
        `mutation ($strands: [InputStrandUpdate!]) {
          pushUpdates(strands: $strands) { revision status error }
        }`,
        { strands: [strand] },
      );

      const update = result.pushUpdates[0];
      if (update.status !== "SUCCESS") {
        throw new Error(
          `pushUpdates failed at batch ${Math.floor(i / PUSH_BATCH_SIZE) + 1}: ` +
            `status=${update.status}, error=${update.error}`,
        );
      }

      totalPushed += batch.length;
      const batchNum = Math.floor(i / PUSH_BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(scopeOps.length / PUSH_BATCH_SIZE);
      console.log(
        `      [${batchNum}/${totalBatches}] ${batch.length} ops -> revision ${update.revision}`,
      );
    }
  }

  return totalPushed;
}

// ---------------------------------------------------------------------------
// State verification
// ---------------------------------------------------------------------------

async function verifyState(
  driveEndpoint: string,
  docId: string,
  expectedGlobal: Record<string, unknown>,
): Promise<boolean> {
  const data = await gql<{
    document: { stateJSON: Record<string, unknown> };
  }>(
    driveEndpoint,
    `query ($id: String!) { document(id: $id) { stateJSON } }`,
    { id: docId },
  );

  const actual = data.document.stateJSON;
  const expectedStr = JSON.stringify(
    expectedGlobal,
    Object.keys(expectedGlobal).sort(),
  );
  const actualStr = JSON.stringify(actual, Object.keys(actual).sort());

  if (expectedStr === actualStr) return true;

  // Count differences for reporting
  const allKeys = new Set([
    ...Object.keys(expectedGlobal),
    ...Object.keys(actual),
  ]);
  let diffs = 0;
  for (const key of allKeys) {
    const ev = JSON.stringify(expectedGlobal[key], null, 0);
    const av = JSON.stringify(actual[key], null, 0);
    if (ev !== av) {
      diffs++;
      if (diffs <= 5) {
        const evShort = (ev || "undefined").slice(0, 60);
        const avShort = (av || "undefined").slice(0, 60);
        console.log(
          `      DIFF: ${key}: expected=${evShort} actual=${avShort}`,
        );
      }
    }
  }
  if (diffs > 5) {
    console.log(`      ... and ${diffs - 5} more differences`);
  }
  return false;
}

// ---------------------------------------------------------------------------
// Upload a single .phd file
// ---------------------------------------------------------------------------

async function uploadPhdFile(
  baseUrl: string,
  driveId: string,
  filePath: string,
  typeMap: Map<string, string>,
): Promise<UploadResult> {
  const endpoint = `${baseUrl}/graphql`;
  const driveEndpoint = `${baseUrl}/d/${driveId}`;

  // 1. Read .phd contents
  const header = readPhdJson<PhdHeader>(filePath, "header.json");
  const operations = readPhdJson<PhdOperations>(filePath, "operations.json");
  const currentState = readPhdJson<PhdCurrentState>(
    filePath,
    "current-state.json",
  );

  const docType = header.documentType;
  const docName =
    header.name || filePath.replace(/^.*\//, "").replace(/\.phd$/, "");
  const globalOpsCount = operations.global?.length ?? 0;
  const localOpsCount = operations.local?.length ?? 0;

  console.log(`\n${"─".repeat(60)}`);
  console.log(`  File:     ${filePath}`);
  console.log(`  Type:     ${docType}`);
  console.log(`  Name:     ${docName || "(unnamed)"}`);
  console.log(`  Ops:      ${globalOpsCount} global, ${localOpsCount} local`);

  // 2. Find the matching _createDocument mutation
  const mutationPrefix = typeMap.get(docType);
  if (!mutationPrefix) {
    throw new Error(
      `No _createDocument mutation found for type "${docType}". ` +
        `Available types: ${[...typeMap.keys()].join(", ")}`,
    );
  }

  // 3. Create the document
  console.log(`  Creating ${mutationPrefix} document...`);
  const docId = await createDocument(
    endpoint,
    driveId,
    mutationPrefix,
    docName || "Untitled",
  );
  console.log(`  Created:  ${docId}`);

  // 4. Push operations
  let totalPushed = 0;
  if (globalOpsCount + localOpsCount > 0) {
    await sleep(REQUEST_DELAY_MS);
    totalPushed = await pushOperations(
      driveEndpoint,
      driveId,
      docId,
      docType,
      operations,
    );
    console.log(`  Pushed:   ${totalPushed} operations`);
  } else {
    console.log(`  No operations to push`);
  }

  // 5. Verify state
  await sleep(REQUEST_DELAY_MS);
  console.log(`  Verifying state...`);
  const stateMatch = await verifyState(
    driveEndpoint,
    docId,
    currentState.global,
  );
  if (stateMatch) {
    console.log(`  State:    EXACT MATCH`);
  } else {
    console.log(
      `  State:    MISMATCH (see diffs above — may be expected with schema changes)`,
    );
  }

  return {
    file: filePath,
    documentType: docType,
    docId,
    name: docName,
    operationsPushed: totalPushed,
    stateMatch,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log(
      "Usage: bun scripts/upload-phd-documents/upload-phd-documents.ts <switchboard-url> <drive-id> <file.phd> [file2.phd ...]",
    );
    console.log(
      "\nExamples:" +
        '\n  bun scripts/upload-phd-documents/upload-phd-documents.ts http://localhost:4001 preview-f80015b9 "op hub.phd" "oh service.phd"' +
        "\n  bun scripts/upload-phd-documents/upload-phd-documents.ts http://localhost:4001 preview-f80015b9 invoice.phd",
    );
    process.exit(1);
  }

  const [rawBaseUrl, driveId, ...phdFiles] = args;
  const baseUrl = rawBaseUrl.replace(/\/+$/, "").replace(/\/graphql$/i, "");

  console.log(`Switchboard: ${baseUrl}`);
  console.log(`Drive:       ${driveId}`);
  console.log(`Files:       ${phdFiles.length}`);

  // Discover available document types from the API
  console.log(`\nDiscovering document types...`);
  const typeMap = await discoverDocumentTypes(`${baseUrl}/graphql`);
  console.log(
    `  Found ${typeMap.size} types: ${[...typeMap.keys()].join(", ")}`,
  );

  // Upload each .phd file
  const results: UploadResult[] = [];
  const failures: { file: string; reason: string }[] = [];

  for (const file of phdFiles) {
    try {
      const result = await uploadPhdFile(baseUrl, driveId, file, typeMap);
      results.push(result);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      console.error(`\n  FAILED: ${file}`);
      console.error(`  Reason: ${reason}`);
      failures.push({ file, reason });
    }
  }

  // Summary
  console.log(`\n${"=".repeat(60)}`);
  console.log(`DONE`);
  console.log(`${"=".repeat(60)}`);
  console.log(`  Drive:     ${driveId}`);
  console.log(`  Uploaded:  ${results.length}`);
  console.log(`  Failed:    ${failures.length}`);

  for (const r of results) {
    const stateIcon = r.stateMatch ? "OK" : "~";
    console.log(
      `  [${stateIcon}] ${r.name || r.file} (${r.documentType}) -> ${r.docId} (${r.operationsPushed} ops)`,
    );
  }

  for (const f of failures) {
    console.log(`  [X] ${f.file}: ${f.reason}`);
  }

  if (failures.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
