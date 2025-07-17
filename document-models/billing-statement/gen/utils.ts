import {
  type DocumentModelUtils,
  baseCreateDocument,
  baseCreateExtendedState,
  baseSaveToFile,
  baseSaveToFileHandle,
  baseLoadFromFile,
  baseLoadFromInput,
  generateId,
} from "document-model";
import {
  type BillingStatementDocument,
  type BillingStatementState,
  type BillingStatementLocalState,
} from "./types.js";
import { reducer } from "./reducer.js";

export const initialGlobalState: BillingStatementState = {
  contributor: "",
  dateIssued: "2025-06-10T15:42:17.873Z",
  dateDue: "2025-06-10T15:42:17.873Z",
  lineItems: [],
  status: "DRAFT",
  currency: "",
  totalCash: 0,
  totalPowt: 0,
  notes: "",
};
export const initialLocalState: BillingStatementLocalState = {};

const utils: DocumentModelUtils<BillingStatementDocument> = {
  fileExtension: ".phdm",
  createState(state) {
    return {
      global: { ...initialGlobalState, ...state?.global },
      local: { ...initialLocalState, ...state?.local },
    };
  },
  createExtendedState(extendedState) {
    return baseCreateExtendedState({ ...extendedState }, utils.createState);
  },
  createDocument(state) {
    const document = baseCreateDocument(
      utils.createExtendedState(state),
      utils.createState,
    );

    document.header.documentType = "powerhouse/billing-statement";

    // for backwards compatibility, but this is NOT a valid signed document id
    document.header.id = generateId();

    return document;
  },
  saveToFile(document, path, name) {
    return baseSaveToFile(document, path, ".phdm", name);
  },
  saveToFileHandle(document, input) {
    return baseSaveToFileHandle(document, input);
  },
  loadFromFile(path) {
    return baseLoadFromFile(path, reducer);
  },
  loadFromInput(input) {
    return baseLoadFromInput(input, reducer);
  },
};

export default utils;
