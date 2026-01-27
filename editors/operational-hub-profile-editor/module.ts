import type { EditorModule } from "document-model";
import { lazy } from "react";

export const OperationalHubProfileEditor: EditorModule = {
  Component: lazy(() => import("./editor.js")),
  documentTypes: ["powerhouse/operational-hub-profile"],
  config: {
    id: "operational-hub-profile-editor",
    name: "Operational Hub Profile Editor",
  },
};
