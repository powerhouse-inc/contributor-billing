import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  SnapshotReportDocument,
  SnapshotReportAction,
} from "@powerhousedao/contributor-billing/document-models/snapshot-report";
import { isSnapshotReportDocument } from "./gen/document-schema.js";

/** Hook to get a SnapshotReport document by its id */
export function useSnapshotReportDocumentById(
  documentId: string | null | undefined,
):
  | [SnapshotReportDocument, DocumentDispatch<SnapshotReportAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isSnapshotReportDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected SnapshotReport document */
export function useSelectedSnapshotReportDocument():
  | [SnapshotReportDocument, DocumentDispatch<SnapshotReportAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isSnapshotReportDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all SnapshotReport documents in the selected drive */
export function useSnapshotReportDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isSnapshotReportDocument);
}

/** Hook to get all SnapshotReport documents in the selected folder */
export function useSnapshotReportDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isSnapshotReportDocument);
}
