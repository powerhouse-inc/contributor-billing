import { createAction } from "document-model/core";
import {
  AddLineItemInputSchema,
  EditLineItemInputSchema,
  DeleteLineItemInputSchema,
} from "../schema/zod.js";
import type {
  AddLineItemInput,
  EditLineItemInput,
  DeleteLineItemInput,
} from "../types.js";
import type {
  AddLineItemAction,
  EditLineItemAction,
  DeleteLineItemAction,
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
