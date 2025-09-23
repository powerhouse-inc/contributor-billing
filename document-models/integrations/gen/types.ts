import type { PHDocument } from "document-model";
import type { IntegrationsAction } from "./actions.js";
import type { IntegrationsPHState } from "./ph-factories.js";
import type { IntegrationsState } from "./schema/types.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type IntegrationsLocalState = Record<PropertyKey, never>;
export type IntegrationsDocument = PHDocument<IntegrationsPHState>;
export type { IntegrationsState, IntegrationsLocalState, IntegrationsAction };
