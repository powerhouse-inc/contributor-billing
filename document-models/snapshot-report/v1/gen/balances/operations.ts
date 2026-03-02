import { type SignalDispatch } from "document-model";
import type {
  SetStartingBalanceAction,
  SetEndingBalanceAction,
  RemoveStartingBalanceAction,
  RemoveEndingBalanceAction,
} from "./actions.js";
import type { SnapshotReportState } from "../types.js";

export interface SnapshotReportBalancesOperations {
  setStartingBalanceOperation: (
    state: SnapshotReportState,
    action: SetStartingBalanceAction,
    dispatch?: SignalDispatch,
  ) => void;
  setEndingBalanceOperation: (
    state: SnapshotReportState,
    action: SetEndingBalanceAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeStartingBalanceOperation: (
    state: SnapshotReportState,
    action: RemoveStartingBalanceAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeEndingBalanceOperation: (
    state: SnapshotReportState,
    action: RemoveEndingBalanceAction,
    dispatch?: SignalDispatch,
  ) => void;
}
