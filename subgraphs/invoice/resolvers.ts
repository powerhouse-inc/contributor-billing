import { BaseSubgraph } from "@powerhousedao/reactor-api";
import { Invoice_processGnosisPayment, Invoice_createRequestFinancePayment, Invoice_uploadInvoicePdfChunk } from "./customResolvers.js";
import { addFile } from "document-drive";
import {
  actions,
  type EditInvoiceInput,
  type EditStatusInput,
  type EditPaymentDataInput,
  type SetExportedDataInput,
  type AddPaymentInput,
  type EditIssuerInput,
  type EditIssuerBankInput,
  type EditIssuerWalletInput,
  type EditPayerInput,
  type EditPayerBankInput,
  type EditPayerWalletInput,
  type AddLineItemInput,
  type EditLineItemInput,
  type DeleteLineItemInput,
  type SetLineItemTagInput,
  type SetInvoiceTagInput,
  type CancelInput,
  type IssueInput,
  type ResetInput,
  type RejectInput,
  type AcceptInput,
  type ReinstateInput,
  type SchedulePaymentInput,
  type ReapprovePaymentInput,
  type RegisterPaymentTxInput,
  type ReportPaymentIssueInput,
  type ConfirmPaymentInput,
  type ClosePaymentInput,
  type InvoiceDocument,
} from "../../document-models/invoice/index.js";
import { setName } from "document-model";

export const getResolvers = (subgraph: BaseSubgraph): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      Invoice: async () => {
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

            const doc = await reactor.getDocument<InvoiceDocument>(docId);
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
                const doc = await reactor.getDocument<InvoiceDocument>(docId);
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
              (doc) => doc.header.documentType === "powerhouse/invoice",
            );
          },
        };
      },
    },
    Mutation: {
      Invoice_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument("powerhouse/invoice");

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: "powerhouse/invoice",
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      Invoice_editInvoice: async (
        _: unknown,
        args: { docId: string; input: EditInvoiceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editInvoice(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to editInvoice");
        }

        return true;
      },

      Invoice_editStatus: async (
        _: unknown,
        args: { docId: string; input: EditStatusInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
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

      Invoice_editPaymentData: async (
        _: unknown,
        args: { docId: string; input: EditPaymentDataInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editPaymentData(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to editPaymentData");
        }

        return true;
      },

      Invoice_setExportedData: async (
        _: unknown,
        args: { docId: string; input: SetExportedDataInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setExportedData(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setExportedData");
        }

        return true;
      },

      Invoice_addPayment: async (
        _: unknown,
        args: { docId: string; input: AddPaymentInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addPayment(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addPayment");
        }

        return true;
      },

      Invoice_editIssuer: async (
        _: unknown,
        args: { docId: string; input: EditIssuerInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editIssuer(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to editIssuer");
        }

        return true;
      },

      Invoice_editIssuerBank: async (
        _: unknown,
        args: { docId: string; input: EditIssuerBankInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editIssuerBank(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to editIssuerBank");
        }

        return true;
      },

      Invoice_editIssuerWallet: async (
        _: unknown,
        args: { docId: string; input: EditIssuerWalletInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editIssuerWallet(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to editIssuerWallet",
          );
        }

        return true;
      },

      Invoice_editPayer: async (
        _: unknown,
        args: { docId: string; input: EditPayerInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.editPayer(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to editPayer");
        }

        return true;
      },

      Invoice_editPayerBank: async (
        _: unknown,
        args: { docId: string; input: EditPayerBankInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editPayerBank(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to editPayerBank");
        }

        return true;
      },

      Invoice_editPayerWallet: async (
        _: unknown,
        args: { docId: string; input: EditPayerWalletInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editPayerWallet(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to editPayerWallet");
        }

        return true;
      },

      Invoice_addLineItem: async (
        _: unknown,
        args: { docId: string; input: AddLineItemInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
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

      Invoice_editLineItem: async (
        _: unknown,
        args: { docId: string; input: EditLineItemInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
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

      Invoice_deleteLineItem: async (
        _: unknown,
        args: { docId: string; input: DeleteLineItemInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.deleteLineItem(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to deleteLineItem");
        }

        return true;
      },

      Invoice_setLineItemTag: async (
        _: unknown,
        args: { docId: string; input: SetLineItemTagInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setLineItemTag(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setLineItemTag");
        }

        return true;
      },

      Invoice_setInvoiceTag: async (
        _: unknown,
        args: { docId: string; input: SetInvoiceTagInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setInvoiceTag(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setInvoiceTag");
        }

        return true;
      },

      Invoice_cancel: async (
        _: unknown,
        args: { docId: string; input: CancelInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.cancel(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to cancel");
        }

        return true;
      },

      Invoice_issue: async (
        _: unknown,
        args: { docId: string; input: IssueInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.issue(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to issue");
        }

        return true;
      },

      Invoice_reset: async (
        _: unknown,
        args: { docId: string; input: ResetInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.reset(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to reset");
        }

        return true;
      },

      Invoice_reject: async (
        _: unknown,
        args: { docId: string; input: RejectInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.reject(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to reject");
        }

        return true;
      },

      Invoice_accept: async (
        _: unknown,
        args: { docId: string; input: AcceptInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.accept(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to accept");
        }

        return true;
      },

      Invoice_reinstate: async (
        _: unknown,
        args: { docId: string; input: ReinstateInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.reinstate(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to reinstate");
        }

        return true;
      },

      Invoice_schedulePayment: async (
        _: unknown,
        args: { docId: string; input: SchedulePaymentInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.schedulePayment(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to schedulePayment");
        }

        return true;
      },

      Invoice_reapprovePayment: async (
        _: unknown,
        args: { docId: string; input: ReapprovePaymentInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.reapprovePayment(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to reapprovePayment",
          );
        }

        return true;
      },

      Invoice_registerPaymentTx: async (
        _: unknown,
        args: { docId: string; input: RegisterPaymentTxInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.registerPaymentTx(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to registerPaymentTx",
          );
        }

        return true;
      },

      Invoice_reportPaymentIssue: async (
        _: unknown,
        args: { docId: string; input: ReportPaymentIssueInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.reportPaymentIssue(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to reportPaymentIssue",
          );
        }

        return true;
      },

      Invoice_confirmPayment: async (
        _: unknown,
        args: { docId: string; input: ConfirmPaymentInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.confirmPayment(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to confirmPayment");
        }

        return true;
      },

      Invoice_closePayment: async (
        _: unknown,
        args: { docId: string; input: ClosePaymentInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<InvoiceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.closePayment(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to closePayment");
        }

        return true;
      },
      Invoice_processGnosisPayment: Invoice_processGnosisPayment,
      Invoice_createRequestFinancePayment: Invoice_createRequestFinancePayment,
      Invoice_uploadInvoicePdfChunk: Invoice_uploadInvoicePdfChunk,
    },
  };
};
