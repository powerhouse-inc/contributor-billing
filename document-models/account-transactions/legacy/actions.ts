import { baseActions } from "document-model";
import {
  accountActions,
  transactionsActions,
  budgetsActions,
} from "./gen/creators.js";

/** Actions for the AccountTransactions document model */

export const actions = {
  ...baseActions,
  ...accountActions,
  ...transactionsActions,
  ...budgetsActions,
};
