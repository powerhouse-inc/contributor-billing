import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: BillingStatement Document
  """
  type BillingStatementQueries {
    getDocument(docId: PHID!, driveId: PHID): BillingStatement
    getDocuments(driveId: String!): [BillingStatement!]
  }

  type Query {
    BillingStatement: BillingStatementQueries
  }

  """
  Mutations: BillingStatement
  """
  type Mutation {
    BillingStatement_createDocument(name: String!, driveId: String): String

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
    BillingStatement_deleteLineItem(
      driveId: String
      docId: PHID
      input: BillingStatement_DeleteLineItemInput
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
    status: BillingStatement_BillingStatementStatusInput!
  }

  """
  Module: LineItems
  """
  input BillingStatement_AddLineItemInput {
    id: OID!
    description: String!
    quantity: Float!
    unit: BillingStatement_BillingStatementUnitInput!
    unitPricePwt: Float!
    unitPriceCash: Float!
    totalPricePwt: Float!
    totalPriceCash: Float!
  }
  input BillingStatement_EditLineItemInput {
    id: OID!
    description: String
    quantity: Float
    unit: BillingStatement_BillingStatementUnitInput
    unitPricePwt: Float
    unitPriceCash: Float
    totalPricePwt: Float
    totalPriceCash: Float
  }
  input BillingStatement_DeleteLineItemInput {
    id: OID!
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
