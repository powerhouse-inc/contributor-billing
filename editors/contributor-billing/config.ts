import type { PHDriveEditorConfig } from "@powerhousedao/reactor-browser";

export const editorConfig: PHDriveEditorConfig = {
  allowedDocumentTypes: [
    "powerhouse/invoice",
    "powerhouse/billing-statement",
  ],
  isDragAndDropEnabled: true,
};
