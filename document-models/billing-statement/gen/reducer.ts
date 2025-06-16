import {
  type StateReducer,
  isDocumentAction,
  createReducer,
} from "document-model";
import { type BillingStatementDocument, z } from "./types.js";

import { reducer as GeneralReducer } from "../src/reducers/general.js";
import { reducer as LineItemsReducer } from "../src/reducers/line-items.js";
import { reducer as TagsReducer } from "../src/reducers/tags.js";

const stateReducer: StateReducer<BillingStatementDocument> = (
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
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "EDIT_CONTRIBUTOR":
      z.EditContributorInputSchema().parse(action.input);
      GeneralReducer.editContributorOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "EDIT_STATUS":
      z.EditStatusInputSchema().parse(action.input);
      GeneralReducer.editStatusOperation(state[action.scope], action, dispatch);
      break;

    case "ADD_LINE_ITEM":
      z.AddLineItemInputSchema().parse(action.input);
      LineItemsReducer.addLineItemOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "EDIT_LINE_ITEM":
      z.EditLineItemInputSchema().parse(action.input);
      LineItemsReducer.editLineItemOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "EDIT_LINE_ITEM_TAG":
      z.EditLineItemTagInputSchema().parse(action.input);
      TagsReducer.editLineItemTagOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<BillingStatementDocument>(stateReducer);
