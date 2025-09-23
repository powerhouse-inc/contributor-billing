import { BaseDocumentClass } from "document-model";
import { InvoicePHState } from "../ph-factories.js";
import {
  type AddLineItemInput,
  type EditLineItemInput,
  type DeleteLineItemInput,
  type SetLineItemTagInput,
  type SetInvoiceTagInput,
} from "../types.js";
import {
  addLineItem,
  editLineItem,
  deleteLineItem,
  setLineItemTag,
  setInvoiceTag,
} from "./creators.js";
import { type InvoiceAction } from "../actions.js";

export default class Invoice_Items extends BaseDocumentClass<InvoicePHState> {
  public addLineItem(input: AddLineItemInput) {
    return this.dispatch(addLineItem(input));
  }

  public editLineItem(input: EditLineItemInput) {
    return this.dispatch(editLineItem(input));
  }

  public deleteLineItem(input: DeleteLineItemInput) {
    return this.dispatch(deleteLineItem(input));
  }

  public setLineItemTag(input: SetLineItemTagInput) {
    return this.dispatch(setLineItemTag(input));
  }

  public setInvoiceTag(input: SetInvoiceTagInput) {
    return this.dispatch(setInvoiceTag(input));
  }
}
