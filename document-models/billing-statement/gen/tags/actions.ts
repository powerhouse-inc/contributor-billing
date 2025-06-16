import { type BaseAction } from "document-model";
import type { EditLineItemTagInput } from "../types.js";

export type EditLineItemTagAction = BaseAction<
  "EDIT_LINE_ITEM_TAG",
  EditLineItemTagInput,
  "global"
>;

export type BillingStatementTagsAction = EditLineItemTagAction;
