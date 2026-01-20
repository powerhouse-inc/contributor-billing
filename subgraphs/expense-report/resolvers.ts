import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  expenseReportDocumentType,
} from "@powerhousedao/contributor-billing/document-models/expense-report";

import type {
  ExpenseReportDocument,
  AddWalletInput,
  RemoveWalletInput,
  AddBillingStatementInput,
  RemoveBillingStatementInput,
  AddLineItemInput,
  UpdateLineItemInput,
  RemoveLineItemInput,
  AddLineItemGroupInput,
  UpdateLineItemGroupInput,
  RemoveLineItemGroupInput,
  SetGroupTotalsInput,
  RemoveGroupTotalsInput,
  SetPeriodStartInput,
  SetPeriodEndInput,
  UpdateWalletInput,
  SetOwnerIdInput,
  SetStatusInput,
} from "@powerhousedao/contributor-billing/document-models/expense-report";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      ExpenseReport: async () => {
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

            const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
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
                  await reactor.getDocument<ExpenseReportDocument>(docId);
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
              (doc) => doc.header.documentType === expenseReportDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      ExpenseReport_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(expenseReportDocumentType);

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: expenseReportDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      ExpenseReport_addWallet: async (
        _: unknown,
        args: { docId: string; input: AddWalletInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.addWallet(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addWallet");
        }

        return true;
      },

      ExpenseReport_removeWallet: async (
        _: unknown,
        args: { docId: string; input: RemoveWalletInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeWallet(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to removeWallet");
        }

        return true;
      },

      ExpenseReport_addBillingStatement: async (
        _: unknown,
        args: { docId: string; input: AddBillingStatementInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addBillingStatement(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to addBillingStatement",
          );
        }

        return true;
      },

      ExpenseReport_removeBillingStatement: async (
        _: unknown,
        args: { docId: string; input: RemoveBillingStatementInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeBillingStatement(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeBillingStatement",
          );
        }

        return true;
      },

      ExpenseReport_addLineItem: async (
        _: unknown,
        args: { docId: string; input: AddLineItemInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
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

      ExpenseReport_updateLineItem: async (
        _: unknown,
        args: { docId: string; input: UpdateLineItemInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateLineItem(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to updateLineItem");
        }

        return true;
      },

      ExpenseReport_removeLineItem: async (
        _: unknown,
        args: { docId: string; input: RemoveLineItemInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeLineItem(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to removeLineItem");
        }

        return true;
      },

      ExpenseReport_addLineItemGroup: async (
        _: unknown,
        args: { docId: string; input: AddLineItemGroupInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addLineItemGroup(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to addLineItemGroup",
          );
        }

        return true;
      },

      ExpenseReport_updateLineItemGroup: async (
        _: unknown,
        args: { docId: string; input: UpdateLineItemGroupInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateLineItemGroup(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateLineItemGroup",
          );
        }

        return true;
      },

      ExpenseReport_removeLineItemGroup: async (
        _: unknown,
        args: { docId: string; input: RemoveLineItemGroupInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeLineItemGroup(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeLineItemGroup",
          );
        }

        return true;
      },

      ExpenseReport_setGroupTotals: async (
        _: unknown,
        args: { docId: string; input: SetGroupTotalsInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setGroupTotals(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setGroupTotals");
        }

        return true;
      },

      ExpenseReport_removeGroupTotals: async (
        _: unknown,
        args: { docId: string; input: RemoveGroupTotalsInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeGroupTotals(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeGroupTotals",
          );
        }

        return true;
      },

      ExpenseReport_setPeriodStart: async (
        _: unknown,
        args: { docId: string; input: SetPeriodStartInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
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

      ExpenseReport_setPeriodEnd: async (
        _: unknown,
        args: { docId: string; input: SetPeriodEndInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
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

      ExpenseReport_updateWallet: async (
        _: unknown,
        args: { docId: string; input: UpdateWalletInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateWallet(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to updateWallet");
        }

        return true;
      },

      ExpenseReport_setOwnerId: async (
        _: unknown,
        args: { docId: string; input: SetOwnerIdInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setOwnerId(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setOwnerId");
        }

        return true;
      },

      ExpenseReport_setStatus: async (
        _: unknown,
        args: { docId: string; input: SetStatusInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ExpenseReportDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.setStatus(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setStatus");
        }

        return true;
      },
    },
  };
};
