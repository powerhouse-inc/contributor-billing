import { BaseDocumentClass } from "document-model";
import {
  type EditBillingStatementInput,
  type EditContributorInput,
  type EditStatusInput,
  type BillingStatementState,
  type BillingStatementLocalState,
} from "../types.js";
import {
  editBillingStatement,
  editContributor,
  editStatus,
} from "./creators.js";
import { type BillingStatementAction } from "../actions.js";

export default class BillingStatement_General extends BaseDocumentClass<
  BillingStatementState,
  BillingStatementLocalState,
  BillingStatementAction
> {
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
