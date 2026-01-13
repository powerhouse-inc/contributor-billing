import type { EditorModule } from "document-model";
import { Editor } from "./editor.js";

export const module: EditorModule = {
  Component: Editor,
  documentTypes: ["powerhouse/accounts"],
  config: {
    id: "accounts-editor",
    name: "accounts-editor",
  },
};
