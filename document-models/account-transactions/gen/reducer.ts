// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { AccountTransactionsPHState } from "@powerhousedao/contributor-billing/document-models/account-transactions";

import { accountTransactionsTransactionsOperations } from "../src/reducers/transactions.js";
import { accountTransactionsBudgetsOperations } from "../src/reducers/budgets.js";
import { accountTransactionsAccountOperations } from "../src/reducers/account.js";

import {
  AddTransactionInputSchema,
  UpdateTransactionInputSchema,
  DeleteTransactionInputSchema,
  UpdateTransactionPeriodInputSchema,
  AddBudgetInputSchema,
  UpdateBudgetInputSchema,
  DeleteBudgetInputSchema,
  SetAccountInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<AccountTransactionsPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "ADD_TRANSACTION":
      AddTransactionInputSchema().parse(action.input);
      accountTransactionsTransactionsOperations.addTransactionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_TRANSACTION":
      UpdateTransactionInputSchema().parse(action.input);
      accountTransactionsTransactionsOperations.updateTransactionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "DELETE_TRANSACTION":
      DeleteTransactionInputSchema().parse(action.input);
      accountTransactionsTransactionsOperations.deleteTransactionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_TRANSACTION_PERIOD":
      UpdateTransactionPeriodInputSchema().parse(action.input);
      accountTransactionsTransactionsOperations.updateTransactionPeriodOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_BUDGET":
      AddBudgetInputSchema().parse(action.input);
      accountTransactionsBudgetsOperations.addBudgetOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_BUDGET":
      UpdateBudgetInputSchema().parse(action.input);
      accountTransactionsBudgetsOperations.updateBudgetOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "DELETE_BUDGET":
      DeleteBudgetInputSchema().parse(action.input);
      accountTransactionsBudgetsOperations.deleteBudgetOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_ACCOUNT":
      SetAccountInputSchema().parse(action.input);
      accountTransactionsAccountOperations.setAccountOperation(
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
