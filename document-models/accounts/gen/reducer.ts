// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { AccountsPHState } from "./types.js";
import { z } from "./types.js";

import { reducer as AccountsReducer } from "../src/reducers/accounts.js";

export const stateReducer: StateReducer<AccountsPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "ADD_ACCOUNT":
      z.AddAccountInputSchema().parse(action.input);
      AccountsReducer.addAccountOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_ACCOUNT":
      z.UpdateAccountInputSchema().parse(action.input);
      AccountsReducer.updateAccountOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "DELETE_ACCOUNT":
      z.DeleteAccountInputSchema().parse(action.input);
      AccountsReducer.deleteAccountOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_KYC_STATUS":
      z.UpdateKycStatusInputSchema().parse(action.input);
      AccountsReducer.updateKycStatusOperation(
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
