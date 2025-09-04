import {
  Breadcrumbs,
  CreateDocumentModal,
  FileItem,
  FolderItem,
  useBreadcrumbs,
  useDrop,
} from "@powerhousedao/design-system";
import {
  addDocument,
  addFile,
  copyNode,
  type DriveEditorProps,
  getSyncStatusSync,
  moveNode,
  setSelectedNode,
  useAllDocuments,
  useAllFolderNodes,
  useDocumentById,
  useDocumentModelModules,
  useDriveContext,
  useDriveSharingType,
  useEditorModules,
  useFileChildNodes,
  useFolderChildNodes,
  useSelectedDrive,
  useSelectedDriveDocuments,
  useSelectedFolder,
  useSelectedNodePath,
  useUserPermissions,
} from "@powerhousedao/reactor-browser";
import { type Node } from "document-drive";
import type { DocumentModelModule } from "document-model";
import { useCallback, useRef, useState } from "react";
import { CreateDocument } from "./CreateDocument.jsx";
import { EditorContainer } from "./EditorContainer.jsx";
import { FolderTree } from "./FolderTree.jsx";
import { InvoiceTable } from "./InvoiceTable/InvoiceTable.jsx";
import { twMerge } from "tailwind-merge";

/**
 * Main drive explorer component with sidebar navigation and content area.
 * Layout: Left sidebar (folder tree) + Right content area (files/folders + document editor)
 */
export function DriveExplorer(props: DriveEditorProps) {
  const [selected, setSelected] = useState<{ [id: string]: boolean }>({});

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
  const {
    onAddFile,
    onAddFolder,
    onCopyNode,
    onDuplicateNode,
    onMoveNode,
    onRenameNode,
    showDeleteNodeModal,
  } = useDriveContext();

  const { isAllowedToCreateDocuments } = useUserPermissions();
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

  // === NAVIGATION SETUP ===
  // Breadcrumbs for folder navigation
  const { breadcrumbs, onBreadcrumbSelected } = useBreadcrumbs({
    selectedNodePath,
    setSelectedNode,
  });

  const folderChildren = useFolderChildNodes();
  const fileChildren = useFileChildNodes();

  // All folders for the sidebar tree view
  const allFolders = useAllFolderNodes();

  // All document states
  const allDocuments = useSelectedDriveDocuments();
  const state = allDocuments;
  const docDispatchers = state?.map((dco) => {
    return useDocumentById(dco.header.id);
  });

  const getDocDispatcher = (id: string) => {
    return docDispatchers?.find((dco) => dco[0]?.header.id === id);
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
          "editor-container rounded-md border-2 border-transparent ",
          isDropTarget && "border-dashed border-blue-100"
        )}
      >
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
