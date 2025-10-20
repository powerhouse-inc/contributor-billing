import { type Action } from "document-model";
import type { AddWalletInput } from "../types.js";

export type AddWalletAction = Action & {
  type: "ADD_WALLET";
  input: AddWalletInput;
};

export type ExpenseReportExpenseReportAction = AddWalletAction;
