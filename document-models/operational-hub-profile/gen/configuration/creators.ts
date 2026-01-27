import { createAction } from "document-model/core";
import {
  SetOperationalHubNameInputSchema,
  SetOperatorTeamInputSchema,
  AddSubteamInputSchema,
  RemoveSubteamInputSchema,
} from "../schema/zod.js";
import type {
  SetOperationalHubNameInput,
  SetOperatorTeamInput,
  AddSubteamInput,
  RemoveSubteamInput,
} from "../types.js";
import type {
  SetOperationalHubNameAction,
  SetOperatorTeamAction,
  AddSubteamAction,
  RemoveSubteamAction,
} from "./actions.js";

export const setOperationalHubName = (input: SetOperationalHubNameInput) =>
  createAction<SetOperationalHubNameAction>(
    "SET_OPERATIONAL_HUB_NAME",
    { ...input },
    undefined,
    SetOperationalHubNameInputSchema,
    "global",
  );

export const setOperatorTeam = (input: SetOperatorTeamInput) =>
  createAction<SetOperatorTeamAction>(
    "SET_OPERATOR_TEAM",
    { ...input },
    undefined,
    SetOperatorTeamInputSchema,
    "global",
  );

export const addSubteam = (input: AddSubteamInput) =>
  createAction<AddSubteamAction>(
    "ADD_SUBTEAM",
    { ...input },
    undefined,
    AddSubteamInputSchema,
    "global",
  );

export const removeSubteam = (input: RemoveSubteamInput) =>
  createAction<RemoveSubteamAction>(
    "REMOVE_SUBTEAM",
    { ...input },
    undefined,
    RemoveSubteamInputSchema,
    "global",
  );
