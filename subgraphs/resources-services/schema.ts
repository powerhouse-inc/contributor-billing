import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Subgraph definition for Resource Templates and Service Offerings
  """
  type Query {
    resourceTemplates(filter: RSResourceTemplatesFilter): [RSResourceTemplate!]!
    serviceOfferings(filter: RSServiceOfferingsFilter): [RSServiceOffering!]!
  }

  type Mutation {
    createResourceInstances(input: CreateResourceInstancesInput!): CreateResourceInstancesOutput
  }

  input CreateResourceInstancesInput {
    resourceTemplateId: PHID!
    name: String!
    teamName: String!
  }

  type CreateResourceInstancesOutput {
    success: Boolean!
    data: JSONObject
    errors: [String!]!
  }

  # ============ Filters ============

  input RSResourceTemplatesFilter {
    id: PHID
    status: [RSTemplateStatus!]
    operatorId: PHID
  }

  input RSServiceOfferingsFilter {
    id: PHID
    status: [RSServiceStatus!]
    operatorId: PHID
    resourceTemplateId: PHID
  }

  # ============ Resource Template Types ============

  enum RSTemplateStatus {
    DRAFT
    COMING_SOON
    ACTIVE
    DEPRECATED
  }

  type RSResourceTemplate {
    id: PHID!
    operatorId: PHID!
    title: String!
    summary: String!
    description: String
    thumbnailUrl: URL
    infoLink: URL
    status: RSTemplateStatus!
    lastModified: DateTime!
    targetAudiences: [RSTargetAudience!]!
    setupServices: [String!]!
    recurringServices: [String!]!
    facetTargets: [RSFacetTarget!]!
    faqFields: [RSFaqField!]!
    contentSections: [RSContentSection!]!
  }

  type RSTargetAudience {
    id: OID!
    label: String!
    color: String
  }

  type RSFacetTarget {
    id: OID!
    categoryKey: String!
    categoryLabel: String!
    selectedOptions: [String!]!
  }

  type RSResourceService {
    id: OID!
    title: String!
    description: String
    displayOrder: Int
    parentServiceId: OID
    isSetupFormation: Boolean!
    optionGroupId: OID
    facetBindings: [RSResourceFacetBinding!]!
  }

  type RSResourceFacetBinding {
    id: OID!
    facetName: String!
    facetType: PHID!
    supportedOptions: [OID!]!
  }

  type RSOptionGroup {
    id: OID!
    name: String!
    description: String
    isAddOn: Boolean!
    defaultSelected: Boolean!
  }

  type RSFaqField {
    id: OID!
    question: String
    answer: String
    displayOrder: Int!
  }

  type RSContentSection {
    id: OID!
    title: String!
    content: String!
    displayOrder: Int!
  }

  # ============ Service Offering Types ============

  enum RSServiceStatus {
    DRAFT
    COMING_SOON
    ACTIVE
    DEPRECATED
  }

  type RSServiceOffering {
    id: PHID!
    operatorId: PHID!
    resourceTemplateId: PHID
    title: String!
    summary: String!
    description: String
    thumbnailUrl: URL
    infoLink: URL
    status: RSServiceStatus!
    lastModified: DateTime!
    targetAudiences: [RSTargetAudience!]!
    setupServices: [String!]!
    recurringServices: [String!]!
    facetTargets: [RSFacetTarget!]!
    services: [RSOfferingService!]!
    tiers: [RSServiceSubscriptionTier!]!
    optionGroups: [RSOptionGroup!]!
  }

  type RSOfferingService {
    id: OID!
    title: String!
    description: String
    displayOrder: Int
    parentServiceId: OID
    isSetupFormation: Boolean!
    isPremiumExclusive: Boolean!
    optionGroupId: OID
    facetBindings: [RSResourceFacetBinding!]!
  }

  type RSServiceSubscriptionTier {
    id: OID!
    name: String!
    description: String
    isCustomPricing: Boolean!
    pricing: RSServicePricing!
    pricingOptions: [RSTierPricingOption!]!
    serviceLevels: [RSServiceLevelBinding!]!
    usageLimits: [RSServiceUsageLimit!]!
  }

  type RSServicePricing {
    amount: Amount_Money
    currency: Currency!
    billingCycle: RSBillingCycle!
    setupFee: Amount_Money
    perSeatAmount: Amount_Money
    perSeatCurrency: Currency
    perSeatBillingCycle: RSBillingCycle
    perSeatLabel: String
  }

  type RSTierPricingOption {
    id: OID!
    billingCycle: RSBillingCycle!
    amount: Amount_Money!
    currency: Currency!
    setupFee: Amount_Money
    isDefault: Boolean!
    perSeatAmount: Amount_Money
  }

  enum RSBillingCycle {
    MONTHLY
    QUARTERLY
    SEMI_ANNUAL
    ANNUAL
    ONE_TIME
  }

  type RSServiceLevelBinding {
    id: OID!
    serviceId: OID!
    level: RSServiceLevel!
    customValue: String
    variations: String
    annexes: String
    setupFee: Amount_Money
    optionGroupId: OID
  }

  enum RSServiceLevel {
    INCLUDED
    NOT_INCLUDED
    OPTIONAL
    CUSTOM
    VARIABLE
    NOT_APPLICABLE
  }

  type RSServiceUsageLimit {
    id: OID!
    serviceId: OID!
    metric: String!
    unitName: String
    limit: Int
    resetPeriod: RSResetPeriod
    notes: String
    unitPrice: Amount_Money
    unitPriceCurrency: Currency
    unitPriceBillingCycle: RSBillingCycle
  }

  enum RSResetPeriod {
    HOURLY
    DAILY
    WEEKLY
    MONTHLY
    QUARTERLY
    SEMI_ANNUAL
    ANNUAL
  }
`;
