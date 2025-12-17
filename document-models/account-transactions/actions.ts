import { baseActions } from "document-model";
import {
  transactionsActions,
  budgetsActions,
  accountActions,
} from "./gen/creators.js";

/** Actions for the AccountTransactions document model */
export const actions = {
  ...baseActions,
  ...transactionsActions,
  ...budgetsActions,
  ...accountActions,
};
