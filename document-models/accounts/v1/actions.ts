import { baseActions } from "document-model";
import { accountsAccountsActions } from "./gen/creators.js";

/** Actions for the Accounts document model */

export const actions = { ...baseActions, ...accountsAccountsActions };
