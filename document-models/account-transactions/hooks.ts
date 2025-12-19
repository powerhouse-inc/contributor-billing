import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  AccountTransactionsDocument,
  AccountTransactionsAction,
} from "@powerhousedao/contributor-billing/document-models/account-transactions";
import { isAccountTransactionsDocument } from "./gen/document-schema.js";

/** Hook to get a AccountTransactions document by its id */
export function useAccountTransactionsDocumentById(
  documentId: string | null | undefined,
):
  | [AccountTransactionsDocument, DocumentDispatch<AccountTransactionsAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isAccountTransactionsDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected AccountTransactions document */
export function useSelectedAccountTransactionsDocument():
  | [AccountTransactionsDocument, DocumentDispatch<AccountTransactionsAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isAccountTransactionsDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all AccountTransactions documents in the selected drive */
export function useAccountTransactionsDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isAccountTransactionsDocument);
}

/** Hook to get all AccountTransactions documents in the selected folder */
export function useAccountTransactionsDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isAccountTransactionsDocument);
}
