import {
  useDocumentOfType,
  useSelectedDocumentId,
} from "@powerhousedao/reactor-browser";
import type {
  IntegrationsAction,
  IntegrationsDocument,
} from "../../document-models/integrations/index.js";

export function useIntegrationsDocument(documentId: string | null | undefined) {
  return useDocumentOfType<IntegrationsDocument, IntegrationsAction>(
    documentId,
    "powerhouse/integrations",
  );
}

export function useSelectedIntegrationsDocument() {
  const selectedDocumentId = useSelectedDocumentId();
  return useIntegrationsDocument(selectedDocumentId);
}
