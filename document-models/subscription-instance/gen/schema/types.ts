export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Address: { input: `${string}:0x${string}`; output: `${string}:0x${string}` };
  Amount: {
    input: { unit?: string; value?: number };
    output: { unit?: string; value?: number };
  };
  Amount_Crypto: {
    input: { unit: string; value: string };
    output: { unit: string; value: string };
  };
  Amount_Currency: {
    input: { unit: string; value: string };
    output: { unit: string; value: string };
  };
  Amount_Fiat: {
    input: { unit: string; value: number };
    output: { unit: string; value: number };
  };
  Amount_Money: { input: number; output: number };
  Amount_Percentage: { input: number; output: number };
  Amount_Tokens: { input: number; output: number };
  Attachment: { input: string; output: string };
  Currency: { input: string; output: string };
  Date: { input: string; output: string };
  DateTime: { input: string; output: string };
  EmailAddress: { input: string; output: string };
  EthereumAddress: { input: string; output: string };
  OID: { input: string; output: string };
  OLabel: { input: string; output: string };
  PHID: { input: string; output: string };
  URL: { input: string; output: string };
  Unknown: { input: unknown; output: unknown };
  Upload: { input: File; output: File };
};

export type ActivateSubscriptionInput = {
  activatedSince: Scalars["DateTime"]["input"];
};

export type AddCommunicationChannelInput = {
  channelId: Scalars["OID"]["input"];
  identifier: Scalars["String"]["input"];
  isPrimary: Scalars["Boolean"]["input"];
  type: CommunicationChannelType;
  verifiedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type AddInvoiceLineItemInput = {
  description: Scalars["String"]["input"];
  invoiceId: Scalars["OID"]["input"];
  lineItemId: Scalars["OID"]["input"];
  metricId?: InputMaybe<Scalars["OID"]["input"]>;
  quantity: Scalars["Int"]["input"];
  serviceId?: InputMaybe<Scalars["OID"]["input"]>;
  unitPrice: Scalars["Amount_Money"]["input"];
};

export type AddServiceGroupInput = {
  groupId: Scalars["OID"]["input"];
  name: Scalars["String"]["input"];
  optional: Scalars["Boolean"]["input"];
};

export type AddServiceInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  recurringAmount?: InputMaybe<Scalars["Amount_Money"]["input"]>;
  recurringBillingCycle?: InputMaybe<BillingCycle>;
  recurringCurrency?: InputMaybe<Scalars["Currency"]["input"]>;
  recurringLastPaymentDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  recurringNextBillingDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  serviceId: Scalars["OID"]["input"];
  setupAmount?: InputMaybe<Scalars["Amount_Money"]["input"]>;
  setupBillingDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  setupCurrency?: InputMaybe<Scalars["Currency"]["input"]>;
  setupPaymentDate?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type AddServiceMetricInput = {
  currentUsage: Scalars["Int"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  metricId: Scalars["OID"]["input"];
  name: Scalars["String"]["input"];
  nextUsageReset?: InputMaybe<Scalars["DateTime"]["input"]>;
  serviceId: Scalars["OID"]["input"];
  unitCostAmount?: InputMaybe<Scalars["Amount_Money"]["input"]>;
  unitCostBillingCycle?: InputMaybe<BillingCycle>;
  unitCostCurrency?: InputMaybe<Scalars["Currency"]["input"]>;
  unitCostLastPaymentDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  unitCostNextBillingDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  unitName: Scalars["String"]["input"];
  usageResetPeriod?: InputMaybe<ResetPeriod>;
};

export type AddServiceToGroupInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  groupId: Scalars["OID"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  recurringAmount?: InputMaybe<Scalars["Amount_Money"]["input"]>;
  recurringBillingCycle?: InputMaybe<BillingCycle>;
  recurringCurrency?: InputMaybe<Scalars["Currency"]["input"]>;
  recurringLastPaymentDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  recurringNextBillingDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  serviceId: Scalars["OID"]["input"];
  setupAmount?: InputMaybe<Scalars["Amount_Money"]["input"]>;
  setupBillingDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  setupCurrency?: InputMaybe<Scalars["Currency"]["input"]>;
  setupPaymentDate?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type BillingCycle =
  | "ANNUAL"
  | "MONTHLY"
  | "ONE_TIME"
  | "QUARTERLY"
  | "SEMI_ANNUAL";

export type BudgetCategory = {
  id: Scalars["OID"]["output"];
  label: Scalars["String"]["output"];
};

export type CancelInvoiceInput = {
  invoiceId: Scalars["OID"]["input"];
  reason?: InputMaybe<Scalars["String"]["input"]>;
};

export type CancelSubscriptionInput = {
  cancellationReason?: InputMaybe<Scalars["String"]["input"]>;
  cancelledSince: Scalars["DateTime"]["input"];
};

export type CommunicationChannel = {
  id: Scalars["OID"]["output"];
  identifier: Scalars["String"]["output"];
  isPrimary: Scalars["Boolean"]["output"];
  type: CommunicationChannelType;
  verifiedAt: Maybe<Scalars["DateTime"]["output"]>;
};

export type CommunicationChannelType =
  | "DISCORD"
  | "EMAIL"
  | "SLACK"
  | "TELEGRAM"
  | "WHATSAPP";

export type CreateInvoiceInput = {
  currency: Scalars["Currency"]["input"];
  dueDate: Scalars["DateTime"]["input"];
  invoiceId: Scalars["OID"]["input"];
  invoiceNumber: Scalars["String"]["input"];
  issueDate: Scalars["DateTime"]["input"];
  notes?: InputMaybe<Scalars["String"]["input"]>;
  periodEnd: Scalars["DateTime"]["input"];
  periodStart: Scalars["DateTime"]["input"];
};

export type CustomerType = "INDIVIDUAL" | "TEAM";

export type DecrementMetricUsageInput = {
  currentTime: Scalars["DateTime"]["input"];
  decrementBy: Scalars["Int"]["input"];
  metricId: Scalars["OID"]["input"];
  serviceId: Scalars["OID"]["input"];
};

export type IncrementMetricUsageInput = {
  currentTime: Scalars["DateTime"]["input"];
  incrementBy: Scalars["Int"]["input"];
  metricId: Scalars["OID"]["input"];
  serviceId: Scalars["OID"]["input"];
};

export type InitializeSubscriptionInput = {
  autoRenew?: InputMaybe<Scalars["Boolean"]["input"]>;
  createdAt: Scalars["DateTime"]["input"];
  customerEmail?: InputMaybe<Scalars["EmailAddress"]["input"]>;
  customerId?: InputMaybe<Scalars["PHID"]["input"]>;
  customerName?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["PHID"]["input"]>;
  resourceLabel?: InputMaybe<Scalars["String"]["input"]>;
  resourceThumbnailUrl?: InputMaybe<Scalars["URL"]["input"]>;
  serviceOfferingId?: InputMaybe<Scalars["PHID"]["input"]>;
  tierName?: InputMaybe<Scalars["String"]["input"]>;
  tierPricingOptionId?: InputMaybe<Scalars["OID"]["input"]>;
};

export type Invoice = {
  currency: Scalars["Currency"]["output"];
  dueDate: Scalars["DateTime"]["output"];
  id: Scalars["OID"]["output"];
  invoiceNumber: Scalars["String"]["output"];
  issueDate: Scalars["DateTime"]["output"];
  lineItems: Array<InvoiceLineItem>;
  notes: Maybe<Scalars["String"]["output"]>;
  paidDate: Maybe<Scalars["DateTime"]["output"]>;
  payments: Array<InvoicePayment>;
  periodEnd: Scalars["DateTime"]["output"];
  periodStart: Scalars["DateTime"]["output"];
  status: InvoiceStatus;
  subtotal: Scalars["Amount_Money"]["output"];
  tax: Maybe<Scalars["Amount_Money"]["output"]>;
  total: Scalars["Amount_Money"]["output"];
};

export type InvoiceLineItem = {
  description: Scalars["String"]["output"];
  id: Scalars["OID"]["output"];
  metricId: Maybe<Scalars["OID"]["output"]>;
  quantity: Scalars["Int"]["output"];
  serviceId: Maybe<Scalars["OID"]["output"]>;
  total: Scalars["Amount_Money"]["output"];
  unitPrice: Scalars["Amount_Money"]["output"];
};

export type InvoicePayment = {
  amount: Scalars["Amount_Money"]["output"];
  currency: Scalars["Currency"]["output"];
  id: Scalars["OID"]["output"];
  paymentDate: Scalars["DateTime"]["output"];
  paymentMethod: PaymentMethod;
  reference: Maybe<Scalars["String"]["output"]>;
  transactionHash: Maybe<Scalars["String"]["output"]>;
  walletAddress: Maybe<Scalars["EthereumAddress"]["output"]>;
};

export type InvoiceStatus =
  | "CANCELLED"
  | "DRAFT"
  | "OVERDUE"
  | "PAID"
  | "PARTIALLY_PAID"
  | "REFUNDED"
  | "SENT";

export type KycStatus =
  | "NOT_REQUIRED"
  | "NOT_STARTED"
  | "PENDING"
  | "REJECTED"
  | "VERIFIED";

export type MarkInvoiceOverdueInput = {
  invoiceId: Scalars["OID"]["input"];
};

export type PauseSubscriptionInput = {
  pausedSince: Scalars["DateTime"]["input"];
};

export type PaymentMethod =
  | "BANK_TRANSFER"
  | "CREDIT_CARD"
  | "CRYPTO"
  | "OTHER"
  | "PAYPAL";

export type RecordInvoicePaymentInput = {
  amount: Scalars["Amount_Money"]["input"];
  currency: Scalars["Currency"]["input"];
  invoiceId: Scalars["OID"]["input"];
  paymentDate: Scalars["DateTime"]["input"];
  paymentId: Scalars["OID"]["input"];
  paymentMethod: PaymentMethod;
  reference?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash?: InputMaybe<Scalars["String"]["input"]>;
  walletAddress?: InputMaybe<Scalars["EthereumAddress"]["input"]>;
};

export type RecurringCost = {
  amount: Scalars["Amount_Money"]["output"];
  billingCycle: BillingCycle;
  currency: Scalars["Currency"]["output"];
  lastPaymentDate: Maybe<Scalars["DateTime"]["output"]>;
  nextBillingDate: Maybe<Scalars["DateTime"]["output"]>;
};

export type RefundInvoiceInput = {
  invoiceId: Scalars["OID"]["input"];
  reason?: InputMaybe<Scalars["String"]["input"]>;
  refundDate: Scalars["DateTime"]["input"];
};

export type RemoveBudgetCategoryInput = {
  budgetId: Scalars["OID"]["input"];
};

export type RemoveCommunicationChannelInput = {
  channelId: Scalars["OID"]["input"];
};

export type RemoveInvoiceLineItemInput = {
  invoiceId: Scalars["OID"]["input"];
  lineItemId: Scalars["OID"]["input"];
};

export type RemoveServiceFromGroupInput = {
  groupId: Scalars["OID"]["input"];
  serviceId: Scalars["OID"]["input"];
};

export type RemoveServiceGroupInput = {
  groupId: Scalars["OID"]["input"];
};

export type RemoveServiceInput = {
  serviceId: Scalars["OID"]["input"];
};

export type RemoveServiceMetricInput = {
  metricId: Scalars["OID"]["input"];
  serviceId: Scalars["OID"]["input"];
};

export type RenewExpiringSubscriptionInput = {
  newRenewalDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  timestamp: Scalars["DateTime"]["input"];
};

export type ReportRecurringPaymentInput = {
  paymentDate: Scalars["DateTime"]["input"];
  serviceId: Scalars["OID"]["input"];
};

export type ReportSetupPaymentInput = {
  paymentDate: Scalars["DateTime"]["input"];
  serviceId: Scalars["OID"]["input"];
};

export type ResetPeriod =
  | "ANNUAL"
  | "DAILY"
  | "HOURLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMI_ANNUAL"
  | "WEEKLY";

export type ResourceDocument = {
  id: Scalars["PHID"]["output"];
  label: Maybe<Scalars["String"]["output"]>;
  thumbnailUrl: Maybe<Scalars["URL"]["output"]>;
};

export type ResumeSubscriptionInput = {
  timestamp: Scalars["DateTime"]["input"];
};

export type SendInvoiceInput = {
  invoiceId: Scalars["OID"]["input"];
  sentDate: Scalars["DateTime"]["input"];
};

export type Service = {
  description: Maybe<Scalars["String"]["output"]>;
  id: Scalars["OID"]["output"];
  metrics: Array<ServiceMetric>;
  name: Maybe<Scalars["String"]["output"]>;
  recurringCost: Maybe<RecurringCost>;
  setupCost: Maybe<SetupCost>;
};

export type ServiceGroup = {
  id: Scalars["OID"]["output"];
  name: Scalars["String"]["output"];
  optional: Scalars["Boolean"]["output"];
  services: Array<Service>;
};

export type ServiceMetric = {
  currentUsage: Scalars["Int"]["output"];
  id: Scalars["OID"]["output"];
  limit: Maybe<Scalars["Int"]["output"]>;
  name: Scalars["String"]["output"];
  nextUsageReset: Maybe<Scalars["DateTime"]["output"]>;
  unitCost: Maybe<RecurringCost>;
  unitName: Scalars["String"]["output"];
  usageResetPeriod: Maybe<ResetPeriod>;
};

export type SetAutoRenewInput = {
  autoRenew: Scalars["Boolean"]["input"];
};

export type SetBudgetCategoryInput = {
  budgetId: Scalars["OID"]["input"];
  budgetLabel: Scalars["String"]["input"];
};

export type SetCustomerTypeInput = {
  customerType: CustomerType;
  teamMemberCount?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SetExpiringInput = {
  expiringSince: Scalars["DateTime"]["input"];
};

export type SetInvoiceTaxInput = {
  invoiceId: Scalars["OID"]["input"];
  tax: Scalars["Amount_Money"]["input"];
};

export type SetOperatorNotesInput = {
  operatorNotes?: InputMaybe<Scalars["String"]["input"]>;
};

export type SetPrimaryCommunicationChannelInput = {
  channelId: Scalars["OID"]["input"];
};

export type SetRenewalDateInput = {
  renewalDate: Scalars["DateTime"]["input"];
};

export type SetResourceDocumentInput = {
  resourceId: Scalars["PHID"]["input"];
  resourceLabel?: InputMaybe<Scalars["String"]["input"]>;
  resourceThumbnailUrl?: InputMaybe<Scalars["URL"]["input"]>;
};

export type SetupCost = {
  amount: Scalars["Amount_Money"]["output"];
  billingDate: Maybe<Scalars["DateTime"]["output"]>;
  currency: Scalars["Currency"]["output"];
  paymentDate: Maybe<Scalars["DateTime"]["output"]>;
};

export type SubscriptionInstanceState = {
  activatedSince: Maybe<Scalars["DateTime"]["output"]>;
  autoRenew: Scalars["Boolean"]["output"];
  budget: Maybe<BudgetCategory>;
  cancellationReason: Maybe<Scalars["String"]["output"]>;
  cancelledSince: Maybe<Scalars["DateTime"]["output"]>;
  communications: Array<CommunicationChannel>;
  createdAt: Maybe<Scalars["DateTime"]["output"]>;
  customerEmail: Maybe<Scalars["EmailAddress"]["output"]>;
  customerId: Maybe<Scalars["PHID"]["output"]>;
  customerName: Maybe<Scalars["String"]["output"]>;
  customerType: Maybe<CustomerType>;
  customerWalletAddress: Maybe<Scalars["EthereumAddress"]["output"]>;
  expiringSince: Maybe<Scalars["DateTime"]["output"]>;
  invoices: Array<Invoice>;
  kycStatus: Maybe<KycStatus>;
  operatorId: Maybe<Scalars["PHID"]["output"]>;
  operatorNotes: Maybe<Scalars["String"]["output"]>;
  pausedSince: Maybe<Scalars["DateTime"]["output"]>;
  renewalDate: Maybe<Scalars["DateTime"]["output"]>;
  resource: Maybe<ResourceDocument>;
  serviceGroups: Array<ServiceGroup>;
  serviceOfferingId: Maybe<Scalars["PHID"]["output"]>;
  services: Array<Service>;
  status: SubscriptionStatus;
  teamMemberCount: Maybe<Scalars["Int"]["output"]>;
  tierName: Maybe<Scalars["String"]["output"]>;
  tierPricingOptionId: Maybe<Scalars["OID"]["output"]>;
};

export type SubscriptionStatus =
  | "ACTIVE"
  | "CANCELLED"
  | "EXPIRING"
  | "PAUSED"
  | "PENDING";

export type UpdateCustomerInfoInput = {
  customerEmail?: InputMaybe<Scalars["EmailAddress"]["input"]>;
  customerId?: InputMaybe<Scalars["PHID"]["input"]>;
  customerName?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateCustomerWalletInput = {
  walletAddress?: InputMaybe<Scalars["EthereumAddress"]["input"]>;
};

export type UpdateInvoiceStatusInput = {
  invoiceId: Scalars["OID"]["input"];
  paidDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  status: InvoiceStatus;
};

export type UpdateKycStatusInput = {
  kycStatus: KycStatus;
};

export type UpdateMetricInput = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  metricId: Scalars["OID"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  nextUsageReset?: InputMaybe<Scalars["DateTime"]["input"]>;
  serviceId: Scalars["OID"]["input"];
  unitName?: InputMaybe<Scalars["String"]["input"]>;
  usageResetPeriod?: InputMaybe<ResetPeriod>;
};

export type UpdateMetricUsageInput = {
  currentTime: Scalars["DateTime"]["input"];
  currentUsage: Scalars["Int"]["input"];
  metricId: Scalars["OID"]["input"];
  serviceId: Scalars["OID"]["input"];
};

export type UpdateServiceInfoInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  serviceId: Scalars["OID"]["input"];
};

export type UpdateServiceRecurringCostInput = {
  amount?: InputMaybe<Scalars["Amount_Money"]["input"]>;
  billingCycle?: InputMaybe<BillingCycle>;
  currency?: InputMaybe<Scalars["Currency"]["input"]>;
  lastPaymentDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  nextBillingDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  serviceId: Scalars["OID"]["input"];
};

export type UpdateServiceSetupCostInput = {
  amount?: InputMaybe<Scalars["Amount_Money"]["input"]>;
  billingDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  currency?: InputMaybe<Scalars["Currency"]["input"]>;
  paymentDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  serviceId: Scalars["OID"]["input"];
};

export type UpdateSubscriptionStatusInput = {
  status: SubscriptionStatus;
};

export type UpdateTeamMemberCountInput = {
  teamMemberCount: Scalars["Int"]["input"];
};

export type UpdateTierInfoInput = {
  tierName?: InputMaybe<Scalars["String"]["input"]>;
  tierPricingOptionId?: InputMaybe<Scalars["OID"]["input"]>;
};

export type VerifyCommunicationChannelInput = {
  channelId: Scalars["OID"]["input"];
  verifiedAt: Scalars["DateTime"]["input"];
};
