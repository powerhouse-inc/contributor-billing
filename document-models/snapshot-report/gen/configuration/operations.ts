import { type SignalDispatch } from "document-model";
import type {
  SetReportConfigAction,
  SetAccountsDocumentAction,
  SetPeriodAction,
  SetOwnerIdAction,
  SetPeriodStartAction,
  SetPeriodEndAction,
} from "./actions.js";
import type { SnapshotReportState } from "../types.js";

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
  setOwnerIdOperation: (
    state: SnapshotReportState,
    action: SetOwnerIdAction,
    dispatch?: SignalDispatch,
  ) => void;
  setPeriodStartOperation: (
    state: SnapshotReportState,
    action: SetPeriodStartAction,
    dispatch?: SignalDispatch,
  ) => void;
  setPeriodEndOperation: (
    state: SnapshotReportState,
    action: SetPeriodEndAction,
    dispatch?: SignalDispatch,
  ) => void;
}
