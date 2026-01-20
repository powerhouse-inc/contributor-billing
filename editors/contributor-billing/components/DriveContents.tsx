import { CreateDocument } from "./CreateDocument.js";
import { EmptyState } from "./EmptyState.js";
import { Files } from "./Files.js";
import { Folders } from "./Folders.js";
import { NavigationBreadcrumbs } from "./NavigationBreadcrumbs.js";
import { ToastContainer } from "@powerhousedao/design-system/connect";
import { HeaderStats } from "./InvoiceTable/HeaderStats.js";
import { InvoiceTableContainer } from "./InvoiceTable/InvoiceTableContainer.js";
import { Suspense } from "react";

/** Shows the documents and folders in the selected drive */
export function DriveContents() {
  return (
    <div className="container mx-auto flex-1 overflow-y-auto p-4">
      {/* <NavigationBreadcrumbs />
      <Folders />
      <Files />
      <EmptyState />
      <CreateDocument /> */}
      <Suspense>
        <HeaderStats />
      </Suspense>
      <Suspense>
        <InvoiceTableContainer />
      </Suspense>
    </div>
  );
}
