import { createAction } from "document-model/core";
import {
  AddTransactionInputSchema,
  UpdateTransactionInputSchema,
  DeleteTransactionInputSchema,
  UpdateTransactionPeriodInputSchema,
} from "../schema/zod.js";
import type {
  AddTransactionInput,
  UpdateTransactionInput,
  DeleteTransactionInput,
  UpdateTransactionPeriodInput,
} from "../types.js";
import type {
  AddTransactionAction,
  UpdateTransactionAction,
  DeleteTransactionAction,
  UpdateTransactionPeriodAction,
} from "./actions.js";

export const addTransaction = (input: AddTransactionInput) =>
  createAction<AddTransactionAction>(
    "ADD_TRANSACTION",
    { ...input },
    undefined,
    AddTransactionInputSchema,
    "global",
  );

export const updateTransaction = (input: UpdateTransactionInput) =>
  createAction<UpdateTransactionAction>(
    "UPDATE_TRANSACTION",
    { ...input },
    undefined,
    UpdateTransactionInputSchema,
    "global",
  );

export const deleteTransaction = (input: DeleteTransactionInput) =>
  createAction<DeleteTransactionAction>(
    "DELETE_TRANSACTION",
    { ...input },
    undefined,
    DeleteTransactionInputSchema,
    "global",
  );

export const updateTransactionPeriod = (input: UpdateTransactionPeriodInput) =>
  createAction<UpdateTransactionPeriodAction>(
    "UPDATE_TRANSACTION_PERIOD",
    { ...input },
    undefined,
    UpdateTransactionPeriodInputSchema,
    "global",
  );
