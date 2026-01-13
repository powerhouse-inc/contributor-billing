import { createAction } from "document-model/core";
import {
  AddTransactionInputSchema,
  RemoveTransactionInputSchema,
  UpdateTransactionFlowTypeInputSchema,
} from "../schema/zod.js";
import type {
  AddTransactionInput,
  RemoveTransactionInput,
  UpdateTransactionFlowTypeInput,
} from "../types.js";
import type {
  AddTransactionAction,
  RemoveTransactionAction,
  UpdateTransactionFlowTypeAction,
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
