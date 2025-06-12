import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Subgraph definition for BillingStatement (powerhouse/billing-statement)
  """
  type BillingStatementState {
    contributor: PHID # Change to AID when available
    dateIssued: DateTime!
    dateDue: DateTime
    lineItems: [BillingStatementLineItem!]!
    status: BillingStatementStatus!
    currency: String!
    totalCash: Float!
    totalPowt: Float!
    notes: String
  }

  type BillingStatementLineItem {
    id: OID!
    description: String!
    quantity: Float!
    unit: BillingStatementUnit!
    unitPricePwt: Float!
    unitPriceCash: Float!
    totalPricePwt: Float!
    totalPriceCash: Float!
    lineItemTag: [BillingStatementTag!]!
  }

  type BillingStatementTag {
    dimension: String!
    value: String!
    label: String
  }

  enum BillingStatementStatus {
    DRAFT
    ISSUED
    ACCEPTED
    REJECTED
    PAID
  }

  enum BillingStatementStatusInput {
    DRAFT
    ISSUED
    ACCEPTED
    REJECTED
    PAID
  }

  enum BillingStatementUnit {
    MINUTE
    HOUR
    DAY
    UNIT
  }

  enum BillingStatementUnitInput {
    MINUTE
    HOUR
    DAY
    UNIT
  }

  """
  Queries: BillingStatement
  """
  type BillingStatementQueries {
    getDocument(driveId: String, docId: PHID): BillingStatement
    getDocuments: [BillingStatement!]
  }

  type Query {
    BillingStatement: BillingStatementQueries
  }

  """
  Mutations: BillingStatement
  """
  type Mutation {
    BillingStatement_createDocument(driveId: String, name: String): String

    BillingStatement_editBillingStatement(
      driveId: String
      docId: PHID
      input: BillingStatement_EditBillingStatementInput
    ): Int
    BillingStatement_editContributor(
      driveId: String
      docId: PHID
      input: BillingStatement_EditContributorInput
    ): Int
    BillingStatement_editStatus(
      driveId: String
      docId: PHID
      input: BillingStatement_EditStatusInput
    ): Int
    BillingStatement_addLineItem(
      driveId: String
      docId: PHID
      input: BillingStatement_AddLineItemInput
    ): Int
    BillingStatement_editLineItem(
      driveId: String
      docId: PHID
      input: BillingStatement_EditLineItemInput
    ): Int
    BillingStatement_editLineItemTag(
      driveId: String
      docId: PHID
      input: BillingStatement_EditLineItemTagInput
    ): Int
  }

  """
  Module: General
  """
  input BillingStatement_EditBillingStatementInput {
    dateIssued: DateTime
    dateDue: DateTime
    currency: String
    notes: String
  }
  input BillingStatement_EditContributorInput {
    contributor: PHID!
  }
  input BillingStatement_EditStatusInput {
    status: BillingStatementStatusInput!
  }

  """
  Module: LineItems
  """
  input BillingStatement_AddLineItemInput {
    id: OID!
    description: String!
    quantity: Float!
    unit: BillingStatementUnitInput!
    unitPricePwt: Float!
    unitPriceCash: Float!
    totalPricePwt: Float!
    totalPriceCash: Float!
  }
  input BillingStatement_EditLineItemInput {
    id: OID!
    description: String
    quantity: Float
    unit: BillingStatementUnitInput!
    unitPricePwt: Float
    unitPriceCash: Float
    totalPricePwt: Float
    totalPriceCash: Float
  }

  """
  Module: Tags
  """
  input BillingStatement_EditLineItemTagInput {
    lineItemId: OID!
    dimension: String!
    value: String!
    label: String
  }
`;
