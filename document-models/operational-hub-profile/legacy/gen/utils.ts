import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type {
  OperationalHubProfileGlobalState,
  OperationalHubProfileLocalState,
} from "./types.js";
import type { OperationalHubProfilePHState } from "./types.js";
import { reducer } from "./reducer.js";
import { operationalHubProfileDocumentType } from "./document-type.js";
import {
  isOperationalHubProfileDocument,
  assertIsOperationalHubProfileDocument,
  isOperationalHubProfileState,
  assertIsOperationalHubProfileState,
} from "./document-schema.js";

export const initialGlobalState: OperationalHubProfileGlobalState = {
  name: "",
  operatorTeam: null,
  subteams: [],
};
export const initialLocalState: OperationalHubProfileLocalState = {};

export const utils: DocumentModelUtils<OperationalHubProfilePHState> = {
  fileExtension: "ohp",
  createState(state) {
    return {
      ...defaultBaseState(),
      global: { ...initialGlobalState, ...state?.global },
      local: { ...initialLocalState, ...state?.local },
    };
  },
  createDocument(state) {
    const document = baseCreateDocument(utils.createState, state);

    document.header.documentType = operationalHubProfileDocumentType;

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
    return isOperationalHubProfileState(state);
  },
  assertIsStateOfType(state) {
    return assertIsOperationalHubProfileState(state);
  },
  isDocumentOfType(document) {
    return isOperationalHubProfileDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsOperationalHubProfileDocument(document);
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
