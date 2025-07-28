import { type SignalDispatch } from "document-model";
import {
  type SetRequestFinanceAction,
  type SetGnosisSafeAction,
  type SetGoogleCloudAction,
} from "./actions.js";
import { type IntegrationsState } from "../types.js";

export interface IntegrationsIntegrationsOperations {
  setRequestFinanceOperation: (
    state: IntegrationsState,
    action: SetRequestFinanceAction,
    dispatch?: SignalDispatch,
  ) => void;
  setGnosisSafeOperation: (
    state: IntegrationsState,
    action: SetGnosisSafeAction,
    dispatch?: SignalDispatch,
  ) => void;
  setGoogleCloudOperation: (
    state: IntegrationsState,
    action: SetGoogleCloudAction,
    dispatch?: SignalDispatch,
  ) => void;
}
