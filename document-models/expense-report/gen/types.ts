import type { PHDocument } from "document-model";
import type { ExpenseReportAction } from "./actions.js";
import type { ExpenseReportPHState } from "./ph-factories.js";
import type { ExpenseReportState } from "./schema/types.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type ExpenseReportLocalState = Record<PropertyKey, never>;
export type ExpenseReportDocument = PHDocument<ExpenseReportPHState>;
export type {
  ExpenseReportState,
  ExpenseReportLocalState,
  ExpenseReportAction,
};
