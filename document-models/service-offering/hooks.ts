import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  ServiceOfferingDocument,
  ServiceOfferingAction,
} from "@powerhousedao/contributor-billing/document-models/service-offering";
import { isServiceOfferingDocument } from "./gen/document-schema.js";

/** Hook to get a ServiceOffering document by its id */
export function useServiceOfferingDocumentById(
  documentId: string | null | undefined,
):
  | [ServiceOfferingDocument, DocumentDispatch<ServiceOfferingAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isServiceOfferingDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected ServiceOffering document */
export function useSelectedServiceOfferingDocument():
  | [ServiceOfferingDocument, DocumentDispatch<ServiceOfferingAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isServiceOfferingDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all ServiceOffering documents in the selected drive */
export function useServiceOfferingDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isServiceOfferingDocument);
}

/** Hook to get all ServiceOffering documents in the selected folder */
export function useServiceOfferingDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isServiceOfferingDocument);
}
