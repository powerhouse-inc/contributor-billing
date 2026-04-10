import { baseActions } from "document-model";
import { operationalHubProfileConfigurationActions } from "./gen/creators.js";

/** Actions for the OperationalHubProfile document model */

export const actions = {
  ...baseActions,
  ...operationalHubProfileConfigurationActions,
};
