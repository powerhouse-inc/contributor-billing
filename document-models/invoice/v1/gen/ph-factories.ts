/**
 * Factory methods for creating InvoiceDocument instances
 */
import type { PHAuthState, PHDocumentState, PHBaseState } from "document-model";
import { createBaseState, defaultBaseState } from "document-model/core";
import type {
  InvoiceDocument,
  InvoiceLocalState,
  InvoiceGlobalState,
  InvoicePHState,
} from "./types.js";
import { createDocument } from "./utils.js";

export function defaultGlobalState(): InvoiceGlobalState {
  return {
    status: "DRAFT",
    invoiceNo: "",
    dateIssued: null,
    dateDue: null,
    dateDelivered: null,
    issuer: {
      id: null,
      name: null,
      address: null,
      contactInfo: null,
      country: null,
      paymentRouting: null,
    },
    payer: {
      id: null,
      name: null,
      address: null,
      contactInfo: null,
      country: null,
      paymentRouting: null,
    },
    currency: "",
    lineItems: [],
    totalPriceTaxExcl: 0,
    totalPriceTaxIncl: 0,
    notes: null,
    rejections: [],
    payments: [],
    payAfter: null,
    invoiceTags: [],
    exported: {
      timestamp: null,
      exportedLineItems: [],
    },
    closureReason: null,
  };
}

export function defaultLocalState(): InvoiceLocalState {
  return {};
}

export function defaultPHState(): InvoicePHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<InvoiceGlobalState>,
): InvoiceGlobalState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as InvoiceGlobalState;
}

export function createLocalState(
  state?: Partial<InvoiceLocalState>,
): InvoiceLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as InvoiceLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<InvoiceGlobalState>,
  localState?: Partial<InvoiceLocalState>,
): InvoicePHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

/**
 * Creates a InvoiceDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createInvoiceDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<InvoiceGlobalState>;
    local?: Partial<InvoiceLocalState>;
  }>,
): InvoiceDocument {
  const document = createDocument(
    state
      ? createState(
          createBaseState(state.auth, state.document),
          state.global,
          state.local,
        )
      : undefined,
  );

  return document;
}
