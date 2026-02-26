import type { Action } from "document-model";
import type {
  SetStartingBalanceInput,
  SetEndingBalanceInput,
  RemoveStartingBalanceInput,
  RemoveEndingBalanceInput,
} from "../types.js";

export type SetStartingBalanceAction = Action & {
  type: "SET_STARTING_BALANCE";
  input: SetStartingBalanceInput;
};
export type SetEndingBalanceAction = Action & {
  type: "SET_ENDING_BALANCE";
  input: SetEndingBalanceInput;
};
export type RemoveStartingBalanceAction = Action & {
  type: "REMOVE_STARTING_BALANCE";
  input: RemoveStartingBalanceInput;
};
export type RemoveEndingBalanceAction = Action & {
  type: "REMOVE_ENDING_BALANCE";
  input: RemoveEndingBalanceInput;
};

export type SnapshotReportBalancesAction =
  | SetStartingBalanceAction
  | SetEndingBalanceAction
  | RemoveStartingBalanceAction
  | RemoveEndingBalanceAction;
