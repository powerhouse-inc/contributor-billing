import type { EditorModule } from "document-model";
import Editor from "./editor.js";
import type { BillingStatementDocument } from "../../document-models/billing-statement/index.js";

export const module: EditorModule<BillingStatementDocument> = {
  Component: Editor,
  documentTypes: ["powerhouse/billing-statement"],
  config: {
    id: "editor-id",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
  },
};

export default module;
