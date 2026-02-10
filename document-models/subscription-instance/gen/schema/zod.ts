import * as z from "zod";
import type {
  ActivateSubscriptionInput,
  AddCommunicationChannelInput,
  AddInvoiceLineItemInput,
  AddServiceGroupInput,
  AddServiceInput,
  AddServiceMetricInput,
  AddServiceToGroupInput,
  BudgetCategory,
  CancelInvoiceInput,
  CancelSubscriptionInput,
  CommunicationChannel,
  CreateInvoiceInput,
  DecrementMetricUsageInput,
  IncrementMetricUsageInput,
  InitializeSubscriptionInput,
  Invoice,
  InvoiceLineItem,
  InvoicePayment,
  MarkInvoiceOverdueInput,
  PauseSubscriptionInput,
  RecordInvoicePaymentInput,
  RecurringCost,
  RefundInvoiceInput,
  RemoveBudgetCategoryInput,
  RemoveCommunicationChannelInput,
  RemoveInvoiceLineItemInput,
  RemoveServiceFromGroupInput,
  RemoveServiceGroupInput,
  RemoveServiceInput,
  RemoveServiceMetricInput,
  RenewExpiringSubscriptionInput,
  ReportRecurringPaymentInput,
  ReportSetupPaymentInput,
  ResourceDocument,
  ResumeSubscriptionInput,
  SendInvoiceInput,
  Service,
  ServiceGroup,
  ServiceMetric,
  SetAutoRenewInput,
  SetBudgetCategoryInput,
  SetCustomerTypeInput,
  SetExpiringInput,
  SetInvoiceTaxInput,
  SetOperatorNotesInput,
  SetPrimaryCommunicationChannelInput,
  SetRenewalDateInput,
  SetResourceDocumentInput,
  SetupCost,
  SubscriptionInstanceState,
  UpdateCustomerInfoInput,
  UpdateCustomerWalletInput,
  UpdateInvoiceStatusInput,
  UpdateKycStatusInput,
  UpdateMetricInput,
  UpdateMetricUsageInput,
  UpdateServiceInfoInput,
  UpdateServiceRecurringCostInput,
  UpdateServiceSetupCostInput,
  UpdateSubscriptionStatusInput,
  UpdateTeamMemberCountInput,
  UpdateTierInfoInput,
  VerifyCommunicationChannelInput,
} from "./types.js";

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
  v !== undefined && v !== null;

export const definedNonNullAnySchema = z
  .any()
  .refine((v) => isDefinedNonNullAny(v));

export const BillingCycleSchema = z.enum([
  "ANNUAL",
  "MONTHLY",
  "ONE_TIME",
  "QUARTERLY",
  "SEMI_ANNUAL",
]);

export const CommunicationChannelTypeSchema = z.enum([
  "DISCORD",
  "EMAIL",
  "SLACK",
  "TELEGRAM",
  "WHATSAPP",
]);

export const CustomerTypeSchema = z.enum(["INDIVIDUAL", "TEAM"]);

export const InvoiceStatusSchema = z.enum([
  "CANCELLED",
  "DRAFT",
  "OVERDUE",
  "PAID",
  "PARTIALLY_PAID",
  "REFUNDED",
  "SENT",
]);

export const KycStatusSchema = z.enum([
  "NOT_REQUIRED",
  "NOT_STARTED",
  "PENDING",
  "REJECTED",
  "VERIFIED",
]);

export const PaymentMethodSchema = z.enum([
  "BANK_TRANSFER",
  "CREDIT_CARD",
  "CRYPTO",
  "OTHER",
  "PAYPAL",
]);

export const ResetPeriodSchema = z.enum([
  "ANNUAL",
  "DAILY",
  "HOURLY",
  "MONTHLY",
  "QUARTERLY",
  "SEMI_ANNUAL",
  "WEEKLY",
]);

export const SubscriptionStatusSchema = z.enum([
  "ACTIVE",
  "CANCELLED",
  "EXPIRING",
  "PAUSED",
  "PENDING",
]);

export function ActivateSubscriptionInputSchema(): z.ZodObject<
  Properties<ActivateSubscriptionInput>
> {
  return z.object({
    activatedSince: z.string().datetime(),
  });
}

export function AddCommunicationChannelInputSchema(): z.ZodObject<
  Properties<AddCommunicationChannelInput>
> {
  return z.object({
    channelId: z.string(),
    identifier: z.string(),
    isPrimary: z.boolean(),
    type: CommunicationChannelTypeSchema,
    verifiedAt: z.string().datetime().nullish(),
  });
}

export function AddInvoiceLineItemInputSchema(): z.ZodObject<
  Properties<AddInvoiceLineItemInput>
> {
  return z.object({
    description: z.string(),
    invoiceId: z.string(),
    lineItemId: z.string(),
    metricId: z.string().nullish(),
    quantity: z.number(),
    serviceId: z.string().nullish(),
    unitPrice: z.number(),
  });
}

export function AddServiceGroupInputSchema(): z.ZodObject<
  Properties<AddServiceGroupInput>
> {
  return z.object({
    groupId: z.string(),
    name: z.string(),
    optional: z.boolean(),
  });
}

export function AddServiceInputSchema(): z.ZodObject<
  Properties<AddServiceInput>
> {
  return z.object({
    description: z.string().nullish(),
    name: z.string().nullish(),
    recurringAmount: z.number().nullish(),
    recurringBillingCycle: BillingCycleSchema.nullish(),
    recurringCurrency: z.string().nullish(),
    recurringLastPaymentDate: z.string().datetime().nullish(),
    recurringNextBillingDate: z.string().datetime().nullish(),
    serviceId: z.string(),
    setupAmount: z.number().nullish(),
    setupBillingDate: z.string().datetime().nullish(),
    setupCurrency: z.string().nullish(),
    setupPaymentDate: z.string().datetime().nullish(),
  });
}

export function AddServiceMetricInputSchema(): z.ZodObject<
  Properties<AddServiceMetricInput>
> {
  return z.object({
    currentUsage: z.number(),
    limit: z.number().nullish(),
    metricId: z.string(),
    name: z.string(),
    nextUsageReset: z.string().datetime().nullish(),
    serviceId: z.string(),
    unitCostAmount: z.number().nullish(),
    unitCostBillingCycle: BillingCycleSchema.nullish(),
    unitCostCurrency: z.string().nullish(),
    unitCostLastPaymentDate: z.string().datetime().nullish(),
    unitCostNextBillingDate: z.string().datetime().nullish(),
    unitName: z.string(),
    usageResetPeriod: ResetPeriodSchema.nullish(),
  });
}

export function AddServiceToGroupInputSchema(): z.ZodObject<
  Properties<AddServiceToGroupInput>
> {
  return z.object({
    description: z.string().nullish(),
    groupId: z.string(),
    name: z.string().nullish(),
    recurringAmount: z.number().nullish(),
    recurringBillingCycle: BillingCycleSchema.nullish(),
    recurringCurrency: z.string().nullish(),
    recurringLastPaymentDate: z.string().datetime().nullish(),
    recurringNextBillingDate: z.string().datetime().nullish(),
    serviceId: z.string(),
    setupAmount: z.number().nullish(),
    setupBillingDate: z.string().datetime().nullish(),
    setupCurrency: z.string().nullish(),
    setupPaymentDate: z.string().datetime().nullish(),
  });
}

export function BudgetCategorySchema(): z.ZodObject<
  Properties<BudgetCategory>
> {
  return z.object({
    __typename: z.literal("BudgetCategory").optional(),
    id: z.string(),
    label: z.string(),
  });
}

export function CancelInvoiceInputSchema(): z.ZodObject<
  Properties<CancelInvoiceInput>
> {
  return z.object({
    invoiceId: z.string(),
    reason: z.string().nullish(),
  });
}

export function CancelSubscriptionInputSchema(): z.ZodObject<
  Properties<CancelSubscriptionInput>
> {
  return z.object({
    cancellationReason: z.string().nullish(),
    cancelledSince: z.string().datetime(),
  });
}

export function CommunicationChannelSchema(): z.ZodObject<
  Properties<CommunicationChannel>
> {
  return z.object({
    __typename: z.literal("CommunicationChannel").optional(),
    id: z.string(),
    identifier: z.string(),
    isPrimary: z.boolean(),
    type: CommunicationChannelTypeSchema,
    verifiedAt: z.string().datetime().nullish(),
  });
}

export function CreateInvoiceInputSchema(): z.ZodObject<
  Properties<CreateInvoiceInput>
> {
  return z.object({
    currency: z.string(),
    dueDate: z.string().datetime(),
    invoiceId: z.string(),
    invoiceNumber: z.string(),
    issueDate: z.string().datetime(),
    notes: z.string().nullish(),
    periodEnd: z.string().datetime(),
    periodStart: z.string().datetime(),
  });
}

export function DecrementMetricUsageInputSchema(): z.ZodObject<
  Properties<DecrementMetricUsageInput>
> {
  return z.object({
    currentTime: z.string().datetime(),
    decrementBy: z.number(),
    metricId: z.string(),
    serviceId: z.string(),
  });
}

export function IncrementMetricUsageInputSchema(): z.ZodObject<
  Properties<IncrementMetricUsageInput>
> {
  return z.object({
    currentTime: z.string().datetime(),
    incrementBy: z.number(),
    metricId: z.string(),
    serviceId: z.string(),
  });
}

export function InitializeSubscriptionInputSchema(): z.ZodObject<
  Properties<InitializeSubscriptionInput>
> {
  return z.object({
    autoRenew: z.boolean().nullish(),
    createdAt: z.string().datetime(),
    customerEmail: z.string().email().nullish(),
    customerId: z.string().nullish(),
    customerName: z.string().nullish(),
    resourceId: z.string().nullish(),
    resourceLabel: z.string().nullish(),
    resourceThumbnailUrl: z.string().url().nullish(),
    serviceOfferingId: z.string().nullish(),
    tierName: z.string().nullish(),
    tierPricingOptionId: z.string().nullish(),
  });
}

export function InvoiceSchema(): z.ZodObject<Properties<Invoice>> {
  return z.object({
    __typename: z.literal("Invoice").optional(),
    currency: z.string(),
    dueDate: z.string().datetime(),
    id: z.string(),
    invoiceNumber: z.string(),
    issueDate: z.string().datetime(),
    lineItems: z.array(z.lazy(() => InvoiceLineItemSchema())),
    notes: z.string().nullish(),
    paidDate: z.string().datetime().nullish(),
    payments: z.array(z.lazy(() => InvoicePaymentSchema())),
    periodEnd: z.string().datetime(),
    periodStart: z.string().datetime(),
    status: InvoiceStatusSchema,
    subtotal: z.number(),
    tax: z.number().nullish(),
    total: z.number(),
  });
}

export function InvoiceLineItemSchema(): z.ZodObject<
  Properties<InvoiceLineItem>
> {
  return z.object({
    __typename: z.literal("InvoiceLineItem").optional(),
    description: z.string(),
    id: z.string(),
    metricId: z.string().nullish(),
    quantity: z.number(),
    serviceId: z.string().nullish(),
    total: z.number(),
    unitPrice: z.number(),
  });
}

export function InvoicePaymentSchema(): z.ZodObject<
  Properties<InvoicePayment>
> {
  return z.object({
    __typename: z.literal("InvoicePayment").optional(),
    amount: z.number(),
    currency: z.string(),
    id: z.string(),
    paymentDate: z.string().datetime(),
    paymentMethod: PaymentMethodSchema,
    reference: z.string().nullish(),
    transactionHash: z.string().nullish(),
    walletAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullish(),
  });
}

export function MarkInvoiceOverdueInputSchema(): z.ZodObject<
  Properties<MarkInvoiceOverdueInput>
> {
  return z.object({
    invoiceId: z.string(),
  });
}

export function PauseSubscriptionInputSchema(): z.ZodObject<
  Properties<PauseSubscriptionInput>
> {
  return z.object({
    pausedSince: z.string().datetime(),
  });
}

export function RecordInvoicePaymentInputSchema(): z.ZodObject<
  Properties<RecordInvoicePaymentInput>
> {
  return z.object({
    amount: z.number(),
    currency: z.string(),
    invoiceId: z.string(),
    paymentDate: z.string().datetime(),
    paymentId: z.string(),
    paymentMethod: PaymentMethodSchema,
    reference: z.string().nullish(),
    transactionHash: z.string().nullish(),
    walletAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullish(),
  });
}

export function RecurringCostSchema(): z.ZodObject<Properties<RecurringCost>> {
  return z.object({
    __typename: z.literal("RecurringCost").optional(),
    amount: z.number(),
    billingCycle: BillingCycleSchema,
    currency: z.string(),
    lastPaymentDate: z.string().datetime().nullish(),
    nextBillingDate: z.string().datetime().nullish(),
  });
}

export function RefundInvoiceInputSchema(): z.ZodObject<
  Properties<RefundInvoiceInput>
> {
  return z.object({
    invoiceId: z.string(),
    reason: z.string().nullish(),
    refundDate: z.string().datetime(),
  });
}

export function RemoveBudgetCategoryInputSchema(): z.ZodObject<
  Properties<RemoveBudgetCategoryInput>
> {
  return z.object({
    budgetId: z.string(),
  });
}

export function RemoveCommunicationChannelInputSchema(): z.ZodObject<
  Properties<RemoveCommunicationChannelInput>
> {
  return z.object({
    channelId: z.string(),
  });
}

export function RemoveInvoiceLineItemInputSchema(): z.ZodObject<
  Properties<RemoveInvoiceLineItemInput>
> {
  return z.object({
    invoiceId: z.string(),
    lineItemId: z.string(),
  });
}

export function RemoveServiceFromGroupInputSchema(): z.ZodObject<
  Properties<RemoveServiceFromGroupInput>
> {
  return z.object({
    groupId: z.string(),
    serviceId: z.string(),
  });
}

export function RemoveServiceGroupInputSchema(): z.ZodObject<
  Properties<RemoveServiceGroupInput>
> {
  return z.object({
    groupId: z.string(),
  });
}

export function RemoveServiceInputSchema(): z.ZodObject<
  Properties<RemoveServiceInput>
> {
  return z.object({
    serviceId: z.string(),
  });
}

export function RemoveServiceMetricInputSchema(): z.ZodObject<
  Properties<RemoveServiceMetricInput>
> {
  return z.object({
    metricId: z.string(),
    serviceId: z.string(),
  });
}

export function RenewExpiringSubscriptionInputSchema(): z.ZodObject<
  Properties<RenewExpiringSubscriptionInput>
> {
  return z.object({
    newRenewalDate: z.string().datetime().nullish(),
    timestamp: z.string().datetime(),
  });
}

export function ReportRecurringPaymentInputSchema(): z.ZodObject<
  Properties<ReportRecurringPaymentInput>
> {
  return z.object({
    paymentDate: z.string().datetime(),
    serviceId: z.string(),
  });
}

export function ReportSetupPaymentInputSchema(): z.ZodObject<
  Properties<ReportSetupPaymentInput>
> {
  return z.object({
    paymentDate: z.string().datetime(),
    serviceId: z.string(),
  });
}

export function ResourceDocumentSchema(): z.ZodObject<
  Properties<ResourceDocument>
> {
  return z.object({
    __typename: z.literal("ResourceDocument").optional(),
    id: z.string(),
    label: z.string().nullish(),
    thumbnailUrl: z.string().url().nullish(),
  });
}

export function ResumeSubscriptionInputSchema(): z.ZodObject<
  Properties<ResumeSubscriptionInput>
> {
  return z.object({
    timestamp: z.string().datetime(),
  });
}

export function SendInvoiceInputSchema(): z.ZodObject<
  Properties<SendInvoiceInput>
> {
  return z.object({
    invoiceId: z.string(),
    sentDate: z.string().datetime(),
  });
}

export function ServiceSchema(): z.ZodObject<Properties<Service>> {
  return z.object({
    __typename: z.literal("Service").optional(),
    description: z.string().nullish(),
    id: z.string(),
    metrics: z.array(z.lazy(() => ServiceMetricSchema())),
    name: z.string().nullish(),
    recurringCost: z.lazy(() => RecurringCostSchema().nullish()),
    setupCost: z.lazy(() => SetupCostSchema().nullish()),
  });
}

export function ServiceGroupSchema(): z.ZodObject<Properties<ServiceGroup>> {
  return z.object({
    __typename: z.literal("ServiceGroup").optional(),
    id: z.string(),
    name: z.string(),
    optional: z.boolean(),
    services: z.array(z.lazy(() => ServiceSchema())),
  });
}

export function ServiceMetricSchema(): z.ZodObject<Properties<ServiceMetric>> {
  return z.object({
    __typename: z.literal("ServiceMetric").optional(),
    currentUsage: z.number(),
    id: z.string(),
    limit: z.number().nullish(),
    name: z.string(),
    nextUsageReset: z.string().datetime().nullish(),
    unitCost: z.lazy(() => RecurringCostSchema().nullish()),
    unitName: z.string(),
    usageResetPeriod: ResetPeriodSchema.nullish(),
  });
}

export function SetAutoRenewInputSchema(): z.ZodObject<
  Properties<SetAutoRenewInput>
> {
  return z.object({
    autoRenew: z.boolean(),
  });
}

export function SetBudgetCategoryInputSchema(): z.ZodObject<
  Properties<SetBudgetCategoryInput>
> {
  return z.object({
    budgetId: z.string(),
    budgetLabel: z.string(),
  });
}

export function SetCustomerTypeInputSchema(): z.ZodObject<
  Properties<SetCustomerTypeInput>
> {
  return z.object({
    customerType: CustomerTypeSchema,
    teamMemberCount: z.number().nullish(),
  });
}

export function SetExpiringInputSchema(): z.ZodObject<
  Properties<SetExpiringInput>
> {
  return z.object({
    expiringSince: z.string().datetime(),
  });
}

export function SetInvoiceTaxInputSchema(): z.ZodObject<
  Properties<SetInvoiceTaxInput>
> {
  return z.object({
    invoiceId: z.string(),
    tax: z.number(),
  });
}

export function SetOperatorNotesInputSchema(): z.ZodObject<
  Properties<SetOperatorNotesInput>
> {
  return z.object({
    operatorNotes: z.string().nullish(),
  });
}

export function SetPrimaryCommunicationChannelInputSchema(): z.ZodObject<
  Properties<SetPrimaryCommunicationChannelInput>
> {
  return z.object({
    channelId: z.string(),
  });
}

export function SetRenewalDateInputSchema(): z.ZodObject<
  Properties<SetRenewalDateInput>
> {
  return z.object({
    renewalDate: z.string().datetime(),
  });
}

export function SetResourceDocumentInputSchema(): z.ZodObject<
  Properties<SetResourceDocumentInput>
> {
  return z.object({
    resourceId: z.string(),
    resourceLabel: z.string().nullish(),
    resourceThumbnailUrl: z.string().url().nullish(),
  });
}

export function SetupCostSchema(): z.ZodObject<Properties<SetupCost>> {
  return z.object({
    __typename: z.literal("SetupCost").optional(),
    amount: z.number(),
    billingDate: z.string().datetime().nullish(),
    currency: z.string(),
    paymentDate: z.string().datetime().nullish(),
  });
}

export function SubscriptionInstanceStateSchema(): z.ZodObject<
  Properties<SubscriptionInstanceState>
> {
  return z.object({
    __typename: z.literal("SubscriptionInstanceState").optional(),
    activatedSince: z.string().datetime().nullish(),
    autoRenew: z.boolean(),
    budget: z.lazy(() => BudgetCategorySchema().nullish()),
    cancellationReason: z.string().nullish(),
    cancelledSince: z.string().datetime().nullish(),
    communications: z.array(z.lazy(() => CommunicationChannelSchema())),
    createdAt: z.string().datetime().nullish(),
    customerEmail: z.string().email().nullish(),
    customerId: z.string().nullish(),
    customerName: z.string().nullish(),
    customerType: CustomerTypeSchema.nullish(),
    customerWalletAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullish(),
    expiringSince: z.string().datetime().nullish(),
    invoices: z.array(z.lazy(() => InvoiceSchema())),
    kycStatus: KycStatusSchema.nullish(),
    operatorId: z.string().nullish(),
    operatorNotes: z.string().nullish(),
    pausedSince: z.string().datetime().nullish(),
    renewalDate: z.string().datetime().nullish(),
    resource: z.lazy(() => ResourceDocumentSchema().nullish()),
    serviceGroups: z.array(z.lazy(() => ServiceGroupSchema())),
    serviceOfferingId: z.string().nullish(),
    services: z.array(z.lazy(() => ServiceSchema())),
    status: SubscriptionStatusSchema,
    teamMemberCount: z.number().nullish(),
    tierName: z.string().nullish(),
    tierPricingOptionId: z.string().nullish(),
  });
}

export function UpdateCustomerInfoInputSchema(): z.ZodObject<
  Properties<UpdateCustomerInfoInput>
> {
  return z.object({
    customerEmail: z.string().email().nullish(),
    customerId: z.string().nullish(),
    customerName: z.string().nullish(),
  });
}

export function UpdateCustomerWalletInputSchema(): z.ZodObject<
  Properties<UpdateCustomerWalletInput>
> {
  return z.object({
    walletAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullish(),
  });
}

export function UpdateInvoiceStatusInputSchema(): z.ZodObject<
  Properties<UpdateInvoiceStatusInput>
> {
  return z.object({
    invoiceId: z.string(),
    paidDate: z.string().datetime().nullish(),
    status: InvoiceStatusSchema,
  });
}

export function UpdateKycStatusInputSchema(): z.ZodObject<
  Properties<UpdateKycStatusInput>
> {
  return z.object({
    kycStatus: KycStatusSchema,
  });
}

export function UpdateMetricInputSchema(): z.ZodObject<
  Properties<UpdateMetricInput>
> {
  return z.object({
    limit: z.number().nullish(),
    metricId: z.string(),
    name: z.string().nullish(),
    nextUsageReset: z.string().datetime().nullish(),
    serviceId: z.string(),
    unitName: z.string().nullish(),
    usageResetPeriod: ResetPeriodSchema.nullish(),
  });
}

export function UpdateMetricUsageInputSchema(): z.ZodObject<
  Properties<UpdateMetricUsageInput>
> {
  return z.object({
    currentTime: z.string().datetime(),
    currentUsage: z.number(),
    metricId: z.string(),
    serviceId: z.string(),
  });
}

export function UpdateServiceInfoInputSchema(): z.ZodObject<
  Properties<UpdateServiceInfoInput>
> {
  return z.object({
    description: z.string().nullish(),
    name: z.string().nullish(),
    serviceId: z.string(),
  });
}

export function UpdateServiceRecurringCostInputSchema(): z.ZodObject<
  Properties<UpdateServiceRecurringCostInput>
> {
  return z.object({
    amount: z.number().nullish(),
    billingCycle: BillingCycleSchema.nullish(),
    currency: z.string().nullish(),
    lastPaymentDate: z.string().datetime().nullish(),
    nextBillingDate: z.string().datetime().nullish(),
    serviceId: z.string(),
  });
}

export function UpdateServiceSetupCostInputSchema(): z.ZodObject<
  Properties<UpdateServiceSetupCostInput>
> {
  return z.object({
    amount: z.number().nullish(),
    billingDate: z.string().datetime().nullish(),
    currency: z.string().nullish(),
    paymentDate: z.string().datetime().nullish(),
    serviceId: z.string(),
  });
}

export function UpdateSubscriptionStatusInputSchema(): z.ZodObject<
  Properties<UpdateSubscriptionStatusInput>
> {
  return z.object({
    status: SubscriptionStatusSchema,
  });
}

export function UpdateTeamMemberCountInputSchema(): z.ZodObject<
  Properties<UpdateTeamMemberCountInput>
> {
  return z.object({
    teamMemberCount: z.number(),
  });
}

export function UpdateTierInfoInputSchema(): z.ZodObject<
  Properties<UpdateTierInfoInput>
> {
  return z.object({
    tierName: z.string().nullish(),
    tierPricingOptionId: z.string().nullish(),
  });
}

export function VerifyCommunicationChannelInputSchema(): z.ZodObject<
  Properties<VerifyCommunicationChannelInput>
> {
  return z.object({
    channelId: z.string(),
    verifiedAt: z.string().datetime(),
  });
}
