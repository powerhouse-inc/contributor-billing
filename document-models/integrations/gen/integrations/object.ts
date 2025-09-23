import { BaseDocumentClass } from "document-model";
import { IntegrationsPHState } from "../ph-factories.js";
import {
  type SetRequestFinanceInput,
  type SetGnosisSafeInput,
  type SetGoogleCloudInput,
} from "../types.js";
import {
  setRequestFinance,
  setGnosisSafe,
  setGoogleCloud,
} from "./creators.js";
import { type IntegrationsAction } from "../actions.js";

export default class Integrations_Integrations extends BaseDocumentClass<IntegrationsPHState> {
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
