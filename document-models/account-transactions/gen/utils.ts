import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type {
  AccountTransactionsGlobalState,
  AccountTransactionsLocalState,
} from "./types.js";
import type { AccountTransactionsPHState } from "./types.js";
import { reducer } from "./reducer.js";
import { accountTransactionsDocumentType } from "./document-type.js";
import {
  isAccountTransactionsDocument,
  assertIsAccountTransactionsDocument,
  isAccountTransactionsState,
  assertIsAccountTransactionsState,
} from "./document-schema.js";

export const initialGlobalState: AccountTransactionsGlobalState = {
  account: {
    id: "",
    account: "",
    name: "",
    budgetPath: null,
    accountTransactionsId: null,
    chain: null,
    type: null,
    owners: null,
    KycAmlStatus: null,
  },
  transactions: [],
  budgets: [],
};
export const initialLocalState: AccountTransactionsLocalState = {};

export const utils: DocumentModelUtils<AccountTransactionsPHState> = {
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

    document.header.documentType = accountTransactionsDocumentType;

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
    return isAccountTransactionsState(state);
  },
  assertIsStateOfType(state) {
    return assertIsAccountTransactionsState(state);
  },
  isDocumentOfType(document) {
    return isAccountTransactionsDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsAccountTransactionsDocument(document);
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
