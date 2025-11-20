import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  InvoiceDocument,
  InvoiceAction,
} from "@powerhousedao/contributor-billing/document-models/invoice";
import { isInvoiceDocument } from "./gen/document-schema.js";

/** Hook to get a Invoice document by its id */
export function useInvoiceDocumentById(
  documentId: string | null | undefined,
): [InvoiceDocument, DocumentDispatch<InvoiceAction>] | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isInvoiceDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected Invoice document */
export function useSelectedInvoiceDocument():
  | [InvoiceDocument, DocumentDispatch<InvoiceAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isInvoiceDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all Invoice documents in the selected drive */
export function useInvoiceDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isInvoiceDocument);
}

/** Hook to get all Invoice documents in the selected folder */
export function useInvoiceDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isInvoiceDocument);
}
