import { type Action } from "document-model";
import type {
  SetReportConfigInput,
  SetAccountsDocumentInput,
  SetPeriodInput,
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

export type SnapshotReportConfigurationAction =
  | SetReportConfigAction
  | SetAccountsDocumentAction
  | SetPeriodAction;
