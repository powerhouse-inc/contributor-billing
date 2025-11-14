import { createAction } from "document-model/core";
import { z, type EditLineItemTagInput } from "../types.js";
import { type EditLineItemTagAction } from "./actions.js";

export const editLineItemTag = (input: EditLineItemTagInput) =>
  createAction<EditLineItemTagAction>(
    "EDIT_LINE_ITEM_TAG",
    { ...input },
    undefined,
    z.EditLineItemTagInputSchema,
    "global",
  );
