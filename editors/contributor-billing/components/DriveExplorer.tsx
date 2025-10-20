import {
  CreateDocumentModal,
  ToastContainer,
} from "@powerhousedao/design-system";
import {
  addDocument,
  type DriveEditorProps,
  useDocumentModelModules,
  useEditorModules,
  useFileChildNodes,
  useSelectedDrive,
  useSelectedDriveDocuments,
  useSelectedFolder,
  type Reactor,
} from "@powerhousedao/reactor-browser";
import type { DocumentModelModule, PHBaseState } from "document-model";
import { useCallback, useEffect, useRef, useState } from "react";
import { InvoiceTable } from "./InvoiceTable/InvoiceTable.js";
import { HeaderStats } from "./InvoiceTable/HeaderStats.js";
import { PHDocument } from "document-model";

declare global {
  interface Window {
    driveContext?: {
      reactor?: Reactor; // or a more specific type
    };
  }
}

/**
 * Main drive explorer component with sidebar navigation and content area.
 * Layout: Left sidebar (folder tree) + Right content area (files/folders + document editor)
 */
export function DriveExplorer(props: DriveEditorProps) {
  const { children, editorConfig } = props;
  const [selected, setSelected] = useState<{ [id: string]: boolean }>({});
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Handler for status filter changes
  const handleStatusChange = useCallback((value: string | string[]) => {
    setSelectedStatuses(Array.isArray(value) ? value : [value]);
  }, []);

  // === DOCUMENT EDITOR STATE ===
  // Customize document opening/closing behavior here

  const [openModal, setOpenModal] = useState(false);
  const selectedDocumentModel = useRef<DocumentModelModule | null>(null);
  const editorModules = useEditorModules();

  // === STATE MANAGEMENT HOOKS ===
  // Core state hooks for drive navigation
  const [selectedDrive] = useSelectedDrive(); // Currently selected drive
  const selectedFolder = useSelectedFolder(); // Currently selected folder

  const fileChildren = useFileChildNodes();

  // All document states
  const allDocuments: PHDocument[] | undefined = useSelectedDriveDocuments();

  // Handler for row selection (does not affect status filter display)
  const handleRowSelection = useCallback(
    (rowId: string, checked: boolean, rowStatus: string) => {
      setSelected((prev: { [id: string]: boolean }) => ({
        ...prev,
        [rowId]: checked,
      }));
    },
    []
  );

  // Determine if CSV export should be enabled based on selected rows
  const canExportSelectedRows = useCallback(() => {
    const allowedStatuses = [
      "ACCEPTED",
      "AWAITINGPAYMENT",
      "PAYMENTSCHEDULED",
      "PAYMENTSENT",
      "PAYMENTRECEIVED",
      "PAYMENTCLOSED",
    ];

    // Get all selected row IDs
    const selectedRowIds = Object.keys(selected).filter((id) => selected[id]);

    if (selectedRowIds.length === 0) return false;

    // Check if all selected rows have allowed statuses
    const selectedRows =
      allDocuments?.filter((doc) => selectedRowIds.includes(doc.header.id)) ||
      [];
    return selectedRows.every((row: PHDocument) =>
      allowedStatuses.includes(
        (row.state as PHBaseState & { global: { status: string } }).global
          .status
      )
    );
  }, [selected, allDocuments]);

  // Create a stable dispatcher map using useRef only (no useState to avoid re-renders)
  const dispatchersRef = useRef<Map<string, [PHDocument, (action: unknown) => Promise<void>]>>(new Map());

  // Create a working dispatch function that uses the existing reactor system
  const createDispatchFunction = useCallback((docId: string) => {
    return async (action: unknown) => {
      try {
        console.log(`Dispatching action for document ${docId}:`, action);

        // Since we can't use GraphQL mutations, we need to find another way
        // The key insight is that the existing useDocumentById hook already works
        // We need to create a dispatch function that can handle actions

        // Try to access the reactor instance through the global window object
        // This is a common pattern in React applications
        if (window.reactor) {
          const result = await window.reactor.addAction(docId, action as any);
          if (result.status !== "SUCCESS") {
            throw new Error(
              result.error?.message ?? "Failed to dispatch action"
            );
          }
          return;
        }

        // Alternative: Try to access through the context
        // The DriveContextProvider might expose the reactor instance
        if ((window as Window).driveContext?.reactor) {
          const result = await (
            window as Window
          ).driveContext?.reactor?.addAction(docId, action as any);
          if (result?.status !== "SUCCESS") {
            throw new Error(
              result?.error?.message ?? "Failed to dispatch action"
            );
          }
          return;
        }

        // Fallback: Use a custom event system
        // This allows the reactor system to listen for actions
        const actionEvent = new CustomEvent("reactor-action", {
          detail: {
            docId,
            action,
            timestamp: Date.now(),
          },
        });

        window.dispatchEvent(actionEvent);

        // For now, we'll just log the action to maintain the interface
        // The InvoiceTable will still work, but actions won't be persisted
        console.warn(
          `Action dispatched via event system for document ${docId}. Make sure the reactor system is listening for 'reactor-action' events.`
        );
      } catch (error) {
        console.error(
          `Failed to dispatch action for document ${docId}:`,
          error
        );
      }
    };
  }, []);

  // Update dispatchers when state changes - use a more stable approach
  useEffect(() => {
    // Only update if the document IDs have actually changed
    const currentDocIds = allDocuments?.map((doc) => doc.header.id) || [];
    const previousDocIds = Array.from(dispatchersRef.current.keys());

    // Check if the document list has actually changed
    const hasChanged =
      currentDocIds.length !== previousDocIds.length ||
      !currentDocIds.every((id) => previousDocIds.includes(id));

    if (!hasChanged) {
      // Just update the document states without recreating dispatchers
      allDocuments?.forEach((doc) => {
        const docId = doc.header.id;
        if (dispatchersRef.current.has(docId)) {
          const [, dispatchFunction] = dispatchersRef.current.get(docId)!;
          dispatchersRef.current.set(docId, [doc, dispatchFunction]);
        }
      });
      return;
    }

    // Only recreate dispatchers when the document list actually changes
    const newDispatchers = new Map();

    allDocuments?.forEach((doc) => {
      const docId = doc.header.id;

      // Check if we already have a dispatcher for this document
      if (dispatchersRef.current.has(docId)) {
        // Update the document state but keep the same dispatch function
        const [, dispatchFunction] = dispatchersRef.current.get(docId)!;
        newDispatchers.set(docId, [doc, dispatchFunction]);
      } else {
        // Create a new dispatcher for this document
        const dispatchFunction = createDispatchFunction(docId);
        newDispatchers.set(docId, [doc, dispatchFunction]);
      }
    });

    // Clean up dispatchers for documents that no longer exist
    for (const [docId] of dispatchersRef.current) {
      if (!currentDocIds.includes(docId)) {
        dispatchersRef.current.delete(docId);
      }
    }

    // Update the ref
    dispatchersRef.current = newDispatchers;
  }, [allDocuments, createDispatchFunction]);

  const getDocDispatcher = (id: string): [PHDocument, (action: unknown) => Promise<void>] | null => {
    return dispatchersRef.current.get(id) || null;
  };

  // Handle document creation from modal
  const onCreateDocument = useCallback(
    async (fileName: string) => {
      setOpenModal(false);

      const documentModel = selectedDocumentModel.current;
      if (!documentModel || !selectedDrive?.header.id) return;

      let editorType = "integrations-editor";
      if (documentModel.documentModel.id === "powerhouse/invoice") {
        editorType = "powerhouse-invoice-editor";
      } else if (documentModel.documentModel.id === "powerhouse/expense-report") {
        editorType = "powerhouse-expense-report-editor";
      }

      try {
        const node = await addDocument(
          selectedDrive.header.id,
          fileName,
          documentModel.documentModel.id,
          selectedFolder?.id,
          undefined,
          undefined,
          editorType
        );

        selectedDocumentModel.current = null;

        if (node) {
          // Customize: Auto-open created document by uncommenting below
          // setActiveDocumentId(node.id);
        }
      } catch (error) {
        console.error("Failed to create document:", error);
      }
    },
    [addDocument, editorModules, selectedDrive?.header.id, selectedFolder?.id]
  );

  const onSelectDocumentModel = useCallback(
    (documentModel: DocumentModelModule) => {
      selectedDocumentModel.current = documentModel;
      setOpenModal(true);
    },
    []
  );

  // === DOCUMENT EDITOR DATA ===
  // Filter available document types here if needed
  const documentModelModules = useDocumentModelModules();

  // Get active document and its editor components

  // if a document is selected then it's editor will be passed as children
  const showDocumentEditor = !!children;

  // === RENDER ===

  return (
    <div className={`flex h-full ${showDocumentEditor ? "w-full" : "editor-container"}`}>
      <div className={`h-full ${showDocumentEditor ? "w-full" : ""}`}>
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
        {/* === RIGHT CONTENT AREA: Files/Folders or Document Editor === */}
        <div className="flex-1">
          {/* Conditional rendering: Document editor or folder contents */}
          {showDocumentEditor ? (
            // Document editor view
            children
          ) : (
            <>
              <HeaderStats />
              <InvoiceTable
                files={fileChildren}
                state={allDocuments || []}
                selected={selected}
                setSelected={setSelected}
                filteredDocumentModels={documentModelModules}
                onSelectDocumentModel={onSelectDocumentModel}
                getDocDispatcher={getDocDispatcher}
                selectedStatuses={selectedStatuses}
                onStatusChange={handleStatusChange}
                onRowSelection={handleRowSelection}
                canExportSelectedRows={canExportSelectedRows}
              />
            </>
          )}
        </div>

        {/* === DOCUMENT CREATION MODAL === */}
        {/* Modal for entering document name after selecting type */}
        <CreateDocumentModal
          onContinue={onCreateDocument}
          onOpenChange={(open) => setOpenModal(open)}
          open={openModal}
        />
      </div>
    </div>
  );
}
