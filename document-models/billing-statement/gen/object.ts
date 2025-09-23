import {
  BaseDocumentClass,
  applyMixins,
  type SignalDispatch,
} from "document-model";
import { BillingStatementPHState } from "./ph-factories.js";
import { type BillingStatementAction } from "./actions.js";
import { reducer } from "./reducer.js";
import { createDocument } from "./utils.js";
import BillingStatement_General from "./general/object.js";
import BillingStatement_LineItems from "./line-items/object.js";
import BillingStatement_Tags from "./tags/object.js";

export * from "./general/object.js";
export * from "./line-items/object.js";
export * from "./tags/object.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface BillingStatement
  extends BillingStatement_General,
    BillingStatement_LineItems,
    BillingStatement_Tags {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class BillingStatement extends BaseDocumentClass<BillingStatementPHState> {
  static fileExtension = ".phdm";

  constructor(
    initialState?: Partial<BillingStatementPHState>,
    dispatch?: SignalDispatch,
  ) {
    super(reducer, createDocument(initialState), dispatch);
  }

  public saveToFile(path: string, name?: string) {
    return super.saveToFile(path, BillingStatement.fileExtension, name);
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

applyMixins(BillingStatement, [
  BillingStatement_General,
  BillingStatement_LineItems,
  BillingStatement_Tags,
]);

export { BillingStatement };
