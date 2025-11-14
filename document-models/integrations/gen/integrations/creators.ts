import { createAction } from "document-model/core";
import {
  SetRequestFinanceInputSchema,
  SetGnosisSafeInputSchema,
  SetGoogleCloudInputSchema,
} from "../schema/zod.js";
import type {
  SetRequestFinanceInput,
  SetGnosisSafeInput,
  SetGoogleCloudInput,
} from "../types.js";
import type {
  SetRequestFinanceAction,
  SetGnosisSafeAction,
  SetGoogleCloudAction,
} from "./actions.js";

export const setRequestFinance = (input: SetRequestFinanceInput) =>
  createAction<SetRequestFinanceAction>(
    "SET_REQUEST_FINANCE",
    { ...input },
    undefined,
    SetRequestFinanceInputSchema,
    "global",
  );

export const setGnosisSafe = (input: SetGnosisSafeInput) =>
  createAction<SetGnosisSafeAction>(
    "SET_GNOSIS_SAFE",
    { ...input },
    undefined,
    SetGnosisSafeInputSchema,
    "global",
  );

export const setGoogleCloud = (input: SetGoogleCloudInput) =>
  createAction<SetGoogleCloudAction>(
    "SET_GOOGLE_CLOUD",
    { ...input },
    undefined,
    SetGoogleCloudInputSchema,
    "global",
  );
