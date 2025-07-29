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
  type IntegrationsDocument,
  type IntegrationsState,
  type IntegrationsLocalState,
} from "./types.js";
import { reducer } from "./reducer.js";

export const initialGlobalState: IntegrationsState = {
  gnosisSafe: {
    safeAddress: "",
    signerPrivateKey: "",
  },
  googleCloud: {
    projectId: "",
    location: "",
    processorId: "",
    keyFile: {
      type: "",
      project_id: "",
      private_key_id: "",
      private_key: "",
      client_email: "",
      client_id: "",
      auth_uri: "",
      token_uri: "",
      auth_provider_x509_cert_url: "",
      client_x509_cert_url: "",
      universe_domain: "",
    },
  },
  requestFinance: {
    apiKey: "",
    email: "",
  },
};
export const initialLocalState: IntegrationsLocalState = {};

const utils: DocumentModelUtils<IntegrationsDocument> = {
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

    document.header.documentType = "powerhouse/integrations";

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
