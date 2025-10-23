import {
  BaseDocumentClass,
  applyMixins,
  type SignalDispatch,
} from "document-model";
import { ExpenseReportPHState } from "./ph-factories.js";
import { type ExpenseReportAction } from "./actions.js";
import { reducer } from "./reducer.js";
import { createDocument } from "./utils.js";
import ExpenseReport_Wallet from "./wallet/object.js";

export * from "./wallet/object.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface ExpenseReport extends ExpenseReport_Wallet {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class ExpenseReport extends BaseDocumentClass<ExpenseReportPHState> {
  static fileExtension = ".phdm";

  constructor(
    initialState?: Partial<ExpenseReportPHState>,
    dispatch?: SignalDispatch,
  ) {
    super(reducer, createDocument(initialState), dispatch);
  }

  public saveToFile(path: string, name?: string) {
    return super.saveToFile(path, ExpenseReport.fileExtension, name);
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

applyMixins(ExpenseReport, [ExpenseReport_Wallet]);

export { ExpenseReport };
