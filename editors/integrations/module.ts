import type { EditorModule } from "document-model";
import { lazy } from "react";

export const Integrations: EditorModule = {
  Component: lazy(() => import("./editor.js")),
  documentTypes: ["powerhouse/integrations"],
  config: {
    id: "integrations-editor",
    name: "Integrations",
  },
};
