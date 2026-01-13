/**
 * Factory methods for creating IntegrationsDocument instances
 */
import type { PHAuthState, PHDocumentState, PHBaseState } from "document-model";
import { createBaseState, defaultBaseState } from "document-model/core";
import type {
  IntegrationsDocument,
  IntegrationsLocalState,
  IntegrationsGlobalState,
  IntegrationsPHState,
} from "./types.js";
import { createDocument } from "./utils.js";

export function defaultGlobalState(): IntegrationsGlobalState {
  return {};
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
  state?: Partial<IntegrationsGlobalState>,
): IntegrationsGlobalState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as IntegrationsGlobalState;
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
  globalState?: Partial<IntegrationsGlobalState>,
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
    global?: Partial<IntegrationsGlobalState>;
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
