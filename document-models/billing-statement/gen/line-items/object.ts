import { BaseDocumentClass } from "document-model";
import {
  type AddLineItemInput,
  type EditLineItemInput,
  type BillingStatementState,
  type BillingStatementLocalState,
} from "../types.js";
import { addLineItem, editLineItem } from "./creators.js";
import { type BillingStatementAction } from "../actions.js";

export default class BillingStatement_LineItems extends BaseDocumentClass<
  BillingStatementState,
  BillingStatementLocalState,
  BillingStatementAction
> {
  public addLineItem(input: AddLineItemInput) {
    return this.dispatch(addLineItem(input));
  }

  public editLineItem(input: EditLineItemInput) {
    return this.dispatch(editLineItem(input));
  }
}
