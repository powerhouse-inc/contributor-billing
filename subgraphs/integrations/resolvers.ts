import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  integrationsDocumentType,
} from "@powerhousedao/contributor-billing/document-models/integrations";

import type {
  IntegrationsDocument,
  SetRequestFinanceInput,
  SetGnosisSafeInput,
  SetGoogleCloudInput,
} from "@powerhousedao/contributor-billing/document-models/integrations";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      Integrations: async () => {
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

            const doc = await reactor.getDocument<IntegrationsDocument>(docId);
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
                  await reactor.getDocument<IntegrationsDocument>(docId);
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
              (doc) => doc.header.documentType === integrationsDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      Integrations_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(integrationsDocumentType);

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: integrationsDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      Integrations_setRequestFinance: async (
        _: unknown,
        args: { docId: string; input: SetRequestFinanceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<IntegrationsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setRequestFinance(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setRequestFinance",
          );
        }

        return true;
      },

      Integrations_setGnosisSafe: async (
        _: unknown,
        args: { docId: string; input: SetGnosisSafeInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<IntegrationsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setGnosisSafe(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setGnosisSafe");
        }

        return true;
      },

      Integrations_setGoogleCloud: async (
        _: unknown,
        args: { docId: string; input: SetGoogleCloudInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<IntegrationsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setGoogleCloud(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setGoogleCloud");
        }

        return true;
      },
    },
  };
};
