import type { PHDocument, PHBaseState } from "document-model";
import type { InvoiceAction } from "./actions.js";
import type { InvoiceState as InvoiceGlobalState } from "./schema/types.js";

export { z } from "./schema/index.js";
export * from "./schema/types.js";
type InvoiceLocalState = Record<PropertyKey, never>;
type InvoicePHState = PHBaseState & {
  global: InvoiceGlobalState;
  local: InvoiceLocalState;
};
type InvoiceDocument = PHDocument<InvoicePHState>;

export type {
  InvoiceGlobalState,
  InvoiceLocalState,
  InvoicePHState,
  InvoiceAction,
  InvoiceDocument,
};
