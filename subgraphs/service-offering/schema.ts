import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: ServiceOffering Document
  """
  type ServiceOfferingQueries {
    getDocument(docId: PHID!, driveId: PHID): ServiceOffering
    getDocuments(driveId: String!): [ServiceOffering!]
  }

  type Query {
    ServiceOffering: ServiceOfferingQueries
  }

  """
  Mutations: ServiceOffering
  """
  type Mutation {
    ServiceOffering_createDocument(name: String!, driveId: String): String

    ServiceOffering_addService(
      driveId: String
      docId: PHID
      input: ServiceOffering_AddServiceInput
    ): Int
    ServiceOffering_updateService(
      driveId: String
      docId: PHID
      input: ServiceOffering_UpdateServiceInput
    ): Int
    ServiceOffering_deleteService(
      driveId: String
      docId: PHID
      input: ServiceOffering_DeleteServiceInput
    ): Int
    ServiceOffering_addFacetBinding(
      driveId: String
      docId: PHID
      input: ServiceOffering_AddFacetBindingInput
    ): Int
    ServiceOffering_removeFacetBinding(
      driveId: String
      docId: PHID
      input: ServiceOffering_RemoveFacetBindingInput
    ): Int
    ServiceOffering_addTier(
      driveId: String
      docId: PHID
      input: ServiceOffering_AddTierInput
    ): Int
    ServiceOffering_updateTier(
      driveId: String
      docId: PHID
      input: ServiceOffering_UpdateTierInput
    ): Int
    ServiceOffering_updateTierPricing(
      driveId: String
      docId: PHID
      input: ServiceOffering_UpdateTierPricingInput
    ): Int
    ServiceOffering_deleteTier(
      driveId: String
      docId: PHID
      input: ServiceOffering_DeleteTierInput
    ): Int
    ServiceOffering_addServiceLevel(
      driveId: String
      docId: PHID
      input: ServiceOffering_AddServiceLevelInput
    ): Int
    ServiceOffering_updateServiceLevel(
      driveId: String
      docId: PHID
      input: ServiceOffering_UpdateServiceLevelInput
    ): Int
    ServiceOffering_removeServiceLevel(
      driveId: String
      docId: PHID
      input: ServiceOffering_RemoveServiceLevelInput
    ): Int
    ServiceOffering_addUsageLimit(
      driveId: String
      docId: PHID
      input: ServiceOffering_AddUsageLimitInput
    ): Int
    ServiceOffering_updateUsageLimit(
      driveId: String
      docId: PHID
      input: ServiceOffering_UpdateUsageLimitInput
    ): Int
    ServiceOffering_removeUsageLimit(
      driveId: String
      docId: PHID
      input: ServiceOffering_RemoveUsageLimitInput
    ): Int
    ServiceOffering_updateOfferingInfo(
      driveId: String
      docId: PHID
      input: ServiceOffering_UpdateOfferingInfoInput
    ): Int
    ServiceOffering_updateOfferingStatus(
      driveId: String
      docId: PHID
      input: ServiceOffering_UpdateOfferingStatusInput
    ): Int
    ServiceOffering_setOperator(
      driveId: String
      docId: PHID
      input: ServiceOffering_SetOperatorInput
    ): Int
    ServiceOffering_setOfferingId(
      driveId: String
      docId: PHID
      input: ServiceOffering_SetOfferingIdInput
    ): Int
    ServiceOffering_addTargetAudience(
      driveId: String
      docId: PHID
      input: ServiceOffering_AddTargetAudienceInput
    ): Int
    ServiceOffering_removeTargetAudience(
      driveId: String
      docId: PHID
      input: ServiceOffering_RemoveTargetAudienceInput
    ): Int
    ServiceOffering_setFacetTarget(
      driveId: String
      docId: PHID
      input: ServiceOffering_SetFacetTargetInput
    ): Int
    ServiceOffering_removeFacetTarget(
      driveId: String
      docId: PHID
      input: ServiceOffering_RemoveFacetTargetInput
    ): Int
    ServiceOffering_addFacetOption(
      driveId: String
      docId: PHID
      input: ServiceOffering_AddFacetOptionInput
    ): Int
    ServiceOffering_removeFacetOption(
      driveId: String
      docId: PHID
      input: ServiceOffering_RemoveFacetOptionInput
    ): Int
    ServiceOffering_setSetupServices(
      driveId: String
      docId: PHID
      input: ServiceOffering_SetSetupServicesInput
    ): Int
    ServiceOffering_setRecurringServices(
      driveId: String
      docId: PHID
      input: ServiceOffering_SetRecurringServicesInput
    ): Int
    ServiceOffering_selectResourceTemplate(
      driveId: String
      docId: PHID
      input: ServiceOffering_SelectResourceTemplateInput
    ): Int
    ServiceOffering_changeResourceTemplate(
      driveId: String
      docId: PHID
      input: ServiceOffering_ChangeResourceTemplateInput
    ): Int
    ServiceOffering_addOptionGroup(
      driveId: String
      docId: PHID
      input: ServiceOffering_AddOptionGroupInput
    ): Int
    ServiceOffering_updateOptionGroup(
      driveId: String
      docId: PHID
      input: ServiceOffering_UpdateOptionGroupInput
    ): Int
    ServiceOffering_deleteOptionGroup(
      driveId: String
      docId: PHID
      input: ServiceOffering_DeleteOptionGroupInput
    ): Int
  }

  """
  Module: ServiceManagement
  """
  input ServiceOffering_AddServiceInput {
    id: OID!
    title: String!
    description: String
    parentServiceId: OID
    displayOrder: Int
    isSetupFormation: Boolean
    isPremiumExclusive: Boolean
    optionGroupId: OID
    lastModified: DateTime!
  }
  input ServiceOffering_UpdateServiceInput {
    id: OID!
    title: String
    description: String
    parentServiceId: OID
    displayOrder: Int
    isSetupFormation: Boolean
    isPremiumExclusive: Boolean
    optionGroupId: OID
    lastModified: DateTime!
  }
  input ServiceOffering_DeleteServiceInput {
    id: OID!
    lastModified: DateTime!
  }
  input ServiceOffering_AddFacetBindingInput {
    serviceId: OID!
    bindingId: OID!
    facetName: String!
    facetType: PHID!
    supportedOptions: [OID!]!
    lastModified: DateTime!
  }
  input ServiceOffering_RemoveFacetBindingInput {
    serviceId: OID!
    bindingId: OID!
    lastModified: DateTime!
  }

  """
  Module: TierManagement
  """
  input ServiceOffering_AddTierInput {
    id: OID!
    name: String!
    description: String
    amount: Amount_Money
    currency: Currency!
    billingCycle: ServiceOffering_BillingCycle!
    setupFee: Amount_Money
    isCustomPricing: Boolean
    lastModified: DateTime!
  }
  input ServiceOffering_UpdateTierInput {
    id: OID!
    name: String
    description: String
    isCustomPricing: Boolean
    lastModified: DateTime!
  }
  input ServiceOffering_UpdateTierPricingInput {
    tierId: OID!
    amount: Amount_Money
    currency: Currency
    billingCycle: ServiceOffering_BillingCycle
    setupFee: Amount_Money
    lastModified: DateTime!
  }
  input ServiceOffering_DeleteTierInput {
    id: OID!
    lastModified: DateTime!
  }
  input ServiceOffering_AddServiceLevelInput {
    tierId: OID!
    serviceLevelId: OID!
    serviceId: OID!
    level: ServiceOffering_ServiceLevel!
    optionGroupId: OID
    variations: String
    annexes: String
    customValue: String
    setupFee: Amount_Money
    lastModified: DateTime!
  }
  input ServiceOffering_UpdateServiceLevelInput {
    tierId: OID!
    serviceLevelId: OID!
    level: ServiceOffering_ServiceLevel
    optionGroupId: OID
    variations: String
    annexes: String
    customValue: String
    setupFee: Amount_Money
    lastModified: DateTime!
  }
  input ServiceOffering_RemoveServiceLevelInput {
    tierId: OID!
    serviceLevelId: OID!
    lastModified: DateTime!
  }
  input ServiceOffering_AddUsageLimitInput {
    tierId: OID!
    limitId: OID!
    serviceId: OID!
    metric: String!
    limit: Int
    resetPeriod: ServiceOffering_ResetPeriod
    notes: String
    lastModified: DateTime!
  }
  input ServiceOffering_UpdateUsageLimitInput {
    tierId: OID!
    limitId: OID!
    metric: String
    limit: Int
    resetPeriod: ServiceOffering_ResetPeriod
    notes: String
    lastModified: DateTime!
  }
  input ServiceOffering_RemoveUsageLimitInput {
    tierId: OID!
    limitId: OID!
    lastModified: DateTime!
  }

  """
  Module: OfferingManagement
  """
  input ServiceOffering_UpdateOfferingInfoInput {
    title: String
    summary: String
    description: String
    thumbnailUrl: URL
    infoLink: URL
    lastModified: DateTime!
  }
  input ServiceOffering_UpdateOfferingStatusInput {
    status: ServiceOffering_ServiceStatus!
    lastModified: DateTime!
  }
  input ServiceOffering_SetOperatorInput {
    operatorId: PHID!
    lastModified: DateTime!
  }
  input ServiceOffering_SetOfferingIdInput {
    id: PHID!
    lastModified: DateTime!
  }
  input ServiceOffering_AddTargetAudienceInput {
    id: OID!
    label: String!
    color: String
    lastModified: DateTime!
  }
  input ServiceOffering_RemoveTargetAudienceInput {
    id: OID!
    lastModified: DateTime!
  }
  input ServiceOffering_SetFacetTargetInput {
    id: OID!
    categoryKey: String!
    categoryLabel: String!
    selectedOptions: [String!]!
    lastModified: DateTime!
  }
  input ServiceOffering_RemoveFacetTargetInput {
    categoryKey: String!
    lastModified: DateTime!
  }
  input ServiceOffering_AddFacetOptionInput {
    categoryKey: String!
    optionId: String!
    lastModified: DateTime!
  }
  input ServiceOffering_RemoveFacetOptionInput {
    categoryKey: String!
    optionId: String!
    lastModified: DateTime!
  }
  input ServiceOffering_SetSetupServicesInput {
    services: [String!]!
    lastModified: DateTime!
  }
  input ServiceOffering_SetRecurringServicesInput {
    services: [String!]!
    lastModified: DateTime!
  }
  input ServiceOffering_SelectResourceTemplateInput {
    resourceTemplateId: PHID!
    lastModified: DateTime!
  }
  input ServiceOffering_ChangeResourceTemplateInput {
    previousTemplateId: PHID!
    newTemplateId: PHID!
    lastModified: DateTime!
  }

  """
  Module: OptionGroupManagement
  """
  input ServiceOffering_AddOptionGroupInput {
    id: OID!
    name: String!
    description: String
    isAddOn: Boolean!
    defaultSelected: Boolean!
    lastModified: DateTime!
  }
  input ServiceOffering_UpdateOptionGroupInput {
    id: OID!
    name: String
    description: String
    isAddOn: Boolean
    defaultSelected: Boolean
    lastModified: DateTime!
  }
  input ServiceOffering_DeleteOptionGroupInput {
    id: OID!
    lastModified: DateTime!
  }
`;
