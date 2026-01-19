import { Suspense } from "react";
import { HeaderStats } from "./InvoiceTable/HeaderStats.js";
import { InvoiceTableContainer } from "./InvoiceTable/InvoiceTableContainer.js";
import { ReportingView } from "./ReportingView.js";
import { MonthOverview } from "./MonthOverview.js";
import { BillingOverview } from "./BillingOverview.js";
import type { SelectedFolderInfo } from "./FolderTree.js";

interface DriveContentsProps {
  selectedFolder: SelectedFolderInfo | null;
}

/** Shows the content based on the selected folder */
export function DriveContents({ selectedFolder }: DriveContentsProps) {
  // Default view (no folder selected or root) - show the payments/invoice view
  if (!selectedFolder) {
    return (
      <div className="container mx-auto flex-1 overflow-y-auto p-4">
        <Suspense>
          <HeaderStats />
        </Suspense>
        <Suspense>
          <InvoiceTableContainer />
        </Suspense>
      </div>
    );
  }

  // Payments folder - show invoice table
  if (selectedFolder.folderType === "payments") {
    return (
      <div className="container mx-auto flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Payments - {selectedFolder.monthName}
          </h1>
          <p className="text-gray-600">
            Manage invoices and billing statements for{" "}
            {selectedFolder.monthName}
          </p>
        </div>
        <Suspense>
          <HeaderStats />
        </Suspense>
        <Suspense>
          <InvoiceTableContainer />
        </Suspense>
      </div>
    );
  }

  // Reporting folder - show expense and snapshot reports
  if (selectedFolder.folderType === "reporting") {
    return (
      <div className="container mx-auto flex-1 overflow-y-auto p-4">
        <Suspense>
          <ReportingView
            folderId={selectedFolder.folderId}
            monthName={selectedFolder.monthName}
          />
        </Suspense>
      </div>
    );
  }

  // Month folder - show overview of both Payments and Reporting
  if (selectedFolder.folderType === "month") {
    return (
      <div className="container mx-auto flex-1 overflow-y-auto p-4">
        <Suspense>
          <MonthOverview
            folderId={selectedFolder.folderId}
            monthName={selectedFolder.monthName}
          />
        </Suspense>
      </div>
    );
  }

  // Billing folder - show all months overview
  if (selectedFolder.folderType === "billing") {
    return (
      <div className="container mx-auto flex-1 overflow-y-auto p-4">
        <Suspense>
          <BillingOverview />
        </Suspense>
      </div>
    );
  }

  // Fallback - show default view
  return (
    <div className="container mx-auto flex-1 overflow-y-auto p-4">
      <Suspense>
        <HeaderStats />
      </Suspense>
      <Suspense>
        <InvoiceTableContainer />
      </Suspense>
    </div>
  );
}
