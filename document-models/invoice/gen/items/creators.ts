import { createAction } from "document-model";
import {
  z,
  type AddLineItemInput,
  type EditLineItemInput,
  type DeleteLineItemInput,
  type SetLineItemTagInput,
  type SetInvoiceTagInput,
} from "../types.js";
import {
  type AddLineItemAction,
  type EditLineItemAction,
  type DeleteLineItemAction,
  type SetLineItemTagAction,
  type SetInvoiceTagAction,
} from "./actions.js";

export const addLineItem = (input: AddLineItemInput) =>
  createAction<AddLineItemAction>(
    "ADD_LINE_ITEM",
    { ...input },
    undefined,
    z.AddLineItemInputSchema,
    "global",
  );

export const editLineItem = (input: EditLineItemInput) =>
  createAction<EditLineItemAction>(
    "EDIT_LINE_ITEM",
    { ...input },
    undefined,
    z.EditLineItemInputSchema,
    "global",
  );

export const deleteLineItem = (input: DeleteLineItemInput) =>
  createAction<DeleteLineItemAction>(
    "DELETE_LINE_ITEM",
    { ...input },
    undefined,
    z.DeleteLineItemInputSchema,
    "global",
  );

export const setLineItemTag = (input: SetLineItemTagInput) =>
  createAction<SetLineItemTagAction>(
    "SET_LINE_ITEM_TAG",
    { ...input },
    undefined,
    z.SetLineItemTagInputSchema,
    "global",
  );

export const setInvoiceTag = (input: SetInvoiceTagInput) =>
  createAction<SetInvoiceTagAction>(
    "SET_INVOICE_TAG",
    { ...input },
    undefined,
    z.SetInvoiceTagInputSchema,
    "global",
  );
