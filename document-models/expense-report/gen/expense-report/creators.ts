import { createAction } from "document-model/core";
import type { AddWalletInput } from "../types.js";
import type { AddWalletAction } from "./actions.js";
import { AddWalletInputSchema } from "../schema/zod.js";

export const addWallet = (input: AddWalletInput) =>
  createAction<AddWalletAction>(
    "ADD_WALLET",
    { ...input },
    undefined,
    AddWalletInputSchema,
    "global",
  );
