import { type SignalDispatch } from "document-model";
import type { SetAccountAction } from "./actions.js";
import type { AccountTransactionsState } from "../types.js";

export interface AccountTransactionsAccountOperations {
  setAccountOperation: (
    state: AccountTransactionsState,
    action: SetAccountAction,
    dispatch?: SignalDispatch,
  ) => void;
}
