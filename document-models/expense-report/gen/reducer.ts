// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  type StateReducer,
  isDocumentAction,
  createReducer,
} from "document-model";
import { ExpenseReportPHState } from "./ph-factories.js";
import { z } from "./types.js";

import { reducer as WalletReducer } from "../src/reducers/wallet.js";

export const stateReducer: StateReducer<ExpenseReportPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "ADD_WALLET":
      z.AddWalletInputSchema().parse(action.input);
      WalletReducer.addWalletOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_WALLET":
      z.RemoveWalletInputSchema().parse(action.input);
      WalletReducer.removeWalletOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_BILLING_STATEMENT":
      z.AddBillingStatementInputSchema().parse(action.input);
      WalletReducer.addBillingStatementOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_BILLING_STATEMENT":
      z.RemoveBillingStatementInputSchema().parse(action.input);
      WalletReducer.removeBillingStatementOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_LINE_ITEM":
      z.AddLineItemInputSchema().parse(action.input);
      WalletReducer.addLineItemOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_LINE_ITEM":
      z.UpdateLineItemInputSchema().parse(action.input);
      WalletReducer.updateLineItemOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_LINE_ITEM":
      z.RemoveLineItemInputSchema().parse(action.input);
      WalletReducer.removeLineItemOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_LINE_ITEM_GROUP":
      z.AddLineItemGroupInputSchema().parse(action.input);
      WalletReducer.addLineItemGroupOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_LINE_ITEM_GROUP":
      z.UpdateLineItemGroupInputSchema().parse(action.input);
      WalletReducer.updateLineItemGroupOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_LINE_ITEM_GROUP":
      z.RemoveLineItemGroupInputSchema().parse(action.input);
      WalletReducer.removeLineItemGroupOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_GROUP_TOTALS":
      z.SetGroupTotalsInputSchema().parse(action.input);
      WalletReducer.setGroupTotalsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_GROUP_TOTALS":
      z.RemoveGroupTotalsInputSchema().parse(action.input);
      WalletReducer.removeGroupTotalsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_PERIOD_START":
      z.SetPeriodStartInputSchema().parse(action.input);
      WalletReducer.setPeriodStartOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_PERIOD_END":
      z.SetPeriodEndInputSchema().parse(action.input);
      WalletReducer.setPeriodEndOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_WALLET":
      z.UpdateWalletInputSchema().parse(action.input);
      WalletReducer.updateWalletOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<ExpenseReportPHState>(stateReducer);
