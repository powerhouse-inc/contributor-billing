import { createAction } from "document-model";
import {
  z,
  type EditBillingStatementInput,
  type EditContributorInput,
  type EditStatusInput,
} from "../types.js";
import {
  type EditBillingStatementAction,
  type EditContributorAction,
  type EditStatusAction,
} from "./actions.js";

export const editBillingStatement = (input: EditBillingStatementInput) =>
  createAction<EditBillingStatementAction>(
    "EDIT_BILLING_STATEMENT",
    { ...input },
    undefined,
    z.EditBillingStatementInputSchema,
    "global",
  );

export const editContributor = (input: EditContributorInput) =>
  createAction<EditContributorAction>(
    "EDIT_CONTRIBUTOR",
    { ...input },
    undefined,
    z.EditContributorInputSchema,
    "global",
  );

export const editStatus = (input: EditStatusInput) =>
  createAction<EditStatusAction>(
    "EDIT_STATUS",
    { ...input },
    undefined,
    z.EditStatusInputSchema,
    "global",
  );
