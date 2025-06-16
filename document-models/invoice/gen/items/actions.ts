import { type BaseAction } from "document-model";
import type {
  AddLineItemInput,
  EditLineItemInput,
  DeleteLineItemInput,
  SetLineItemTagInput,
  SetInvoiceTagInput,
} from "../types.js";

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
export type DeleteLineItemAction = BaseAction<
  "DELETE_LINE_ITEM",
  DeleteLineItemInput,
  "global"
>;
export type SetLineItemTagAction = BaseAction<
  "SET_LINE_ITEM_TAG",
  SetLineItemTagInput,
  "global"
>;
export type SetInvoiceTagAction = BaseAction<
  "SET_INVOICE_TAG",
  SetInvoiceTagInput,
  "global"
>;

export type InvoiceItemsAction =
  | AddLineItemAction
  | EditLineItemAction
  | DeleteLineItemAction
  | SetLineItemTagAction
  | SetInvoiceTagAction;
