import type { Action } from "document-model";
import type {
  SetReportConfigInput,
  SetAccountsDocumentInput,
  SetPeriodInput,
  SetOwnerIdInput,
  SetPeriodStartInput,
  SetPeriodEndInput,
} from "../types.js";

export type SetReportConfigAction = Action & {
  type: "SET_REPORT_CONFIG";
  input: SetReportConfigInput;
};
export type SetAccountsDocumentAction = Action & {
  type: "SET_ACCOUNTS_DOCUMENT";
  input: SetAccountsDocumentInput;
};
export type SetPeriodAction = Action & {
  type: "SET_PERIOD";
  input: SetPeriodInput;
};
export type SetOwnerIdAction = Action & {
  type: "SET_OWNER_ID";
  input: SetOwnerIdInput;
};
export type SetPeriodStartAction = Action & {
  type: "SET_PERIOD_START";
  input: SetPeriodStartInput;
};
export type SetPeriodEndAction = Action & {
  type: "SET_PERIOD_END";
  input: SetPeriodEndInput;
};

export type SnapshotReportConfigurationAction =
  | SetReportConfigAction
  | SetAccountsDocumentAction
  | SetPeriodAction
  | SetOwnerIdAction
  | SetPeriodStartAction
  | SetPeriodEndAction;
