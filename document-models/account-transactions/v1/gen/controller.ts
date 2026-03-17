import { PHDocumentController } from "document-model/core";
import { AccountTransactions } from "../module.js";
import type {
  AccountTransactionsAction,
  AccountTransactionsPHState,
} from "./types.js";

export const AccountTransactionsController =
  PHDocumentController.forDocumentModel<
    AccountTransactionsPHState,
    AccountTransactionsAction
  >(AccountTransactions);
