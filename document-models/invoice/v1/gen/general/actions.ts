import type { Action } from "document-model";
import type {
  EditInvoiceInput,
  AddPaymentInput,
  EditPaymentDataInput,
  EditStatusInput,
  SetExportedDataInput,
} from "../types.js";

export type EditInvoiceAction = Action & {
  type: "EDIT_INVOICE";
  input: EditInvoiceInput;
};
export type AddPaymentAction = Action & {
  type: "ADD_PAYMENT";
  input: AddPaymentInput;
};
export type EditPaymentDataAction = Action & {
  type: "EDIT_PAYMENT_DATA";
  input: EditPaymentDataInput;
};
export type EditStatusAction = Action & {
  type: "EDIT_STATUS";
  input: EditStatusInput;
};
export type SetExportedDataAction = Action & {
  type: "SET_EXPORTED_DATA";
  input: SetExportedDataInput;
};

export type InvoiceGeneralAction =
  | EditInvoiceAction
  | AddPaymentAction
  | EditPaymentDataAction
  | EditStatusAction
  | SetExportedDataAction;
