import { type Action } from "document-model";
import type {
  AddTransactionInput,
  RemoveTransactionInput,
  UpdateTransactionFlowTypeInput,
} from "../types.js";

export type AddTransactionAction = Action & {
  type: "ADD_TRANSACTION";
  input: AddTransactionInput;
};
export type RemoveTransactionAction = Action & {
  type: "REMOVE_TRANSACTION";
  input: RemoveTransactionInput;
};
export type UpdateTransactionFlowTypeAction = Action & {
  type: "UPDATE_TRANSACTION_FLOW_TYPE";
  input: UpdateTransactionFlowTypeInput;
};

export type SnapshotReportTransactionsAction =
  | AddTransactionAction
  | RemoveTransactionAction
  | UpdateTransactionFlowTypeAction;
