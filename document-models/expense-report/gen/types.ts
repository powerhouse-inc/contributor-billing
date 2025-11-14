import type { PHDocument, PHBaseState } from "document-model";
import type { ExpenseReportAction } from "./actions.js";
import type { ExpenseReportState as ExpenseReportGlobalState } from "./schema/types.js";

export { z } from "./schema/index.js";
export * from "./schema/types.js";
type ExpenseReportLocalState = Record<PropertyKey, never>;
type ExpenseReportPHState = PHBaseState & {
  global: ExpenseReportGlobalState;
  local: ExpenseReportLocalState;
};
type ExpenseReportDocument = PHDocument<ExpenseReportPHState>;

export type {
  ExpenseReportGlobalState,
  ExpenseReportLocalState,
  ExpenseReportPHState,
  ExpenseReportAction,
  ExpenseReportDocument,
};
