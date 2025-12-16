import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type { InvoiceGlobalState, InvoiceLocalState } from "./types.js";
import type { InvoicePHState } from "./types.js";
import { reducer } from "./reducer.js";
import { invoiceDocumentType } from "./document-type.js";
import {
  isInvoiceDocument,
  assertIsInvoiceDocument,
  isInvoiceState,
  assertIsInvoiceState,
} from "./document-schema.js";

export const initialGlobalState: InvoiceGlobalState = {
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
export const initialLocalState: InvoiceLocalState = {};

export const utils: DocumentModelUtils<InvoicePHState> = {
  fileExtension: "",
  createState(state) {
    return {
      ...defaultBaseState(),
      global: { ...initialGlobalState, ...state?.global },
      local: { ...initialLocalState, ...state?.local },
    };
  },
  createDocument(state) {
    const document = baseCreateDocument(utils.createState, state);

    document.header.documentType = invoiceDocumentType;

    // for backwards compatibility, but this is NOT a valid signed document id
    document.header.id = generateId();

    return document;
  },
  saveToFileHandle(document, input) {
    return baseSaveToFileHandle(document, input);
  },
  loadFromInput(input) {
    return baseLoadFromInput(input, reducer);
  },
  isStateOfType(state) {
    return isInvoiceState(state);
  },
  assertIsStateOfType(state) {
    return assertIsInvoiceState(state);
  },
  isDocumentOfType(document) {
    return isInvoiceDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsInvoiceDocument(document);
  },
};

export const createDocument = utils.createDocument;
export const createState = utils.createState;
export const saveToFileHandle = utils.saveToFileHandle;
export const loadFromInput = utils.loadFromInput;
export const isStateOfType = utils.isStateOfType;
export const assertIsStateOfType = utils.assertIsStateOfType;
export const isDocumentOfType = utils.isDocumentOfType;
export const assertIsDocumentOfType = utils.assertIsDocumentOfType;
