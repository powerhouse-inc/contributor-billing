/**
 * Factory methods for creating IntegrationsDocument instances
 */

import {
  createBaseState,
  defaultBaseState,
  type PHAuthState,
  type PHDocumentState,
  type PHBaseState,
} from "document-model";
import type {
  IntegrationsDocument,
  IntegrationsLocalState,
  IntegrationsState,
} from "./types.js";
import { createDocument } from "./utils.js";

export type IntegrationsPHState = PHBaseState & {
  global: IntegrationsState;
  local: IntegrationsLocalState;
};

export function defaultGlobalState(): IntegrationsState {
  return {
    gnosisSafe: {
      safeAddress: "",
      signerPrivateKey: "",
    },
    googleCloud: {
      projectId: "",
      location: "",
      processorId: "",
      keyFile: null,
    },
    requestFinance: {
      apiKey: "",
      email: "",
    },
  };
}

export function defaultLocalState(): IntegrationsLocalState {
  return {};
}

export function defaultPHState(): IntegrationsPHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<IntegrationsState>,
): IntegrationsState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as IntegrationsState;
}

export function createLocalState(
  state?: Partial<IntegrationsLocalState>,
): IntegrationsLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as IntegrationsLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<IntegrationsState>,
  localState?: Partial<IntegrationsLocalState>,
): IntegrationsPHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

/**
 * Creates a IntegrationsDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createIntegrationsDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<IntegrationsState>;
    local?: Partial<IntegrationsLocalState>;
  }>,
): IntegrationsDocument {
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
