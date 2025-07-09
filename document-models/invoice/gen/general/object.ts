import { BaseDocumentClass } from "document-model";
import {
  type EditInvoiceInput,
  type EditStatusInput,
  type EditPaymentDataInput,
  type SetExportedDataInput,
  type AddPaymentInput,
  type InvoiceState,
  type InvoiceLocalState,
} from "../types.js";
import {
  editInvoice,
  editStatus,
  editPaymentData,
  setExportedData,
  addPayment,
} from "./creators.js";
import { type InvoiceAction } from "../actions.js";

export default class Invoice_General extends BaseDocumentClass<
  InvoiceState,
  InvoiceLocalState,
  InvoiceAction
> {
  public editInvoice(input: EditInvoiceInput) {
    return this.dispatch(editInvoice(input));
  }

  public editStatus(input: EditStatusInput) {
    return this.dispatch(editStatus(input));
  }

  public editPaymentData(input: EditPaymentDataInput) {
    return this.dispatch(editPaymentData(input));
  }

  public setExportedData(input: SetExportedDataInput) {
    return this.dispatch(setExportedData(input));
  }

  public addPayment(input: AddPaymentInput) {
    return this.dispatch(addPayment(input));
  }
}
