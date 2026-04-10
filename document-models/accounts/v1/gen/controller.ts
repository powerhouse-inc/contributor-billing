import { PHDocumentController } from "document-model";
import { Accounts } from "../module.js";
import type { AccountsAction, AccountsPHState } from "./types.js";

export const AccountsController = PHDocumentController.forDocumentModel<
  AccountsPHState,
  AccountsAction
>(Accounts);
