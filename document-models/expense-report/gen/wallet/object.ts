import { BaseDocumentClass } from "document-model";
import { ExpenseReportPHState } from "../ph-factories.js";
import {
  type AddWalletInput,
  type RemoveWalletInput,
  type AddBillingStatementInput,
  type RemoveBillingStatementInput,
  type AddLineItemInput,
  type UpdateLineItemInput,
  type RemoveLineItemInput,
  type AddLineItemGroupInput,
  type UpdateLineItemGroupInput,
  type RemoveLineItemGroupInput,
  type SetGroupTotalsInput,
  type RemoveGroupTotalsInput,
  type SetPeriodStartInput,
  type SetPeriodEndInput,
  type UpdateWalletInput,
} from "../types.js";
import {
  addWallet,
  removeWallet,
  addBillingStatement,
  removeBillingStatement,
  addLineItem,
  updateLineItem,
  removeLineItem,
  addLineItemGroup,
  updateLineItemGroup,
  removeLineItemGroup,
  setGroupTotals,
  removeGroupTotals,
  setPeriodStart,
  setPeriodEnd,
  updateWallet,
} from "./creators.js";
import { type ExpenseReportAction } from "../actions.js";

export default class ExpenseReport_Wallet extends BaseDocumentClass<ExpenseReportPHState> {
  public addWallet(input: AddWalletInput) {
    return this.dispatch(addWallet(input));
  }

  public removeWallet(input: RemoveWalletInput) {
    return this.dispatch(removeWallet(input));
  }

  public addBillingStatement(input: AddBillingStatementInput) {
    return this.dispatch(addBillingStatement(input));
  }

  public removeBillingStatement(input: RemoveBillingStatementInput) {
    return this.dispatch(removeBillingStatement(input));
  }

  public addLineItem(input: AddLineItemInput) {
    return this.dispatch(addLineItem(input));
  }

  public updateLineItem(input: UpdateLineItemInput) {
    return this.dispatch(updateLineItem(input));
  }

  public removeLineItem(input: RemoveLineItemInput) {
    return this.dispatch(removeLineItem(input));
  }

  public addLineItemGroup(input: AddLineItemGroupInput) {
    return this.dispatch(addLineItemGroup(input));
  }

  public updateLineItemGroup(input: UpdateLineItemGroupInput) {
    return this.dispatch(updateLineItemGroup(input));
  }

  public removeLineItemGroup(input: RemoveLineItemGroupInput) {
    return this.dispatch(removeLineItemGroup(input));
  }

  public setGroupTotals(input: SetGroupTotalsInput) {
    return this.dispatch(setGroupTotals(input));
  }

  public removeGroupTotals(input: RemoveGroupTotalsInput) {
    return this.dispatch(removeGroupTotals(input));
  }

  public setPeriodStart(input: SetPeriodStartInput) {
    return this.dispatch(setPeriodStart(input));
  }

  public setPeriodEnd(input: SetPeriodEndInput) {
    return this.dispatch(setPeriodEnd(input));
  }

  public updateWallet(input: UpdateWalletInput) {
    return this.dispatch(updateWallet(input));
  }
}
