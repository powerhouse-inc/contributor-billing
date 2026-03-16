import { baseActions } from "document-model";
import { configurationActions } from "./gen/creators.js";

/** Actions for the OperationalHubProfile document model */

export const actions = { ...baseActions, ...configurationActions };
