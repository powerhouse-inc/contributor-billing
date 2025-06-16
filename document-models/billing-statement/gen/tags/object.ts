import { BaseDocumentClass } from "document-model";
import {
  type EditLineItemTagInput,
  type BillingStatementState,
  type BillingStatementLocalState,
} from "../types.js";
import { editLineItemTag } from "./creators.js";
import { type BillingStatementAction } from "../actions.js";

export default class BillingStatement_Tags extends BaseDocumentClass<
  BillingStatementState,
  BillingStatementLocalState,
  BillingStatementAction
> {
  public editLineItemTag(input: EditLineItemTagInput) {
    return this.dispatch(editLineItemTag(input));
  }
}
