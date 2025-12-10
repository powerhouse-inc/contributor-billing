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
      docId: PHID!
      input: AccountTransactions_SetAccountInput!
    ): Boolean

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
    AccountTransactions_fetchTransactionsFromAlchemy(
      docId: PHID!
      address: EthereumAddress!
      fromBlock: String
    ): AccountTransactions_AlchemyFetchResult
    AccountTransactions_getTransactionsFromAlchemy(
      address: EthereumAddress!
      fromBlock: String
    ): AccountTransactions_AlchemyTransactionsResult
  }

  """
  Response type for Alchemy fetch operation
  """
  type AccountTransactions_AlchemyFetchResult {
    success: Boolean!
    transactionsAdded: Int!
    message: String!
  }

  """
  Response type for Alchemy get transactions operation
  """
  type AccountTransactions_AlchemyTransactionsResult {
    success: Boolean!
    transactions: [AccountTransactions_TransactionData!]!
    message: String!
    transactionsCount: Int!
  }

  """
  Transaction data from Alchemy
  """
  type AccountTransactions_TransactionData {
    counterParty: EthereumAddress!
    amount: Amount_Currency!
    txHash: String!
    token: Currency!
    blockNumber: Int!
    datetime: DateTime!
    accountingPeriod: String!
    from: EthereumAddress!
    to: EthereumAddress!
    direction: String!
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
    budget: OID
    accountingPeriod: String!
  }
  input AccountTransactions_UpdateTransactionInput {
    id: ID!
    counterParty: EthereumAddress
    amount: Amount_Currency
    datetime: DateTime
    txHash: String
    token: Currency
    blockNumber: Int
    budget: OID
    accountingPeriod: String
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

  """
  Input for setting account information
  """
  input AccountTransactions_SetAccountInput {
    address: EthereumAddress!
    name: String
  }
`;
