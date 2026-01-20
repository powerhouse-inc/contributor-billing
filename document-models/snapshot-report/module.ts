import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { SnapshotReportPHState } from "@powerhousedao/contributor-billing/document-models/snapshot-report";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "@powerhousedao/contributor-billing/document-models/snapshot-report";

/** Document model module for the Todo List document type */
export const SnapshotReport: DocumentModelModule<SnapshotReportPHState> = {
  version: 1,
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
