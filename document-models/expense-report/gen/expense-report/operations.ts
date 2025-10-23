import { type SignalDispatch } from "document-model";
import { type AddWalletAction } from "./actions.js";
import { type ExpenseReportState } from "../types.js";

export interface ExpenseReportExpenseReportOperations {
  addWalletOperation: (
    state: ExpenseReportState,
    action: AddWalletAction,
    dispatch?: SignalDispatch,
  ) => void;
}
