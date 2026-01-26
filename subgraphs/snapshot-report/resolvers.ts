import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  snapshotReportDocumentType,
} from "@powerhousedao/contributor-billing/document-models/snapshot-report";

import type {
  SnapshotReportDocument,
  SetReportConfigInput,
  SetAccountsDocumentInput,
  SetPeriodInput,
  AddOwnerIdInput,
  RemoveOwnerIdInput,
  SetPeriodStartInput,
  SetPeriodEndInput,
  AddSnapshotAccountInput,
  UpdateSnapshotAccountTypeInput,
  RemoveSnapshotAccountInput,
  SetStartingBalanceInput,
  SetEndingBalanceInput,
  RemoveStartingBalanceInput,
  RemoveEndingBalanceInput,
  AddTransactionInput,
  RemoveTransactionInput,
  UpdateTransactionFlowTypeInput,
  RecalculateFlowTypesInput,
} from "@powerhousedao/contributor-billing/document-models/snapshot-report";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      SnapshotReport: async () => {
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
              await reactor.getDocument<SnapshotReportDocument>(docId);
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
                  await reactor.getDocument<SnapshotReportDocument>(docId);
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
              (doc) => doc.header.documentType === snapshotReportDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      SnapshotReport_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(snapshotReportDocumentType);

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: snapshotReportDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      SnapshotReport_setReportConfig: async (
        _: unknown,
        args: { docId: string; input: SetReportConfigInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setReportConfig(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setReportConfig");
        }

        return true;
      },

      SnapshotReport_setAccountsDocument: async (
        _: unknown,
        args: { docId: string; input: SetAccountsDocumentInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setAccountsDocument(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setAccountsDocument",
          );
        }

        return true;
      },

      SnapshotReport_setPeriod: async (
        _: unknown,
        args: { docId: string; input: SetPeriodInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.setPeriod(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setPeriod");
        }

        return true;
      },

      SnapshotReport_addOwnerId: async (
        _: unknown,
        args: { docId: string; input: AddOwnerIdInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addOwnerId(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addOwnerId");
        }

        return true;
      },

      SnapshotReport_removeOwnerId: async (
        _: unknown,
        args: { docId: string; input: RemoveOwnerIdInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeOwnerId(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to removeOwnerId");
        }

        return true;
      },

      SnapshotReport_setPeriodStart: async (
        _: unknown,
        args: { docId: string; input: SetPeriodStartInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setPeriodStart(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setPeriodStart");
        }

        return true;
      },

      SnapshotReport_setPeriodEnd: async (
        _: unknown,
        args: { docId: string; input: SetPeriodEndInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setPeriodEnd(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setPeriodEnd");
        }

        return true;
      },

      SnapshotReport_addSnapshotAccount: async (
        _: unknown,
        args: { docId: string; input: AddSnapshotAccountInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addSnapshotAccount(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to addSnapshotAccount",
          );
        }

        return true;
      },

      SnapshotReport_updateSnapshotAccountType: async (
        _: unknown,
        args: { docId: string; input: UpdateSnapshotAccountTypeInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateSnapshotAccountType(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateSnapshotAccountType",
          );
        }

        return true;
      },

      SnapshotReport_removeSnapshotAccount: async (
        _: unknown,
        args: { docId: string; input: RemoveSnapshotAccountInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeSnapshotAccount(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeSnapshotAccount",
          );
        }

        return true;
      },

      SnapshotReport_setStartingBalance: async (
        _: unknown,
        args: { docId: string; input: SetStartingBalanceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setStartingBalance(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setStartingBalance",
          );
        }

        return true;
      },

      SnapshotReport_setEndingBalance: async (
        _: unknown,
        args: { docId: string; input: SetEndingBalanceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setEndingBalance(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setEndingBalance",
          );
        }

        return true;
      },

      SnapshotReport_removeStartingBalance: async (
        _: unknown,
        args: { docId: string; input: RemoveStartingBalanceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeStartingBalance(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeStartingBalance",
          );
        }

        return true;
      },

      SnapshotReport_removeEndingBalance: async (
        _: unknown,
        args: { docId: string; input: RemoveEndingBalanceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeEndingBalance(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeEndingBalance",
          );
        }

        return true;
      },

      SnapshotReport_addTransaction: async (
        _: unknown,
        args: { docId: string; input: AddTransactionInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addTransaction(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addTransaction");
        }

        return true;
      },

      SnapshotReport_removeTransaction: async (
        _: unknown,
        args: { docId: string; input: RemoveTransactionInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeTransaction(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeTransaction",
          );
        }

        return true;
      },

      SnapshotReport_updateTransactionFlowType: async (
        _: unknown,
        args: { docId: string; input: UpdateTransactionFlowTypeInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateTransactionFlowType(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateTransactionFlowType",
          );
        }

        return true;
      },

      SnapshotReport_recalculateFlowTypes: async (
        _: unknown,
        args: { docId: string; input: RecalculateFlowTypesInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<SnapshotReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.recalculateFlowTypes(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to recalculateFlowTypes",
          );
        }

        return true;
      },
    },
  };
};
