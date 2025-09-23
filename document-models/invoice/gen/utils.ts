import {
  type CreateDocument,
  type CreateState,
  type LoadFromFile,
  type LoadFromInput,
  baseCreateDocument,
  baseSaveToFile,
  baseSaveToFileHandle,
  baseLoadFromFile,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model";
import { type InvoiceState, type InvoiceLocalState } from "./types.js";
import { InvoicePHState } from "./ph-factories.js";
import { reducer } from "./reducer.js";

export const initialGlobalState: InvoiceState = {
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
export const initialLocalState: InvoiceLocalState = {};

export const createState: CreateState<InvoicePHState> = (state) => {
  return {
    ...defaultBaseState(),
    global: { ...initialGlobalState, ...(state?.global ?? {}) },
    local: { ...initialLocalState, ...(state?.local ?? {}) },
  };
};

export const createDocument: CreateDocument<InvoicePHState> = (state) => {
  const document = baseCreateDocument(createState, state);
  document.header.documentType = "powerhouse/invoice";
  // for backwards compatibility, but this is NOT a valid signed document id
  document.header.id = generateId();
  return document;
};

export const saveToFile = (document: any, path: string, name?: string) => {
  return baseSaveToFile(document, path, ".phdm", name);
};

export const saveToFileHandle = (document: any, input: any) => {
  return baseSaveToFileHandle(document, input);
};

export const loadFromFile: LoadFromFile<InvoicePHState> = (path) => {
  return baseLoadFromFile(path, reducer);
};

export const loadFromInput: LoadFromInput<InvoicePHState> = (input) => {
  return baseLoadFromInput(input, reducer);
};

const utils = {
  fileExtension: ".phdm",
  createState,
  createDocument,
  saveToFile,
  saveToFileHandle,
  loadFromFile,
  loadFromInput,
};

export default utils;
