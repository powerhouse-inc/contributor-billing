import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentById,
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  ServiceSubscriptionsAction,
  ServiceSubscriptionsDocument,
} from "@powerhousedao/contributor-billing/document-models/service-subscriptions";
import {
  assertIsServiceSubscriptionsDocument,
  isServiceSubscriptionsDocument,
} from "./gen/document-schema.js";

/** Hook to get a ServiceSubscriptions document by its id */
export function useServiceSubscriptionsDocumentById(
  documentId: string | null | undefined,
):
  | [ServiceSubscriptionsDocument, DocumentDispatch<ServiceSubscriptionsAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isServiceSubscriptionsDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected ServiceSubscriptions document */
export function useSelectedServiceSubscriptionsDocument(): [
  ServiceSubscriptionsDocument,
  DocumentDispatch<ServiceSubscriptionsAction>,
] {
  const [document, dispatch] = useSelectedDocument();

  assertIsServiceSubscriptionsDocument(document);
  return [document, dispatch] as const;
}

/** Hook to get all ServiceSubscriptions documents in the selected drive */
export function useServiceSubscriptionsDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isServiceSubscriptionsDocument);
}

/** Hook to get all ServiceSubscriptions documents in the selected folder */
export function useServiceSubscriptionsDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isServiceSubscriptionsDocument);
}
