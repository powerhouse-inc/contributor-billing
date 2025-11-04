import {
  useDocumentOfType,
  useSelectedDocumentId,
} from "@powerhousedao/reactor-browser";
import type {
  BillingStatementAction,
  BillingStatementDocument,
} from "../../document-models/billing-statement/index.js";

export function useBillingStatementDocument(
  documentId: string | null | undefined,
) {
  return useDocumentOfType<BillingStatementDocument, BillingStatementAction>(
    documentId,
    "powerhouse/billing-statement",
  );
}

export function useSelectedBillingStatementDocument() {
  const selectedDocumentId = useSelectedDocumentId();
  return useBillingStatementDocument(selectedDocumentId);
}
