import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  accountsDocumentType,
} from "@powerhousedao/contributor-billing/document-models/accounts";

import type {
  AccountsDocument,
  AddAccountInput,
  UpdateAccountInput,
  DeleteAccountInput,
  UpdateKycStatusInput,
} from "@powerhousedao/contributor-billing/document-models/accounts";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      Accounts: async () => {
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

            const doc = await reactor.getDocument<AccountsDocument>(docId);
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
                const doc = await reactor.getDocument<AccountsDocument>(docId);
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
              (doc) => doc.header.documentType === accountsDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      Accounts_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(accountsDocumentType);

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: accountsDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      Accounts_addAccount: async (
        _: unknown,
        args: { docId: string; input: AddAccountInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AccountsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addAccount(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addAccount");
        }

        return true;
      },

      Accounts_updateAccount: async (
        _: unknown,
        args: { docId: string; input: UpdateAccountInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AccountsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateAccount(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to updateAccount");
        }

        return true;
      },

      Accounts_deleteAccount: async (
        _: unknown,
        args: { docId: string; input: DeleteAccountInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AccountsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.deleteAccount(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to deleteAccount");
        }

        return true;
      },

      Accounts_updateKycStatus: async (
        _: unknown,
        args: { docId: string; input: UpdateKycStatusInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AccountsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateKycStatus(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to updateKycStatus");
        }

        return true;
      },
    },
  };
};
