import type { PHDriveEditorConfig } from "@powerhousedao/reactor-browser";

/** Editor config for the <%= pascalCaseDriveEditorName %> */
export const editorConfig: PHDriveEditorConfig = {
  isDragAndDropEnabled: true,
  allowedDocumentTypes: [
    "powerhouse/invoice",
    "powerhouse/billing-statement",
    "powerhouse/expense-report",
  ],
};
