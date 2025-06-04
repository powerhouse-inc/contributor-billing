import { type BaseAction } from "document-model";
import type {
  EditInvoiceInput,
  EditStatusInput,
  AddRefInput,
  EditRefInput,
  DeleteRefInput,
  AddPaymentAccountInput,
  EditPaymentAccountInput,
  DeletePaymentAccountInput,
} from "../types.js";

export type EditInvoiceAction = BaseAction<
  "EDIT_INVOICE",
  EditInvoiceInput,
  "global"
>;
export type EditStatusAction = BaseAction<
  "EDIT_STATUS",
  EditStatusInput,
  "global"
>;
export type AddRefAction = BaseAction<"ADD_REF", AddRefInput, "global">;
export type EditRefAction = BaseAction<"EDIT_REF", EditRefInput, "global">;
export type DeleteRefAction = BaseAction<
  "DELETE_REF",
  DeleteRefInput,
  "global"
>;
export type AddPaymentAccountAction = BaseAction<
  "ADD_PAYMENT_ACCOUNT",
  AddPaymentAccountInput,
  "global"
>;
export type EditPaymentAccountAction = BaseAction<
  "EDIT_PAYMENT_ACCOUNT",
  EditPaymentAccountInput,
  "global"
>;
export type DeletePaymentAccountAction = BaseAction<
  "DELETE_PAYMENT_ACCOUNT",
  DeletePaymentAccountInput,
  "global"
>;

export type InvoiceGeneralAction =
  | EditInvoiceAction
  | EditStatusAction
  | AddRefAction
  | EditRefAction
  | DeleteRefAction
  | AddPaymentAccountAction
  | EditPaymentAccountAction
  | DeletePaymentAccountAction;
