import { baseActions } from "document-model";
import {
  accountTransactionsAccountActions,
  accountTransactionsTransactionsActions,
  accountTransactionsBudgetsActions,
} from "./gen/creators.js";

/** Actions for the AccountTransactions document model */

export const actions = {
  ...baseActions,
  ...accountTransactionsAccountActions,
  ...accountTransactionsTransactionsActions,
  ...accountTransactionsBudgetsActions,
};
