import { createAction } from "document-model";
import {
  z,
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
  type AddWalletAction,
  type RemoveWalletAction,
  type AddBillingStatementAction,
  type RemoveBillingStatementAction,
  type AddLineItemAction,
  type UpdateLineItemAction,
  type RemoveLineItemAction,
  type AddLineItemGroupAction,
  type UpdateLineItemGroupAction,
  type RemoveLineItemGroupAction,
  type SetGroupTotalsAction,
  type RemoveGroupTotalsAction,
  type SetPeriodStartAction,
  type SetPeriodEndAction,
  type UpdateWalletAction,
} from "./actions.js";

export const addWallet = (input: AddWalletInput) =>
  createAction<AddWalletAction>(
    "ADD_WALLET",
    { ...input },
    undefined,
    z.AddWalletInputSchema,
    "global",
  );

export const removeWallet = (input: RemoveWalletInput) =>
  createAction<RemoveWalletAction>(
    "REMOVE_WALLET",
    { ...input },
    undefined,
    z.RemoveWalletInputSchema,
    "global",
  );

export const addBillingStatement = (input: AddBillingStatementInput) =>
  createAction<AddBillingStatementAction>(
    "ADD_BILLING_STATEMENT",
    { ...input },
    undefined,
    z.AddBillingStatementInputSchema,
    "global",
  );

export const removeBillingStatement = (input: RemoveBillingStatementInput) =>
  createAction<RemoveBillingStatementAction>(
    "REMOVE_BILLING_STATEMENT",
    { ...input },
    undefined,
    z.RemoveBillingStatementInputSchema,
    "global",
  );

export const addLineItem = (input: AddLineItemInput) =>
  createAction<AddLineItemAction>(
    "ADD_LINE_ITEM",
    { ...input },
    undefined,
    z.AddLineItemInputSchema,
    "global",
  );

export const updateLineItem = (input: UpdateLineItemInput) =>
  createAction<UpdateLineItemAction>(
    "UPDATE_LINE_ITEM",
    { ...input },
    undefined,
    z.UpdateLineItemInputSchema,
    "global",
  );

export const removeLineItem = (input: RemoveLineItemInput) =>
  createAction<RemoveLineItemAction>(
    "REMOVE_LINE_ITEM",
    { ...input },
    undefined,
    z.RemoveLineItemInputSchema,
    "global",
  );

export const addLineItemGroup = (input: AddLineItemGroupInput) =>
  createAction<AddLineItemGroupAction>(
    "ADD_LINE_ITEM_GROUP",
    { ...input },
    undefined,
    z.AddLineItemGroupInputSchema,
    "global",
  );

export const updateLineItemGroup = (input: UpdateLineItemGroupInput) =>
  createAction<UpdateLineItemGroupAction>(
    "UPDATE_LINE_ITEM_GROUP",
    { ...input },
    undefined,
    z.UpdateLineItemGroupInputSchema,
    "global",
  );

export const removeLineItemGroup = (input: RemoveLineItemGroupInput) =>
  createAction<RemoveLineItemGroupAction>(
    "REMOVE_LINE_ITEM_GROUP",
    { ...input },
    undefined,
    z.RemoveLineItemGroupInputSchema,
    "global",
  );

export const setGroupTotals = (input: SetGroupTotalsInput) =>
  createAction<SetGroupTotalsAction>(
    "SET_GROUP_TOTALS",
    { ...input },
    undefined,
    z.SetGroupTotalsInputSchema,
    "global",
  );

export const removeGroupTotals = (input: RemoveGroupTotalsInput) =>
  createAction<RemoveGroupTotalsAction>(
    "REMOVE_GROUP_TOTALS",
    { ...input },
    undefined,
    z.RemoveGroupTotalsInputSchema,
    "global",
  );

export const setPeriodStart = (input: SetPeriodStartInput) =>
  createAction<SetPeriodStartAction>(
    "SET_PERIOD_START",
    { ...input },
    undefined,
    z.SetPeriodStartInputSchema,
    "global",
  );

export const setPeriodEnd = (input: SetPeriodEndInput) =>
  createAction<SetPeriodEndAction>(
    "SET_PERIOD_END",
    { ...input },
    undefined,
    z.SetPeriodEndInputSchema,
    "global",
  );

export const updateWallet = (input: UpdateWalletInput) =>
  createAction<UpdateWalletAction>(
    "UPDATE_WALLET",
    { ...input },
    undefined,
    z.UpdateWalletInputSchema,
    "global",
  );
