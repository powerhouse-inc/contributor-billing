import { createAction } from "document-model";
import {
  z,
  type EditInvoiceInput,
  type EditStatusInput,
  type EditPaymentDataInput,
  type SetExportedDataInput,
  type AddPaymentInput,
} from "../types.js";
import {
  type EditInvoiceAction,
  type EditStatusAction,
  type EditPaymentDataAction,
  type SetExportedDataAction,
  type AddPaymentAction,
} from "./actions.js";

export const editInvoice = (input: EditInvoiceInput) =>
  createAction<EditInvoiceAction>(
    "EDIT_INVOICE",
    { ...input },
    undefined,
    z.EditInvoiceInputSchema,
    "global",
  );

export const editStatus = (input: EditStatusInput) =>
  createAction<EditStatusAction>(
    "EDIT_STATUS",
    { ...input },
    undefined,
    z.EditStatusInputSchema,
    "global",
  );

export const editPaymentData = (input: EditPaymentDataInput) =>
  createAction<EditPaymentDataAction>(
    "EDIT_PAYMENT_DATA",
    { ...input },
    undefined,
    z.EditPaymentDataInputSchema,
    "global",
  );

export const setExportedData = (input: SetExportedDataInput) =>
  createAction<SetExportedDataAction>(
    "SET_EXPORTED_DATA",
    { ...input },
    undefined,
    z.SetExportedDataInputSchema,
    "global",
  );

export const addPayment = (input: AddPaymentInput) =>
  createAction<AddPaymentAction>(
    "ADD_PAYMENT",
    { ...input },
    undefined,
    z.AddPaymentInputSchema,
    "global",
  );
