import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  IntegrationsDocument,
  IntegrationsAction,
} from "@powerhousedao/contributor-billing/document-models/integrations";
import { isIntegrationsDocument } from "./gen/document-schema.js";

/** Hook to get a Integrations document by its id */
export function useIntegrationsDocumentById(
  documentId: string | null | undefined,
):
  | [IntegrationsDocument, DocumentDispatch<IntegrationsAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isIntegrationsDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected Integrations document */
export function useSelectedIntegrationsDocument():
  | [IntegrationsDocument, DocumentDispatch<IntegrationsAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isIntegrationsDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all Integrations documents in the selected drive */
export function useIntegrationsDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isIntegrationsDocument);
}

/** Hook to get all Integrations documents in the selected folder */
export function useIntegrationsDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isIntegrationsDocument);
}
