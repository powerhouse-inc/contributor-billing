import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: ResourceTemplate Document
  """
  type ResourceTemplateQueries {
    getDocument(docId: PHID!, driveId: PHID): ResourceTemplate
    getDocuments(driveId: String!): [ResourceTemplate!]
  }

  type Query {
    ResourceTemplate: ResourceTemplateQueries
  }

  """
  Mutations: ResourceTemplate
  """
  type Mutation {
    ResourceTemplate_createDocument(name: String!, driveId: String): String

    ResourceTemplate_updateTemplateInfo(
      driveId: String
      docId: PHID
      input: ResourceTemplate_UpdateTemplateInfoInput
    ): Int
    ResourceTemplate_updateTemplateStatus(
      driveId: String
      docId: PHID
      input: ResourceTemplate_UpdateTemplateStatusInput
    ): Int
    ResourceTemplate_setOperator(
      driveId: String
      docId: PHID
      input: ResourceTemplate_SetOperatorInput
    ): Int
    ResourceTemplate_setTemplateId(
      driveId: String
      docId: PHID
      input: ResourceTemplate_SetTemplateIdInput
    ): Int
    ResourceTemplate_addTargetAudience(
      driveId: String
      docId: PHID
      input: ResourceTemplate_AddTargetAudienceInput
    ): Int
    ResourceTemplate_removeTargetAudience(
      driveId: String
      docId: PHID
      input: ResourceTemplate_RemoveTargetAudienceInput
    ): Int
    ResourceTemplate_setFacetTarget(
      driveId: String
      docId: PHID
      input: ResourceTemplate_SetFacetTargetInput
    ): Int
    ResourceTemplate_removeFacetTarget(
      driveId: String
      docId: PHID
      input: ResourceTemplate_RemoveFacetTargetInput
    ): Int
    ResourceTemplate_addFacetOption(
      driveId: String
      docId: PHID
      input: ResourceTemplate_AddFacetOptionInput
    ): Int
    ResourceTemplate_removeFacetOption(
      driveId: String
      docId: PHID
      input: ResourceTemplate_RemoveFacetOptionInput
    ): Int
    ResourceTemplate_setSetupServices(
      driveId: String
      docId: PHID
      input: ResourceTemplate_SetSetupServicesInput
    ): Int
    ResourceTemplate_setRecurringServices(
      driveId: String
      docId: PHID
      input: ResourceTemplate_SetRecurringServicesInput
    ): Int
    ResourceTemplate_addService(
      driveId: String
      docId: PHID
      input: ResourceTemplate_AddServiceInput
    ): Int
    ResourceTemplate_updateService(
      driveId: String
      docId: PHID
      input: ResourceTemplate_UpdateServiceInput
    ): Int
    ResourceTemplate_deleteService(
      driveId: String
      docId: PHID
      input: ResourceTemplate_DeleteServiceInput
    ): Int
    ResourceTemplate_addFacetBinding(
      driveId: String
      docId: PHID
      input: ResourceTemplate_AddFacetBindingInput
    ): Int
    ResourceTemplate_removeFacetBinding(
      driveId: String
      docId: PHID
      input: ResourceTemplate_RemoveFacetBindingInput
    ): Int
    ResourceTemplate_addOptionGroup(
      driveId: String
      docId: PHID
      input: ResourceTemplate_AddOptionGroupInput
    ): Int
    ResourceTemplate_updateOptionGroup(
      driveId: String
      docId: PHID
      input: ResourceTemplate_UpdateOptionGroupInput
    ): Int
    ResourceTemplate_deleteOptionGroup(
      driveId: String
      docId: PHID
      input: ResourceTemplate_DeleteOptionGroupInput
    ): Int
  }

  """
  Module: TemplateManagement
  """
  input ResourceTemplate_UpdateTemplateInfoInput {
    title: String
    summary: String
    description: String
    thumbnailUrl: URL
    infoLink: URL
    lastModified: DateTime!
  }
  input ResourceTemplate_UpdateTemplateStatusInput {
    status: ResourceTemplate_TemplateStatus!
    lastModified: DateTime!
  }
  input ResourceTemplate_SetOperatorInput {
    operatorId: PHID!
    lastModified: DateTime!
  }
  input ResourceTemplate_SetTemplateIdInput {
    id: PHID!
    lastModified: DateTime!
  }

  """
  Module: AudienceManagement
  """
  input ResourceTemplate_AddTargetAudienceInput {
    id: OID!
    label: String!
    color: String
    lastModified: DateTime!
  }
  input ResourceTemplate_RemoveTargetAudienceInput {
    id: OID!
    lastModified: DateTime!
  }

  """
  Module: FacetTargeting
  """
  input ResourceTemplate_SetFacetTargetInput {
    id: OID!
    categoryKey: String!
    categoryLabel: String!
    selectedOptions: [String!]!
    lastModified: DateTime!
  }
  input ResourceTemplate_RemoveFacetTargetInput {
    categoryKey: String!
    lastModified: DateTime!
  }
  input ResourceTemplate_AddFacetOptionInput {
    categoryKey: String!
    optionId: String!
    lastModified: DateTime!
  }
  input ResourceTemplate_RemoveFacetOptionInput {
    categoryKey: String!
    optionId: String!
    lastModified: DateTime!
  }

  """
  Module: ServiceCategoryManagement
  """
  input ResourceTemplate_SetSetupServicesInput {
    services: [String!]!
    lastModified: DateTime!
  }
  input ResourceTemplate_SetRecurringServicesInput {
    services: [String!]!
    lastModified: DateTime!
  }

  """
  Module: ServiceManagement
  """
  input ResourceTemplate_AddServiceInput {
    id: OID!
    title: String!
    description: String
    parentServiceId: OID
    displayOrder: Int
    isSetupFormation: Boolean
    optionGroupId: OID
    lastModified: DateTime!
  }
  input ResourceTemplate_UpdateServiceInput {
    id: OID!
    title: String
    description: String
    parentServiceId: OID
    displayOrder: Int
    isSetupFormation: Boolean
    optionGroupId: OID
    lastModified: DateTime!
  }
  input ResourceTemplate_DeleteServiceInput {
    id: OID!
    lastModified: DateTime!
  }
  input ResourceTemplate_AddFacetBindingInput {
    serviceId: OID!
    bindingId: OID!
    facetName: String!
    facetType: PHID!
    supportedOptions: [OID!]!
    lastModified: DateTime!
  }
  input ResourceTemplate_RemoveFacetBindingInput {
    serviceId: OID!
    bindingId: OID!
    lastModified: DateTime!
  }

  """
  Module: OptionGroupManagement
  """
  input ResourceTemplate_AddOptionGroupInput {
    id: OID!
    name: String!
    description: String
    isAddOn: Boolean!
    defaultSelected: Boolean!
    lastModified: DateTime!
  }
  input ResourceTemplate_UpdateOptionGroupInput {
    id: OID!
    name: String
    description: String
    isAddOn: Boolean
    defaultSelected: Boolean
    lastModified: DateTime!
  }
  input ResourceTemplate_DeleteOptionGroupInput {
    id: OID!
    lastModified: DateTime!
  }
`;
