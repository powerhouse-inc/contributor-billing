import type { EditorProps } from "document-model";
import { ToastContainer } from "@powerhousedao/design-system/connect";
import { DriveContents } from "./DriveContents.js";
import { FolderTree } from "./FolderTree.js";

/**
 * Main drive explorer component for Contributor Billing.
 * Displays an operational hub with invoice management and billing statement generation.
 */
export function DriveExplorer({ children }: EditorProps) {
  // if a document is selected then its editor will be passed as children
  const showDocumentEditor = !!children;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Sidebar - resizable, managed by Sidebar component */}
      <FolderTree />

      {/* Toast notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Main content area - takes remaining space, scrollable */}
      <div className="flex-1 min-w-0 h-full overflow-auto">
        {/* Conditional rendering: Document editor or Operational Hub */}
        {showDocumentEditor ? (
          /* Document editor view */
          <div className="min-h-full">{children}</div>
        ) : (
          /* Operational Hub view */
          <DriveContents />
        )}
      </div>
    </div>
  );
}
