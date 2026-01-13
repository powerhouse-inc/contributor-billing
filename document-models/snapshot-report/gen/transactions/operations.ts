import { type SignalDispatch } from "document-model";
import {
  type AddTransactionAction,
  type RemoveTransactionAction,
  type UpdateTransactionFlowTypeAction,
} from "./actions.js";
import { type SnapshotReportState } from "../types.js";

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
}
