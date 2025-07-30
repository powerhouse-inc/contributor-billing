import {
  type StateReducer,
  isDocumentAction,
  createReducer,
} from "document-model";
import { type IntegrationsDocument, z } from "./types.js";

import { reducer as IntegrationsReducer } from "../src/reducers/integrations.js";

const stateReducer: StateReducer<IntegrationsDocument> = (
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
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "SET_GNOSIS_SAFE":
      z.SetGnosisSafeInputSchema().parse(action.input);
      IntegrationsReducer.setGnosisSafeOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "SET_GOOGLE_CLOUD":
      z.SetGoogleCloudInputSchema().parse(action.input);
      IntegrationsReducer.setGoogleCloudOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<IntegrationsDocument>(stateReducer);
