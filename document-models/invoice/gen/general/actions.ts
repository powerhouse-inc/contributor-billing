import { type BaseAction } from "document-model";
import type {
  EditInvoiceInput,
  EditStatusInput,
  AddRefInput,
  EditRefInput,
  DeleteRefInput,
  EditPaymentDataInput,
  SetExportedInput,
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
export type EditPaymentDataAction = BaseAction<
  "EDIT_PAYMENT_DATA",
  EditPaymentDataInput,
  "global"
>;
export type SetExportedAction = BaseAction<
  "SET_EXPORTED",
  SetExportedInput,
  "global"
>;

export type InvoiceGeneralAction =
  | EditInvoiceAction
  | EditStatusAction
  | AddRefAction
  | EditRefAction
  | DeleteRefAction
  | EditPaymentDataAction
  | SetExportedAction;
