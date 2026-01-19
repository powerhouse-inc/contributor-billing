import { useEffect, useMemo, useRef, useCallback } from "react";
import {
  isFolderNodeKind,
  addFolder,
  useSelectedDrive,
} from "@powerhousedao/reactor-browser";
import type { FolderNode, Node } from "document-drive";

const BILLING_FOLDER_NAME = "Billing";
const PAYMENTS_FOLDER_NAME = "Payments";
const REPORTING_FOLDER_NAME = "Reporting";

export interface MonthFolderInfo {
  folder: FolderNode;
  paymentsFolder: FolderNode | null;
  reportingFolder: FolderNode | null;
}

export interface UseBillingFolderStructureResult {
  /** The Billing root folder node, or null if it doesn't exist yet */
  billingFolder: FolderNode | null;
  /** Map of month name to folder info (e.g., "January 2025" -> folder info) */
  monthFolders: Map<string, MonthFolderInfo>;
  /** The current month's folder info, or null if not created yet */
  currentMonthFolder: MonthFolderInfo | null;
  /** Create a new month folder with Payments and Reporting subfolders */
  createMonthFolder: (monthName: string) => Promise<void>;
  /** Check if a folder is a Payments folder */
  isPaymentsFolder: (folderId: string) => boolean;
  /** Check if a folder is a Reporting folder */
  isReportingFolder: (folderId: string) => boolean;
  /** Get all Payments folder IDs */
  paymentsFolderIds: Set<string>;
  /** Get all Reporting folder IDs */
  reportingFolderIds: Set<string>;
}

/**
 * Format a date as "January 2025"
 */
export function formatMonthName(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Get the current month name (e.g., "January 2025")
 */
export function getCurrentMonthName(): string {
  return formatMonthName(new Date());
}

/**
 * Hook that manages the Billing folder structure in the Contributor Billing drive.
 *
 * Structure:
 * Billing/
 * ├── January 2025/
 * │   ├── Payments/
 * │   └── Reporting/
 * ├── February 2025/
 * │   ├── Payments/
 * │   └── Reporting/
 * └── ...
 *
 * This hook:
 * 1. Creates the "Billing" folder if it doesn't exist
 * 2. Auto-creates the current month folder with Payments/Reporting subfolders
 * 3. Provides a function to manually create additional month folders
 */
export function useBillingFolderStructure(): UseBillingFolderStructureResult {
  const [driveDocument] = useSelectedDrive();

  // Track folder creation state to prevent duplicate creation
  const creationStateRef = useRef({
    hasCreatedBillingFolder: false,
    hasCreatedCurrentMonth: false,
    creatingMonths: new Set<string>(),
  });

  // Find the "Billing" root folder
  const billingFolder = useMemo(() => {
    if (!driveDocument) return null;
    const nodes = driveDocument.state.global.nodes;
    return (
      nodes.find(
        (node: Node): node is FolderNode =>
          isFolderNodeKind(node) && node.name === BILLING_FOLDER_NAME,
      ) ?? null
    );
  }, [driveDocument]);

  // Find all month folders under Billing and their subfolders
  const monthFolders = useMemo(() => {
    const folders = new Map<string, MonthFolderInfo>();
    if (!driveDocument || !billingFolder) return folders;

    const allNodes = driveDocument.state.global.nodes;

    // Find all folders directly under Billing (these are month folders)
    const monthFolderNodes = allNodes.filter(
      (node: Node): node is FolderNode =>
        isFolderNodeKind(node) && node.parentFolder === billingFolder.id,
    );

    for (const monthFolder of monthFolderNodes) {
      // Find Payments and Reporting subfolders
      const paymentsFolder =
        allNodes.find(
          (node: Node): node is FolderNode =>
            isFolderNodeKind(node) &&
            node.parentFolder === monthFolder.id &&
            node.name === PAYMENTS_FOLDER_NAME,
        ) ?? null;

      const reportingFolder =
        allNodes.find(
          (node: Node): node is FolderNode =>
            isFolderNodeKind(node) &&
            node.parentFolder === monthFolder.id &&
            node.name === REPORTING_FOLDER_NAME,
        ) ?? null;

      folders.set(monthFolder.name, {
        folder: monthFolder,
        paymentsFolder,
        reportingFolder,
      });
    }

    return folders;
  }, [driveDocument, billingFolder]);

  // Get current month folder info
  const currentMonthFolder = useMemo(() => {
    const currentMonth = getCurrentMonthName();
    return monthFolders.get(currentMonth) ?? null;
  }, [monthFolders]);

  // Build sets of Payments and Reporting folder IDs for quick lookup
  const { paymentsFolderIds, reportingFolderIds } = useMemo(() => {
    const paymentsIds = new Set<string>();
    const reportingIds = new Set<string>();

    for (const info of monthFolders.values()) {
      if (info.paymentsFolder) {
        paymentsIds.add(info.paymentsFolder.id);
      }
      if (info.reportingFolder) {
        reportingIds.add(info.reportingFolder.id);
      }
    }

    return { paymentsFolderIds: paymentsIds, reportingFolderIds: reportingIds };
  }, [monthFolders]);

  const isPaymentsFolder = useCallback(
    (folderId: string) => paymentsFolderIds.has(folderId),
    [paymentsFolderIds],
  );

  const isReportingFolder = useCallback(
    (folderId: string) => reportingFolderIds.has(folderId),
    [reportingFolderIds],
  );

  // Create a new month folder with Payments and Reporting subfolders
  const createMonthFolder = useCallback(
    async (monthName: string) => {
      if (!driveDocument || !billingFolder) return;
      if (monthFolders.has(monthName)) return; // Already exists
      if (creationStateRef.current.creatingMonths.has(monthName)) return; // Already creating

      creationStateRef.current.creatingMonths.add(monthName);
      const driveId = driveDocument.header.id;

      try {
        // Create month folder
        const monthFolder = await addFolder(
          driveId,
          monthName,
          billingFolder.id,
        );
        if (!monthFolder) {
          console.error(`Failed to create month folder: ${monthName}`);
          return;
        }

        // Create Payments subfolder
        await addFolder(driveId, PAYMENTS_FOLDER_NAME, monthFolder.id);

        // Create Reporting subfolder
        await addFolder(driveId, REPORTING_FOLDER_NAME, monthFolder.id);
      } catch (error) {
        console.error(
          `Error creating month folder structure: ${monthName}`,
          error,
        );
      } finally {
        creationStateRef.current.creatingMonths.delete(monthName);
      }
    },
    [driveDocument, billingFolder, monthFolders],
  );

  // Auto-create Billing folder if it doesn't exist
  useEffect(() => {
    if (
      !driveDocument ||
      billingFolder ||
      creationStateRef.current.hasCreatedBillingFolder
    )
      return;

    creationStateRef.current.hasCreatedBillingFolder = true;
    const driveId = driveDocument.header.id;
    void addFolder(driveId, BILLING_FOLDER_NAME);
  }, [driveDocument, billingFolder]);

  // Auto-create current month folder if it doesn't exist
  useEffect(() => {
    if (
      !driveDocument ||
      !billingFolder ||
      currentMonthFolder ||
      creationStateRef.current.hasCreatedCurrentMonth
    )
      return;

    creationStateRef.current.hasCreatedCurrentMonth = true;
    const currentMonth = getCurrentMonthName();
    void createMonthFolder(currentMonth);
  }, [driveDocument, billingFolder, currentMonthFolder, createMonthFolder]);

  return {
    billingFolder,
    monthFolders,
    currentMonthFolder,
    createMonthFolder,
    isPaymentsFolder,
    isReportingFolder,
    paymentsFolderIds,
    reportingFolderIds,
  };
}
