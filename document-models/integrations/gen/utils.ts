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
  type IntegrationsState,
  type IntegrationsLocalState,
} from "./types.js";
import { IntegrationsPHState } from "./ph-factories.js";
import { reducer } from "./reducer.js";

export const initialGlobalState: IntegrationsState = {
  gnosisSafe: {
    safeAddress: "",
    signerPrivateKey: "",
  },
  googleCloud: {
    keyFile: {
      project_id: "",
      client_email: "",
      private_key: "",
      auth_provider_x509_cert_url: "",
      auth_uri: "",
      client_id: "",
      client_x509_cert_url: "",
      private_key_id: "",
      token_uri: "",
      type: "",
      universe_domain: "",
    },
    location: "",
    processorId: "",
    projectId: "",
  },
  requestFinance: {
    apiKey: "",
    email: "",
  },
};
export const initialLocalState: IntegrationsLocalState = {};

export const createState: CreateState<IntegrationsPHState> = (state) => {
  return {
    ...defaultBaseState(),
    global: { ...initialGlobalState, ...(state?.global ?? {}) },
    local: { ...initialLocalState, ...(state?.local ?? {}) },
  };
};

export const createDocument: CreateDocument<IntegrationsPHState> = (state) => {
  const document = baseCreateDocument(createState, state);
  document.header.documentType = "powerhouse/integrations";
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

export const loadFromFile: LoadFromFile<IntegrationsPHState> = (path) => {
  return baseLoadFromFile(path, reducer);
};

export const loadFromInput: LoadFromInput<IntegrationsPHState> = (input) => {
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
