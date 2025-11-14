import { createAction } from "document-model/core";
import { z, type AddLineItemInput, type EditLineItemInput } from "../types.js";
import { type AddLineItemAction, type EditLineItemAction } from "./actions.js";

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
