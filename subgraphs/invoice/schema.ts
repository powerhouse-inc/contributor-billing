import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Subgraph definition for Invoice (powerhouse/invoice)
  """
  type InvoiceState {
    status: Status!
    invoiceNo: String!
    dateIssued: Date!
    dateDue: Date!
    dateDelivered: Date
    issuer: LegalEntity!
    payer: LegalEntity!
    currency: String!
    lineItems: [InvoiceLineItem!]!
    totalPriceTaxExcl: Float!
    totalPriceTaxIncl: Float!
    notes: String
    rejections: [Rejection!]!
    payments: [Payment!]!
    payAfter: DateTime
    invoiceTags: [InvoiceTag!]! # e.g. {'xero-payment-account', '090', 'PowerhouseUSD'}
    exported: ExportedData
    closureReason: ClosureReason
  }

  enum ClosureReason {
    UNDERPAID
    OVERPAID
    CANCELLED
  }

  type Rejection {
    id: OID!
    reason: String!
    final: Boolean!
  }

  type ExportedData {
    timestamp: DateTime! # ISO 8601 timestamp of the export
    exportedLineItems: [[String!]!]! # CSV Format
  }

  type Payment {
    id: OID!
    processorRef: String
    paymentDate: DateTime
    txnRef: String
    confirmed: Boolean!
    issue: String
    amount: Float
  }

  type Token {
    evmAddress: String
    symbol: String
    chainName: String
    chainId: String
    rpc: String
  }

  type LegalEntity {
    id: LegalEntityId
    name: String
    address: Address
    contactInfo: ContactInfo
    country: String
    paymentRouting: PaymentRouting
  }

  type Address {
    streetAddress: String
    extendedAddress: String
    city: String
    postalCode: String
    country: String
    stateProvince: String
  }

  type ContactInfo {
    tel: String
    email: String
  }

  type PaymentRouting {
    bank: Bank
    wallet: InvoiceWallet
  }

  type Bank {
    name: String!
    address: Address!
    ABA: String
    BIC: String
    SWIFT: String
    accountNum: String!
    accountType: InvoiceAccountType
    beneficiary: String
    intermediaryBank: IntermediaryBank
    memo: String
  }

  type IntermediaryBank {
    name: String!
    address: Address!
    ABA: String
    BIC: String
    SWIFT: String
    accountNum: String!
    accountType: InvoiceAccountType
    beneficiary: String
    memo: String
  }

  type InvoiceWallet {
    rpc: String
    chainName: String
    chainId: String
    address: String
  }

  type InvoiceLineItem {
    id: OID!
    description: String!
    taxPercent: Float!
    quantity: Float!
    currency: String!
    unitPriceTaxExcl: Float!
    unitPriceTaxIncl: Float!
    totalPriceTaxExcl: Float!
    totalPriceTaxIncl: Float!
    lineItemTag: [InvoiceTag!]
  }

  type InvoiceTag {
    dimension: String! # "xero-expense-account", "xero-payment-account", "accounting-period", ...
    value: String! # "627", ..., "090", ..., "2025/05", "2025/Q1", ...
    label: String # "Marketing", ..., "Business Bank", ..., "May 2025"
  }

  union LegalEntityId = LegalEntityTaxId | LegalEntityCorporateRegistrationId

  type LegalEntityTaxId {
    taxId: String!
  }

  type LegalEntityCorporateRegistrationId {
    corpRegId: String!
  }

  enum Status {
    DRAFT
    ISSUED
    CANCELLED
    ACCEPTED
    REJECTED
    PAYMENTSCHEDULED
    PAYMENTSENT
    PAYMENTISSUE
    PAYMENTRECEIVED
    PAYMENTCLOSED
  }

  enum InvoiceAccountType {
    CHECKING
    SAVINGS
    TRUST
    WALLET
  }

  enum InvoiceAccountTypeInput {
    CHECKING
    SAVINGS
    TRUST
    WALLET
  }

  """
  Queries: Invoice
  """
  type InvoiceQueries {
    getDocument(driveId: String, docId: PHID): Invoice
    getDocuments: [Invoice!]
  }

  type Query {
    Invoice: InvoiceQueries
  }

  """
  Mutations: Invoice
  """
  type Mutation {
    Invoice_createDocument(driveId: String, name: String): String

    Invoice_editInvoice(
      driveId: String
      docId: PHID
      input: Invoice_EditInvoiceInput
    ): Int
    Invoice_editStatus(
      driveId: String
      docId: PHID
      input: Invoice_EditStatusInput
    ): Int
    Invoice_editPaymentData(
      driveId: String
      docId: PHID
      input: Invoice_EditPaymentDataInput
    ): Int
    Invoice_setExportedData(
      driveId: String
      docId: PHID
      input: Invoice_SetExportedDataInput
    ): Int
    Invoice_addPayment(
      driveId: String
      docId: PHID
      input: Invoice_AddPaymentInput
    ): Int
    Invoice_editIssuer(
      driveId: String
      docId: PHID
      input: Invoice_EditIssuerInput
    ): Int
    Invoice_editIssuerBank(
      driveId: String
      docId: PHID
      input: Invoice_EditIssuerBankInput
    ): Int
    Invoice_editIssuerWallet(
      driveId: String
      docId: PHID
      input: Invoice_EditIssuerWalletInput
    ): Int
    Invoice_editPayer(
      driveId: String
      docId: PHID
      input: Invoice_EditPayerInput
    ): Int
    Invoice_editPayerBank(
      driveId: String
      docId: PHID
      input: Invoice_EditPayerBankInput
    ): Int
    Invoice_editPayerWallet(
      driveId: String
      docId: PHID
      input: Invoice_EditPayerWalletInput
    ): Int
    Invoice_addLineItem(
      driveId: String
      docId: PHID
      input: Invoice_AddLineItemInput
    ): Int
    Invoice_editLineItem(
      driveId: String
      docId: PHID
      input: Invoice_EditLineItemInput
    ): Int
    Invoice_deleteLineItem(
      driveId: String
      docId: PHID
      input: Invoice_DeleteLineItemInput
    ): Int
    Invoice_setLineItemTag(
      driveId: String
      docId: PHID
      input: Invoice_SetLineItemTagInput
    ): Int
    Invoice_setInvoiceTag(
      driveId: String
      docId: PHID
      input: Invoice_SetInvoiceTagInput
    ): Int
    Invoice_cancel(
      driveId: String
      docId: PHID
      input: Invoice_CancelInput
    ): Int
    Invoice_issue(driveId: String, docId: PHID, input: Invoice_IssueInput): Int
    Invoice_reset(driveId: String, docId: PHID, input: Invoice_ResetInput): Int
    Invoice_reject(
      driveId: String
      docId: PHID
      input: Invoice_RejectInput
    ): Int
    Invoice_accept(
      driveId: String
      docId: PHID
      input: Invoice_AcceptInput
    ): Int
    Invoice_reinstate(
      driveId: String
      docId: PHID
      input: Invoice_ReinstateInput
    ): Int
    Invoice_schedulePayment(
      driveId: String
      docId: PHID
      input: Invoice_SchedulePaymentInput
    ): Int
    Invoice_reapprovePayment(
      driveId: String
      docId: PHID
      input: Invoice_ReapprovePaymentInput
    ): Int
    Invoice_registerPaymentTx(
      driveId: String
      docId: PHID
      input: Invoice_RegisterPaymentTxInput
    ): Int
    Invoice_reportPaymentIssue(
      driveId: String
      docId: PHID
      input: Invoice_ReportPaymentIssueInput
    ): Int
    Invoice_confirmPayment(
      driveId: String
      docId: PHID
      input: Invoice_ConfirmPaymentInput
    ): Int
    Invoice_closePayment(
      driveId: String
      docId: PHID
      input: Invoice_ClosePaymentInput
    ): Int
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

  """
  Module: General
  """
  input Invoice_EditInvoiceInput {
    invoiceNo: String
    dateIssued: String
    dateDue: String
    currency: String
    notes: String
  }
  input Invoice_EditStatusInput {
    status: Status!
  }
  input Invoice_EditPaymentDataInput {
    id: OID!
    processorRef: String
    paymentDate: DateTime
    txnRef: String
    confirmed: Boolean!
    issue: String
  }
  input Invoice_SetExportedDataInput {
    timestamp: DateTime!
    exportedLineItems: [[String!]!]!
  }
  input Invoice_AddPaymentInput {
    id: OID!
    processorRef: String
    paymentDate: DateTime
    txnRef: String
    confirmed: Boolean!
    issue: String
  }

  """
  Module: Parties
  """
  input Invoice_EditIssuerInput {
    id: String
    name: String
    streetAddress: String
    extendedAddress: String
    city: String
    postalCode: String
    country: String
    stateProvince: String
    tel: String
    email: String
  }
  input Invoice_EditIssuerBankInput {
    name: String
    streetAddress: String
    extendedAddress: String
    city: String
    postalCode: String
    country: String
    stateProvince: String
    ABA: String
    BIC: String
    SWIFT: String
    accountNum: String
    accountType: InvoiceAccountTypeInput
    beneficiary: String
    memo: String
    # intermediaryBank
    nameIntermediary: String
    streetAddressIntermediary: String
    extendedAddressIntermediary: String
    cityIntermediary: String
    postalCodeIntermediary: String
    countryIntermediary: String
    stateProvinceIntermediary: String
    ABAIntermediary: String
    BICIntermediary: String
    SWIFTIntermediary: String
    accountNumIntermediary: String
    accountTypeIntermediary: InvoiceAccountTypeInput
    beneficiaryIntermediary: String
    memoIntermediary: String
  }
  input Invoice_EditIssuerWalletInput {
    rpc: String
    chainName: String
    chainId: String
    address: String
  }

  input Invoice_EditPayerInput {
    id: String
    name: String
    streetAddress: String
    extendedAddress: String
    city: String
    postalCode: String
    country: String
    stateProvince: String
    tel: String
    email: String
  }
  input Invoice_EditPayerBankInput {
    name: String
    streetAddress: String
    extendedAddress: String
    city: String
    postalCode: String
    country: String
    stateProvince: String
    ABA: String
    BIC: String
    SWIFT: String
    accountNum: String
    accountType: InvoiceAccountTypeInput
    beneficiary: String
    memo: String
    # intermediaryBank
    nameIntermediary: String
    streetAddressIntermediary: String
    extendedAddressIntermediary: String
    cityIntermediary: String
    postalCodeIntermediary: String
    countryIntermediary: String
    stateProvinceIntermediary: String
    ABAIntermediary: String
    BICIntermediary: String
    SWIFTIntermediary: String
    accountNumIntermediary: String
    accountTypeIntermediary: InvoiceAccountTypeInput
    beneficiaryIntermediary: String
    memoIntermediary: String
  }
  input Invoice_EditPayerWalletInput {
    rpc: String
    chainName: String
    chainId: String
    address: String
  }

  """
  Module: Items
  """
  input Invoice_AddLineItemInput {
    id: OID!
    description: String!
    taxPercent: Float!
    quantity: Float!
    currency: String! # Default can be USD
    unitPriceTaxExcl: Float!
    unitPriceTaxIncl: Float!
    totalPriceTaxExcl: Float!
    totalPriceTaxIncl: Float!
  }
  input Invoice_EditLineItemInput {
    id: OID!
    description: String
    taxPercent: Float
    quantity: Float
    currency: String
    unitPriceTaxExcl: Float
    unitPriceTaxIncl: Float
    totalPriceTaxExcl: Float
    totalPriceTaxIncl: Float
  }
  input Invoice_DeleteLineItemInput {
    id: OID!
  }
  input Invoice_SetLineItemTagInput {
    lineItemId: OID!
    dimension: String!
    value: String!
    label: String
  }
  input Invoice_SetInvoiceTagInput {
    dimension: String!
    value: String!
    label: String
  }

  """
  Module: Transitions
  """
  input Invoice_CancelInput {
    "Add your inputs here"
    _placeholder: String
  }
  input Invoice_IssueInput {
    invoiceNo: String!
    dateIssued: String!
  }
  input Invoice_ResetInput {
    "Add your inputs here"
    _placeholder: String
  }
  input Invoice_RejectInput {
    id: OID! # New Rejection ID
    reason: String!
    final: Boolean!
  }
  input Invoice_AcceptInput {
    payAfter: DateTime
  }
  input Invoice_ReinstateInput {
    "Add your inputs here"
    _placeholder: String
  }
  input Invoice_SchedulePaymentInput {
    id: OID! # New Payment ID
    processorRef: String!
  }
  input Invoice_ReapprovePaymentInput {
    "Add your inputs here"
    _placeholder: String
  }
  input Invoice_RegisterPaymentTxInput {
    id: OID! # Payment ID
    timestamp: DateTime!
    txRef: String!
  }
  input Invoice_ReportPaymentIssueInput {
    id: OID! # Payment ID
    issue: String!
  }
  input Invoice_ConfirmPaymentInput {
    id: OID! # Payment ID
    amount: Float!
  }
  input Invoice_ClosePaymentInput {
    closureReason: ClosureReasonInput
  }

  enum ClosureReasonInput {
    UNDERPAID
    OVERPAID
    CANCELLED
  }
`;
