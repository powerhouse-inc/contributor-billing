import type { PHDocument, ExtendedState } from "document-model";
import type { IntegrationsState } from "./schema/types.js";
import type { IntegrationsAction } from "./actions.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type IntegrationsLocalState = Record<PropertyKey, never>;
export type ExtendedIntegrationsState = ExtendedState<
  IntegrationsState,
  IntegrationsLocalState
>;
export type IntegrationsDocument = PHDocument<
  IntegrationsState,
  IntegrationsLocalState,
  IntegrationsAction
>;
export type { IntegrationsState, IntegrationsLocalState, IntegrationsAction };
