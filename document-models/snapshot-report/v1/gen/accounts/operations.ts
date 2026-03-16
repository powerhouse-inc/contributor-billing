import { type SignalDispatch } from "document-model";
import type {
  AddSnapshotAccountAction,
  UpdateSnapshotAccountTypeAction,
  RemoveSnapshotAccountAction,
} from "./actions.js";
import type { SnapshotReportState } from "../types.js";

export interface SnapshotReportAccountsOperations {
  addSnapshotAccountOperation: (
    state: SnapshotReportState,
    action: AddSnapshotAccountAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateSnapshotAccountTypeOperation: (
    state: SnapshotReportState,
    action: UpdateSnapshotAccountTypeAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeSnapshotAccountOperation: (
    state: SnapshotReportState,
    action: RemoveSnapshotAccountAction,
    dispatch?: SignalDispatch,
  ) => void;
}
