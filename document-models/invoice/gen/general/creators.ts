import { createAction } from "document-model";
import {
  z,
  type EditInvoiceInput,
  type EditStatusInput,
  type AddRefInput,
  type EditRefInput,
  type DeleteRefInput,
  type EditPaymentDataInput,
  type SetExportedInput,
} from "../types.js";
import {
  type EditInvoiceAction,
  type EditStatusAction,
  type AddRefAction,
  type EditRefAction,
  type DeleteRefAction,
  type EditPaymentDataAction,
  type SetExportedAction,
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

export const addRef = (input: AddRefInput) =>
  createAction<AddRefAction>(
    "ADD_REF",
    { ...input },
    undefined,
    z.AddRefInputSchema,
    "global",
  );

export const editRef = (input: EditRefInput) =>
  createAction<EditRefAction>(
    "EDIT_REF",
    { ...input },
    undefined,
    z.EditRefInputSchema,
    "global",
  );

export const deleteRef = (input: DeleteRefInput) =>
  createAction<DeleteRefAction>(
    "DELETE_REF",
    { ...input },
    undefined,
    z.DeleteRefInputSchema,
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

export const setExported = (input: SetExportedInput) =>
  createAction<SetExportedAction>(
    "SET_EXPORTED",
    { ...input },
    undefined,
    z.SetExportedInputSchema,
    "global",
  );
