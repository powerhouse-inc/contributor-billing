import { createAction } from "document-model/core";
import {
  AddSnapshotAccountInputSchema,
  UpdateSnapshotAccountTypeInputSchema,
  RemoveSnapshotAccountInputSchema,
} from "../schema/zod.js";
import type {
  AddSnapshotAccountInput,
  UpdateSnapshotAccountTypeInput,
  RemoveSnapshotAccountInput,
} from "../types.js";
import type {
  AddSnapshotAccountAction,
  UpdateSnapshotAccountTypeAction,
  RemoveSnapshotAccountAction,
} from "./actions.js";

export const addSnapshotAccount = (input: AddSnapshotAccountInput) =>
  createAction<AddSnapshotAccountAction>(
    "ADD_SNAPSHOT_ACCOUNT",
    { ...input },
    undefined,
    AddSnapshotAccountInputSchema,
    "global",
  );

export const updateSnapshotAccountType = (
  input: UpdateSnapshotAccountTypeInput,
) =>
  createAction<UpdateSnapshotAccountTypeAction>(
    "UPDATE_SNAPSHOT_ACCOUNT_TYPE",
    { ...input },
    undefined,
    UpdateSnapshotAccountTypeInputSchema,
    "global",
  );

export const removeSnapshotAccount = (input: RemoveSnapshotAccountInput) =>
  createAction<RemoveSnapshotAccountAction>(
    "REMOVE_SNAPSHOT_ACCOUNT",
    { ...input },
    undefined,
    RemoveSnapshotAccountInputSchema,
    "global",
  );
