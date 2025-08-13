import type { EditorModule } from "document-model";
import Editor from "./editor.js";
import type { IntegrationsDocument } from "../../document-models/integrations/index.js";

export const module: EditorModule<IntegrationsDocument> = {
  Component: Editor,
  documentTypes: ["powerhouse/integrations"],
  config: {
    id: "integrations-editor",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
  },
};

export default module;
