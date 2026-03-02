/**
 * Factory methods for creating AccountsDocument instances
 */
import type { PHAuthState, PHDocumentState, PHBaseState } from "document-model";
import { createBaseState, defaultBaseState } from "document-model/core";
import type {
  AccountsDocument,
  AccountsLocalState,
  AccountsGlobalState,
  AccountsPHState,
} from "./types.js";
import { createDocument } from "./utils.js";

export function defaultGlobalState(): AccountsGlobalState {
  return {
    accounts: [],
  };
}

export function defaultLocalState(): AccountsLocalState {
  return {};
}

export function defaultPHState(): AccountsPHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<AccountsGlobalState>,
): AccountsGlobalState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as AccountsGlobalState;
}

export function createLocalState(
  state?: Partial<AccountsLocalState>,
): AccountsLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as AccountsLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<AccountsGlobalState>,
  localState?: Partial<AccountsLocalState>,
): AccountsPHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

/**
 * Creates a AccountsDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createAccountsDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<AccountsGlobalState>;
    local?: Partial<AccountsLocalState>;
  }>,
): AccountsDocument {
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
