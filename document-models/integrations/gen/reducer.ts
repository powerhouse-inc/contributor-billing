// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  type StateReducer,
  isDocumentAction,
  createReducer,
} from "document-model";
import { IntegrationsPHState } from "./ph-factories.js";
import { z } from "./types.js";

import { reducer as IntegrationsReducer } from "../src/reducers/integrations.js";

export const stateReducer: StateReducer<IntegrationsPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "SET_REQUEST_FINANCE":
      z.SetRequestFinanceInputSchema().parse(action.input);
      IntegrationsReducer.setRequestFinanceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_GNOSIS_SAFE":
      z.SetGnosisSafeInputSchema().parse(action.input);
      IntegrationsReducer.setGnosisSafeOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_GOOGLE_CLOUD":
      z.SetGoogleCloudInputSchema().parse(action.input);
      IntegrationsReducer.setGoogleCloudOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<IntegrationsPHState>(stateReducer);
