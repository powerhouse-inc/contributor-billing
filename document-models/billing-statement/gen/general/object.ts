import { BaseDocumentClass } from "document-model";
import { BillingStatementPHState } from "../ph-factories.js";
import {
  type EditBillingStatementInput,
  type EditContributorInput,
  type EditStatusInput,
} from "../types.js";
import {
  editBillingStatement,
  editContributor,
  editStatus,
} from "./creators.js";
import { type BillingStatementAction } from "../actions.js";

export default class BillingStatement_General extends BaseDocumentClass<BillingStatementPHState> {
  public editBillingStatement(input: EditBillingStatementInput) {
    return this.dispatch(editBillingStatement(input));
  }

  public editContributor(input: EditContributorInput) {
    return this.dispatch(editContributor(input));
  }

  public editStatus(input: EditStatusInput) {
    return this.dispatch(editStatus(input));
  }
}
