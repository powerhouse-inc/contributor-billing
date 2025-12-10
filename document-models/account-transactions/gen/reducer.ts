// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { AccountTransactionsPHState } from "./types.js";
import { z } from "./types.js";

import { reducer as TransactionsReducer } from "../src/reducers/transactions.js";
import { reducer as BudgetsReducer } from "../src/reducers/budgets.js";
import { reducer as AccountReducer } from "../src/reducers/account.js";

export const stateReducer: StateReducer<AccountTransactionsPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "ADD_TRANSACTION":
      z.AddTransactionInputSchema().parse(action.input);
      TransactionsReducer.addTransactionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_TRANSACTION":
      z.UpdateTransactionInputSchema().parse(action.input);
      TransactionsReducer.updateTransactionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "DELETE_TRANSACTION":
      z.DeleteTransactionInputSchema().parse(action.input);
      TransactionsReducer.deleteTransactionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_TRANSACTION_PERIOD":
      z.UpdateTransactionPeriodInputSchema().parse(action.input);
      TransactionsReducer.updateTransactionPeriodOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_BUDGET":
      z.AddBudgetInputSchema().parse(action.input);
      BudgetsReducer.addBudgetOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_BUDGET":
      z.UpdateBudgetInputSchema().parse(action.input);
      BudgetsReducer.updateBudgetOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "DELETE_BUDGET":
      z.DeleteBudgetInputSchema().parse(action.input);
      BudgetsReducer.deleteBudgetOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_ACCOUNT":
      z.SetAccountInputSchema().parse(action.input);
      AccountReducer.setAccountOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<AccountTransactionsPHState>(stateReducer);
