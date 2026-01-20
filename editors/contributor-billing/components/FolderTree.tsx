import {
  Sidebar,
  SidebarProvider,
  type SidebarNode,
} from "@powerhousedao/document-engineering";
import {
  setSelectedNode,
  showCreateDocumentModal,
  useDocumentsInSelectedDrive,
} from "@powerhousedao/reactor-browser";
import { Wallet, FileText, Camera } from "lucide-react";
import { useMemo, useState } from "react";

const ICON_SIZE = 16;

/** Custom view types that don't correspond to document models */
export type CustomView =
  | "accounts"
  | "expense-report"
  | "snapshot-report"
  | null;

/**
 * Maps navigation section IDs to their corresponding document types.
 * When a section is clicked, the corresponding document type will be created or navigated to.
 */
const SECTION_TO_DOCUMENT_TYPE: Record<string, string | null> = {
  accounts: "powerhouse/accounts",
  "expense-report": "powerhouse/expense-report",
  "snapshot-report": "powerhouse/snapshot-report",
};

/**
 * Maps navigation section IDs to custom view identifiers.
 */
const SECTION_TO_CUSTOM_VIEW: Record<string, CustomView> = {
  accounts: "accounts",
  "expense-report": "expense-report",
  "snapshot-report": "snapshot-report",
};

/**
 * Base navigation sections for the Contributor Billing drive.
 * The accounts section will have dynamic children based on account-transactions documents.
 */
const BASE_NAVIGATION_SECTIONS: SidebarNode[] = [
  {
    id: "accounts",
    title: "Accounts",
    icon: <Wallet size={ICON_SIZE} />,
  },
  {
    id: "expense-report",
    title: "Expense Report",
    icon: <FileText size={ICON_SIZE} />,
  },
  {
    id: "snapshot-report",
    title: "Snapshot Report",
    icon: <Camera size={ICON_SIZE} />,
  },
];

type FolderTreeProps = {
  onCustomViewChange?: (view: CustomView) => void;
};

/**
 * Sidebar navigation component with hardcoded navigation sections.
 * Displays Accounts as the main section.
 * If an accounts document exists, clicking shows its editor.
 * If it doesn't exist, clicking shows the create document modal.
 * Account-transactions documents are shown as children of the Accounts node.
 */
export function FolderTree({ onCustomViewChange }: FolderTreeProps) {
  const [activeNodeId, setActiveNodeId] = useState<string>(
    BASE_NAVIGATION_SECTIONS[0].id,
  );

  const documentsInDrive = useDocumentsInSelectedDrive();

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

  // Build navigation sections with dynamic account-transactions children
  const navigationSections = useMemo(() => {
    // Build account-transactions children nodes
    const accountTransactionsChildren: SidebarNode[] =
      accountTransactionsDocuments.map((doc) => ({
        id: doc.header.id,
        title: doc.header.name || "Untitled",
        icon: <FileText size={ICON_SIZE} />,
      }));

    // Replace the accounts section with one that has children if any exist
    return BASE_NAVIGATION_SECTIONS.map((section) => {
      if (section.id === "accounts" && accountTransactionsChildren.length > 0) {
        return {
          ...section,
          children: accountTransactionsChildren,
        };
      }
      return section;
    });
  }, [accountTransactionsDocuments]);

  // Create a map of document type to existing document (first one found)
  const existingDocumentsByType = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    if (!documentsInDrive) return map;

    for (const doc of documentsInDrive) {
      const docType = doc.header.documentType;
      // Only store the first document of each type (singleton pattern)
      if (!map[docType]) {
        map[docType] = doc.header.id;
      }
    }
    return map;
  }, [documentsInDrive]);

  const handleActiveNodeChange = (node: SidebarNode) => {
    setActiveNodeId(node.id);

    // Check if this is an account-transactions child node
    if (accountTransactionsNodeIds.has(node.id)) {
      // It's an account-transactions document - open the document editor
      onCustomViewChange?.(null);
      setSelectedNode(node.id);
      return;
    }

    // Check if this section has a custom view
    const customView = SECTION_TO_CUSTOM_VIEW[node.id];
    if (customView) {
      // For accounts, check if document exists
      const documentType = SECTION_TO_DOCUMENT_TYPE[node.id];
      if (documentType) {
        const existingDocId = existingDocumentsByType[documentType];
        if (existingDocId) {
          // Navigate to the existing accounts document
          onCustomViewChange?.(null);
          setSelectedNode(existingDocId);
        } else {
          // Clear selected node to create document at drive root, not in current folder
          setSelectedNode("");
          showCreateDocumentModal(documentType);
        }
      }
      return;
    }

    // Clear custom view when navigating to a document
    onCustomViewChange?.(null);

    const documentType = SECTION_TO_DOCUMENT_TYPE[node.id];
    if (!documentType) return;

    const existingDocId = existingDocumentsByType[documentType];
    if (existingDocId) {
      // Navigate to the existing document
      setSelectedNode(existingDocId);
    } else {
      // Clear selected node to create document at drive root, not in current folder
      setSelectedNode("");
      showCreateDocumentModal(documentType);
    }
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
          onCustomViewChange?.(null);
          setSelectedNode("");
        }}
      />
    </SidebarProvider>
  );
}
