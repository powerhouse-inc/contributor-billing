import { type BaseAction } from "document-model";
import type { AddLineItemInput, EditLineItemInput } from "../types.js";

export type AddLineItemAction = BaseAction<
  "ADD_LINE_ITEM",
  AddLineItemInput,
  "global"
>;
export type EditLineItemAction = BaseAction<
  "EDIT_LINE_ITEM",
  EditLineItemInput,
  "global"
>;

export type BillingStatementLineItemsAction =
  | AddLineItemAction
  | EditLineItemAction;
