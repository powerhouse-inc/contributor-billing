import { type SignalDispatch } from "document-model";
import {
  type AddTransactionAction,
  type UpdateTransactionAction,
  type DeleteTransactionAction,
  type UpdateTransactionPeriodAction,
} from "./actions.js";
import { type AccountTransactionsState } from "../types.js";

export interface AccountTransactionsTransactionsOperations {
  addTransactionOperation: (
    state: AccountTransactionsState,
    action: AddTransactionAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateTransactionOperation: (
    state: AccountTransactionsState,
    action: UpdateTransactionAction,
    dispatch?: SignalDispatch,
  ) => void;
  deleteTransactionOperation: (
    state: AccountTransactionsState,
    action: DeleteTransactionAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateTransactionPeriodOperation: (
    state: AccountTransactionsState,
    action: UpdateTransactionPeriodAction,
    dispatch?: SignalDispatch,
  ) => void;
}
