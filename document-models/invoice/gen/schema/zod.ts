import { z } from "zod";
import type {
  AcceptInput,
  AddLineItemInput,
  AddPaymentInput,
  Address,
  Bank,
  CancelInput,
  ClosePaymentInput,
  ClosureReason,
  ClosureReasonInput,
  ConfirmPaymentInput,
  ContactInfo,
  DeleteLineItemInput,
  EditInvoiceInput,
  EditIssuerBankInput,
  EditIssuerInput,
  EditIssuerWalletInput,
  EditLineItemInput,
  EditPayerBankInput,
  EditPayerInput,
  EditPayerWalletInput,
  EditPaymentDataInput,
  EditStatusInput,
  ExportedData,
  IntermediaryBank,
  InvoiceAccountType,
  InvoiceAccountTypeInput,
  InvoiceLineItem,
  InvoiceState,
  InvoiceTag,
  InvoiceWallet,
  IssueInput,
  LegalEntity,
  LegalEntityCorporateRegistrationId,
  LegalEntityTaxId,
  Payment,
  PaymentRouting,
  ReapprovePaymentInput,
  RegisterPaymentTxInput,
  ReinstateInput,
  RejectInput,
  Rejection,
  ReportPaymentIssueInput,
  ResetInput,
  SchedulePaymentInput,
  SetExportedDataInput,
  SetInvoiceTagInput,
  SetLineItemTagInput,
  Status,
  Token,
} from "./types.js";

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
  v !== undefined && v !== null;

export const definedNonNullAnySchema = z
  .any()
  .refine((v) => isDefinedNonNullAny(v));

export const ClosureReasonSchema = z.enum([
  "CANCELLED",
  "OVERPAID",
  "UNDERPAID",
]);

export const ClosureReasonInputSchema = z.enum([
  "CANCELLED",
  "OVERPAID",
  "UNDERPAID",
]);

export const InvoiceAccountTypeSchema = z.enum([
  "CHECKING",
  "SAVINGS",
  "TRUST",
  "WALLET",
]);

export const InvoiceAccountTypeInputSchema = z.enum([
  "CHECKING",
  "SAVINGS",
  "TRUST",
  "WALLET",
]);

export const StatusSchema = z.enum([
  "ACCEPTED",
  "CANCELLED",
  "DRAFT",
  "ISSUED",
  "PAYMENTCLOSED",
  "PAYMENTISSUE",
  "PAYMENTRECEIVED",
  "PAYMENTSCHEDULED",
  "PAYMENTSENT",
  "REJECTED",
]);

export function AcceptInputSchema(): z.ZodObject<Properties<AcceptInput>> {
  return z.object({
    payAfter: z.string().datetime().nullish(),
  });
}

export function AddLineItemInputSchema(): z.ZodObject<
  Properties<AddLineItemInput>
> {
  return z.object({
    currency: z.string(),
    description: z.string(),
    id: z.string(),
    quantity: z.number(),
    taxPercent: z.number(),
    totalPriceTaxExcl: z.number(),
    totalPriceTaxIncl: z.number(),
    unitPriceTaxExcl: z.number(),
    unitPriceTaxIncl: z.number(),
  });
}

export function AddPaymentInputSchema(): z.ZodObject<
  Properties<AddPaymentInput>
> {
  return z.object({
    confirmed: z.boolean(),
    id: z.string(),
    issue: z.string().nullish(),
    paymentDate: z.string().datetime().nullish(),
    processorRef: z.string().nullish(),
    txnRef: z.string().nullish(),
  });
}

export function AddressSchema(): z.ZodObject<Properties<Address>> {
  return z.object({
    __typename: z.literal("Address").optional(),
    city: z.string().nullable(),
    country: z.string().nullable(),
    extendedAddress: z.string().nullable(),
    postalCode: z.string().nullable(),
    stateProvince: z.string().nullable(),
    streetAddress: z.string().nullable(),
  });
}

export function BankSchema(): z.ZodObject<Properties<Bank>> {
  return z.object({
    __typename: z.literal("Bank").optional(),
    ABA: z.string().nullable(),
    BIC: z.string().nullable(),
    SWIFT: z.string().nullable(),
    accountNum: z.string(),
    accountType: InvoiceAccountTypeSchema.nullable(),
    address: AddressSchema(),
    beneficiary: z.string().nullable(),
    intermediaryBank: IntermediaryBankSchema().nullable(),
    memo: z.string().nullable(),
    name: z.string(),
  });
}

export function CancelInputSchema(): z.ZodObject<Properties<CancelInput>> {
  return z.object({
    _placeholder: z.string().nullish(),
  });
}

export function ClosePaymentInputSchema(): z.ZodObject<
  Properties<ClosePaymentInput>
> {
  return z.object({
    closureReason: z.lazy(() => ClosureReasonInputSchema.nullish()),
  });
}

export function ConfirmPaymentInputSchema(): z.ZodObject<
  Properties<ConfirmPaymentInput>
> {
  return z.object({
    amount: z.number(),
    id: z.string(),
  });
}

export function ContactInfoSchema(): z.ZodObject<Properties<ContactInfo>> {
  return z.object({
    __typename: z.literal("ContactInfo").optional(),
    email: z.string().nullable(),
    tel: z.string().nullable(),
  });
}

export function DeleteLineItemInputSchema(): z.ZodObject<
  Properties<DeleteLineItemInput>
> {
  return z.object({
    id: z.string(),
  });
}

export function EditInvoiceInputSchema(): z.ZodObject<
  Properties<EditInvoiceInput>
> {
  return z.object({
    currency: z.string().nullish(),
    dateDue: z.string().nullish(),
    dateIssued: z.string().nullish(),
    invoiceNo: z.string().nullish(),
    notes: z.string().nullish(),
  });
}

export function EditIssuerBankInputSchema(): z.ZodObject<
  Properties<EditIssuerBankInput>
> {
  return z.object({
    ABA: z.string().nullish(),
    ABAIntermediary: z.string().nullish(),
    BIC: z.string().nullish(),
    BICIntermediary: z.string().nullish(),
    SWIFT: z.string().nullish(),
    SWIFTIntermediary: z.string().nullish(),
    accountNum: z.string().nullish(),
    accountNumIntermediary: z.string().nullish(),
    accountType: z.lazy(() => InvoiceAccountTypeInputSchema.nullish()),
    accountTypeIntermediary: z.lazy(() =>
      InvoiceAccountTypeInputSchema.nullish(),
    ),
    beneficiary: z.string().nullish(),
    beneficiaryIntermediary: z.string().nullish(),
    city: z.string().nullish(),
    cityIntermediary: z.string().nullish(),
    country: z.string().nullish(),
    countryIntermediary: z.string().nullish(),
    extendedAddress: z.string().nullish(),
    extendedAddressIntermediary: z.string().nullish(),
    memo: z.string().nullish(),
    memoIntermediary: z.string().nullish(),
    name: z.string().nullish(),
    nameIntermediary: z.string().nullish(),
    postalCode: z.string().nullish(),
    postalCodeIntermediary: z.string().nullish(),
    stateProvince: z.string().nullish(),
    stateProvinceIntermediary: z.string().nullish(),
    streetAddress: z.string().nullish(),
    streetAddressIntermediary: z.string().nullish(),
  });
}

export function EditIssuerInputSchema(): z.ZodObject<
  Properties<EditIssuerInput>
> {
  return z.object({
    city: z.string().nullish(),
    country: z.string().nullish(),
    email: z.string().nullish(),
    extendedAddress: z.string().nullish(),
    id: z.string().nullish(),
    name: z.string().nullish(),
    postalCode: z.string().nullish(),
    stateProvince: z.string().nullish(),
    streetAddress: z.string().nullish(),
    tel: z.string().nullish(),
  });
}

export function EditIssuerWalletInputSchema(): z.ZodObject<
  Properties<EditIssuerWalletInput>
> {
  return z.object({
    address: z.string().nullish(),
    chainId: z.string().nullish(),
    chainName: z.string().nullish(),
    rpc: z.string().nullish(),
  });
}

export function EditLineItemInputSchema(): z.ZodObject<
  Properties<EditLineItemInput>
> {
  return z.object({
    currency: z.string().nullish(),
    description: z.string().nullish(),
    id: z.string(),
    quantity: z.number().nullish(),
    taxPercent: z.number().nullish(),
    totalPriceTaxExcl: z.number().nullish(),
    totalPriceTaxIncl: z.number().nullish(),
    unitPriceTaxExcl: z.number().nullish(),
    unitPriceTaxIncl: z.number().nullish(),
  });
}

export function EditPayerBankInputSchema(): z.ZodObject<
  Properties<EditPayerBankInput>
> {
  return z.object({
    ABA: z.string().nullish(),
    ABAIntermediary: z.string().nullish(),
    BIC: z.string().nullish(),
    BICIntermediary: z.string().nullish(),
    SWIFT: z.string().nullish(),
    SWIFTIntermediary: z.string().nullish(),
    accountNum: z.string().nullish(),
    accountNumIntermediary: z.string().nullish(),
    accountType: z.lazy(() => InvoiceAccountTypeInputSchema.nullish()),
    accountTypeIntermediary: z.lazy(() =>
      InvoiceAccountTypeInputSchema.nullish(),
    ),
    beneficiary: z.string().nullish(),
    beneficiaryIntermediary: z.string().nullish(),
    city: z.string().nullish(),
    cityIntermediary: z.string().nullish(),
    country: z.string().nullish(),
    countryIntermediary: z.string().nullish(),
    extendedAddress: z.string().nullish(),
    extendedAddressIntermediary: z.string().nullish(),
    memo: z.string().nullish(),
    memoIntermediary: z.string().nullish(),
    name: z.string().nullish(),
    nameIntermediary: z.string().nullish(),
    postalCode: z.string().nullish(),
    postalCodeIntermediary: z.string().nullish(),
    stateProvince: z.string().nullish(),
    stateProvinceIntermediary: z.string().nullish(),
    streetAddress: z.string().nullish(),
    streetAddressIntermediary: z.string().nullish(),
  });
}

export function EditPayerInputSchema(): z.ZodObject<
  Properties<EditPayerInput>
> {
  return z.object({
    city: z.string().nullish(),
    country: z.string().nullish(),
    email: z.string().nullish(),
    extendedAddress: z.string().nullish(),
    id: z.string().nullish(),
    name: z.string().nullish(),
    postalCode: z.string().nullish(),
    stateProvince: z.string().nullish(),
    streetAddress: z.string().nullish(),
    tel: z.string().nullish(),
  });
}

export function EditPayerWalletInputSchema(): z.ZodObject<
  Properties<EditPayerWalletInput>
> {
  return z.object({
    address: z.string().nullish(),
    chainId: z.string().nullish(),
    chainName: z.string().nullish(),
    rpc: z.string().nullish(),
  });
}

export function EditPaymentDataInputSchema(): z.ZodObject<
  Properties<EditPaymentDataInput>
> {
  return z.object({
    confirmed: z.boolean(),
    id: z.string(),
    issue: z.string().nullish(),
    paymentDate: z.string().datetime().nullish(),
    processorRef: z.string().nullish(),
    txnRef: z.string().nullish(),
  });
}

export function EditStatusInputSchema(): z.ZodObject<
  Properties<EditStatusInput>
> {
  return z.object({
    status: StatusSchema,
  });
}

export function ExportedDataSchema(): z.ZodObject<Properties<ExportedData>> {
  return z.object({
    __typename: z.literal("ExportedData").optional(),
    exportedLineItems: z.array(z.array(z.string())),
    timestamp: z.string().datetime(),
  });
}

export function IntermediaryBankSchema(): z.ZodObject<
  Properties<IntermediaryBank>
> {
  return z.object({
    __typename: z.literal("IntermediaryBank").optional(),
    ABA: z.string().nullable(),
    BIC: z.string().nullable(),
    SWIFT: z.string().nullable(),
    accountNum: z.string(),
    accountType: InvoiceAccountTypeSchema.nullable(),
    address: AddressSchema(),
    beneficiary: z.string().nullable(),
    memo: z.string().nullable(),
    name: z.string(),
  });
}

export function InvoiceLineItemSchema(): z.ZodObject<
  Properties<InvoiceLineItem>
> {
  return z.object({
    __typename: z.literal("InvoiceLineItem").optional(),
    currency: z.string(),
    description: z.string(),
    id: z.string(),
    lineItemTag: z.array(InvoiceTagSchema()).nullable(),
    quantity: z.number(),
    taxPercent: z.number(),
    totalPriceTaxExcl: z.number(),
    totalPriceTaxIncl: z.number(),
    unitPriceTaxExcl: z.number(),
    unitPriceTaxIncl: z.number(),
  });
}

export function InvoiceStateSchema(): z.ZodObject<Properties<InvoiceState>> {
  return z.object({
    __typename: z.literal("InvoiceState").optional(),
    closureReason: ClosureReasonSchema.nullable(),
    currency: z.string(),
    dateDelivered: z.string().datetime().nullable(),
    dateDue: z.string().datetime(),
    dateIssued: z.string().datetime(),
    exported: ExportedDataSchema().nullable(),
    invoiceNo: z.string(),
    invoiceTags: z.array(InvoiceTagSchema()),
    issuer: LegalEntitySchema(),
    lineItems: z.array(InvoiceLineItemSchema()),
    notes: z.string().nullable(),
    payAfter: z.string().datetime().nullable(),
    payer: LegalEntitySchema(),
    payments: z.array(PaymentSchema()),
    rejections: z.array(RejectionSchema()),
    status: StatusSchema,
    totalPriceTaxExcl: z.number(),
    totalPriceTaxIncl: z.number(),
  });
}

export function InvoiceTagSchema(): z.ZodObject<Properties<InvoiceTag>> {
  return z.object({
    __typename: z.literal("InvoiceTag").optional(),
    dimension: z.string(),
    label: z.string().nullable(),
    value: z.string(),
  });
}

export function InvoiceWalletSchema(): z.ZodObject<Properties<InvoiceWallet>> {
  return z.object({
    __typename: z.literal("InvoiceWallet").optional(),
    address: z.string().nullable(),
    chainId: z.string().nullable(),
    chainName: z.string().nullable(),
    rpc: z.string().nullable(),
  });
}

export function IssueInputSchema(): z.ZodObject<Properties<IssueInput>> {
  return z.object({
    dateIssued: z.string(),
    invoiceNo: z.string(),
  });
}

export function LegalEntitySchema(): z.ZodObject<Properties<LegalEntity>> {
  return z.object({
    __typename: z.literal("LegalEntity").optional(),
    address: AddressSchema().nullable(),
    contactInfo: ContactInfoSchema().nullable(),
    country: z.string().nullable(),
    id: LegalEntityIdSchema().nullable(),
    name: z.string().nullable(),
    paymentRouting: PaymentRoutingSchema().nullable(),
  });
}

export function LegalEntityCorporateRegistrationIdSchema(): z.ZodObject<
  Properties<LegalEntityCorporateRegistrationId>
> {
  return z.object({
    __typename: z.literal("LegalEntityCorporateRegistrationId").optional(),
    corpRegId: z.string(),
  });
}

export function LegalEntityIdSchema() {
  return z.union([
    LegalEntityCorporateRegistrationIdSchema(),
    LegalEntityTaxIdSchema(),
  ]);
}

export function LegalEntityTaxIdSchema(): z.ZodObject<
  Properties<LegalEntityTaxId>
> {
  return z.object({
    __typename: z.literal("LegalEntityTaxId").optional(),
    taxId: z.string(),
  });
}

export function PaymentSchema(): z.ZodObject<Properties<Payment>> {
  return z.object({
    __typename: z.literal("Payment").optional(),
    amount: z.number().nullable(),
    confirmed: z.boolean(),
    id: z.string(),
    issue: z.string().nullable(),
    paymentDate: z.string().datetime().nullable(),
    processorRef: z.string().nullable(),
    txnRef: z.string().nullable(),
  });
}

export function PaymentRoutingSchema(): z.ZodObject<
  Properties<PaymentRouting>
> {
  return z.object({
    __typename: z.literal("PaymentRouting").optional(),
    bank: BankSchema().nullable(),
    wallet: InvoiceWalletSchema().nullable(),
  });
}

export function ReapprovePaymentInputSchema(): z.ZodObject<
  Properties<ReapprovePaymentInput>
> {
  return z.object({
    _placeholder: z.string().nullish(),
  });
}

export function RegisterPaymentTxInputSchema(): z.ZodObject<
  Properties<RegisterPaymentTxInput>
> {
  return z.object({
    id: z.string(),
    timestamp: z.string().datetime(),
    txRef: z.string(),
  });
}

export function ReinstateInputSchema(): z.ZodObject<
  Properties<ReinstateInput>
> {
  return z.object({
    _placeholder: z.string().nullish(),
  });
}

export function RejectInputSchema(): z.ZodObject<Properties<RejectInput>> {
  return z.object({
    final: z.boolean(),
    id: z.string(),
    reason: z.string(),
  });
}

export function RejectionSchema(): z.ZodObject<Properties<Rejection>> {
  return z.object({
    __typename: z.literal("Rejection").optional(),
    final: z.boolean(),
    id: z.string(),
    reason: z.string(),
  });
}

export function ReportPaymentIssueInputSchema(): z.ZodObject<
  Properties<ReportPaymentIssueInput>
> {
  return z.object({
    id: z.string(),
    issue: z.string(),
  });
}

export function ResetInputSchema(): z.ZodObject<Properties<ResetInput>> {
  return z.object({
    _placeholder: z.string().nullish(),
  });
}

export function SchedulePaymentInputSchema(): z.ZodObject<
  Properties<SchedulePaymentInput>
> {
  return z.object({
    id: z.string(),
    processorRef: z.string(),
  });
}

export function SetExportedDataInputSchema(): z.ZodObject<
  Properties<SetExportedDataInput>
> {
  return z.object({
    exportedLineItems: z.array(z.array(z.string())),
    timestamp: z.string().datetime(),
  });
}

export function SetInvoiceTagInputSchema(): z.ZodObject<
  Properties<SetInvoiceTagInput>
> {
  return z.object({
    dimension: z.string(),
    label: z.string().nullish(),
    value: z.string(),
  });
}

export function SetLineItemTagInputSchema(): z.ZodObject<
  Properties<SetLineItemTagInput>
> {
  return z.object({
    dimension: z.string(),
    label: z.string().nullish(),
    lineItemId: z.string(),
    value: z.string(),
  });
}

export function TokenSchema(): z.ZodObject<Properties<Token>> {
  return z.object({
    __typename: z.literal("Token").optional(),
    chainId: z.string().nullable(),
    chainName: z.string().nullable(),
    evmAddress: z.string().nullable(),
    rpc: z.string().nullable(),
    symbol: z.string().nullable(),
  });
}
