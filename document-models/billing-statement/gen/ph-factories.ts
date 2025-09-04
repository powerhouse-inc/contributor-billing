/**
 * Factory methods for creating BillingStatementDocument instances
 */

import {
  createBaseState,
  defaultBaseState,
  type PHAuthState,
  type PHDocumentState,
  type PHBaseState,
} from "document-model";
import type {
  BillingStatementDocument,
  BillingStatementLocalState,
  BillingStatementState,
} from "./types.js";
import { createDocument } from "./utils.js";

export type BillingStatementPHState = PHBaseState & {
  global: BillingStatementState;
  local: BillingStatementLocalState;
};

export function defaultGlobalState(): BillingStatementState {
  return {
    contributor: "",
    dateIssued: "2025-06-10T15:42:17.873Z",
    dateDue: "2025-06-10T15:42:17.873Z",
    lineItems: [],
    status: "DRAFT",
    currency: "",
    totalCash: 0,
    totalPowt: 0,
    notes: "",
  };
}

export function defaultLocalState(): BillingStatementLocalState {
  return {};
}

export function defaultPHState(): BillingStatementPHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<BillingStatementState>,
): BillingStatementState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as BillingStatementState;
}

export function createLocalState(
  state?: Partial<BillingStatementLocalState>,
): BillingStatementLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as BillingStatementLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<BillingStatementState>,
  localState?: Partial<BillingStatementLocalState>,
): BillingStatementPHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

/**
 * Creates a BillingStatementDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createBillingStatementDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<BillingStatementState>;
    local?: Partial<BillingStatementLocalState>;
  }>,
): BillingStatementDocument {
  const document = createDocument(
    state
      ? createState(
          createBaseState(state.auth, state.document),
          state.global,
          state.local,
        )
      : undefined,
  );

  return document;
}
