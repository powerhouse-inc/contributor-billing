import { type SignalDispatch } from "document-model";
import type {
  AddTransactionAction,
  RemoveTransactionAction,
  UpdateTransactionFlowTypeAction,
  RecalculateFlowTypesAction,
} from "./actions.js";
import type { SnapshotReportState } from "../types.js";

export interface SnapshotReportTransactionsOperations {
  addTransactionOperation: (
    state: SnapshotReportState,
    action: AddTransactionAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeTransactionOperation: (
    state: SnapshotReportState,
    action: RemoveTransactionAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateTransactionFlowTypeOperation: (
    state: SnapshotReportState,
    action: UpdateTransactionFlowTypeAction,
    dispatch?: SignalDispatch,
  ) => void;
  recalculateFlowTypesOperation: (
    state: SnapshotReportState,
    action: RecalculateFlowTypesAction,
    dispatch?: SignalDispatch,
  ) => void;
}
