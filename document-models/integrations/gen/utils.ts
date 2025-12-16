import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type {
  IntegrationsGlobalState,
  IntegrationsLocalState,
} from "./types.js";
import type { IntegrationsPHState } from "./types.js";
import { reducer } from "./reducer.js";
import { integrationsDocumentType } from "./document-type.js";
import {
  isIntegrationsDocument,
  assertIsIntegrationsDocument,
  isIntegrationsState,
  assertIsIntegrationsState,
} from "./document-schema.js";

export const initialGlobalState: IntegrationsGlobalState = {
  gnosisSafe: null,
  googleCloud: null,
  requestFinance: null,
};
export const initialLocalState: IntegrationsLocalState = {};

export const utils: DocumentModelUtils<IntegrationsPHState> = {
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

    document.header.documentType = integrationsDocumentType;

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
    return isIntegrationsState(state);
  },
  assertIsStateOfType(state) {
    return assertIsIntegrationsState(state);
  },
  isDocumentOfType(document) {
    return isIntegrationsDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsIntegrationsDocument(document);
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
