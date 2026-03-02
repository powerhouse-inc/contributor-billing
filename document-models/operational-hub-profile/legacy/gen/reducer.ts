// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { OperationalHubProfilePHState } from "@powerhousedao/contributor-billing/document-models/operational-hub-profile";

import { operationalHubProfileConfigurationOperations } from "../src/reducers/configuration.js";

import {
  SetOperationalHubNameInputSchema,
  SetOperatorTeamInputSchema,
  AddSubteamInputSchema,
  RemoveSubteamInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<OperationalHubProfilePHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }
  switch (action.type) {
    case "SET_OPERATIONAL_HUB_NAME": {
      SetOperationalHubNameInputSchema().parse(action.input);

      operationalHubProfileConfigurationOperations.setOperationalHubNameOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_OPERATOR_TEAM": {
      SetOperatorTeamInputSchema().parse(action.input);

      operationalHubProfileConfigurationOperations.setOperatorTeamOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_SUBTEAM": {
      AddSubteamInputSchema().parse(action.input);

      operationalHubProfileConfigurationOperations.addSubteamOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_SUBTEAM": {
      RemoveSubteamInputSchema().parse(action.input);

      operationalHubProfileConfigurationOperations.removeSubteamOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    default:
      return state;
  }
};

export const reducer =
  createReducer<OperationalHubProfilePHState>(stateReducer);
