import { createAction } from "document-model/core";
import {
  z,
  type AddTransactionInput,
  type UpdateTransactionInput,
  type DeleteTransactionInput,
  type UpdateTransactionPeriodInput,
} from "../types.js";
import {
  type AddTransactionAction,
  type UpdateTransactionAction,
  type DeleteTransactionAction,
  type UpdateTransactionPeriodAction,
} from "./actions.js";

export const addTransaction = (input: AddTransactionInput) =>
  createAction<AddTransactionAction>(
    "ADD_TRANSACTION",
    { ...input },
    undefined,
    z.AddTransactionInputSchema,
    "global",
  );

export const updateTransaction = (input: UpdateTransactionInput) =>
  createAction<UpdateTransactionAction>(
    "UPDATE_TRANSACTION",
    { ...input },
    undefined,
    z.UpdateTransactionInputSchema,
    "global",
  );

export const deleteTransaction = (input: DeleteTransactionInput) =>
  createAction<DeleteTransactionAction>(
    "DELETE_TRANSACTION",
    { ...input },
    undefined,
    z.DeleteTransactionInputSchema,
    "global",
  );

export const updateTransactionPeriod = (input: UpdateTransactionPeriodInput) =>
  createAction<UpdateTransactionPeriodAction>(
    "UPDATE_TRANSACTION_PERIOD",
    { ...input },
    undefined,
    z.UpdateTransactionPeriodInputSchema,
    "global",
  );
