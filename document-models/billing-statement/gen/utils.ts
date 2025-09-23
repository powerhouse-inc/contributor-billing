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
import {
  type BillingStatementState,
  type BillingStatementLocalState,
} from "./types.js";
import { BillingStatementPHState } from "./ph-factories.js";
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

export const createState: CreateState<BillingStatementPHState> = (state) => {
  return {
    ...defaultBaseState(),
    global: { ...initialGlobalState, ...(state?.global ?? {}) },
    local: { ...initialLocalState, ...(state?.local ?? {}) },
  };
};

export const createDocument: CreateDocument<BillingStatementPHState> = (
  state,
) => {
  const document = baseCreateDocument(createState, state);
  document.header.documentType = "powerhouse/billing-statement";
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

export const loadFromFile: LoadFromFile<BillingStatementPHState> = (path) => {
  return baseLoadFromFile(path, reducer);
};

export const loadFromInput: LoadFromInput<BillingStatementPHState> = (
  input,
) => {
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
