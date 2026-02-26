import { createAction } from "document-model/core";
import {
  EditInvoiceInputSchema,
  EditStatusInputSchema,
  EditPaymentDataInputSchema,
  SetExportedDataInputSchema,
  AddPaymentInputSchema,
} from "../schema/zod.js";
import type {
  EditInvoiceInput,
  EditStatusInput,
  EditPaymentDataInput,
  SetExportedDataInput,
  AddPaymentInput,
} from "../types.js";
import type {
  EditInvoiceAction,
  EditStatusAction,
  EditPaymentDataAction,
  SetExportedDataAction,
  AddPaymentAction,
} from "./actions.js";

export const editInvoice = (input: EditInvoiceInput) =>
  createAction<EditInvoiceAction>(
    "EDIT_INVOICE",
    { ...input },
    undefined,
    EditInvoiceInputSchema,
    "global",
  );

export const editStatus = (input: EditStatusInput) =>
  createAction<EditStatusAction>(
    "EDIT_STATUS",
    { ...input },
    undefined,
    EditStatusInputSchema,
    "global",
  );

export const editPaymentData = (input: EditPaymentDataInput) =>
  createAction<EditPaymentDataAction>(
    "EDIT_PAYMENT_DATA",
    { ...input },
    undefined,
    EditPaymentDataInputSchema,
    "global",
  );

export const setExportedData = (input: SetExportedDataInput) =>
  createAction<SetExportedDataAction>(
    "SET_EXPORTED_DATA",
    { ...input },
    undefined,
    SetExportedDataInputSchema,
    "global",
  );

export const addPayment = (input: AddPaymentInput) =>
  createAction<AddPaymentAction>(
    "ADD_PAYMENT",
    { ...input },
    undefined,
    AddPaymentInputSchema,
    "global",
  );
