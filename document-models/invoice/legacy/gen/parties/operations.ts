import { type SignalDispatch } from "document-model";
import type {
  EditIssuerAction,
  EditIssuerBankAction,
  EditIssuerWalletAction,
  EditPayerAction,
  EditPayerBankAction,
  EditPayerWalletAction,
} from "./actions.js";
import type { InvoiceState } from "../types.js";

export interface InvoicePartiesOperations {
  editIssuerOperation: (
    state: InvoiceState,
    action: EditIssuerAction,
    dispatch?: SignalDispatch,
  ) => void;
  editIssuerBankOperation: (
    state: InvoiceState,
    action: EditIssuerBankAction,
    dispatch?: SignalDispatch,
  ) => void;
  editIssuerWalletOperation: (
    state: InvoiceState,
    action: EditIssuerWalletAction,
    dispatch?: SignalDispatch,
  ) => void;
  editPayerOperation: (
    state: InvoiceState,
    action: EditPayerAction,
    dispatch?: SignalDispatch,
  ) => void;
  editPayerBankOperation: (
    state: InvoiceState,
    action: EditPayerBankAction,
    dispatch?: SignalDispatch,
  ) => void;
  editPayerWalletOperation: (
    state: InvoiceState,
    action: EditPayerWalletAction,
    dispatch?: SignalDispatch,
  ) => void;
}
