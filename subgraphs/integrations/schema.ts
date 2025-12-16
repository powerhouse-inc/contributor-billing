import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: Integrations Document
  """
  type IntegrationsQueries {
    getDocument(docId: PHID!, driveId: PHID): Integrations
    getDocuments(driveId: String!): [Integrations!]
  }

  type Query {
    Integrations: IntegrationsQueries
  }

  """
  Mutations: Integrations
  """
  type Mutation {
    Integrations_createDocument(name: String!, driveId: String): String

    Integrations_setRequestFinance(
      driveId: String
      docId: PHID
      input: Integrations_SetRequestFinanceInput
    ): Int
    Integrations_setGnosisSafe(
      driveId: String
      docId: PHID
      input: Integrations_SetGnosisSafeInput
    ): Int
    Integrations_setGoogleCloud(
      driveId: String
      docId: PHID
      input: Integrations_SetGoogleCloudInput
    ): Int
  }

  """
  Module: Integrations
  """
  input Integrations_SetRequestFinanceInput {
    apiKey: String
    email: String
  }
  input Integrations_SetGnosisSafeInput {
    safeAddress: EthereumAddress
    signerPrivateKey: String
  }
  input Integrations_SetGoogleCloudInput {
    projectId: String
    location: String
    processorId: String
    keyFile: Integrations_GoogleKeyFileInput
  }

  input Integrations_GoogleKeyFileInput {
    type: String
    project_id: String
    private_key_id: String
    private_key: String
    client_email: String
    client_id: String
    auth_uri: String
    token_uri: String
    auth_provider_x509_cert_url: String
    client_x509_cert_url: String
    universe_domain: String
  }
`;
