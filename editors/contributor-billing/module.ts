import type { EditorModule } from "document-model";
import { lazy } from "react";

export const ContributorBilling: EditorModule = {
  Component: lazy(() => import("./editor.js")),
  documentTypes: ["powerhouse/document-drive"],
  config: {
    id: "contributor-billing",
    name: "Contributor Billing",
  },
};
