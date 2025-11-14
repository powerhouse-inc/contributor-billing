// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { BillingStatementPHState } from "./types.js";
import { z } from "./types.js";

import { reducer as GeneralReducer } from "../src/reducers/general.js";
import { reducer as LineItemsReducer } from "../src/reducers/line-items.js";
import { reducer as TagsReducer } from "../src/reducers/tags.js";

export const stateReducer: StateReducer<BillingStatementPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "EDIT_BILLING_STATEMENT":
      z.EditBillingStatementInputSchema().parse(action.input);
      GeneralReducer.editBillingStatementOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_CONTRIBUTOR":
      z.EditContributorInputSchema().parse(action.input);
      GeneralReducer.editContributorOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_STATUS":
      z.EditStatusInputSchema().parse(action.input);
      GeneralReducer.editStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_LINE_ITEM":
      z.AddLineItemInputSchema().parse(action.input);
      LineItemsReducer.addLineItemOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_LINE_ITEM":
      z.EditLineItemInputSchema().parse(action.input);
      LineItemsReducer.editLineItemOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_LINE_ITEM_TAG":
      z.EditLineItemTagInputSchema().parse(action.input);
      TagsReducer.editLineItemTagOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<BillingStatementPHState>(stateReducer);
