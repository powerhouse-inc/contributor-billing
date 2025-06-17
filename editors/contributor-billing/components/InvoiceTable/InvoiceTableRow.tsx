import { useState, useRef } from "react";
import { RowActionMenu } from "./RowActionMenu.js";
import {
  FileItem,
  type UiFileNode,
  type BaseUiFileNode,
} from "@powerhousedao/design-system";

export const InvoiceTableRow = ({
  file,
  row,
  isSelected,
  onSelect,
  menuOptions,
  onMenuAction,
  setActiveDocumentId,
  onDeleteNode,
  renameNode,
}: {
  file?: UiFileNode;
  row: any;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  menuOptions: { label: string; value: string }[];
  onMenuAction: (action: string) => void;
  setActiveDocumentId: (id: string) => void;
  onDeleteNode: (nodeId: string) => void;
  renameNode: (nodeId: string, name: string) => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLTableCellElement>(null);
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
            uiNode={file as BaseUiFileNode}
            onSelectNode={() => setActiveDocumentId(row.id)}
            onRenameNode={(name) => renameNode(row.id, name)}
            onDuplicateNode={() => {}}
            onDeleteNode={() => onDeleteNode(row.id)}
            isAllowedToCreateDocuments={true}
            className="h-10"
          />
        )}
      </td>
      <td className="px-2 py-2 text-center">{row.invoiceNo}</td>
      <td className="px-2 py-2 text-center">{row.issueDate}</td>
      <td className="px-2 py-2 text-center">{row.dueDate}</td>
      <td className="px-2 py-2 text-center">{row.currency}</td>
      <td className="px-2 py-2 text-center">{row.amount}</td>
      {row.status === "ISSUED" && (
        <td className="px-2 py-2 text-center">
          <button
            className="bg-white border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100 col-span-1 justify-self-end"
            onClick={() => {}}
          >
            Create Billing Statement
          </button>
        </td>
      )}
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
