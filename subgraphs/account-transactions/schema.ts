import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: AccountTransactions Document
  """
  type AccountTransactionsQueries {
    getDocument(docId: PHID!, driveId: PHID): AccountTransactions
    getDocuments(driveId: String!): [AccountTransactions!]
  }

  type Query {
    AccountTransactions: AccountTransactionsQueries
  }

  """
  Mutations: AccountTransactions
  """
  type Mutation {
    AccountTransactions_createDocument(name: String!, driveId: String): String

    AccountTransactions_setAccount(
      driveId: String
      docId: PHID
      input: AccountTransactions_SetAccountInput
    ): Int
    AccountTransactions_addTransaction(
      driveId: String
      docId: PHID
      input: AccountTransactions_AddTransactionInput
    ): Int
    AccountTransactions_updateTransaction(
      driveId: String
      docId: PHID
      input: AccountTransactions_UpdateTransactionInput
    ): Int
    AccountTransactions_deleteTransaction(
      driveId: String
      docId: PHID
      input: AccountTransactions_DeleteTransactionInput
    ): Int
    AccountTransactions_updateTransactionPeriod(
      driveId: String
      docId: PHID
      input: AccountTransactions_UpdateTransactionPeriodInput
    ): Int
    AccountTransactions_addBudget(
      driveId: String
      docId: PHID
      input: AccountTransactions_AddBudgetInput
    ): Int
    AccountTransactions_updateBudget(
      driveId: String
      docId: PHID
      input: AccountTransactions_UpdateBudgetInput
    ): Int
    AccountTransactions_deleteBudget(
      driveId: String
      docId: PHID
      input: AccountTransactions_DeleteBudgetInput
    ): Int
  }

  """
  Module: Account
  """
  input AccountTransactions_SetAccountInput {
    id: OID!
    account: String!
    name: String!
    budgetPath: String
    accountTransactionsId: PHID
    chain: [String!]
    type: String
    owners: [String!]
    KycAmlStatus: String
  }

  """
  Module: Transactions
  """
  input AccountTransactions_AddTransactionInput {
    id: ID!
    counterParty: EthereumAddress
    amount: Amount_Currency!
    datetime: DateTime!
    txHash: String!
    token: Currency!
    blockNumber: Int
    uniqueId: String
    budget: OID
    accountingPeriod: String!
    direction: AccountTransactions_TransactionDirectionInput!
  }
  input AccountTransactions_UpdateTransactionInput {
    id: ID!
    counterParty: EthereumAddress
    amount: Amount_Currency
    datetime: DateTime
    txHash: String
    token: Currency
    blockNumber: Int
    uniqueId: String
    budget: OID
    accountingPeriod: String
    direction: AccountTransactions_TransactionDirectionInput
  }
  input AccountTransactions_DeleteTransactionInput {
    id: ID!
  }
  input AccountTransactions_UpdateTransactionPeriodInput {
    id: ID!
    accountingPeriod: String!
  }

  """
  Module: Budgets
  """
  input AccountTransactions_AddBudgetInput {
    id: OID!
    name: OLabel
  }
  input AccountTransactions_UpdateBudgetInput {
    id: OID!
    name: OLabel
  }
  input AccountTransactions_DeleteBudgetInput {
    id: OID!
  }
`;
