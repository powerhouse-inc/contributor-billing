import { type DriveEditorModule } from "@powerhousedao/reactor-browser";
import Editor from "./editor.js";

export const module: DriveEditorModule = {
  Component: Editor,
  documentTypes: ["powerhouse/document-drive"],
  config: {
    id: "contributor-billing",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
    documentTypes: [
      "powerhouse/invoice",
      "powerhouse/billing-statement",
    ],
    dragAndDrop: {
      enabled: true,
    },
  },
};

export default module;
