import { createAction } from "document-model/core";
import {
  AddLineItemInputSchema,
  EditLineItemInputSchema,
  DeleteLineItemInputSchema,
  SetLineItemTagInputSchema,
  SetInvoiceTagInputSchema,
} from "../schema/zod.js";
import type {
  AddLineItemInput,
  EditLineItemInput,
  DeleteLineItemInput,
  SetLineItemTagInput,
  SetInvoiceTagInput,
} from "../types.js";
import type {
  AddLineItemAction,
  EditLineItemAction,
  DeleteLineItemAction,
  SetLineItemTagAction,
  SetInvoiceTagAction,
} from "./actions.js";

export const addLineItem = (input: AddLineItemInput) =>
  createAction<AddLineItemAction>(
    "ADD_LINE_ITEM",
    { ...input },
    undefined,
    AddLineItemInputSchema,
    "global",
  );

export const editLineItem = (input: EditLineItemInput) =>
  createAction<EditLineItemAction>(
    "EDIT_LINE_ITEM",
    { ...input },
    undefined,
    EditLineItemInputSchema,
    "global",
  );

export const deleteLineItem = (input: DeleteLineItemInput) =>
  createAction<DeleteLineItemAction>(
    "DELETE_LINE_ITEM",
    { ...input },
    undefined,
    DeleteLineItemInputSchema,
    "global",
  );

export const setLineItemTag = (input: SetLineItemTagInput) =>
  createAction<SetLineItemTagAction>(
    "SET_LINE_ITEM_TAG",
    { ...input },
    undefined,
    SetLineItemTagInputSchema,
    "global",
  );

export const setInvoiceTag = (input: SetInvoiceTagInput) =>
  createAction<SetInvoiceTagAction>(
    "SET_INVOICE_TAG",
    { ...input },
    undefined,
    SetInvoiceTagInputSchema,
    "global",
  );
