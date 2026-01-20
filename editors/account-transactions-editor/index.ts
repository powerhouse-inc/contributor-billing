import type { EditorModule } from "document-model";
import { Editor } from "./editor.js";

export const module: EditorModule = {
  Component: Editor,
  documentTypes: ["powerhouse/account-transactions"],
  config: {
    id: "account-transactions-editor",
    name: "account-transactions-editor",
  },
};
