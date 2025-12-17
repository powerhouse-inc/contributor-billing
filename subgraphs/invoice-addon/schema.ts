import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Subgraph definition
  """
  type Mutation {
    Invoice_processGnosisPayment(
      chainName: String!
      paymentDetails: JSON!
      invoiceNo: String!
    ): ProcessGnosisPaymentOutput
    Invoice_createRequestFinancePayment(
      paymentData: JSON!
    ): CreateRequestFinancePaymentOutput
    Invoice_uploadInvoicePdfChunk(
      chunk: String!
      chunkIndex: Int!
      totalChunks: Int!
      fileName: String!
      sessionId: String!
    ): UploadInvoicePdfChunkOutput
  }

  """
  Output type for PDF chunk upload
  """
  type UploadInvoicePdfChunkOutput {
    success: Boolean!
    data: JSON
    error: String
  }

  """
  Output type for request finance payment
  """
  type CreateRequestFinancePaymentOutput {
    success: Boolean!
    data: JSON
    error: String
  }

  """
  Output type for process gnosis payment
  """
  type ProcessGnosisPaymentOutput {
    success: Boolean!
    data: JSON
    error: String
  }

  scalar JSON
`;
