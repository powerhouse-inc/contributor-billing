import { baseActions } from "document-model";
import {
  configurationActions,
  accountsActions,
  balancesActions,
  transactionsActions,
} from "./gen/creators.js";

/** Actions for the SnapshotReport document model */

export const actions = {
  ...baseActions,
  ...configurationActions,
  ...accountsActions,
  ...balancesActions,
  ...transactionsActions,
};
