import { BaseDocumentClass } from "document-model";
import {
  type SetRequestFinanceInput,
  type SetGnosisSafeInput,
  type SetGoogleCloudInput,
  type IntegrationsState,
  type IntegrationsLocalState,
} from "../types.js";
import {
  setRequestFinance,
  setGnosisSafe,
  setGoogleCloud,
} from "./creators.js";
import { type IntegrationsAction } from "../actions.js";

export default class Integrations_Integrations extends BaseDocumentClass<
  IntegrationsState,
  IntegrationsLocalState,
  IntegrationsAction
> {
  public setRequestFinance(input: SetRequestFinanceInput) {
    return this.dispatch(setRequestFinance(input));
  }

  public setGnosisSafe(input: SetGnosisSafeInput) {
    return this.dispatch(setGnosisSafe(input));
  }

  public setGoogleCloud(input: SetGoogleCloudInput) {
    return this.dispatch(setGoogleCloud(input));
  }
}
