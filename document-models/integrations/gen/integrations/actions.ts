import { type Action } from "document-model";
import type {
  SetRequestFinanceInput,
  SetGnosisSafeInput,
  SetGoogleCloudInput,
} from "../types.js";

export type SetRequestFinanceAction = Action & {
  type: "SET_REQUEST_FINANCE";
  input: SetRequestFinanceInput;
};
export type SetGnosisSafeAction = Action & {
  type: "SET_GNOSIS_SAFE";
  input: SetGnosisSafeInput;
};
export type SetGoogleCloudAction = Action & {
  type: "SET_GOOGLE_CLOUD";
  input: SetGoogleCloudInput;
};

export type IntegrationsIntegrationsAction =
  | SetRequestFinanceAction
  | SetGnosisSafeAction
  | SetGoogleCloudAction;
