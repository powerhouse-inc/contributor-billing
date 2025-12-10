import { createAction } from "document-model/core";
import {
  z,
  type AddAccountInput,
  type UpdateAccountInput,
  type DeleteAccountInput,
  type UpdateKycStatusInput,
} from "../types.js";
import {
  type AddAccountAction,
  type UpdateAccountAction,
  type DeleteAccountAction,
  type UpdateKycStatusAction,
} from "./actions.js";

export const addAccount = (input: AddAccountInput) =>
  createAction<AddAccountAction>(
    "ADD_ACCOUNT",
    { ...input },
    undefined,
    z.AddAccountInputSchema,
    "global",
  );

export const updateAccount = (input: UpdateAccountInput) =>
  createAction<UpdateAccountAction>(
    "UPDATE_ACCOUNT",
    { ...input },
    undefined,
    z.UpdateAccountInputSchema,
    "global",
  );

export const deleteAccount = (input: DeleteAccountInput) =>
  createAction<DeleteAccountAction>(
    "DELETE_ACCOUNT",
    { ...input },
    undefined,
    z.DeleteAccountInputSchema,
    "global",
  );

export const updateKycStatus = (input: UpdateKycStatusInput) =>
  createAction<UpdateKycStatusAction>(
    "UPDATE_KYC_STATUS",
    { ...input },
    undefined,
    z.UpdateKycStatusInputSchema,
    "global",
  );
