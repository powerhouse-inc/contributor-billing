import { useState, useCallback, useRef, useMemo } from "react";
import {
  isFileNodeKind,
  useDocumentModelModules,
  type VetraDocumentModelModule,
  showCreateDocumentModal,
  useDocumentsInSelectedDrive,
  useOnDropFile,
  useSelectedDrive,
  dispatchActions,
} from "@powerhousedao/reactor-browser";
import type { PHBaseState, PHDocument } from "document-model";
import type { FileNode } from "document-drive";
import { moveNode } from "document-drive";
import { InvoiceTable } from "./InvoiceTable.js";

interface InvoiceTableContainerProps {
  /** The ID of the payments folder to filter invoices by */
  folderId: string;
  /** The month name (e.g., "January 2026") for checking existing reports */
  monthName?: string;
}

/**
 * Container that renders the InvoiceTable.
 * Uses useNodesInSelectedDriveOrFolder pattern to avoid freeze issues.
 */
export function InvoiceTableContainer({
  folderId,
  monthName,
}: InvoiceTableContainerProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingFilesRef = useRef<Set<File>>(new Set());

  const documentModelModules = useDocumentModelModules();
  const [driveDocument] = useSelectedDrive();
  const allDocuments = useDocumentsInSelectedDrive();

  // Filter file nodes to only those in the specific payments folder
  // Access drive nodes directly (same approach as HeaderStats)
  const fileNodes = useMemo(() => {
    if (!driveDocument) return [];
    const nodes = driveDocument.state.global.nodes;
    return nodes.filter(
      (n) => isFileNodeKind(n) && n.parentFolder === folderId,
    ) as FileNode[];
  }, [driveDocument, folderId]);

  // Get the drop file handler
  const onDropFile = useOnDropFile();

  // Handle file drop
  const driveId = driveDocument?.header.id;

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const files = Array.from(event.dataTransfer.files);
      if (files.length === 0) return;

      if (!onDropFile || !driveId) return;

      // Track all files being processed
      files.forEach((file) => pendingFilesRef.current.add(file));

      // Process all files - React state updates automatically via hooks
      const filePromises = files.map(async (file) => {
        try {
          const fileNode = await onDropFile(file, (progress) => {
            if (progress.stage === "complete" || progress.stage === "failed") {
              pendingFilesRef.current.delete(file);
            }
          });

          // Move the uploaded file to the correct folder
          if (fileNode && folderId) {
            await dispatchActions(
              moveNode({
                srcFolder: fileNode.id,
                targetParentFolder: folderId,
              }),
              driveId,
            );
          }
        } catch (error) {
          console.error("Error dropping file:", error);
          pendingFilesRef.current.delete(file);
        }
      });

      await Promise.allSettled(filePromises);
    },
    [onDropFile, driveId, folderId],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "copy";
    },
    [],
  );

  const handleDragEnter = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    },
    [],
  );

  // Handler for status filter changes
  const handleStatusChange = useCallback((value: string | string[]) => {
    setSelectedStatuses(Array.isArray(value) ? value : [value]);
  }, []);

  // Handler for row selection
  const handleRowSelection = useCallback(
    (rowId: string, checked: boolean, _rowStatus: string) => {
      setSelected((prev) => ({
        ...prev,
        [rowId]: checked,
      }));
    },
    [],
  );

  // Stub for getDocDispatcher - requires documents to work properly
  const getDocDispatcher = useCallback(
    (_id: string): [PHDocument, (action: unknown) => Promise<void>] | null => {
      return null;
    },
    [],
  );

  // Handle document model selection for create modal
  const onSelectDocumentModel = useCallback(
    (documentModel: VetraDocumentModelModule) => {
      showCreateDocumentModal(documentModel.id);
    },
    [],
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
          .status,
      ),
    );
  }, [selected, allDocuments]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
    >
      <InvoiceTable
        files={fileNodes}
        selected={selected}
        setSelected={setSelected}
        filteredDocumentModels={documentModelModules || []}
        onSelectDocumentModel={onSelectDocumentModel}
        getDocDispatcher={getDocDispatcher}
        selectedStatuses={selectedStatuses}
        onStatusChange={handleStatusChange}
        onRowSelection={handleRowSelection}
        canExportSelectedRows={canExportSelectedRows}
        monthName={monthName}
      />
    </div>
  );
}
