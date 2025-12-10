import type { EditorModule } from "document-model";
import { lazy } from "react";

export const AccountTransactionsEditor: EditorModule = {
  Component: lazy(() => import("./editor.js")),
  documentTypes: ["powerhouse/account-transactions"],
  config: {
    id: "powerhouse-account-transactions-editor",
    name: "Account Transactions",
  },
};
