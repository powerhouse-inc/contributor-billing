import { CreateDocumentModal, useDrop } from "@powerhousedao/design-system";
import {
  addDocument,
  type DriveEditorProps,
  useDocumentModelModules,
  useDriveContext,
  useDriveSharingType,
  useEditorModules,
  useFileChildNodes,
  useSelectedDrive,
  useSelectedDriveDocuments,
  useSelectedFolder,
  useSelectedNodePath,
} from "@powerhousedao/reactor-browser";
import { type Node } from "document-drive";
import type { DocumentModelModule } from "document-model";
import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContainer } from "./EditorContainer.js";
import { InvoiceTable } from "./InvoiceTable/InvoiceTable.js";
import { twMerge } from "tailwind-merge";
import { ToastContainer } from "@powerhousedao/design-system";

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
  // === DRIVE CONTEXT HOOKS ===
  // Core drive operations and document models
  const { onAddFile, onAddFolder, onCopyNode, onMoveNode } = useDriveContext();

  // === STATE MANAGEMENT HOOKS ===
  // Core state hooks for drive navigation
  const [selectedDrive] = useSelectedDrive(); // Currently selected drive
  const selectedFolder = useSelectedFolder(); // Currently selected folder
  const selectedNodePath = useSelectedNodePath();
  const sharingType = useDriveSharingType(selectedDrive?.header.id);

  // === DROP HOOKS ===
  const { isDropTarget, dropProps } = useDrop({
    node:
      selectedNodePath?.length > 0
        ? (selectedNodePath[selectedNodePath.length - 1] as Node)
        : undefined,
    onAddFile,
    onCopyNode,
    onMoveNode,
  });

  const fileChildren = useFileChildNodes();

  // All document states
  const allDocuments = useSelectedDriveDocuments();
  const state = allDocuments;

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

  // Handle folder creation with optional name parameter
  const handleCreateFolder = useCallback(
    async (folderName?: string) => {
      let name: string | undefined = folderName;

      // If no name provided, prompt for it (for manual folder creation)
      if (!name) {
        const promptResult = prompt("Enter folder name:");
        name = promptResult || undefined;
      }

      if (name?.trim()) {
        try {
          await onAddFolder(name.trim(), selectedFolder);
        } catch (error) {
          console.error("Failed to create folder:", error);
        }
      }
    },
    [onAddFolder, selectedFolder]
  );

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

  // console.log("files", fileChildren);
  // console.log("state", state);
  // console.log("isDropTarget", isDropTarget);
  // console.log("dropProps", dropProps);
  return (
    <div className="flex h-full editor-container">
      <div
        {...dropProps}
        className={twMerge(
          "rounded-md border-2 border-transparent ",
          isDropTarget && "border-dashed border-blue-100"
        )}
      >
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
            <InvoiceTable
              setActiveDocumentId={setActiveDocumentId}
              files={fileChildren}
              state={state || []}
              selected={selected}
              setSelected={setSelected}
              onBatchAction={() => {}}
              onDeleteNode={() => {}}
              renameNode={() => {}}
              filteredDocumentModels={documentModelModules}
              onSelectDocumentModel={onSelectDocumentModel}
              getDocDispatcher={getDocDispatcher}
              selectedStatuses={selectedStatuses}
              onStatusChange={handleStatusChange}
            />
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
