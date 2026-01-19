import { createAction } from "document-model/core";
import {
  SetReportConfigInputSchema,
  SetAccountsDocumentInputSchema,
  SetPeriodInputSchema,
  SetOwnerIdInputSchema,
  SetPeriodStartInputSchema,
  SetPeriodEndInputSchema,
} from "../schema/zod.js";
import type {
  SetReportConfigInput,
  SetAccountsDocumentInput,
  SetPeriodInput,
  SetOwnerIdInput,
  SetPeriodStartInput,
  SetPeriodEndInput,
} from "../types.js";
import type {
  SetReportConfigAction,
  SetAccountsDocumentAction,
  SetPeriodAction,
  SetOwnerIdAction,
  SetPeriodStartAction,
  SetPeriodEndAction,
} from "./actions.js";

export const setReportConfig = (input: SetReportConfigInput) =>
  createAction<SetReportConfigAction>(
    "SET_REPORT_CONFIG",
    { ...input },
    undefined,
    SetReportConfigInputSchema,
    "global",
  );

export const setAccountsDocument = (input: SetAccountsDocumentInput) =>
  createAction<SetAccountsDocumentAction>(
    "SET_ACCOUNTS_DOCUMENT",
    { ...input },
    undefined,
    SetAccountsDocumentInputSchema,
    "global",
  );

export const setPeriod = (input: SetPeriodInput) =>
  createAction<SetPeriodAction>(
    "SET_PERIOD",
    { ...input },
    undefined,
    SetPeriodInputSchema,
    "global",
  );

export const setOwnerId = (input: SetOwnerIdInput) =>
  createAction<SetOwnerIdAction>(
    "SET_OWNER_ID",
    { ...input },
    undefined,
    SetOwnerIdInputSchema,
    "global",
  );

export const setPeriodStart = (input: SetPeriodStartInput) =>
  createAction<SetPeriodStartAction>(
    "SET_PERIOD_START",
    { ...input },
    undefined,
    SetPeriodStartInputSchema,
    "global",
  );

export const setPeriodEnd = (input: SetPeriodEndInput) =>
  createAction<SetPeriodEndAction>(
    "SET_PERIOD_END",
    { ...input },
    undefined,
    SetPeriodEndInputSchema,
    "global",
  );
