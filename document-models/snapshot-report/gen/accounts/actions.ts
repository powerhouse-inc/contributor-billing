import type { Action } from "document-model";
import type {
  AddSnapshotAccountInput,
  UpdateSnapshotAccountTypeInput,
  RemoveSnapshotAccountInput,
} from "../types.js";

export type AddSnapshotAccountAction = Action & {
  type: "ADD_SNAPSHOT_ACCOUNT";
  input: AddSnapshotAccountInput;
};
export type UpdateSnapshotAccountTypeAction = Action & {
  type: "UPDATE_SNAPSHOT_ACCOUNT_TYPE";
  input: UpdateSnapshotAccountTypeInput;
};
export type RemoveSnapshotAccountAction = Action & {
  type: "REMOVE_SNAPSHOT_ACCOUNT";
  input: RemoveSnapshotAccountInput;
};

export type SnapshotReportAccountsAction =
  | AddSnapshotAccountAction
  | UpdateSnapshotAccountTypeAction
  | RemoveSnapshotAccountAction;
