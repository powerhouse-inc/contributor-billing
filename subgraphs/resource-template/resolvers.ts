import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  resourceTemplateDocumentType,
} from "@powerhousedao/contributor-billing/document-models/resource-template";

import type {
  ResourceTemplateDocument,
  UpdateTemplateInfoInput,
  UpdateTemplateStatusInput,
  SetOperatorInput,
  SetTemplateIdInput,
  AddTargetAudienceInput,
  RemoveTargetAudienceInput,
  SetFacetTargetInput,
  RemoveFacetTargetInput,
  AddFacetOptionInput,
  RemoveFacetOptionInput,
  SetSetupServicesInput,
  SetRecurringServicesInput,
  AddServiceInput,
  UpdateServiceInput,
  DeleteServiceInput,
  AddFacetBindingInput,
  RemoveFacetBindingInput,
  AddOptionGroupInput,
  UpdateOptionGroupInput,
  DeleteOptionGroupInput,
} from "@powerhousedao/contributor-billing/document-models/resource-template";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      ResourceTemplate: async () => {
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
              await reactor.getDocument<ResourceTemplateDocument>(docId);
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
                  await reactor.getDocument<ResourceTemplateDocument>(docId);
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
              (doc) => doc.header.documentType === resourceTemplateDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      ResourceTemplate_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(
          resourceTemplateDocumentType,
        );

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: resourceTemplateDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      ResourceTemplate_updateTemplateInfo: async (
        _: unknown,
        args: { docId: string; input: UpdateTemplateInfoInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateTemplateInfo(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateTemplateInfo",
          );
        }

        return true;
      },

      ResourceTemplate_updateTemplateStatus: async (
        _: unknown,
        args: { docId: string; input: UpdateTemplateStatusInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateTemplateStatus(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateTemplateStatus",
          );
        }

        return true;
      },

      ResourceTemplate_setOperator: async (
        _: unknown,
        args: { docId: string; input: SetOperatorInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_setTemplateId: async (
        _: unknown,
        args: { docId: string; input: SetTemplateIdInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setTemplateId(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setTemplateId");
        }

        return true;
      },

      ResourceTemplate_addTargetAudience: async (
        _: unknown,
        args: { docId: string; input: AddTargetAudienceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_removeTargetAudience: async (
        _: unknown,
        args: { docId: string; input: RemoveTargetAudienceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_setFacetTarget: async (
        _: unknown,
        args: { docId: string; input: SetFacetTargetInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_removeFacetTarget: async (
        _: unknown,
        args: { docId: string; input: RemoveFacetTargetInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_addFacetOption: async (
        _: unknown,
        args: { docId: string; input: AddFacetOptionInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_removeFacetOption: async (
        _: unknown,
        args: { docId: string; input: RemoveFacetOptionInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_setSetupServices: async (
        _: unknown,
        args: { docId: string; input: SetSetupServicesInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_setRecurringServices: async (
        _: unknown,
        args: { docId: string; input: SetRecurringServicesInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_addService: async (
        _: unknown,
        args: { docId: string; input: AddServiceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_updateService: async (
        _: unknown,
        args: { docId: string; input: UpdateServiceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_deleteService: async (
        _: unknown,
        args: { docId: string; input: DeleteServiceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_addFacetBinding: async (
        _: unknown,
        args: { docId: string; input: AddFacetBindingInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_removeFacetBinding: async (
        _: unknown,
        args: { docId: string; input: RemoveFacetBindingInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_addOptionGroup: async (
        _: unknown,
        args: { docId: string; input: AddOptionGroupInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_updateOptionGroup: async (
        _: unknown,
        args: { docId: string; input: UpdateOptionGroupInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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

      ResourceTemplate_deleteOptionGroup: async (
        _: unknown,
        args: { docId: string; input: DeleteOptionGroupInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceTemplateDocument>(docId);
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
