import { createAction } from "document-model/core";
import {
  z,
  type AddBudgetInput,
  type UpdateBudgetInput,
  type DeleteBudgetInput,
} from "../types.js";
import {
  type AddBudgetAction,
  type UpdateBudgetAction,
  type DeleteBudgetAction,
} from "./actions.js";

export const addBudget = (input: AddBudgetInput) =>
  createAction<AddBudgetAction>(
    "ADD_BUDGET",
    { ...input },
    undefined,
    z.AddBudgetInputSchema,
    "global",
  );

export const updateBudget = (input: UpdateBudgetInput) =>
  createAction<UpdateBudgetAction>(
    "UPDATE_BUDGET",
    { ...input },
    undefined,
    z.UpdateBudgetInputSchema,
    "global",
  );

export const deleteBudget = (input: DeleteBudgetInput) =>
  createAction<DeleteBudgetAction>(
    "DELETE_BUDGET",
    { ...input },
    undefined,
    z.DeleteBudgetInputSchema,
    "global",
  );
