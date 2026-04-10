import type { PHDocumentEditorConfig } from "@powerhousedao/reactor-browser";

/** Editor config for the <%= pascalCaseDriveEditorName %> */
export const editorConfig: PHDocumentEditorConfig = {
  isDragAndDropEnabled: false,
  allowedDocumentTypes: [
    "powerhouse/invoice",
    "powerhouse/billing-statement",
    "powerhouse/expense-report",
    "powerhouse/snapshot-report",
    "powerhouse/accounts",
    "powerhouse/resource-instance",
    "powerhouse/subscription-instance",
  ],
};
