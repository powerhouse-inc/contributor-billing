import type { EditorModule } from "document-model";
import Editor from "./editor.js";
import type { IntegrationsDocument } from "../../document-models/integrations/index.js";

export const module: EditorModule<IntegrationsDocument> = {
  Component: Editor,
  documentTypes: ["powerhouse/integrations"],
  config: {
    id: "editor-id",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
  },
};

export default module;
