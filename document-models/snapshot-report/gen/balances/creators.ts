import { createAction } from "document-model/core";
import {
  SetStartingBalanceInputSchema,
  SetEndingBalanceInputSchema,
  RemoveStartingBalanceInputSchema,
  RemoveEndingBalanceInputSchema,
} from "../schema/zod.js";
import type {
  SetStartingBalanceInput,
  SetEndingBalanceInput,
  RemoveStartingBalanceInput,
  RemoveEndingBalanceInput,
} from "../types.js";
import type {
  SetStartingBalanceAction,
  SetEndingBalanceAction,
  RemoveStartingBalanceAction,
  RemoveEndingBalanceAction,
} from "./actions.js";

export const setStartingBalance = (input: SetStartingBalanceInput) =>
  createAction<SetStartingBalanceAction>(
    "SET_STARTING_BALANCE",
    { ...input },
    undefined,
    SetStartingBalanceInputSchema,
    "global",
  );

export const setEndingBalance = (input: SetEndingBalanceInput) =>
  createAction<SetEndingBalanceAction>(
    "SET_ENDING_BALANCE",
    { ...input },
    undefined,
    SetEndingBalanceInputSchema,
    "global",
  );

export const removeStartingBalance = (input: RemoveStartingBalanceInput) =>
  createAction<RemoveStartingBalanceAction>(
    "REMOVE_STARTING_BALANCE",
    { ...input },
    undefined,
    RemoveStartingBalanceInputSchema,
    "global",
  );

export const removeEndingBalance = (input: RemoveEndingBalanceInput) =>
  createAction<RemoveEndingBalanceAction>(
    "REMOVE_ENDING_BALANCE",
    { ...input },
    undefined,
    RemoveEndingBalanceInputSchema,
    "global",
  );
