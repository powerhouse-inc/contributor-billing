import { createAction } from "document-model";
import {
  z,
  type SetRequestFinanceInput,
  type SetGnosisSafeInput,
  type SetGoogleCloudInput,
} from "../types.js";
import {
  type SetRequestFinanceAction,
  type SetGnosisSafeAction,
  type SetGoogleCloudAction,
} from "./actions.js";

export const setRequestFinance = (input: SetRequestFinanceInput) =>
  createAction<SetRequestFinanceAction>(
    "SET_REQUEST_FINANCE",
    { ...input },
    undefined,
    z.SetRequestFinanceInputSchema,
    "global",
  );

export const setGnosisSafe = (input: SetGnosisSafeInput) =>
  createAction<SetGnosisSafeAction>(
    "SET_GNOSIS_SAFE",
    { ...input },
    undefined,
    z.SetGnosisSafeInputSchema,
    "global",
  );

export const setGoogleCloud = (input: SetGoogleCloudInput) =>
  createAction<SetGoogleCloudAction>(
    "SET_GOOGLE_CLOUD",
    { ...input },
    undefined,
    z.SetGoogleCloudInputSchema,
    "global",
  );
