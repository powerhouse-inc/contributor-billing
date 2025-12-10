import type { PHDocument, PHBaseState } from "document-model";
import type { AccountTransactionsAction } from "./actions.js";
import type { AccountTransactionsState as AccountTransactionsGlobalState } from "./schema/types.js";

export { z } from "./schema/index.js";
export * from "./schema/types.js";
type AccountTransactionsLocalState = Record<PropertyKey, never>;
type AccountTransactionsPHState = PHBaseState & {
  global: AccountTransactionsGlobalState;
  local: AccountTransactionsLocalState;
};
type AccountTransactionsDocument = PHDocument<AccountTransactionsPHState>;

export type {
  AccountTransactionsGlobalState,
  AccountTransactionsLocalState,
  AccountTransactionsPHState,
  AccountTransactionsAction,
  AccountTransactionsDocument,
};
