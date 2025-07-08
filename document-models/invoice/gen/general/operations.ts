import { type SignalDispatch } from "document-model";
import {
  type EditInvoiceAction,
  type EditStatusAction,
  type EditPaymentDataAction,
  type SetExportedDataAction,
} from "./actions.js";
import { type InvoiceState } from "../types.js";

export interface InvoiceGeneralOperations {
  editInvoiceOperation: (
    state: InvoiceState,
    action: EditInvoiceAction,
    dispatch?: SignalDispatch,
  ) => void;
  editStatusOperation: (
    state: InvoiceState,
    action: EditStatusAction,
    dispatch?: SignalDispatch,
  ) => void;
  editPaymentDataOperation: (
    state: InvoiceState,
    action: EditPaymentDataAction,
    dispatch?: SignalDispatch,
  ) => void;
  setExportedDataOperation: (
    state: InvoiceState,
    action: SetExportedDataAction,
    dispatch?: SignalDispatch,
  ) => void;
}
