import type { PHDocument, PHBaseState } from "document-model";
import type { OperationalHubProfileAction } from "./actions.js";
import type { OperationalHubProfileState as OperationalHubProfileGlobalState } from "./schema/types.js";

type OperationalHubProfileLocalState = Record<PropertyKey, never>;

type OperationalHubProfilePHState = PHBaseState & {
  global: OperationalHubProfileGlobalState;
  local: OperationalHubProfileLocalState;
};
type OperationalHubProfileDocument = PHDocument<OperationalHubProfilePHState>;

export * from "./schema/types.js";

export type {
  OperationalHubProfileGlobalState,
  OperationalHubProfileLocalState,
  OperationalHubProfilePHState,
  OperationalHubProfileAction,
  OperationalHubProfileDocument,
};
