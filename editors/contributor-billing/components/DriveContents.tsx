import { Suspense } from "react";
import { HeaderStats } from "./InvoiceTable/HeaderStats.js";
import { InvoiceTableContainer } from "./InvoiceTable/InvoiceTableContainer.js";
import { ReportingView } from "./ReportingView.js";
import { BillingOverview } from "./BillingOverview.js";
import { DashboardHome } from "./DashboardHome.js";
import type { SelectedFolderInfo } from "./FolderTree.js";

interface DriveContentsProps {
  selectedFolder: SelectedFolderInfo | null;
  onFolderSelect?: (folderInfo: SelectedFolderInfo | null) => void;
}

/** Shows the content based on the selected folder */
export function DriveContents({
  selectedFolder,
  onFolderSelect,
}: DriveContentsProps) {
  // Default view (no folder selected or root) - show the dashboard home
  if (!selectedFolder) {
    return (
      <div className="container mx-auto flex-1 overflow-y-auto p-4">
        <Suspense>
          <DashboardHome onFolderSelect={onFolderSelect} />
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
          <HeaderStats folderId={selectedFolder.folderId} />
        </Suspense>
        <Suspense>
          <InvoiceTableContainer folderId={selectedFolder.folderId} />
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

  // Billing folder - show all months overview
  if (selectedFolder.folderType === "billing") {
    return (
      <div className="container mx-auto flex-1 overflow-y-auto p-4">
        <Suspense>
          <BillingOverview onFolderSelect={onFolderSelect} />
        </Suspense>
      </div>
    );
  }

  // Fallback - show dashboard home
  return (
    <div className="container mx-auto flex-1 overflow-y-auto p-4">
      <Suspense>
        <DashboardHome onFolderSelect={onFolderSelect} />
      </Suspense>
    </div>
  );
}
