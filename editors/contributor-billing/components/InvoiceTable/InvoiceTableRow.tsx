import { useState, useRef } from "react";
import { RowActionMenu } from "./RowActionMenu.js";
import { FileItem } from "@powerhousedao/design-system";
import { useDriveContext } from "@powerhousedao/reactor-browser";

export const InvoiceTableRow = ({
  files,
  row,
  isSelected,
  onSelect,
  setActiveDocumentId,
  onDeleteNode,
  renameNode,
  onCreateBillingStatement,
  billingDocStates,
}: {
  files?: any[];
  row: any;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  setActiveDocumentId: (id: string) => void;
  onDeleteNode: (nodeId: string) => void;
  renameNode: (nodeId: string, name: string) => void;
  onCreateBillingStatement?: (id: string) => void;
  billingDocStates?: { id: string; contributor: string }[];
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLTableCellElement>(null);

  const billingDoc = billingDocStates?.find(
    (doc) => doc.contributor === row.id
  );
  const billingFile = files?.find((file) => file.id === billingDoc?.id);

  const file = files?.find((file) => file.id === row.id);

  const hasExportedData =
    row.exported != null && Boolean(row.exported.timestamp?.trim());

  const {
    onAddFile,
    onAddFolder,
    onCopyNode,
    onDuplicateNode,
    onMoveNode,
    onRenameNode,
    showDeleteNodeModal,
  } = useDriveContext();

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-2 py-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="size-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
      </td>
      <td className="py-1 w-10">
        {file && (
          <FileItem
            key={row.id}
            fileNode={file as any}
            sharingType="PUBLIC"
            onRenameNode={onRenameNode}
            onDuplicateNode={() => new Promise((resolve) => resolve(undefined))}
            showDeleteNodeModal={showDeleteNodeModal}
            isAllowedToCreateDocuments={true}
            className="h-10"
            onAddFile={() => new Promise((resolve) => resolve(undefined))}
            onAddFolder={() => new Promise((resolve) => resolve(undefined))}
            onCopyNode={() => new Promise((resolve) => resolve(undefined))}
            onMoveNode={() => new Promise((resolve) => resolve(undefined))}
            onAddAndSelectNewFolder={() =>
              new Promise((resolve) => resolve(undefined))
            }
            getSyncStatusSync={() => undefined}
            setSelectedNode={() => setActiveDocumentId(row.id)}
          />
        )}
      </td>
      <td className="px-2 py-2 text-center">{row.invoiceNo}</td>
      <td className="px-2 py-2 text-center">{row.issueDate}</td>
      <td className="px-2 py-2 text-center">{row.dueDate}</td>
      <td className="px-2 py-2 text-center">{row.currency}</td>
      <td className="px-2 py-2 text-center">{row.amount}</td>
      {(row.status === "ISSUED" ||
        row.status === "ACCEPTED" ||
        row.status === "PAYMENTSCHEDULED" ||
        row.status === "PAYMENTRECEIVED" ||
        row.status === "PAYMENTSENT") &&
        !billingFile && (
          <td className="px-2 py-2 text-center">
            <button
              className="bg-white border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100 col-span-1 justify-self-end"
              onClick={() => onCreateBillingStatement?.(row.id)}
            >
              Generate Billing Statement
            </button>
          </td>
        )}
      {billingFile && (
        <td className="px-2 py-2 text-center">
          <FileItem
            key={billingDoc?.id}
            fileNode={billingFile as any}
            sharingType="PUBLIC"
            onRenameNode={onRenameNode}
            onDuplicateNode={() => new Promise((resolve) => resolve(undefined))}
            showDeleteNodeModal={showDeleteNodeModal}
            isAllowedToCreateDocuments={true}
            className="h-10"
            onAddFile={() => new Promise((resolve) => resolve(undefined))}
            onAddFolder={() => new Promise((resolve) => resolve(undefined))}
            onCopyNode={() => new Promise((resolve) => resolve(undefined))}
            onMoveNode={() => new Promise((resolve) => resolve(undefined))}
            onAddAndSelectNewFolder={() =>
              new Promise((resolve) => resolve(undefined))
            }
            getSyncStatusSync={() => undefined}
            setSelectedNode={() =>
              setActiveDocumentId(billingDoc?.id as string)
            }
          />
        </td>
      )}
      <td className="px-2 py-2 text-center">
        {hasExportedData ? (
          <span className="text-green-500">Yes</span>
        ) : (
          <span className="text-red-500">No</span>
        )}
      </td>
      {/* <td className="px-2 py-2 text-right relative" ref={menuRef}>
        <div className="relative inline-block">
          <button
            className="px-2 py-1 hover:bg-gray-200 rounded"
            onClick={() => setMenuOpen(v => !v)}
          >
            &#x2026;
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <RowActionMenu
                options={menuOptions}
                onAction={action => {
                  onMenuAction(action);
                  setMenuOpen(false);
                  setActiveDocumentId(row.id);
                }}
              />
            </>
          )}
        </div>
      </td> */}
    </tr>
  );
};
