import { baseActions } from "document-model";
import { accountsActions } from "./gen/creators.js";

/** Actions for the Accounts document model */

export const actions = { ...baseActions, ...accountsActions };
