import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type {
  SnapshotReportGlobalState,
  SnapshotReportLocalState,
} from "./types.js";
import type { SnapshotReportPHState } from "./types.js";
import { reducer } from "./reducer.js";
import { snapshotReportDocumentType } from "./document-type.js";
import {
  isSnapshotReportDocument,
  assertIsSnapshotReportDocument,
  isSnapshotReportState,
  assertIsSnapshotReportState,
} from "./document-schema.js";

export const initialGlobalState: SnapshotReportGlobalState = {
  ownerIds: [],
  accountsDocumentId: null,
  startDate: null,
  endDate: null,
  reportName: null,
  reportPeriodStart: null,
  reportPeriodEnd: null,
  snapshotAccounts: [],
};
export const initialLocalState: SnapshotReportLocalState = {};

export const utils: DocumentModelUtils<SnapshotReportPHState> = {
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

    document.header.documentType = snapshotReportDocumentType;

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
    return isSnapshotReportState(state);
  },
  assertIsStateOfType(state) {
    return assertIsSnapshotReportState(state);
  },
  isDocumentOfType(document) {
    return isSnapshotReportDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsSnapshotReportDocument(document);
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
