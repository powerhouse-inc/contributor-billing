import { BaseDocumentClass } from "document-model";
import { BillingStatementPHState } from "../ph-factories.js";
import { type EditLineItemTagInput } from "../types.js";
import { editLineItemTag } from "./creators.js";
import { type BillingStatementAction } from "../actions.js";

export default class BillingStatement_Tags extends BaseDocumentClass<BillingStatementPHState> {
  public editLineItemTag(input: EditLineItemTagInput) {
    return this.dispatch(editLineItemTag(input));
  }
}
