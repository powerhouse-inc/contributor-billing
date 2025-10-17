import {
  useDocumentOfType,
  useSelectedDocumentId,
} from "@powerhousedao/reactor-browser";
import type {
  InvoiceAction,
  InvoiceDocument,
} from "../../document-models/invoice/index.js";

export function useInvoiceDocument(documentId: string | null | undefined) {
  return useDocumentOfType<InvoiceDocument, InvoiceAction>(
    documentId,
    "powerhouse/invoice",
  );
}

export function useSelectedInvoiceDocument() {
  const selectedDocumentId = useSelectedDocumentId();
  return useInvoiceDocument(selectedDocumentId);
}
