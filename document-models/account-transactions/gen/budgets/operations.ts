import { type SignalDispatch } from "document-model";
import type {
  AddBudgetAction,
  UpdateBudgetAction,
  DeleteBudgetAction,
} from "./actions.js";
import type { AccountTransactionsState } from "../types.js";

export interface AccountTransactionsBudgetsOperations {
  addBudgetOperation: (
    state: AccountTransactionsState,
    action: AddBudgetAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateBudgetOperation: (
    state: AccountTransactionsState,
    action: UpdateBudgetAction,
    dispatch?: SignalDispatch,
  ) => void;
  deleteBudgetOperation: (
    state: AccountTransactionsState,
    action: DeleteBudgetAction,
    dispatch?: SignalDispatch,
  ) => void;
}
