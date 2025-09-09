import { type Subgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import {
  actions,
  type EditBillingStatementInput,
  type EditContributorInput,
  type EditStatusInput,
  type AddLineItemInput,
  type EditLineItemInput,
  type EditLineItemTagInput,
  type BillingStatementDocument,
} from "../../document-models/billing-statement/index.js";
import { setName } from "document-model";

export const getResolvers = (subgraph: Subgraph): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      BillingStatement: async () => {
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
              await reactor.getDocument<BillingStatementDocument>(docId);
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
                  await reactor.getDocument<BillingStatementDocument>(docId);
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
              (doc) =>
                doc.header.documentType === "powerhouse/billing-statement",
            );
          },
        };
      },
    },
    Mutation: {
      BillingStatement_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(
          "powerhouse/billing-statement",
        );

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: "powerhouse/billing-statement",
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      BillingStatement_editBillingStatement: async (
        _: unknown,
        args: { docId: string; input: EditBillingStatementInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BillingStatementDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editBillingStatement(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to editBillingStatement",
          );
        }

        return true;
      },

      BillingStatement_editContributor: async (
        _: unknown,
        args: { docId: string; input: EditContributorInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BillingStatementDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editContributor(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to editContributor");
        }

        return true;
      },

      BillingStatement_editStatus: async (
        _: unknown,
        args: { docId: string; input: EditStatusInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BillingStatementDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editStatus(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to editStatus");
        }

        return true;
      },

      BillingStatement_addLineItem: async (
        _: unknown,
        args: { docId: string; input: AddLineItemInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BillingStatementDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addLineItem(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addLineItem");
        }

        return true;
      },

      BillingStatement_editLineItem: async (
        _: unknown,
        args: { docId: string; input: EditLineItemInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BillingStatementDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editLineItem(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to editLineItem");
        }

        return true;
      },

      BillingStatement_editLineItemTag: async (
        _: unknown,
        args: { docId: string; input: EditLineItemTagInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<BillingStatementDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editLineItemTag(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to editLineItemTag");
        }

        return true;
      },
    },
  };
};
