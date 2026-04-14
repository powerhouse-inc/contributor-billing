import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model";
import { reducer } from "./reducer.js";
import { operationalHubProfileDocumentType } from "./document-type.js";
import {
  assertIsOperationalHubProfileDocument,
  assertIsOperationalHubProfileState,
  isOperationalHubProfileDocument,
  isOperationalHubProfileState,
} from "./document-schema.js";
import type {
  OperationalHubProfileGlobalState,
  OperationalHubProfileLocalState,
  OperationalHubProfilePHState,
} from "./types.js";

export const initialGlobalState: OperationalHubProfileGlobalState = {
  name: "",
  operatorTeam: null,
  subteams: [],
};
export const initialLocalState: OperationalHubProfileLocalState = {};

export const utils: DocumentModelUtils<OperationalHubProfilePHState> = {
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
