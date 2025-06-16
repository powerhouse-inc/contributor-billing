import type { PHDocument, ExtendedState } from "document-model";
import type { BillingStatementState } from "./schema/types.js";
import type { BillingStatementAction } from "./actions.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type BillingStatementLocalState = Record<PropertyKey, never>;
export type ExtendedBillingStatementState = ExtendedState<
  BillingStatementState,
  BillingStatementLocalState
>;
export type BillingStatementDocument = PHDocument<
  BillingStatementState,
  BillingStatementLocalState,
  BillingStatementAction
>;
export type {
  BillingStatementState,
  BillingStatementLocalState,
  BillingStatementAction,
};
