import { type SignalDispatch } from "document-model";
import {
  type AddLineItemAction,
  type EditLineItemAction,
  type DeleteLineItemAction,
  type SetLineItemTagAction,
  type SetInvoiceTagAction,
} from "./actions.js";
import { type InvoiceState } from "../types.js";

export interface InvoiceItemsOperations {
  addLineItemOperation: (
    state: InvoiceState,
    action: AddLineItemAction,
    dispatch?: SignalDispatch,
  ) => void;
  editLineItemOperation: (
    state: InvoiceState,
    action: EditLineItemAction,
    dispatch?: SignalDispatch,
  ) => void;
  deleteLineItemOperation: (
    state: InvoiceState,
    action: DeleteLineItemAction,
    dispatch?: SignalDispatch,
  ) => void;
  setLineItemTagOperation: (
    state: InvoiceState,
    action: SetLineItemTagAction,
    dispatch?: SignalDispatch,
  ) => void;
  setInvoiceTagOperation: (
    state: InvoiceState,
    action: SetInvoiceTagAction,
    dispatch?: SignalDispatch,
  ) => void;
}
