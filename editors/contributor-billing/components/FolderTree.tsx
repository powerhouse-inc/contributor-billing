import {
  Sidebar,
  SidebarProvider,
  type SidebarNode,
} from "@powerhousedao/document-engineering";
import {
  setSelectedNode,
  showCreateDocumentModal,
  useDocumentsInSelectedDrive,
  useSelectedDrive,
  isFileNodeKind,
} from "@powerhousedao/reactor-browser";
import {
  Wallet,
  FileText,
  Building2,
  Calendar,
  CreditCard,
  BarChart3,
  Camera,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useBillingFolderStructure } from "../hooks/useBillingFolderStructure.js";

const ICON_SIZE = 16;

/** Folder types for content routing */
export type FolderType = "payments" | "reporting" | "month" | "billing" | null;

/** Selected folder info for content routing */
export interface SelectedFolderInfo {
  folderId: string;
  folderType: FolderType;
  monthName?: string;
}

type FolderTreeProps = {
  onFolderSelect?: (folderInfo: SelectedFolderInfo | null) => void;
};

/**
 * Sidebar navigation component with:
 * - Accounts section (with account-transactions children)
 * - Billing folder structure (Month > Payments/Reporting)
 */
export function FolderTree({ onFolderSelect }: FolderTreeProps) {
  const [activeNodeId, setActiveNodeId] = useState<string>("accounts");

  const documentsInDrive = useDocumentsInSelectedDrive();
  const [driveDocument] = useSelectedDrive();
  const { billingFolder, monthFolders, paymentsFolderIds, reportingFolderIds } =
    useBillingFolderStructure();

  // Build a map of document ID to parent folder ID
  const documentParentMap = useMemo(() => {
    const map = new Map<string, string | null>();
    if (!driveDocument) return map;
    const nodes = driveDocument.state.global.nodes;
    for (const node of nodes) {
      if (isFileNodeKind(node)) {
        map.set(node.id, node.parentFolder);
      }
    }
    return map;
  }, [driveDocument]);

  // Find all account-transactions documents in the drive
  const accountTransactionsDocuments = useMemo(() => {
    if (!documentsInDrive) return [];
    return documentsInDrive.filter(
      (doc) => doc.header.documentType === "powerhouse/account-transactions",
    );
  }, [documentsInDrive]);

  // Build a set of account-transactions node IDs for quick lookup
  const accountTransactionsNodeIds = useMemo(() => {
    const nodeIds = new Set<string>();
    for (const doc of accountTransactionsDocuments) {
      nodeIds.add(doc.header.id);
    }
    return nodeIds;
  }, [accountTransactionsDocuments]);

  // Find accounts document
  const accountsDocument = useMemo(() => {
    if (!documentsInDrive) return null;
    return documentsInDrive.find(
      (doc) => doc.header.documentType === "powerhouse/accounts",
    );
  }, [documentsInDrive]);

  // Find report documents (expense + snapshot) and build ID set for lookup
  const { reportDocuments, reportDocumentIds } = useMemo(() => {
    if (!documentsInDrive)
      return { reportDocuments: [], reportDocumentIds: new Set<string>() };
    const docs = documentsInDrive.filter(
      (doc) =>
        doc.header.documentType === "powerhouse/expense-report" ||
        doc.header.documentType === "powerhouse/snapshot-report",
    );
    return {
      reportDocuments: docs,
      reportDocumentIds: new Set(docs.map((d) => d.header.id)),
    };
  }, [documentsInDrive]);

  // Build month folder IDs set for quick lookup
  const monthFolderIds = useMemo(() => {
    const ids = new Set<string>();
    for (const info of monthFolders.values()) {
      ids.add(info.folder.id);
    }
    return ids;
  }, [monthFolders]);

  // Build navigation sections
  const navigationSections = useMemo(() => {
    // Build account-transactions children nodes
    const accountTransactionsChildren: SidebarNode[] =
      accountTransactionsDocuments.map((doc) => ({
        id: doc.header.id,
        title: doc.header.name || "Untitled",
        icon: <FileText size={ICON_SIZE} />,
      }));

    // Build Billing folder children (month folders)
    const billingChildren: SidebarNode[] = [];

    // Sort months by date (most recent first)
    const sortedMonths = Array.from(monthFolders.entries()).sort(
      ([nameA], [nameB]) => {
        // Parse "January 2025" format
        const dateA = new Date(nameA);
        const dateB = new Date(nameB);
        return dateB.getTime() - dateA.getTime(); // Most recent first
      },
    );

    for (const [monthName, info] of sortedMonths) {
      const monthChildren: SidebarNode[] = [];

      if (info.paymentsFolder) {
        monthChildren.push({
          id: info.paymentsFolder.id,
          title: "Payments",
          icon: <CreditCard size={ICON_SIZE} />,
        });
      }

      if (info.reportingFolder) {
        // Filter reports that belong to this specific reporting folder OR match the month
        // Extract just the month part (e.g., "January" from "January 2026")
        const monthPart = monthName.split(" ")[0]?.toLowerCase() || "";
        const yearPart = monthName.split(" ")[1] || "";

        const folderReports = reportDocuments.filter((doc) => {
          const parentId = documentParentMap.get(doc.header.id);
          // Include if stored in this reporting folder
          if (parentId === info.reportingFolder?.id) return true;
          // Include if stored in the month folder directly
          if (parentId === info.folder.id) return true;
          // Include if report name contains the month name (with or without year)
          const docName = doc.header.name?.toLowerCase() || "";
          if (docName.includes(monthName.toLowerCase())) return true;
          // Check if name contains month part and optionally the year
          if (monthPart && docName.includes(monthPart)) {
            // If year is in the name, make sure it matches
            if (yearPart && docName.includes(yearPart)) return true;
            // If no year in name, still include it
            if (!yearPart || !docName.match(/\d{4}/)) return true;
          }
          return false;
        });
        const reportingChildren: SidebarNode[] = folderReports.map((doc) => ({
          id: doc.header.id,
          title: doc.header.name || "Untitled Report",
          icon:
            doc.header.documentType === "powerhouse/snapshot-report" ? (
              <Camera size={ICON_SIZE} />
            ) : (
              <FileText size={ICON_SIZE} />
            ),
        }));

        monthChildren.push({
          id: info.reportingFolder.id,
          title: "Reporting",
          icon: <BarChart3 size={ICON_SIZE} />,
          children:
            reportingChildren.length > 0 ? reportingChildren : undefined,
        });
      }

      billingChildren.push({
        id: info.folder.id,
        title: monthName,
        icon: <Calendar size={ICON_SIZE} />,
        children: monthChildren.length > 0 ? monthChildren : undefined,
      });
    }

    const sections: SidebarNode[] = [
      // Accounts section
      {
        id: "accounts",
        title: "Accounts",
        icon: <Wallet size={ICON_SIZE} />,
        children:
          accountTransactionsChildren.length > 0
            ? accountTransactionsChildren
            : undefined,
      },
      // Billing folder structure
      {
        id: billingFolder?.id || "billing-placeholder",
        title: "Billing",
        icon: <Building2 size={ICON_SIZE} />,
        children: billingChildren.length > 0 ? billingChildren : undefined,
      },
    ];

    return sections;
  }, [
    accountTransactionsDocuments,
    billingFolder,
    monthFolders,
    reportDocuments,
    documentParentMap,
  ]);

  const handleActiveNodeChange = (node: SidebarNode) => {
    setActiveNodeId(node.id);

    // Check if this is an account-transactions child node
    if (accountTransactionsNodeIds.has(node.id)) {
      onFolderSelect?.(null);
      setSelectedNode(node.id);
      return;
    }

    // Check if this is an expense or snapshot report document
    if (reportDocumentIds.has(node.id)) {
      onFolderSelect?.(null);
      setSelectedNode(node.id);
      return;
    }

    // Check if clicking Accounts section
    if (node.id === "accounts") {
      if (accountsDocument) {
        onFolderSelect?.(null);
        setSelectedNode(accountsDocument.header.id);
      } else {
        setSelectedNode("");
        showCreateDocumentModal("powerhouse/accounts");
      }
      return;
    }

    // Check if clicking Billing folder
    if (node.id === billingFolder?.id || node.id === "billing-placeholder") {
      onFolderSelect?.({
        folderId: billingFolder?.id || "",
        folderType: "billing",
      });
      setSelectedNode("");
      return;
    }

    // Check if clicking a month folder
    if (monthFolderIds.has(node.id)) {
      // Find the month name for this folder
      for (const [monthName, info] of monthFolders.entries()) {
        if (info.folder.id === node.id) {
          onFolderSelect?.({
            folderId: node.id,
            folderType: "month",
            monthName,
          });
          setSelectedNode("");
          return;
        }
      }
    }

    // Check if clicking a Payments folder
    if (paymentsFolderIds.has(node.id)) {
      // Find the month name for this payments folder
      for (const [monthName, info] of monthFolders.entries()) {
        if (info.paymentsFolder?.id === node.id) {
          onFolderSelect?.({
            folderId: node.id,
            folderType: "payments",
            monthName,
          });
          setSelectedNode("");
          return;
        }
      }
    }

    // Check if clicking a Reporting folder
    if (reportingFolderIds.has(node.id)) {
      // Find the month name for this reporting folder
      for (const [monthName, info] of monthFolders.entries()) {
        if (info.reportingFolder?.id === node.id) {
          onFolderSelect?.({
            folderId: node.id,
            folderType: "reporting",
            monthName,
          });
          setSelectedNode("");
          return;
        }
      }
    }

    // Default: clear selection
    onFolderSelect?.(null);
    setSelectedNode("");
  };

  return (
    <SidebarProvider nodes={navigationSections}>
      <style>
        {`
          .folder-tree-sidebar .sidebar__item-caret--no-children {
            visibility: hidden;
          }
        `}
      </style>
      <Sidebar
        className="pt-1 folder-tree-sidebar"
        nodes={navigationSections}
        activeNodeId={activeNodeId}
        onActiveNodeChange={handleActiveNodeChange}
        sidebarTitle="Operational Hub Navigation"
        showSearchBar={false}
        resizable={true}
        allowPinning={false}
        showStatusFilter={false}
        initialWidth={256}
        defaultLevel={2}
        handleOnTitleClick={() => {
          onFolderSelect?.(null);
          setSelectedNode("");
        }}
      />
    </SidebarProvider>
  );
}
