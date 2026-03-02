import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type { AccountsGlobalState, AccountsLocalState } from "./types.js";
import type { AccountsPHState } from "./types.js";
import { reducer } from "./reducer.js";
import { accountsDocumentType } from "./document-type.js";
import {
  isAccountsDocument,
  assertIsAccountsDocument,
  isAccountsState,
  assertIsAccountsState,
} from "./document-schema.js";

export const initialGlobalState: AccountsGlobalState = {
  accounts: [],
};
export const initialLocalState: AccountsLocalState = {};

export const utils: DocumentModelUtils<AccountsPHState> = {
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

    document.header.documentType = accountsDocumentType;

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
    return isAccountsState(state);
  },
  assertIsStateOfType(state) {
    return assertIsAccountsState(state);
  },
  isDocumentOfType(document) {
    return isAccountsDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsAccountsDocument(document);
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
