import { createAction } from "document-model/core";
import {
  AddBudgetInputSchema,
  UpdateBudgetInputSchema,
  DeleteBudgetInputSchema,
} from "../schema/zod.js";
import type {
  AddBudgetInput,
  UpdateBudgetInput,
  DeleteBudgetInput,
} from "../types.js";
import type {
  AddBudgetAction,
  UpdateBudgetAction,
  DeleteBudgetAction,
} from "./actions.js";

export const addBudget = (input: AddBudgetInput) =>
  createAction<AddBudgetAction>(
    "ADD_BUDGET",
    { ...input },
    undefined,
    AddBudgetInputSchema,
    "global",
  );

export const updateBudget = (input: UpdateBudgetInput) =>
  createAction<UpdateBudgetAction>(
    "UPDATE_BUDGET",
    { ...input },
    undefined,
    UpdateBudgetInputSchema,
    "global",
  );

export const deleteBudget = (input: DeleteBudgetInput) =>
  createAction<DeleteBudgetAction>(
    "DELETE_BUDGET",
    { ...input },
    undefined,
    DeleteBudgetInputSchema,
    "global",
  );
