import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  ExpenseReportDocument,
  ExpenseReportAction,
} from "@powerhousedao/contributor-billing/document-models/expense-report";
import { isExpenseReportDocument } from "./gen/document-schema.js";
import { expenseReportDocumentType } from "./gen/document-type.js";

/**
 * Lenient type guard that only checks document type header.
 * Used for backwards compatibility when schema changes may not
 * match existing documents exactly.
 */
function isExpenseReportDocumentLoose(
  document: unknown,
): document is ExpenseReportDocument {
  if (!document || typeof document !== "object") return false;
  const doc = document as Record<string, unknown>;
  const header = doc.header as Record<string, unknown> | undefined;
  return header?.documentType === expenseReportDocumentType;
}

/** Hook to get a ExpenseReport document by its id */
export function useExpenseReportDocumentById(
  documentId: string | null | undefined,
):
  | [ExpenseReportDocument, DocumentDispatch<ExpenseReportAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  // Use lenient check for backwards compatibility with schema changes
  if (!isExpenseReportDocumentLoose(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected ExpenseReport document */
export function useSelectedExpenseReportDocument():
  | [ExpenseReportDocument, DocumentDispatch<ExpenseReportAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  // Use lenient check for backwards compatibility with schema changes
  if (!isExpenseReportDocumentLoose(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all ExpenseReport documents in the selected drive */
export function useExpenseReportDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  // Use lenient check for backwards compatibility with schema changes
  return documentsInSelectedDrive?.filter(isExpenseReportDocumentLoose);
}

/** Hook to get all ExpenseReport documents in the selected folder */
export function useExpenseReportDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  // Use lenient check for backwards compatibility with schema changes
  return documentsInSelectedFolder?.filter(isExpenseReportDocumentLoose);
}
