import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: ExpenseReport Document
  """
  type ExpenseReportQueries {
    getDocument(docId: PHID!, driveId: PHID): ExpenseReport
    getDocuments(driveId: String!): [ExpenseReport!]
  }

  type Query {
    ExpenseReport: ExpenseReportQueries
  }

  """
  Mutations: ExpenseReport
  """
  type Mutation {
    ExpenseReport_createDocument(name: String!, driveId: String): String

    ExpenseReport_addWallet(
      driveId: String
      docId: PHID
      input: ExpenseReport_AddWalletInput
    ): Int
    ExpenseReport_removeWallet(
      driveId: String
      docId: PHID
      input: ExpenseReport_RemoveWalletInput
    ): Int
    ExpenseReport_addBillingStatement(
      driveId: String
      docId: PHID
      input: ExpenseReport_AddBillingStatementInput
    ): Int
    ExpenseReport_removeBillingStatement(
      driveId: String
      docId: PHID
      input: ExpenseReport_RemoveBillingStatementInput
    ): Int
    ExpenseReport_addLineItem(
      driveId: String
      docId: PHID
      input: ExpenseReport_AddLineItemInput
    ): Int
    ExpenseReport_updateLineItem(
      driveId: String
      docId: PHID
      input: ExpenseReport_UpdateLineItemInput
    ): Int
    ExpenseReport_removeLineItem(
      driveId: String
      docId: PHID
      input: ExpenseReport_RemoveLineItemInput
    ): Int
    ExpenseReport_addLineItemGroup(
      driveId: String
      docId: PHID
      input: ExpenseReport_AddLineItemGroupInput
    ): Int
    ExpenseReport_updateLineItemGroup(
      driveId: String
      docId: PHID
      input: ExpenseReport_UpdateLineItemGroupInput
    ): Int
    ExpenseReport_removeLineItemGroup(
      driveId: String
      docId: PHID
      input: ExpenseReport_RemoveLineItemGroupInput
    ): Int
    ExpenseReport_setGroupTotals(
      driveId: String
      docId: PHID
      input: ExpenseReport_SetGroupTotalsInput
    ): Int
    ExpenseReport_removeGroupTotals(
      driveId: String
      docId: PHID
      input: ExpenseReport_RemoveGroupTotalsInput
    ): Int
    ExpenseReport_setPeriodStart(
      driveId: String
      docId: PHID
      input: ExpenseReport_SetPeriodStartInput
    ): Int
    ExpenseReport_setPeriodEnd(
      driveId: String
      docId: PHID
      input: ExpenseReport_SetPeriodEndInput
    ): Int
    ExpenseReport_updateWallet(
      driveId: String
      docId: PHID
      input: ExpenseReport_UpdateWalletInput
    ): Int
  }

  """
  Module: Wallet
  """
  input ExpenseReport_AddWalletInput {
    wallet: EthereumAddress!
    name: String
  }
  input ExpenseReport_RemoveWalletInput {
    wallet: EthereumAddress!
  }
  input ExpenseReport_AddBillingStatementInput {
    wallet: EthereumAddress!
    billingStatementId: OID!
  }
  input ExpenseReport_RemoveBillingStatementInput {
    wallet: EthereumAddress!
    billingStatementId: OID!
  }
  input ExpenseReport_AddLineItemInput {
    wallet: EthereumAddress!
    lineItem: ExpenseReport_LineItemInput!
  }

  input ExpenseReport_LineItemInput {
    id: ID!
    label: String
    group: ID
    budget: Float
    actuals: Float
    forecast: Float
    payments: Float
    comments: String
  }
  input ExpenseReport_UpdateLineItemInput {
    wallet: EthereumAddress!
    lineItemId: ID!
    label: String
    group: ID
    budget: Float
    actuals: Float
    forecast: Float
    payments: Float
    comments: String
  }
  input ExpenseReport_RemoveLineItemInput {
    wallet: EthereumAddress!
    lineItemId: ID!
  }
  input ExpenseReport_AddLineItemGroupInput {
    id: ID!
    label: String
    parentId: ID
  }
  input ExpenseReport_UpdateLineItemGroupInput {
    id: ID!
    label: String
    parentId: ID
  }
  input ExpenseReport_RemoveLineItemGroupInput {
    id: ID!
  }
  input ExpenseReport_SetGroupTotalsInput {
    wallet: EthereumAddress!
    groupTotals: ExpenseReport_GroupTotalsInput!
  }

  input ExpenseReport_GroupTotalsInput {
    group: ID!
    totalBudget: Float
    totalForecast: Float
    totalActuals: Float
    totalPayments: Float
  }
  input ExpenseReport_RemoveGroupTotalsInput {
    wallet: EthereumAddress!
    groupId: ID!
  }
  input ExpenseReport_SetPeriodStartInput {
    periodStart: DateTime!
  }
  input ExpenseReport_SetPeriodEndInput {
    periodEnd: DateTime!
  }
  input ExpenseReport_UpdateWalletInput {
    address: EthereumAddress!
    name: String
  }
`;
