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

export const initialGlobalState: AccountsGlobalState = {
  accounts: [],
};
export const initialLocalState: AccountsLocalState = {};

const utils: DocumentModelUtils<AccountsPHState> = {
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

    document.header.documentType = "powerhouse/accounts";

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
  isStateOfType(state: unknown): state is AccountsPHState {
    return typeof state === "object" && state !== null && "global" in state;
  },
  assertIsStateOfType(state: unknown): asserts state is AccountsPHState {
    if (!utils.isStateOfType(state)) {
      throw new Error("Invalid Accounts state");
    }
  },
  isDocumentOfType(document: unknown): document is any {
    return typeof document === "object" && document !== null && "header" in document;
  },
  assertIsDocumentOfType(document: unknown): void {
    if (!utils.isDocumentOfType(document)) {
      throw new Error("Invalid Accounts document");
    }
  },
};

export const createDocument = utils.createDocument;
export const createState = utils.createState;
export const saveToFileHandle = utils.saveToFileHandle;
export const loadFromInput = utils.loadFromInput;

export default utils;
