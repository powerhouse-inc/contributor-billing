import type { PHDocument, PHBaseState } from "document-model";
import type { IntegrationsAction } from "./actions.js";
import type { IntegrationsState as IntegrationsGlobalState } from "./schema/types.js";

export { z } from "./schema/index.js";
export * from "./schema/types.js";
type IntegrationsLocalState = Record<PropertyKey, never>;
type IntegrationsPHState = PHBaseState & {
  global: IntegrationsGlobalState;
  local: IntegrationsLocalState;
};
type IntegrationsDocument = PHDocument<IntegrationsPHState>;

export type {
  IntegrationsGlobalState,
  IntegrationsLocalState,
  IntegrationsPHState,
  IntegrationsAction,
  IntegrationsDocument,
};
