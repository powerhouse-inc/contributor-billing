import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  serviceOfferingDocumentType,
} from "@powerhousedao/contributor-billing/document-models/service-offering";

import type {
  ServiceOfferingDocument,
  AddServiceInput,
  UpdateServiceInput,
  DeleteServiceInput,
  AddFacetBindingInput,
  RemoveFacetBindingInput,
  AddTierInput,
  UpdateTierInput,
  UpdateTierPricingInput,
  DeleteTierInput,
  AddServiceLevelInput,
  UpdateServiceLevelInput,
  RemoveServiceLevelInput,
  AddUsageLimitInput,
  UpdateUsageLimitInput,
  RemoveUsageLimitInput,
  UpdateOfferingInfoInput,
  UpdateOfferingStatusInput,
  SetOperatorInput,
  SetOfferingIdInput,
  AddTargetAudienceInput,
  RemoveTargetAudienceInput,
  SetFacetTargetInput,
  RemoveFacetTargetInput,
  AddFacetOptionInput,
  RemoveFacetOptionInput,
  SetSetupServicesInput,
  SetRecurringServicesInput,
  SelectResourceTemplateInput,
  ChangeResourceTemplateInput,
  AddOptionGroupInput,
  UpdateOptionGroupInput,
  DeleteOptionGroupInput,
} from "@powerhousedao/contributor-billing/document-models/service-offering";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      ServiceOffering: async () => {
        return {
          getDocument: async (args: { docId: string; driveId: string }) => {
            const { docId, driveId } = args;

            if (!docId) {
              throw new Error("Document id is required");
            }

            if (driveId) {
              const docIds = await reactor.getDocuments(driveId);
              if (!docIds.includes(docId)) {
                throw new Error(
                  `Document with id ${docId} is not part of ${driveId}`,
                );
              }
            }

            const doc =
              await reactor.getDocument<ServiceOfferingDocument>(docId);
            return {
              driveId: driveId,
              ...doc,
              ...doc.header,
              created: doc.header.createdAtUtcIso,
              lastModified: doc.header.lastModifiedAtUtcIso,
              state: doc.state.global,
              stateJSON: doc.state.global,
              revision: doc.header?.revision?.global ?? 0,
            };
          },
          getDocuments: async (args: { driveId: string }) => {
            const { driveId } = args;
            const docsIds = await reactor.getDocuments(driveId);
            const docs = await Promise.all(
              docsIds.map(async (docId) => {
                const doc =
                  await reactor.getDocument<ServiceOfferingDocument>(docId);
                return {
                  driveId: driveId,
                  ...doc,
                  ...doc.header,
                  created: doc.header.createdAtUtcIso,
                  lastModified: doc.header.lastModifiedAtUtcIso,
                  state: doc.state.global,
                  stateJSON: doc.state.global,
                  revision: doc.header?.revision?.global ?? 0,
                };
              }),
            );

            return docs.filter(
              (doc) => doc.header.documentType === serviceOfferingDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      ServiceOffering_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(serviceOfferingDocumentType);

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: serviceOfferingDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      ServiceOffering_addService: async (
        _: unknown,
        args: { docId: string; input: AddServiceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addService(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addService");
        }

        return true;
      },

      ServiceOffering_updateService: async (
        _: unknown,
        args: { docId: string; input: UpdateServiceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateService(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to updateService");
        }

        return true;
      },

      ServiceOffering_deleteService: async (
        _: unknown,
        args: { docId: string; input: DeleteServiceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.deleteService(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to deleteService");
        }

        return true;
      },

      ServiceOffering_addFacetBinding: async (
        _: unknown,
        args: { docId: string; input: AddFacetBindingInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addFacetBinding(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addFacetBinding");
        }

        return true;
      },

      ServiceOffering_removeFacetBinding: async (
        _: unknown,
        args: { docId: string; input: RemoveFacetBindingInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeFacetBinding(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeFacetBinding",
          );
        }

        return true;
      },

      ServiceOffering_addTier: async (
        _: unknown,
        args: { docId: string; input: AddTierInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.addTier(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addTier");
        }

        return true;
      },

      ServiceOffering_updateTier: async (
        _: unknown,
        args: { docId: string; input: UpdateTierInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateTier(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to updateTier");
        }

        return true;
      },

      ServiceOffering_updateTierPricing: async (
        _: unknown,
        args: { docId: string; input: UpdateTierPricingInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateTierPricing(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateTierPricing",
          );
        }

        return true;
      },

      ServiceOffering_deleteTier: async (
        _: unknown,
        args: { docId: string; input: DeleteTierInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.deleteTier(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to deleteTier");
        }

        return true;
      },

      ServiceOffering_addServiceLevel: async (
        _: unknown,
        args: { docId: string; input: AddServiceLevelInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addServiceLevel(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addServiceLevel");
        }

        return true;
      },

      ServiceOffering_updateServiceLevel: async (
        _: unknown,
        args: { docId: string; input: UpdateServiceLevelInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateServiceLevel(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateServiceLevel",
          );
        }

        return true;
      },

      ServiceOffering_removeServiceLevel: async (
        _: unknown,
        args: { docId: string; input: RemoveServiceLevelInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeServiceLevel(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeServiceLevel",
          );
        }

        return true;
      },

      ServiceOffering_addUsageLimit: async (
        _: unknown,
        args: { docId: string; input: AddUsageLimitInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addUsageLimit(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addUsageLimit");
        }

        return true;
      },

      ServiceOffering_updateUsageLimit: async (
        _: unknown,
        args: { docId: string; input: UpdateUsageLimitInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateUsageLimit(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateUsageLimit",
          );
        }

        return true;
      },

      ServiceOffering_removeUsageLimit: async (
        _: unknown,
        args: { docId: string; input: RemoveUsageLimitInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeUsageLimit(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeUsageLimit",
          );
        }

        return true;
      },

      ServiceOffering_updateOfferingInfo: async (
        _: unknown,
        args: { docId: string; input: UpdateOfferingInfoInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateOfferingInfo(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateOfferingInfo",
          );
        }

        return true;
      },

      ServiceOffering_updateOfferingStatus: async (
        _: unknown,
        args: { docId: string; input: UpdateOfferingStatusInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateOfferingStatus(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateOfferingStatus",
          );
        }

        return true;
      },

      ServiceOffering_setOperator: async (
        _: unknown,
        args: { docId: string; input: SetOperatorInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setOperator(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setOperator");
        }

        return true;
      },

      ServiceOffering_setOfferingId: async (
        _: unknown,
        args: { docId: string; input: SetOfferingIdInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setOfferingId(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setOfferingId");
        }

        return true;
      },

      ServiceOffering_addTargetAudience: async (
        _: unknown,
        args: { docId: string; input: AddTargetAudienceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addTargetAudience(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to addTargetAudience",
          );
        }

        return true;
      },

      ServiceOffering_removeTargetAudience: async (
        _: unknown,
        args: { docId: string; input: RemoveTargetAudienceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeTargetAudience(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeTargetAudience",
          );
        }

        return true;
      },

      ServiceOffering_setFacetTarget: async (
        _: unknown,
        args: { docId: string; input: SetFacetTargetInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setFacetTarget(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setFacetTarget");
        }

        return true;
      },

      ServiceOffering_removeFacetTarget: async (
        _: unknown,
        args: { docId: string; input: RemoveFacetTargetInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeFacetTarget(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeFacetTarget",
          );
        }

        return true;
      },

      ServiceOffering_addFacetOption: async (
        _: unknown,
        args: { docId: string; input: AddFacetOptionInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addFacetOption(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addFacetOption");
        }

        return true;
      },

      ServiceOffering_removeFacetOption: async (
        _: unknown,
        args: { docId: string; input: RemoveFacetOptionInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeFacetOption(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeFacetOption",
          );
        }

        return true;
      },

      ServiceOffering_setSetupServices: async (
        _: unknown,
        args: { docId: string; input: SetSetupServicesInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setSetupServices(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setSetupServices",
          );
        }

        return true;
      },

      ServiceOffering_setRecurringServices: async (
        _: unknown,
        args: { docId: string; input: SetRecurringServicesInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setRecurringServices(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setRecurringServices",
          );
        }

        return true;
      },

      ServiceOffering_selectResourceTemplate: async (
        _: unknown,
        args: { docId: string; input: SelectResourceTemplateInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.selectResourceTemplate(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to selectResourceTemplate",
          );
        }

        return true;
      },

      ServiceOffering_changeResourceTemplate: async (
        _: unknown,
        args: { docId: string; input: ChangeResourceTemplateInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.changeResourceTemplate(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to changeResourceTemplate",
          );
        }

        return true;
      },

      ServiceOffering_addOptionGroup: async (
        _: unknown,
        args: { docId: string; input: AddOptionGroupInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addOptionGroup(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addOptionGroup");
        }

        return true;
      },

      ServiceOffering_updateOptionGroup: async (
        _: unknown,
        args: { docId: string; input: UpdateOptionGroupInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateOptionGroup(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateOptionGroup",
          );
        }

        return true;
      },

      ServiceOffering_deleteOptionGroup: async (
        _: unknown,
        args: { docId: string; input: DeleteOptionGroupInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ServiceOfferingDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.deleteOptionGroup(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to deleteOptionGroup",
          );
        }

        return true;
      },
    },
  };
};
