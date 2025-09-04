/**
 * Factory methods for creating InvoiceDocument instances
 */

import {
  createBaseState,
  defaultBaseState,
  type PHAuthState,
  type PHDocumentState,
  type PHBaseState,
} from "document-model";
import type {
  InvoiceDocument,
  InvoiceLocalState,
  InvoiceState,
} from "./types.js";
import { createDocument } from "./utils.js";

export type InvoicePHState = PHBaseState & {
  global: InvoiceState;
  local: InvoiceLocalState;
};

export function defaultGlobalState(): InvoiceState {
  return {
    invoiceNo: "",
    dateIssued: "",
    dateDue: "",
    dateDelivered: null,
    payAfter: null,
    status: "DRAFT",
    issuer: {
      id: null,
      name: "",
      address: {
        streetAddress: "",
        extendedAddress: "",
        city: "",
        postalCode: "",
        country: "",
        stateProvince: "",
      },
      contactInfo: {
        tel: "",
        email: "",
      },
      country: "",
      paymentRouting: {
        bank: {
          name: "",
          address: {
            streetAddress: "",
            extendedAddress: "",
            city: "",
            postalCode: "",
            country: "",
            stateProvince: "",
          },
          ABA: "",
          BIC: "",
          SWIFT: "",
          accountNum: "",
          accountType: "CHECKING",
          beneficiary: "",
          intermediaryBank: {
            name: "",
            address: {
              streetAddress: "",
              extendedAddress: "",
              city: "",
              postalCode: "",
              country: "",
              stateProvince: "",
            },
            ABA: "",
            BIC: "",
            SWIFT: "",
            accountNum: "",
            accountType: "CHECKING",
            beneficiary: "",
            memo: "",
          },
          memo: "",
        },
        wallet: {
          rpc: "",
          chainName: "",
          chainId: "",
          address: "",
        },
      },
    },
    payer: {
      id: null,
      name: "",
      address: {
        streetAddress: "",
        extendedAddress: "",
        city: "",
        postalCode: "",
        country: "",
        stateProvince: "",
      },
      contactInfo: {
        tel: "",
        email: "",
      },
      country: "",
      paymentRouting: {
        bank: {
          name: "",
          address: {
            streetAddress: "",
            extendedAddress: "",
            city: "",
            postalCode: "",
            country: "",
            stateProvince: "",
          },
          ABA: "",
          BIC: "",
          SWIFT: "",
          accountNum: "",
          accountType: "CHECKING",
          beneficiary: "",
          intermediaryBank: {
            name: "",
            address: {
              streetAddress: "",
              extendedAddress: "",
              city: "",
              postalCode: "",
              country: "",
              stateProvince: "",
            },
            ABA: "",
            BIC: "",
            SWIFT: "",
            accountNum: "",
            accountType: "CHECKING",
            beneficiary: "",
            memo: "",
          },
          memo: "",
        },
        wallet: {
          rpc: "",
          chainName: "",
          chainId: "",
          address: "",
        },
      },
    },
    currency: "",
    lineItems: [],
    totalPriceTaxExcl: 0,
    totalPriceTaxIncl: 0,
    notes: null,
    invoiceTags: [],
    rejections: [],
    payments: [],
    exported: {
      exportedLineItems: [],
      timestamp: "",
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

export function createGlobalState(state?: Partial<InvoiceState>): InvoiceState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as InvoiceState;
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
  globalState?: Partial<InvoiceState>,
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
    global?: Partial<InvoiceState>;
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
