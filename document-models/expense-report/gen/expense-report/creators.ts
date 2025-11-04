import { createAction } from "document-model";
import { z, type AddWalletInput } from "../types.js";
import { type AddWalletAction } from "./actions.js";

export const addWallet = (input: AddWalletInput) =>
  createAction<AddWalletAction>(
    "ADD_WALLET",
    { ...input },
    undefined,
    z.AddWalletInputSchema,
    "global",
  );
