import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  ResourceTemplateDocument,
  ResourceTemplateAction,
} from "./gen/types.js";
import { isResourceTemplateDocument } from "./gen/document-schema.js";

/** Hook to get a ResourceTemplate document by its id */
export function useResourceTemplateDocumentById(
  documentId: string | null | undefined,
):
  | [ResourceTemplateDocument, DocumentDispatch<ResourceTemplateAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isResourceTemplateDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected ResourceTemplate document */
export function useSelectedResourceTemplateDocument():
  | [ResourceTemplateDocument, DocumentDispatch<ResourceTemplateAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isResourceTemplateDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all ResourceTemplate documents in the selected drive */
export function useResourceTemplateDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isResourceTemplateDocument);
}

/** Hook to get all ResourceTemplate documents in the selected folder */
export function useResourceTemplateDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isResourceTemplateDocument);
}
