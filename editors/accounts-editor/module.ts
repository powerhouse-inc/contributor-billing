import type { EditorModule } from "document-model";
import { lazy } from "react";

export const AccountsEditor: EditorModule = {
  Component: lazy(() => import("./editor.js")),
  documentTypes: ["powerhouse/accounts"],
  config: {
    id: "powerhouse-accounts-editor",
    name: "Accounts",
  },
};
