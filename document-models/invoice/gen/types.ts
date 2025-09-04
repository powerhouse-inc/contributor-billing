import type { PHDocument } from "document-model";
import type { InvoiceAction } from "./actions.js";
import type { InvoicePHState } from "./ph-factories.js";
import type { InvoiceState } from "./schema/types.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type InvoiceLocalState = Record<PropertyKey, never>;
export type InvoiceDocument = PHDocument<InvoicePHState>;
export type { InvoiceState, InvoiceLocalState, InvoiceAction };
