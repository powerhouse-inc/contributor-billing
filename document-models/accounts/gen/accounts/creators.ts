import { createAction } from "document-model/core";
import {
  AddAccountInputSchema,
  UpdateAccountInputSchema,
  DeleteAccountInputSchema,
  UpdateKycStatusInputSchema,
} from "../schema/zod.js";
import type {
  AddAccountInput,
  UpdateAccountInput,
  DeleteAccountInput,
  UpdateKycStatusInput,
} from "../types.js";
import type {
  AddAccountAction,
  UpdateAccountAction,
  DeleteAccountAction,
  UpdateKycStatusAction,
} from "./actions.js";

export const addAccount = (input: AddAccountInput) =>
  createAction<AddAccountAction>(
    "ADD_ACCOUNT",
    { ...input },
    undefined,
    AddAccountInputSchema,
    "global",
  );

export const updateAccount = (input: UpdateAccountInput) =>
  createAction<UpdateAccountAction>(
    "UPDATE_ACCOUNT",
    { ...input },
    undefined,
    UpdateAccountInputSchema,
    "global",
  );

export const deleteAccount = (input: DeleteAccountInput) =>
  createAction<DeleteAccountAction>(
    "DELETE_ACCOUNT",
    { ...input },
    undefined,
    DeleteAccountInputSchema,
    "global",
  );

export const updateKycStatus = (input: UpdateKycStatusInput) =>
  createAction<UpdateKycStatusAction>(
    "UPDATE_KYC_STATUS",
    { ...input },
    undefined,
    UpdateKycStatusInputSchema,
    "global",
  );
