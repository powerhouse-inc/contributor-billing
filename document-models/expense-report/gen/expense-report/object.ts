import { BaseDocumentClass } from "document-model";
import { ExpenseReportPHState } from "../ph-factories.js";
import { type AddWalletInput } from "../types.js";
import { addWallet } from "./creators.js";
import { type ExpenseReportAction } from "../actions.js";

export default class ExpenseReport_ExpenseReport extends BaseDocumentClass<ExpenseReportPHState> {
  public addWallet(input: AddWalletInput) {
    return this.dispatch(addWallet(input));
  }
}
