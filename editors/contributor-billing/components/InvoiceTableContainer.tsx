import { useState, useCallback, useRef } from "react";
import {
  useNodesInSelectedDriveOrFolder,
  isFileNodeKind,
  useDocumentModelModules,
  type VetraDocumentModelModule,
  showCreateDocumentModal,
  useDocumentsInSelectedDrive,
  useOnDropFile,
} from "@powerhousedao/reactor-browser";
import type { PHBaseState, PHDocument } from "document-model";
import { InvoiceTable } from "./InvoiceTable.js";

/**
 * Container that renders the InvoiceTable.
 * Uses useNodesInSelectedDriveOrFolder pattern to avoid freeze issues.
 */
export function InvoiceTableContainer() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingFilesRef = useRef<Set<File>>(new Set());

  const documentModelModules = useDocumentModelModules();

  // Use the simple pattern - just nodes, no document fetching
  const nodes = useNodesInSelectedDriveOrFolder();
  const fileNodes = nodes.filter((n) => isFileNodeKind(n));
  const allDocuments = useDocumentsInSelectedDrive();

  // Get the drop file handler
  const onDropFile = useOnDropFile();

  // Handle file drop
  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const files = Array.from(event.dataTransfer.files);
      if (files.length === 0) return;

      if (!onDropFile) return;

      // Track all files being processed
      files.forEach((file) => pendingFilesRef.current.add(file));

      // Process all files
      const filePromises = files.map(async (file) => {
        try {
          await onDropFile(file, (progress) => {
            // Handle progress updates if needed
            if (progress.stage === "complete" || progress.stage === "failed") {
              pendingFilesRef.current.delete(file);
              
              // If all files are done, reload the page
              if (pendingFilesRef.current.size === 0) {
                window.location.reload();
              }
            }
          });
        } catch (error) {
          console.error("Error dropping file:", error);
          pendingFilesRef.current.delete(file);
          
          // If all files are done (including failed ones), reload
          if (pendingFilesRef.current.size === 0) {
            window.location.reload();
          }
        }
      });

      // Wait for all files to complete
      await Promise.allSettled(filePromises);
      
      // Final check - reload if all files are done
      if (pendingFilesRef.current.size === 0) {
        window.location.reload();
      }
    },
    [onDropFile]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

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
            .status
        )
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
      />
    </div>
  );
}
