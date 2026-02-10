import type { Action } from "document-model";
import type {
  CreateInvoiceInput,
  UpdateInvoiceStatusInput,
  AddInvoiceLineItemInput,
  RemoveInvoiceLineItemInput,
  SetInvoiceTaxInput,
  RecordInvoicePaymentInput,
  SendInvoiceInput,
  CancelInvoiceInput,
  MarkInvoiceOverdueInput,
  RefundInvoiceInput,
} from "../types.js";

export type CreateInvoiceAction = Action & {
  type: "CREATE_INVOICE";
  input: CreateInvoiceInput;
};
export type UpdateInvoiceStatusAction = Action & {
  type: "UPDATE_INVOICE_STATUS";
  input: UpdateInvoiceStatusInput;
};
export type AddInvoiceLineItemAction = Action & {
  type: "ADD_INVOICE_LINE_ITEM";
  input: AddInvoiceLineItemInput;
};
export type RemoveInvoiceLineItemAction = Action & {
  type: "REMOVE_INVOICE_LINE_ITEM";
  input: RemoveInvoiceLineItemInput;
};
export type SetInvoiceTaxAction = Action & {
  type: "SET_INVOICE_TAX";
  input: SetInvoiceTaxInput;
};
export type RecordInvoicePaymentAction = Action & {
  type: "RECORD_INVOICE_PAYMENT";
  input: RecordInvoicePaymentInput;
};
export type SendInvoiceAction = Action & {
  type: "SEND_INVOICE";
  input: SendInvoiceInput;
};
export type CancelInvoiceAction = Action & {
  type: "CANCEL_INVOICE";
  input: CancelInvoiceInput;
};
export type MarkInvoiceOverdueAction = Action & {
  type: "MARK_INVOICE_OVERDUE";
  input: MarkInvoiceOverdueInput;
};
export type RefundInvoiceAction = Action & {
  type: "REFUND_INVOICE";
  input: RefundInvoiceInput;
};

export type SubscriptionInstanceBillingAction =
  | CreateInvoiceAction
  | UpdateInvoiceStatusAction
  | AddInvoiceLineItemAction
  | RemoveInvoiceLineItemAction
  | SetInvoiceTaxAction
  | RecordInvoicePaymentAction
  | SendInvoiceAction
  | CancelInvoiceAction
  | MarkInvoiceOverdueAction
  | RefundInvoiceAction;
