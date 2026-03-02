import { type SignalDispatch } from "document-model";
import type {
  SetOperationalHubNameAction,
  SetOperatorTeamAction,
  AddSubteamAction,
  RemoveSubteamAction,
} from "./actions.js";
import type { OperationalHubProfileState } from "../types.js";

export interface OperationalHubProfileConfigurationOperations {
  setOperationalHubNameOperation: (
    state: OperationalHubProfileState,
    action: SetOperationalHubNameAction,
    dispatch?: SignalDispatch,
  ) => void;
  setOperatorTeamOperation: (
    state: OperationalHubProfileState,
    action: SetOperatorTeamAction,
    dispatch?: SignalDispatch,
  ) => void;
  addSubteamOperation: (
    state: OperationalHubProfileState,
    action: AddSubteamAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeSubteamOperation: (
    state: OperationalHubProfileState,
    action: RemoveSubteamAction,
    dispatch?: SignalDispatch,
  ) => void;
}
