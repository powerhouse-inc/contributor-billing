import { baseActions } from "document-model";
import { integrationsActions } from "./gen/creators.js";

/** Actions for the Integrations document model */
export const actions = { ...baseActions, ...integrationsActions };
