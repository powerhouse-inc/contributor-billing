import { ExtendedEditor, EditorContextProps } from "document-model-libs";
import Editor from "./editor";
import {
  DocumentDriveState,
  DocumentDriveAction,
  DocumentDriveLocalState,
} from "@powerhousedao/common/document-drive";
export const module: ExtendedEditor<
  DocumentDriveState,
  DocumentDriveAction,
  DocumentDriveLocalState
> = {
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
