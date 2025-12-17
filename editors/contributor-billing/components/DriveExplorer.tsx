import type { EditorProps } from "document-model";
import { ToastContainer } from "@powerhousedao/design-system/connect";
import { HeaderStats } from "./HeaderStats.js";
import { InvoiceTableContainer } from "./InvoiceTableContainer.js";

/**
 * Main drive explorer component for Contributor Billing.
 * Displays an operational hub with invoice management and billing statement generation.
 */
export function DriveExplorer({ children }: EditorProps) {
  // if a document is selected then its editor will be passed as children
  const showDocumentEditor = !!children;

  return (
    <div className="contributor-billing-explorer h-full overflow-y-auto">
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

      {/* Conditional rendering: Document editor or Operational Hub */}
      {showDocumentEditor ? (
        /* Document editor view */
        children
      ) : (
        /* Operational Hub view */
        <div className="container mx-auto p-4 space-y-4">
          <HeaderStats />
          <InvoiceTableContainer />
        </div>
      )}
    </div>
  );
}
