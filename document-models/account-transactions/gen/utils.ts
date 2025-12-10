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

const utils: DocumentModelUtils<AccountTransactionsPHState> = {
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

    document.header.documentType = "powerhouse/account-transactions";

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
