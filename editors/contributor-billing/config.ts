import type { PHDriveEditorConfig } from "@powerhousedao/reactor-browser";

/** Editor config for the ContributorBilling */
export const editorConfig: PHDriveEditorConfig = {
  isDragAndDropEnabled: false,
  allowedDocumentTypes: [
    "powerhouse/invoice",
    "powerhouse/billing-statement",
    "powerhouse/expense-report",
    "powerhouse/accounts",
  ],
};
