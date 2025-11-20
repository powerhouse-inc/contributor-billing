// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { IntegrationsPHState } from "@powerhousedao/contributor-billing/document-models/integrations";

import { integrationsIntegrationsOperations } from "../src/reducers/integrations.js";

import {
  SetRequestFinanceInputSchema,
  SetGnosisSafeInputSchema,
  SetGoogleCloudInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<IntegrationsPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "SET_REQUEST_FINANCE":
      SetRequestFinanceInputSchema().parse(action.input);
      integrationsIntegrationsOperations.setRequestFinanceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_GNOSIS_SAFE":
      SetGnosisSafeInputSchema().parse(action.input);
      integrationsIntegrationsOperations.setGnosisSafeOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_GOOGLE_CLOUD":
      SetGoogleCloudInputSchema().parse(action.input);
      integrationsIntegrationsOperations.setGoogleCloudOperation(
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
