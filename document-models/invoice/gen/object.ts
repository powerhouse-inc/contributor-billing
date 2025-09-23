import {
  BaseDocumentClass,
  applyMixins,
  type SignalDispatch,
} from "document-model";
import { InvoicePHState } from "./ph-factories.js";
import { type InvoiceAction } from "./actions.js";
import { reducer } from "./reducer.js";
import { createDocument } from "./utils.js";
import Invoice_General from "./general/object.js";
import Invoice_Parties from "./parties/object.js";
import Invoice_Items from "./items/object.js";
import Invoice_Transitions from "./transitions/object.js";

export * from "./general/object.js";
export * from "./parties/object.js";
export * from "./items/object.js";
export * from "./transitions/object.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface Invoice
  extends Invoice_General,
    Invoice_Parties,
    Invoice_Items,
    Invoice_Transitions {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class Invoice extends BaseDocumentClass<InvoicePHState> {
  static fileExtension = ".phdm";

  constructor(
    initialState?: Partial<InvoicePHState>,
    dispatch?: SignalDispatch,
  ) {
    super(reducer, createDocument(initialState), dispatch);
  }

  public saveToFile(path: string, name?: string) {
    return super.saveToFile(path, Invoice.fileExtension, name);
  }

  public loadFromFile(path: string) {
    return super.loadFromFile(path);
  }

  static async fromFile(path: string) {
    const document = new this();
    await document.loadFromFile(path);
    return document;
  }
}

applyMixins(Invoice, [
  Invoice_General,
  Invoice_Parties,
  Invoice_Items,
  Invoice_Transitions,
]);

export { Invoice };
