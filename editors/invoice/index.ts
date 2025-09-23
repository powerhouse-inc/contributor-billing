import type { EditorModule } from "document-model";
import Editor from "./editor.js";

export const module: EditorModule = {
  Component: Editor,
  documentTypes: ["powerhouse/invoice"],
  config: {
    id: "powerhouse-invoice-editor",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
  },
};

export default module;
