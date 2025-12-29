import type { EditorModule } from "document-model";
import { lazy } from "react";

/** Document editor module for the Todo List document type */
export const Invoice: EditorModule = {
  Component: lazy(() => import("./editor.js")),
  documentTypes: ["powerhouse/invoice"],
  config: {
    id: "powerhouse-invoice-editor",
    name: "invoice",
  },
};
