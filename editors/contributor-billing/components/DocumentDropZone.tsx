import { useCallback, useRef, useState } from "react";
import {
  useOnDropFile,
  useSelectedDrive,
  useDocumentsInSelectedDrive,
} from "@powerhousedao/reactor-browser";
import { toast } from "@powerhousedao/design-system/connect";
import type { FileUploadProgress } from "@powerhousedao/reactor-browser";
import { useDocumentAutoPlacement } from "../hooks/useDocumentAutoPlacement.js";

interface DocumentDropZoneProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Drop zone component that handles document uploads for the Contributor Billing drive.
 * Supports:
 * - Expense Reports: Auto-placed in Reporting folders based on period
 * - Accounts: Kept at root level
 */
export function DocumentDropZone({
  children,
  className = "",
}: DocumentDropZoneProps) {
  const onDropFile = useOnDropFile();
  const [selectedDrive] = useSelectedDrive();
  const documentsInDrive = useDocumentsInSelectedDrive();
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);

  // Activate auto-placement hook
  useDocumentAutoPlacement();

  const driveId = selectedDrive?.header.id;

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounterRef.current = 0;

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0 || !onDropFile || !driveId) return;

      // Filter to only accept .phd files (Powerhouse document archives)
      const phdFiles = files.filter((file) => file.name.endsWith(".phd"));
      const rejectedFiles = files.filter((file) => !file.name.endsWith(".phd"));

      // Show error for rejected files
      if (rejectedFiles.length > 0) {
        const rejectedNames = rejectedFiles.map((f) => f.name).join(", ");
        toast(
          `Only .phd files (Powerhouse documents) can be dropped here. Rejected: ${rejectedNames}`,
          { type: "error" },
        );
      }

      if (phdFiles.length === 0) return;

      // Process all files
      const filePromises = phdFiles.map(async (file) => {
        try {
          const fileNode = await onDropFile(
            file,
            (progress: FileUploadProgress) => {
              if (progress.stage === "complete") {
                toast(`Successfully uploaded ${file.name}`, {
                  type: "success",
                });
              } else if (progress.stage === "failed") {
                toast(`Failed to upload ${file.name}`, {
                  type: "error",
                });
              }
            },
          );

          if (fileNode) {
            // Auto-placement hook will handle moving the document to the correct location
            // Give it a moment to detect the new document
            setTimeout(() => {
              // Check if document was loaded and what type it is
              const doc = documentsInDrive?.find(
                (d) => d.header.id === fileNode.id,
              );

              if (doc) {
                const docType = doc.header.documentType;
                if (docType === "powerhouse/expense-report") {
                  toast(
                    `Expense report uploaded. It will be placed in the appropriate Reporting folder based on its period.`,
                    { type: "info" },
                  );
                } else if (docType === "powerhouse/accounts") {
                  toast(
                    `Accounts document uploaded. It will remain at the root level.`,
                    { type: "info" },
                  );
                }
              }
            }, 1000);
          }
        } catch (error) {
          console.error("Error dropping file:", error);
          toast(`Error uploading ${file.name}`, { type: "error" });
        }
      });

      await Promise.allSettled(filePromises);
    },
    [onDropFile, driveId, documentsInDrive],
  );

  return (
    <div
      className={`relative ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg pointer-events-none">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-200">
            <div className="text-center">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-lg font-semibold text-gray-900">
                Drop documents here
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Expense Reports and Accounts documents will be automatically
                organized
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
