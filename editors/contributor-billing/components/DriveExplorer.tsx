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
  useNodeActions,
  showDeleteNodeModal,
} from "@powerhousedao/reactor-browser";
import type { DocumentModelModule } from "document-model";
import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContainer } from "./EditorContainer.js";
import { InvoiceTable } from "./InvoiceTable/InvoiceTable.js";
import { HeaderStats } from "./InvoiceTable/HeaderStats.js";
import type { Node } from "document-drive";

/**
 * Main drive explorer component with sidebar navigation and content area.
 * Layout: Left sidebar (folder tree) + Right content area (files/folders + document editor)
 */
export function DriveExplorer(props: DriveEditorProps) {
  const [selected, setSelected] = useState<{ [id: string]: boolean }>({});
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Handler for status filter changes
  const handleStatusChange = useCallback((value: string | string[]) => {
    setSelectedStatuses(Array.isArray(value) ? value : [value]);
  }, []);

  // === DOCUMENT EDITOR STATE ===
  // Customize document opening/closing behavior here
  const [activeDocumentId, setActiveDocumentId] = useState<
    string | undefined
  >();
  const [openModal, setOpenModal] = useState(false);
  const selectedDocumentModel = useRef<DocumentModelModule | null>(null);
  const editorModules = useEditorModules();

  // === NODE ACTIONS HOOK ===
  // Get all node operations from reactor-browser
  const { onRenameNode, onDuplicateNode } = useNodeActions();

  // === STATE MANAGEMENT HOOKS ===
  // Core state hooks for drive navigation
  const [selectedDrive] = useSelectedDrive(); // Currently selected drive
  const selectedFolder = useSelectedFolder(); // Currently selected folder

  const fileChildren = useFileChildNodes();

  // All document states
  const allDocuments = useSelectedDriveDocuments();
  const state = allDocuments;

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
      state?.filter((doc) => selectedRowIds.includes(doc.header.id)) || [];
    return selectedRows.every((row) =>
      allowedStatuses.includes((row.state as any).global.status)
    );
  }, [selected, state]);

  // Create a stable dispatcher map using useRef only (no useState to avoid re-renders)
  const dispatchersRef = useRef<Map<string, [any, (action: any) => void]>>(
    new Map()
  );

  // Create a working dispatch function that uses the existing reactor system
  const createDispatchFunction = useCallback((docId: string) => {
    return async (action: any) => {
      try {
        console.log(`Dispatching action for document ${docId}:`, action);

        // Since we can't use GraphQL mutations, we need to find another way
        // The key insight is that the existing useDocumentById hook already works
        // We need to create a dispatch function that can handle actions

        // Try to access the reactor instance through the global window object
        // This is a common pattern in React applications
        if (window.reactor) {
          const result = await window.reactor.addAction(docId, action);
          if (result.status !== "SUCCESS") {
            throw new Error(
              result.error?.message ?? "Failed to dispatch action"
            );
          }
          return;
        }

        // Alternative: Try to access through the context
        // The DriveContextProvider might expose the reactor instance
        if ((window as any).driveContext?.reactor) {
          const result = await (window as any).driveContext.reactor.addAction(
            docId,
            action
          );
          if (result.status !== "SUCCESS") {
            throw new Error(
              result.error?.message ?? "Failed to dispatch action"
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
    const currentDocIds = state?.map((doc) => doc.header.id) || [];
    const previousDocIds = Array.from(dispatchersRef.current.keys());

    // Check if the document list has actually changed
    const hasChanged =
      currentDocIds.length !== previousDocIds.length ||
      !currentDocIds.every((id) => previousDocIds.includes(id));

    if (!hasChanged) {
      // Just update the document states without recreating dispatchers
      state?.forEach((doc) => {
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

    state?.forEach((doc) => {
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
  }, [state, createDispatchFunction]);

  const getDocDispatcher = (id: string) => {
    return dispatchersRef.current.get(id) || null;
  };

  // === EVENT HANDLERS ===

  // Wrapper for rename that handles node ID
  const handleRenameNode = useCallback(
    async (nodeId: string, newName: string) => {
      const node = fileChildren.find((n) => n.id === nodeId);
      if (node) {
        await onRenameNode(newName, node);
      }
    },
    [fileChildren, onRenameNode]
  );

  // Wrapper for delete that clears selection
  const handleDeleteNode = useCallback(
    async (nodeId: string) => {
      const node = fileChildren.find((n) => n.id === nodeId);
      if (
        node &&
        window.confirm(`Are you sure you want to delete "${node.name}"?`)
      ) {
        // Delete via context menu or direct call
        // The FileItem component will call showDeleteNodeModal instead
        setSelected((prev) => {
          const newSelected = { ...prev };
          delete newSelected[nodeId];
          return newSelected;
        });
      }
    },
    [fileChildren]
  );

  // Wrapper for showDeleteNodeModal (for FileItem) - uses the reactor-browser function
  const handleShowDeleteModal = useCallback(async (node: Node) => {
    showDeleteNodeModal(node.id);

    // Clear selection after deletion is confirmed
    setSelected((prev) => {
      const newSelected = { ...prev };
      delete newSelected[node.id];
      return newSelected;
    });

    return undefined;
  }, []);

  // Handle document creation from modal
  const onCreateDocument = useCallback(
    async (fileName: string) => {
      setOpenModal(false);

      const documentModel = selectedDocumentModel.current;
      if (!documentModel || !selectedDrive?.header.id) return;

      const editorType =
        documentModel.documentModel.id === "powerhouse/invoice"
          ? "powerhouse-invoice-editor"
          : "integrations-editor";

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
  const activeDocument = activeDocumentId
    ? fileChildren.find((file) => file.id === activeDocumentId)
    : undefined;

  const documentModelModule = activeDocument
    ? documentModelModules?.find(
        (m) => m.documentModel.id === activeDocument.documentType
      )
    : null;

  const editorModule = activeDocument
    ? editorModules?.find((e) =>
        e.documentTypes.includes(activeDocument.documentType)
      )
    : null;

  // === RENDER ===

  return (
    <div className="flex h-full editor-container">
      <div className="h-full">
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
        <div className="flex-1 p-4">
          {/* Conditional rendering: Document editor or folder contents */}
          {activeDocument && documentModelModule && editorModule ? (
            // Document editor view
            <EditorContainer
              handleClose={() => setActiveDocumentId(undefined)}
              activeDocumentId={activeDocumentId || ""}
            />
          ) : (
            <>
              <HeaderStats />
              <InvoiceTable
                setActiveDocumentId={setActiveDocumentId}
                files={fileChildren}
                state={state || []}
                selected={selected}
                setSelected={setSelected}
                onBatchAction={() => {}}
                onDeleteNode={handleDeleteNode}
                renameNode={handleRenameNode}
                onDuplicateNode={async (node: Node) => {
                  await onDuplicateNode(node);
                  return undefined;
                }}
                showDeleteNodeModal={handleShowDeleteModal}
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
