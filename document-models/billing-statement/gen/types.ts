import type { PHDocument } from "document-model";
import type { BillingStatementAction } from "./actions.js";
import type { BillingStatementPHState } from "./ph-factories.js";
import type { BillingStatementState } from "./schema/types.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type BillingStatementLocalState = Record<PropertyKey, never>;
export type BillingStatementDocument = PHDocument<BillingStatementPHState>;
export type {
  BillingStatementState,
  BillingStatementLocalState,
  BillingStatementAction,
};
