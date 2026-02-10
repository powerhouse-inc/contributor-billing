import { type SignalDispatch } from "document-model";
import type {
  CreateInvoiceAction,
  UpdateInvoiceStatusAction,
  AddInvoiceLineItemAction,
  RemoveInvoiceLineItemAction,
  SetInvoiceTaxAction,
  RecordInvoicePaymentAction,
  SendInvoiceAction,
  CancelInvoiceAction,
  MarkInvoiceOverdueAction,
  RefundInvoiceAction,
} from "./actions.js";
import type { SubscriptionInstanceState } from "../types.js";

export interface SubscriptionInstanceBillingOperations {
  createInvoiceOperation: (
    state: SubscriptionInstanceState,
    action: CreateInvoiceAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateInvoiceStatusOperation: (
    state: SubscriptionInstanceState,
    action: UpdateInvoiceStatusAction,
    dispatch?: SignalDispatch,
  ) => void;
  addInvoiceLineItemOperation: (
    state: SubscriptionInstanceState,
    action: AddInvoiceLineItemAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeInvoiceLineItemOperation: (
    state: SubscriptionInstanceState,
    action: RemoveInvoiceLineItemAction,
    dispatch?: SignalDispatch,
  ) => void;
  setInvoiceTaxOperation: (
    state: SubscriptionInstanceState,
    action: SetInvoiceTaxAction,
    dispatch?: SignalDispatch,
  ) => void;
  recordInvoicePaymentOperation: (
    state: SubscriptionInstanceState,
    action: RecordInvoicePaymentAction,
    dispatch?: SignalDispatch,
  ) => void;
  sendInvoiceOperation: (
    state: SubscriptionInstanceState,
    action: SendInvoiceAction,
    dispatch?: SignalDispatch,
  ) => void;
  cancelInvoiceOperation: (
    state: SubscriptionInstanceState,
    action: CancelInvoiceAction,
    dispatch?: SignalDispatch,
  ) => void;
  markInvoiceOverdueOperation: (
    state: SubscriptionInstanceState,
    action: MarkInvoiceOverdueAction,
    dispatch?: SignalDispatch,
  ) => void;
  refundInvoiceOperation: (
    state: SubscriptionInstanceState,
    action: RefundInvoiceAction,
    dispatch?: SignalDispatch,
  ) => void;
}
