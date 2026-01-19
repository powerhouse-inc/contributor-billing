import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: SnapshotReport Document
  """
  type SnapshotReportQueries {
    getDocument(docId: PHID!, driveId: PHID): SnapshotReport
    getDocuments(driveId: String!): [SnapshotReport!]
  }

  type Query {
    SnapshotReport: SnapshotReportQueries
  }

  """
  Mutations: SnapshotReport
  """
  type Mutation {
    SnapshotReport_createDocument(name: String!, driveId: String): String

    SnapshotReport_setReportConfig(
      driveId: String
      docId: PHID
      input: SnapshotReport_SetReportConfigInput
    ): Int
    SnapshotReport_setAccountsDocument(
      driveId: String
      docId: PHID
      input: SnapshotReport_SetAccountsDocumentInput
    ): Int
    SnapshotReport_setPeriod(
      driveId: String
      docId: PHID
      input: SnapshotReport_SetPeriodInput
    ): Int
    SnapshotReport_setOwnerId(
      driveId: String
      docId: PHID
      input: SnapshotReport_SetOwnerIdInput
    ): Int
    SnapshotReport_setPeriodStart(
      driveId: String
      docId: PHID
      input: SnapshotReport_SetPeriodStartInput
    ): Int
    SnapshotReport_setPeriodEnd(
      driveId: String
      docId: PHID
      input: SnapshotReport_SetPeriodEndInput
    ): Int
    SnapshotReport_addSnapshotAccount(
      driveId: String
      docId: PHID
      input: SnapshotReport_AddSnapshotAccountInput
    ): Int
    SnapshotReport_updateSnapshotAccountType(
      driveId: String
      docId: PHID
      input: SnapshotReport_UpdateSnapshotAccountTypeInput
    ): Int
    SnapshotReport_removeSnapshotAccount(
      driveId: String
      docId: PHID
      input: SnapshotReport_RemoveSnapshotAccountInput
    ): Int
    SnapshotReport_setStartingBalance(
      driveId: String
      docId: PHID
      input: SnapshotReport_SetStartingBalanceInput
    ): Int
    SnapshotReport_setEndingBalance(
      driveId: String
      docId: PHID
      input: SnapshotReport_SetEndingBalanceInput
    ): Int
    SnapshotReport_removeStartingBalance(
      driveId: String
      docId: PHID
      input: SnapshotReport_RemoveStartingBalanceInput
    ): Int
    SnapshotReport_removeEndingBalance(
      driveId: String
      docId: PHID
      input: SnapshotReport_RemoveEndingBalanceInput
    ): Int
    SnapshotReport_addTransaction(
      driveId: String
      docId: PHID
      input: SnapshotReport_AddTransactionInput
    ): Int
    SnapshotReport_removeTransaction(
      driveId: String
      docId: PHID
      input: SnapshotReport_RemoveTransactionInput
    ): Int
    SnapshotReport_updateTransactionFlowType(
      driveId: String
      docId: PHID
      input: SnapshotReport_UpdateTransactionFlowTypeInput
    ): Int
    SnapshotReport_recalculateFlowTypes(
      driveId: String
      docId: PHID
      input: SnapshotReport_RecalculateFlowTypesInput
    ): Int
  }

  """
  Module: Configuration
  """
  input SnapshotReport_SetReportConfigInput {
    reportName: String
    startDate: DateTime
    endDate: DateTime
    accountsDocumentId: PHID
    ownerId: PHID
  }
  input SnapshotReport_SetAccountsDocumentInput {
    accountsDocumentId: PHID!
  }
  input SnapshotReport_SetPeriodInput {
    startDate: DateTime!
    endDate: DateTime!
  }
  input SnapshotReport_SetOwnerIdInput {
    ownerId: PHID!
  }
  input SnapshotReport_SetPeriodStartInput {
    periodStart: DateTime!
  }
  input SnapshotReport_SetPeriodEndInput {
    periodEnd: DateTime!
  }

  """
  Module: Accounts
  """
  input SnapshotReport_AddSnapshotAccountInput {
    id: OID!
    accountId: OID!
    accountAddress: String!
    accountName: String!
    type: SnapshotReport_AccountTypeInput!
    accountTransactionsId: PHID
  }
  input SnapshotReport_UpdateSnapshotAccountTypeInput {
    id: OID!
    type: SnapshotReport_AccountTypeInput!
  }
  input SnapshotReport_RemoveSnapshotAccountInput {
    id: OID!
  }

  """
  Module: Balances
  """
  input SnapshotReport_SetStartingBalanceInput {
    accountId: OID!
    balanceId: OID!
    token: Currency!
    amount: Amount_Currency!
  }
  input SnapshotReport_SetEndingBalanceInput {
    accountId: OID!
    balanceId: OID!
    token: Currency!
    amount: Amount_Currency!
  }
  input SnapshotReport_RemoveStartingBalanceInput {
    accountId: OID!
    balanceId: OID!
  }
  input SnapshotReport_RemoveEndingBalanceInput {
    accountId: OID!
    balanceId: OID!
  }

  """
  Module: Transactions
  """
  input SnapshotReport_AddTransactionInput {
    accountId: OID!
    id: OID!
    transactionId: String!
    counterParty: EthereumAddress
    amount: Amount_Currency!
    datetime: DateTime!
    txHash: String!
    token: Currency!
    blockNumber: Int
    direction: SnapshotReport_TransactionDirectionInput!
    flowType: SnapshotReport_TransactionFlowTypeInput
    counterPartyAccountId: OID
  }

  input SnapshotReport_RemoveTransactionInput {
    id: OID!
  }
  input SnapshotReport_UpdateTransactionFlowTypeInput {
    id: OID!
    flowType: SnapshotReport_TransactionFlowTypeInput!
  }
  input SnapshotReport_RecalculateFlowTypesInput {
    _: String
  }
`;
