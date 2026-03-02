import { createAction } from "document-model/core";
import {
  AddTransactionInputSchema,
  RemoveTransactionInputSchema,
  UpdateTransactionFlowTypeInputSchema,
  RecalculateFlowTypesInputSchema,
} from "../schema/zod.js";
import type {
  AddTransactionInput,
  RemoveTransactionInput,
  UpdateTransactionFlowTypeInput,
  RecalculateFlowTypesInput,
} from "../types.js";
import type {
  AddTransactionAction,
  RemoveTransactionAction,
  UpdateTransactionFlowTypeAction,
  RecalculateFlowTypesAction,
} from "./actions.js";

export const addTransaction = (input: AddTransactionInput) =>
  createAction<AddTransactionAction>(
    "ADD_TRANSACTION",
    { ...input },
    undefined,
    AddTransactionInputSchema,
    "global",
  );

export const removeTransaction = (input: RemoveTransactionInput) =>
  createAction<RemoveTransactionAction>(
    "REMOVE_TRANSACTION",
    { ...input },
    undefined,
    RemoveTransactionInputSchema,
    "global",
  );

export const updateTransactionFlowType = (
  input: UpdateTransactionFlowTypeInput,
) =>
  createAction<UpdateTransactionFlowTypeAction>(
    "UPDATE_TRANSACTION_FLOW_TYPE",
    { ...input },
    undefined,
    UpdateTransactionFlowTypeInputSchema,
    "global",
  );

export const recalculateFlowTypes = (input: RecalculateFlowTypesInput) =>
  createAction<RecalculateFlowTypesAction>(
    "RECALCULATE_FLOW_TYPES",
    { ...input },
    undefined,
    RecalculateFlowTypesInputSchema,
    "global",
  );
