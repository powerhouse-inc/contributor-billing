import { type Subgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import {
  actions,
  type SetRequestFinanceInput,
  type SetGnosisSafeInput,
  type SetGoogleCloudInput,
  type IntegrationsDocument,
} from "../../document-models/integrations/index.js";
import { setName } from "document-model";

export const getResolvers = (subgraph: Subgraph): Record<string, any> => {
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
                  state: doc.state.global,
                  stateJSON: doc.state.global,
                  revision: doc.header?.revision?.global ?? 0,
                };
              }),
            );

            return docs.filter(
              (doc) => doc.header.documentType === "powerhouse/integrations",
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
        const document = await reactor.addDocument("powerhouse/integrations");

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: "powerhouse/integrations",
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
