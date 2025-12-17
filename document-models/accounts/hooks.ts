import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  AccountsDocument,
  AccountsAction,
} from "@powerhousedao/contributor-billing/document-models/accounts";
import { isAccountsDocument } from "./gen/document-schema.js";

/** Hook to get a Accounts document by its id */
export function useAccountsDocumentById(
  documentId: string | null | undefined,
):
  | [AccountsDocument, DocumentDispatch<AccountsAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isAccountsDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected Accounts document */
export function useSelectedAccountsDocument():
  | [AccountsDocument, DocumentDispatch<AccountsAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isAccountsDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all Accounts documents in the selected drive */
export function useAccountsDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isAccountsDocument);
}

/** Hook to get all Accounts documents in the selected folder */
export function useAccountsDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isAccountsDocument);
}
