import { type SignalDispatch } from "document-model";
import {
  type SetReportConfigAction,
  type SetAccountsDocumentAction,
  type SetPeriodAction,
} from "./actions.js";
import { type SnapshotReportState } from "../types.js";

export interface SnapshotReportConfigurationOperations {
  setReportConfigOperation: (
    state: SnapshotReportState,
    action: SetReportConfigAction,
    dispatch?: SignalDispatch,
  ) => void;
  setAccountsDocumentOperation: (
    state: SnapshotReportState,
    action: SetAccountsDocumentAction,
    dispatch?: SignalDispatch,
  ) => void;
  setPeriodOperation: (
    state: SnapshotReportState,
    action: SetPeriodAction,
    dispatch?: SignalDispatch,
  ) => void;
}
