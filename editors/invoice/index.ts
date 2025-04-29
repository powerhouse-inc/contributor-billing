import type { EditorModule, EditorProps } from "document-model";
import Editor from "./editor.js";
import type { InvoiceDocument } from "../../document-models/invoice/index.js";
import { type FC } from "react";

export const module: EditorModule<InvoiceDocument> = {
  Component: Editor as unknown as FC<
    EditorProps<InvoiceDocument> & Record<string, unknown>
  >,
  documentTypes: ["Invoice"],
  config: {
    id: "invoice-editor",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
    timelineEnabled: false,
  },
};

export default module;
