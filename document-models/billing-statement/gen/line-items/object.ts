import { BaseDocumentClass } from "document-model";
import { BillingStatementPHState } from "../ph-factories.js";
import { type AddLineItemInput, type EditLineItemInput } from "../types.js";
import { addLineItem, editLineItem } from "./creators.js";
import { type BillingStatementAction } from "../actions.js";

export default class BillingStatement_LineItems extends BaseDocumentClass<BillingStatementPHState> {
  public addLineItem(input: AddLineItemInput) {
    return this.dispatch(addLineItem(input));
  }

  public editLineItem(input: EditLineItemInput) {
    return this.dispatch(editLineItem(input));
  }
}
