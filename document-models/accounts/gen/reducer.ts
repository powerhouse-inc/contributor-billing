// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { AccountsPHState } from "@powerhousedao/contributor-billing/document-models/accounts";

import { accountsAccountsOperations } from "../src/reducers/accounts.js";

import {
  AddAccountInputSchema,
  UpdateAccountInputSchema,
  DeleteAccountInputSchema,
  UpdateKycStatusInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<AccountsPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "ADD_ACCOUNT":
      AddAccountInputSchema().parse(action.input);
      accountsAccountsOperations.addAccountOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_ACCOUNT":
      UpdateAccountInputSchema().parse(action.input);
      accountsAccountsOperations.updateAccountOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "DELETE_ACCOUNT":
      DeleteAccountInputSchema().parse(action.input);
      accountsAccountsOperations.deleteAccountOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_KYC_STATUS":
      UpdateKycStatusInputSchema().parse(action.input);
      accountsAccountsOperations.updateKycStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<AccountsPHState>(stateReducer);
