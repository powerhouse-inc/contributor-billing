import { createAction } from "document-model/core";
import {
  SetReportConfigInputSchema,
  SetAccountsDocumentInputSchema,
  SetPeriodInputSchema,
  SetOwnerIdInputSchema,
} from "../schema/zod.js";
import type {
  SetReportConfigInput,
  SetAccountsDocumentInput,
  SetPeriodInput,
  SetOwnerIdInput,
} from "../types.js";
import type {
  SetReportConfigAction,
  SetAccountsDocumentAction,
  SetPeriodAction,
  SetOwnerIdAction,
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
