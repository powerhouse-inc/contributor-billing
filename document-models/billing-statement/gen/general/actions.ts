import { type BaseAction } from "document-model";
import type {
  EditBillingStatementInput,
  EditContributorInput,
  EditStatusInput,
} from "../types.js";

export type EditBillingStatementAction = BaseAction<
  "EDIT_BILLING_STATEMENT",
  EditBillingStatementInput,
  "global"
>;
export type EditContributorAction = BaseAction<
  "EDIT_CONTRIBUTOR",
  EditContributorInput,
  "global"
>;
export type EditStatusAction = BaseAction<
  "EDIT_STATUS",
  EditStatusInput,
  "global"
>;

export type BillingStatementGeneralAction =
  | EditBillingStatementAction
  | EditContributorAction
  | EditStatusAction;
