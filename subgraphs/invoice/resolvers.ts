/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type Subgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { actions } from "../../document-models/invoice/index.js";
import { generateId } from "document-model";
import { Invoice_processGnosisPayment, Invoice_createRequestFinancePayment, Invoice_uploadInvoicePdfChunk } from "./customResolvers.js";

const DEFAULT_DRIVE_ID = "powerhouse";

export const getResolvers = (subgraph: Subgraph): Record<string, any> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      Invoice: async (_: any, args: any, ctx: any) => {
        return {
          getDocument: async (args: any) => {
            const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
            const docId: string = args.docId || "";
            const doc = await reactor.getDocument(driveId, docId);
            return {
              driveId: driveId,
              ...doc,
              state: doc?.state?.global ?? "",
              stateJSON: doc?.state?.global,
              revision: doc?.header?.revision?.global,
            };
          },
          getDocuments: async (args: any) => {
            const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
            const docsIds = await reactor.getDocuments(driveId);
            const docs = await Promise.all(
              (docsIds ?? []).map(async (docId) => {
                const doc = await reactor.getDocument(driveId, docId);
                return {
                  driveId: driveId,
                  ...doc,
                  state: doc?.state?.global,
                  stateJSON: doc?.state?.global,
                  revision: doc?.header?.revision?.global,
                };
              }),
            );

            return docs.filter(
              (doc) => doc.header?.documentType === "powerhouse/invoice",
            );
          },
        };
      },
    },
    Mutation: {
      Invoice_createDocument: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId = generateId();

        await reactor.addDriveAction(
          driveId,
          addFile({
            id: docId,
            name: args.name,
            documentType: "powerhouse/invoice",
            synchronizationUnits: [
              {
                branch: "main",
                scope: "global",
                syncId: generateId(),
              },
              {
                branch: "main",
                scope: "local",
                syncId: generateId(),
              },
            ],
          }),
        );

        return docId;
      },

      Invoice_editInvoice: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.editInvoice({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_editStatus: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.editStatus({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_editPaymentData: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.editPaymentData({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_setExportedData: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.setExportedData({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_addPayment: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.addPayment({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_editIssuer: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.editIssuer({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_editIssuerBank: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.editIssuerBank({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_editIssuerWallet: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.editIssuerWallet({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_editPayer: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.editPayer({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_editPayerBank: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.editPayerBank({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_editPayerWallet: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.editPayerWallet({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_addLineItem: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.addLineItem({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_editLineItem: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.editLineItem({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_deleteLineItem: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.deleteLineItem({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_setLineItemTag: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.setLineItemTag({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_setInvoiceTag: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.setInvoiceTag({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_cancel: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.cancel({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_issue: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.issue({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_reset: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.reset({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_reject: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.reject({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_accept: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.accept({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_reinstate: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.reinstate({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_schedulePayment: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.schedulePayment({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_reapprovePayment: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.reapprovePayment({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_registerPaymentTx: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.registerPaymentTx({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_reportPaymentIssue: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.reportPaymentIssue({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_confirmPayment: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.confirmPayment({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },

      Invoice_closePayment: async (_: any, args: any) => {
        const driveId: string = args.driveId || DEFAULT_DRIVE_ID;
        const docId: string = args.docId || "";
        const doc = await reactor.getDocument(driveId, docId);

        await reactor.addAction(
          driveId,
          docId,
          actions.closePayment({ ...args.input }),
        );

        return (doc?.header?.revision.global ?? 0) + 1;
      },
      Invoice_processGnosisPayment,
      Invoice_createRequestFinancePayment,
      Invoice_uploadInvoicePdfChunk,
    },
  };
};
