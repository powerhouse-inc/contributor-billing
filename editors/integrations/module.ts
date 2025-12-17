import type { EditorModule } from "document-model";
import { lazy } from "react";

/** Document editor module for the Todo List document type */
export const Integrations: EditorModule = {
  Component: lazy(() => import("./editor.js")),
  documentTypes: ["powerhouse/integrations"],
  config: {
    id: "integrations",
    name: "integrations",
  },
};
