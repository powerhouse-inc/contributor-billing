import { type BaseAction } from "document-model";
import type {
  EditInvoiceInput,
  EditStatusInput,
  EditPaymentDataInput,
  SetExportedDataInput,
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
export type EditPaymentDataAction = BaseAction<
  "EDIT_PAYMENT_DATA",
  EditPaymentDataInput,
  "global"
>;
export type SetExportedDataAction = BaseAction<
  "SET_EXPORTED_DATA",
  SetExportedDataInput,
  "global"
>;

export type InvoiceGeneralAction =
  | EditInvoiceAction
  | EditStatusAction
  | EditPaymentDataAction
  | SetExportedDataAction;
