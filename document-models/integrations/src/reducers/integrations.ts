/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import type { IntegrationsIntegrationsOperations } from "../../gen/integrations/operations.js";

export const reducer: IntegrationsIntegrationsOperations = {
  setRequestFinanceOperation(state, action, dispatch) {
    const requestFinance = {
      apiKey: action.input.apiKey || '',
      email: action.input.email || '',
    };

    state.requestFinance = requestFinance;


  },
  setGnosisSafeOperation(state, action, dispatch) {
    const gnosisSafe = {
      safeAddress: action.input.safeAddress || '',
      signerPrivateKey: action.input.signerPrivateKey || '',
    };

    state.gnosisSafe = gnosisSafe;

  },
  setGoogleCloudOperation(state, action, dispatch) {
    const googleCloud = {
      projectId: action.input.projectId || '',
      location: action.input.location || '',
      processorId: action.input.processorId || '',
      keyFile: {
        type: action.input.keyFile?.type || '',
        project_id: action.input.keyFile?.project_id || '',
        private_key_id: action.input.keyFile?.private_key_id || '',
        private_key: action.input.keyFile?.private_key || '',
        client_email: action.input.keyFile?.client_email || '',
        client_id: action.input.keyFile?.client_id || '',
        auth_uri: action.input.keyFile?.auth_uri || '',
        token_uri: action.input.keyFile?.token_uri || '',
        auth_provider_x509_cert_url: action.input.keyFile?.auth_provider_x509_cert_url || '',
        client_x509_cert_url: action.input.keyFile?.client_x509_cert_url || '',
        universe_domain: action.input.keyFile?.universe_domain || '',
      },
    };

    state.googleCloud = googleCloud;

  },
};
