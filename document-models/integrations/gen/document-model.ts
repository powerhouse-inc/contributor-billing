import type { DocumentModelState } from "document-model";

export const documentModel: DocumentModelState = {
  id: "powerhouse/integrations",
  name: "Integrations",
  extension: ".phdm",
  description:
    "A place where to store different API keys used by other powerhouse packages.",
  author: {
    name: "Liberuum",
    website: "https://powerhouse.inc",
  },
  specifications: [
    {
      version: 1,
      changeLog: [],
      state: {
        global: {
          schema:
            "type IntegrationsState {\n  requestFinance: RequestFinance\n  gnosisSafe: GnosisSafe\n  googleCloud: GoogleCloud\n}\n\ntype RequestFinance {\n  apiKey: String\n  email: String\n}\n\ntype GnosisSafe {\n  safeAddress: EthereumAddress\n  signerPrivateKey: String\n}\n\ntype GoogleCloud {\n  projectId: String\n  location: String\n  processorId: String\n  keyFile: GoogleKeyFile\n}\n\ntype GoogleKeyFile {\n  type: String\n  project_id: String\n  private_key_id: String\n  private_key: String\n  client_email: String\n  client_id: String\n  auth_uri: String\n  token_uri: String\n  auth_provider_x509_cert_url: String\n  client_x509_cert_url: String\n  universe_domain: String\n}",
          initialValue: '"{}"',
          examples: [],
        },
        local: {
          schema: "",
          initialValue: '""',
          examples: [],
        },
      },
      modules: [
        {
          id: "7fbd9402-1079-4909-adec-2679eba37a7e",
          name: "integrations",
          description: "",
          operations: [
            {
              id: "1dc33e69-870b-40d8-bcef-450bf4cf07a4",
              name: "SET_REQUEST_FINANCE",
              description: "",
              schema:
                "input SetRequestFinanceInput {\n  apiKey: String\n  email: String\n}",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "872bbfbb-1f0d-4ee6-9516-ffab5b9fdba7",
              name: "SET_GNOSIS_SAFE",
              description: "",
              schema:
                "input SetGnosisSafeInput {\n  safeAddress: EthereumAddress\n  signerPrivateKey: String\n}",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "9adc73ea-3d7f-4e80-afd0-fc25476c569f",
              name: "SET_GOOGLE_CLOUD",
              description: "",
              schema:
                "input SetGoogleCloudInput {\n  projectId: String\n  location: String\n  processorId: String\n  keyFile: GoogleKeyFileInput\n}\n\ninput GoogleKeyFileInput {\n  type: String\n  project_id: String\n  private_key_id: String\n  private_key: String\n  client_email: String\n  client_id: String\n  auth_uri: String\n  token_uri: String\n  auth_provider_x509_cert_url: String\n  client_x509_cert_url: String\n  universe_domain: String\n}",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
          ],
        },
      ],
    },
  ],
};
