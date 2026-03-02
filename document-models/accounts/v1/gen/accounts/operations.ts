import { type SignalDispatch } from "document-model";
import type {
  AddAccountAction,
  UpdateAccountAction,
  DeleteAccountAction,
  UpdateKycStatusAction,
} from "./actions.js";
import type { AccountsState } from "../types.js";

export interface AccountsAccountsOperations {
  addAccountOperation: (
    state: AccountsState,
    action: AddAccountAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateAccountOperation: (
    state: AccountsState,
    action: UpdateAccountAction,
    dispatch?: SignalDispatch,
  ) => void;
  deleteAccountOperation: (
    state: AccountsState,
    action: DeleteAccountAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateKycStatusOperation: (
    state: AccountsState,
    action: UpdateKycStatusAction,
    dispatch?: SignalDispatch,
  ) => void;
}
