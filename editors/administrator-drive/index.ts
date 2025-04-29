import { type DriveEditorModule } from "@powerhousedao/reactor-browser";
import Editor from "./editor.js";
import { type DocumentDriveDocument } from "document-drive";

export const module: DriveEditorModule<DocumentDriveDocument> = {
  Component: Editor,
  documentTypes: ["powerhouse/document-drive"],
  config: {
    id: "AdministratorDrive",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
  },
};

export default module;
