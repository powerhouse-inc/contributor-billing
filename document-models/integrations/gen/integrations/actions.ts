import { type BaseAction } from "document-model";
import type {
  SetRequestFinanceInput,
  SetGnosisSafeInput,
  SetGoogleCloudInput,
} from "../types.js";

export type SetRequestFinanceAction = BaseAction<
  "SET_REQUEST_FINANCE",
  SetRequestFinanceInput,
  "global"
>;
export type SetGnosisSafeAction = BaseAction<
  "SET_GNOSIS_SAFE",
  SetGnosisSafeInput,
  "global"
>;
export type SetGoogleCloudAction = BaseAction<
  "SET_GOOGLE_CLOUD",
  SetGoogleCloudInput,
  "global"
>;

export type IntegrationsIntegrationsAction =
  | SetRequestFinanceAction
  | SetGnosisSafeAction
  | SetGoogleCloudAction;
