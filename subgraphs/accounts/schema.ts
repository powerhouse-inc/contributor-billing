import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: Accounts Document
  """
  type AccountsQueries {
    getDocument(docId: PHID!, driveId: PHID): Accounts
    getDocuments(driveId: String!): [Accounts!]
  }

  type Query {
    Accounts: AccountsQueries
  }

  """
  Mutations: Accounts
  """
  type Mutation {
    Accounts_createDocument(name: String!, driveId: String): String

    Accounts_addAccount(
      driveId: String
      docId: PHID
      input: Accounts_AddAccountInput
    ): Int
    Accounts_updateAccount(
      driveId: String
      docId: PHID
      input: Accounts_UpdateAccountInput
    ): Int
    Accounts_deleteAccount(
      driveId: String
      docId: PHID
      input: Accounts_DeleteAccountInput
    ): Int
    Accounts_updateKycStatus(
      driveId: String
      docId: PHID
      input: Accounts_UpdateKycStatusInput
    ): Int
  }

  """
  Module: Accounts
  """
  input Accounts_AddAccountInput {
    id: OID!
    account: String!
    name: String!
    budgetPath: String
    accountTransactionsId: PHID
    chain: [String!]
    type: AccountTypeInput
    owners: [String!]
    KycAmlStatus: KycAmlStatusTypeInput
  }

  enum AccountTypeInput {
    Source
    Internal
    Destination
    External
  }

  enum KycAmlStatusTypeInput {
    PASSED
    PENDING
    FAILED
  }
  input Accounts_UpdateAccountInput {
    id: OID!
    account: String
    name: String
    budgetPath: String
    accountTransactionsId: PHID
    chain: [String!]
    type: AccountTypeInput
    owners: [String!]
    KycAmlStatus: KycAmlStatusTypeInput
  }

  input Accounts_DeleteAccountInput {
    id: OID!
  }
  input Accounts_UpdateKycStatusInput {
    id: OID!
    KycAmlStatus: KycAmlStatusTypeInput!
  }
`;
