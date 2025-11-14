import type { EditorModule } from "document-model";
import { lazy } from "react";

export const BillingStatement: EditorModule = {
  Component: lazy(() => import("./editor.js")),
  documentTypes: ["powerhouse/billing-statement"],
  config: {
    id: "powerhouse-billing-statement-editor",
    name: "Billing Statement",
  },
};
