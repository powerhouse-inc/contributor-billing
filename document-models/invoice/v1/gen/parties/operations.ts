import { type SignalDispatch } from "document-model";
import type {
  EditIssuerBankAction,
  EditIssuerAction,
  EditIssuerWalletAction,
  EditPayerBankAction,
  EditPayerAction,
  EditPayerWalletAction,
} from "./actions.js";
import type { InvoiceState } from "../types.js";

export interface InvoicePartiesOperations {
  editIssuerBankOperation: (
    state: InvoiceState,
    action: EditIssuerBankAction,
    dispatch?: SignalDispatch,
  ) => void;
  editIssuerOperation: (
    state: InvoiceState,
    action: EditIssuerAction,
    dispatch?: SignalDispatch,
  ) => void;
  editIssuerWalletOperation: (
    state: InvoiceState,
    action: EditIssuerWalletAction,
    dispatch?: SignalDispatch,
  ) => void;
  editPayerBankOperation: (
    state: InvoiceState,
    action: EditPayerBankAction,
    dispatch?: SignalDispatch,
  ) => void;
  editPayerOperation: (
    state: InvoiceState,
    action: EditPayerAction,
    dispatch?: SignalDispatch,
  ) => void;
  editPayerWalletOperation: (
    state: InvoiceState,
    action: EditPayerWalletAction,
    dispatch?: SignalDispatch,
  ) => void;
}
