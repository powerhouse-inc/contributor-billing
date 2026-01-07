import {
  useDocumentOfType,
  useSelectedDocumentId,
} from "@powerhousedao/reactor-browser";
import type {
  ExpenseReportAction,
  ExpenseReportDocument,
} from "../../document-models/expense-report/index.js";

export function useExpenseReportDocument(
  documentId: string | null | undefined,
) {
  return useDocumentOfType<ExpenseReportDocument, ExpenseReportAction>(
    documentId,
    "powerhouse/expense-report",
  );
}

export function useSelectedExpenseReportDocument() {
  const selectedDocumentId = useSelectedDocumentId();
  return useExpenseReportDocument(selectedDocumentId);
}
