import { createAction } from "document-model/core";
import {
  SetReportConfigInputSchema,
  SetAccountsDocumentInputSchema,
  SetPeriodInputSchema,
} from "../schema/zod.js";
import type {
  SetReportConfigInput,
  SetAccountsDocumentInput,
  SetPeriodInput,
} from "../types.js";
import type {
  SetReportConfigAction,
  SetAccountsDocumentAction,
  SetPeriodAction,
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
