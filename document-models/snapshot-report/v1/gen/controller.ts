import { PHDocumentController } from "document-model";
import { SnapshotReport } from "../module.js";
import type { SnapshotReportAction, SnapshotReportPHState } from "./types.js";

export const SnapshotReportController = PHDocumentController.forDocumentModel<
  SnapshotReportPHState,
  SnapshotReportAction
>(SnapshotReport);
