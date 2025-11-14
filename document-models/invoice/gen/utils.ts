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

export const initialGlobalState: InvoiceGlobalState = {
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
  exported: [],
};
export const initialLocalState: InvoiceLocalState = {};

const utils: DocumentModelUtils<InvoicePHState> = {
  fileExtension: ".phdm",
  createState(state) {
    return {
      ...defaultBaseState(),
      global: { ...initialGlobalState, ...state?.global },
      local: { ...initialLocalState, ...state?.local },
    };
  },
  createDocument(state) {
    const document = baseCreateDocument(utils.createState, state);

    document.header.documentType = "powerhouse/invoice";

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
};

export const createDocument = utils.createDocument;
export const createState = utils.createState;
export const saveToFileHandle = utils.saveToFileHandle;
export const loadFromInput = utils.loadFromInput;

export default utils;
