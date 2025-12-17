// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { SnapshotReportPHState } from "@powerhousedao/contributor-billing/document-models/snapshot-report";

import { snapshotReportConfigurationOperations } from "../src/reducers/configuration.js";
import { snapshotReportAccountsOperations } from "../src/reducers/accounts.js";
import { snapshotReportBalancesOperations } from "../src/reducers/balances.js";
import { snapshotReportTransactionsOperations } from "../src/reducers/transactions.js";

import {
  SetReportConfigInputSchema,
  SetAccountsDocumentInputSchema,
  SetPeriodInputSchema,
  AddSnapshotAccountInputSchema,
  UpdateSnapshotAccountTypeInputSchema,
  RemoveSnapshotAccountInputSchema,
  SetStartingBalanceInputSchema,
  SetEndingBalanceInputSchema,
  RemoveStartingBalanceInputSchema,
  RemoveEndingBalanceInputSchema,
  AddTransactionInputSchema,
  RemoveTransactionInputSchema,
  UpdateTransactionFlowTypeInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<SnapshotReportPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "SET_REPORT_CONFIG":
      SetReportConfigInputSchema().parse(action.input);
      snapshotReportConfigurationOperations.setReportConfigOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_ACCOUNTS_DOCUMENT":
      SetAccountsDocumentInputSchema().parse(action.input);
      snapshotReportConfigurationOperations.setAccountsDocumentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_PERIOD":
      SetPeriodInputSchema().parse(action.input);
      snapshotReportConfigurationOperations.setPeriodOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_SNAPSHOT_ACCOUNT":
      AddSnapshotAccountInputSchema().parse(action.input);
      snapshotReportAccountsOperations.addSnapshotAccountOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_SNAPSHOT_ACCOUNT_TYPE":
      UpdateSnapshotAccountTypeInputSchema().parse(action.input);
      snapshotReportAccountsOperations.updateSnapshotAccountTypeOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_SNAPSHOT_ACCOUNT":
      RemoveSnapshotAccountInputSchema().parse(action.input);
      snapshotReportAccountsOperations.removeSnapshotAccountOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_STARTING_BALANCE":
      SetStartingBalanceInputSchema().parse(action.input);
      snapshotReportBalancesOperations.setStartingBalanceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_ENDING_BALANCE":
      SetEndingBalanceInputSchema().parse(action.input);
      snapshotReportBalancesOperations.setEndingBalanceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_STARTING_BALANCE":
      RemoveStartingBalanceInputSchema().parse(action.input);
      snapshotReportBalancesOperations.removeStartingBalanceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_ENDING_BALANCE":
      RemoveEndingBalanceInputSchema().parse(action.input);
      snapshotReportBalancesOperations.removeEndingBalanceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_TRANSACTION":
      AddTransactionInputSchema().parse(action.input);
      snapshotReportTransactionsOperations.addTransactionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_TRANSACTION":
      RemoveTransactionInputSchema().parse(action.input);
      snapshotReportTransactionsOperations.removeTransactionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_TRANSACTION_FLOW_TYPE":
      UpdateTransactionFlowTypeInputSchema().parse(action.input);
      snapshotReportTransactionsOperations.updateTransactionFlowTypeOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<SnapshotReportPHState>(stateReducer);
