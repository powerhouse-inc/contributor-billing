import type { EditorProps } from "document-model";
import { ToastContainer } from "@powerhousedao/design-system/connect";
import { useState } from "react";
import { DriveContents } from "./DriveContents.js";
import { FolderTree, type SelectedFolderInfo } from "./FolderTree.js";
import { FolderTreeErrorBoundary } from "./FolderTreeErrorBoundary.js";

/**
 * Main drive explorer component for Contributor Billing.
 * Displays an operational hub with invoice management and billing statement generation.
 */
export function DriveExplorer({ children }: EditorProps) {
  // if a document is selected then its editor will be passed as children
  const showDocumentEditor = !!children;

  // Track which folder is selected for content routing
  const [selectedFolder, setSelectedFolder] =
    useState<SelectedFolderInfo | null>(null);

  // Track active node in sidebar for visual selection sync
  // Empty string means no selection (home page)
  const [activeNodeId, setActiveNodeId] = useState<string>("");

  const handleFolderSelect = (folderInfo: SelectedFolderInfo | null) => {
    setSelectedFolder(folderInfo);
    // Only update sidebar selection when explicitly selecting a folder with a valid ID
    // When folderInfo is null (opening a document), let the sidebar keep its current selection
    // When folderId is empty (e.g., billing folder doesn't exist yet), don't update sidebar
    if (folderInfo && folderInfo.folderId) {
      setActiveNodeId(folderInfo.folderId);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Sidebar - resizable, managed by Sidebar component */}
      <FolderTreeErrorBoundary>
        <FolderTree
          onFolderSelect={handleFolderSelect}
          activeNodeId={activeNodeId}
          onActiveNodeIdChange={setActiveNodeId}
        />
      </FolderTreeErrorBoundary>

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
        {/* Conditional rendering: Document editor or folder content */}
        {showDocumentEditor ? (
          /* Document editor view */
          <div className="min-h-full">{children}</div>
        ) : (
          /* Folder content view */
          <DriveContents
            selectedFolder={selectedFolder}
            onFolderSelect={handleFolderSelect}
          />
        )}
      </div>
    </div>
  );
}
