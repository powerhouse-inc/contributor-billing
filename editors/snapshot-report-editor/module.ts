import type { EditorModule } from "document-model";
import { lazy } from "react";

export const SnapshotReportEditor: EditorModule = {
  Component: lazy(() => import("./editor.js")),
  documentTypes: ["powerhouse/snapshot-report"],
  config: {
    id: "powerhouse-snapshot-report-editor",
    name: "Snapshot Report",
  },
};
