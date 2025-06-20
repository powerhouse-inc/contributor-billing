/* eslint-disable react/jsx-max-depth */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */
import { RWAButton } from "@powerhousedao/design-system";
import {
  EditInvoiceInput,
  DeleteLineItemInput,
  InvoiceTag,
} from "../../document-models/invoice/index.js";
import {
  forwardRef,
  useState,
  useMemo,
  useRef,
  useLayoutEffect,
  Dispatch,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Tag } from "lucide-react";
import { NumberForm } from "./components/numberForm.js";
import { InputField } from "./components/inputField.js";
import { LineItemTagsTable } from "./lineItemTags/lineItemTags.js";

// Add TagAssignmentRow interface
interface TagAssignmentRow {
  id: string;
  item: string;
  period: string;
  expenseAccount: string;
  total: string;
}

// Helper function to get precision based on currency
function getCurrencyPrecision(currency: string): number {
  return currency === "USDS" || currency === "DAI" ? 6 : 2;
}

export function formatNumber(value: number): string {
  // Check if the value has decimal places
  const hasDecimals = value % 1 !== 0;

  // If no decimals or only trailing zeros after 2 decimal places, show 2 decimal places
  if (!hasDecimals || value.toFixed(5).endsWith("000")) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Otherwise, show actual decimal places up to 5
  const stringValue = value.toString();
  const decimalPart = stringValue.split(".")[1] || "";

  // Determine how many decimal places to show (up to 5)
  const decimalPlaces = Math.min(Math.max(2, decimalPart.length), 5);
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
}

type LineItem = {
  currency: string;
  description: string;
  id: string;
  quantity: number;
  taxPercent: number;
  totalPriceTaxExcl: number;
  totalPriceTaxIncl: number;
  unitPriceTaxExcl: number;
  unitPriceTaxIncl: number;
  lineItemTag: InvoiceTag[];
};

type EditableLineItem = {
  currency: string;
  description: string;
  id: string;
  quantity: number | string;
  taxPercent: number | string;
  totalPriceTaxExcl: number;
  totalPriceTaxIncl: number;
  unitPriceTaxExcl: number | string;
  unitPriceTaxIncl: number;
};

type EditableLineItemProps = {
  readonly item: Partial<LineItem>;
  readonly onSave: (item: LineItem) => void;
  readonly onCancel: () => void;
  readonly currency: string;
};

const EditableLineItem = forwardRef(function EditableLineItem(
  props: EditableLineItemProps,
  ref: React.Ref<HTMLTableRowElement>
) {
  const { item, onSave, onCancel, currency } = props;
  const [editedItem, setEditedItem] = useState<Partial<EditableLineItem>>({
    ...item,
    currency,
    quantity: item.quantity ?? "",
    taxPercent: item.taxPercent ?? "",
    unitPriceTaxExcl: item.unitPriceTaxExcl ?? "",
  });

  const calculatedValues = useMemo(() => {
    const quantity =
      typeof editedItem.quantity === "string"
        ? editedItem.quantity === ""
          ? 0
          : Number(editedItem.quantity)
        : (editedItem.quantity ?? 0);

    const unitPriceTaxExcl =
      typeof editedItem.unitPriceTaxExcl === "string"
        ? editedItem.unitPriceTaxExcl === ""
          ? 0
          : Number(editedItem.unitPriceTaxExcl)
        : (editedItem.unitPriceTaxExcl ?? 0);

    const taxPercent =
      typeof editedItem.taxPercent === "string"
        ? editedItem.taxPercent === ""
          ? 0
          : Number(editedItem.taxPercent)
        : (editedItem.taxPercent ?? 0);

    const totalPriceTaxExcl = quantity * unitPriceTaxExcl;
    const taxAmount = totalPriceTaxExcl * (taxPercent / 100);
    const totalPriceTaxIncl = totalPriceTaxExcl + taxAmount;
    const unitPriceTaxIncl = unitPriceTaxExcl * (1 + taxPercent / 100);

    return {
      totalPriceTaxExcl,
      totalPriceTaxIncl,
      unitPriceTaxIncl,
    };
  }, [editedItem.quantity, editedItem.unitPriceTaxExcl, editedItem.taxPercent]);

  function handleInputChange(field: keyof EditableLineItem) {
    return function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const value = event.target.value;

      if (field === "description") {
        setEditedItem((prev) => ({ ...prev, [field]: value }));
        return;
      }

      // For numeric fields
      if (value === "" || value === "0") {
        setEditedItem((prev) => ({ ...prev, [field]: value }));
        return;
      }

      if (field === "quantity") {
        // Allow only integers for quantity
        if (/^\d+$/.test(value)) {
          setEditedItem((prev) => ({ ...prev, [field]: value }));
        }
      } else if (field === "taxPercent") {
        // Allow integers from 0-100 for tax percent, with more permissive validation
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
          setEditedItem((prev) => ({ ...prev, [field]: value }));
        }
      } else if (field === "unitPriceTaxExcl") {
        // For unit price, allow up to dynamic decimal places based on currency
        const maxDecimals = getCurrencyPrecision(currency);
        // Allow negative numbers with optional minus sign at start
        const regex = new RegExp(`^-?\\d*\\.?\\d{0,${maxDecimals}}$`);
        if (regex.test(value)) {
          setEditedItem((prev) => ({ ...prev, [field]: value }));
        }
      } else {
        // For other decimal fields
        if (/^-?\d*\.?\d*$/.test(value)) {
          setEditedItem((prev) => ({ ...prev, [field]: value }));
        }
      }
    };
  }

  function handleSave() {
    const quantity =
      typeof editedItem.quantity === "string"
        ? editedItem.quantity === ""
          ? 0
          : Number(editedItem.quantity)
        : (editedItem.quantity ?? 0);

    const unitPriceTaxExcl =
      typeof editedItem.unitPriceTaxExcl === "string"
        ? editedItem.unitPriceTaxExcl === ""
          ? 0
          : Number(editedItem.unitPriceTaxExcl)
        : (editedItem.unitPriceTaxExcl ?? 0);

    const taxPercent =
      typeof editedItem.taxPercent === "string"
        ? editedItem.taxPercent === ""
          ? 0
          : Number(editedItem.taxPercent)
        : (editedItem.taxPercent ?? 0);

    const completeItem: LineItem = {
      id: editedItem.id ?? uuidv4(),
      currency: editedItem.currency!,
      description: editedItem.description ?? "",
      quantity: quantity,
      taxPercent: taxPercent,
      unitPriceTaxExcl: unitPriceTaxExcl,
      unitPriceTaxIncl: calculatedValues.unitPriceTaxIncl,
      totalPriceTaxExcl: calculatedValues.totalPriceTaxExcl,
      totalPriceTaxIncl: calculatedValues.totalPriceTaxIncl,
      lineItemTag: [],
    };
    onSave(completeItem);
  }

  return (
    <tr ref={ref} className="hover:bg-gray-50 table-row">
      <td className="border border-gray-200 p-3 table-cell">
        <InputField
          onBlur={() => {}}
          handleInputChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setEditedItem((prev) => ({ ...prev, description: e.target.value }));
          }}
          value={editedItem.description ?? ""}
          placeholder="Description"
          className=""
        />
      </td>
      <td className="border border-gray-200 p-3 table-cell">
        <NumberForm
          number={editedItem.quantity ?? ""}
          precision={0}
          handleInputChange={handleInputChange("quantity")}
          placeholder="Quantity"
          className=""
        />
      </td>
      <td className="border border-gray-200 p-3 table-cell">
        <NumberForm
          number={editedItem.unitPriceTaxExcl ?? ""}
          precision={getCurrencyPrecision(currency)}
          handleInputChange={handleInputChange("unitPriceTaxExcl")}
          pattern="^-?\d*\.?\d*$"
          placeholder="Unit Price (excl. tax)"
          className=""
        />
      </td>
      <td className="border border-gray-200 p-3 table-cell">
        <NumberForm
          number={editedItem.taxPercent ?? ""}
          precision={0}
          pattern="^(100|[1-9]?[0-9])$"
          handleInputChange={handleInputChange("taxPercent")}
          placeholder="Tax %"
          className=""
        />
      </td>
      <td className="border border-gray-200 p-3 text-right font-medium table-cell">
        {formatNumber(calculatedValues.totalPriceTaxExcl)}
      </td>
      <td className="border border-gray-200 p-3 text-right font-medium table-cell">
        {formatNumber(calculatedValues.totalPriceTaxIncl)}
      </td>
      <td className="border border-gray-200 p-3 table-cell">
        <div className="flex space-x-2">
          <button
            className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
});

type LineItemsTableProps = {
  readonly lineItems: LineItem[];
  readonly currency: string;
  readonly onAddItem: (item: LineItem) => void;
  readonly onUpdateItem: (item: LineItem) => void;
  readonly onDeleteItem: (input: DeleteLineItemInput) => void;
  readonly onUpdateCurrency: (input: EditInvoiceInput) => void;
  readonly dispatch: Dispatch<any>;
  readonly paymentAccounts: InvoiceTag[];
};

export function LineItemsTable({
  lineItems,
  currency,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onUpdateCurrency,
  dispatch,
  paymentAccounts,
}: LineItemsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showTagTable, setShowTagTable] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [modalRect, setModalRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  function handleAddClick() {
    setIsAddingNew(true);
  }

  function handleSaveNewItem(item: LineItem) {
    onAddItem(item);
    setIsAddingNew(false);
  }

  function handleCancelNewItem() {
    setIsAddingNew(false);
  }

  // Transform line items to TagAssignmentRow format for the tag table
  const tagAssignmentRows = lineItems.map((item) => ({
    id: item.id,
    item: item.description,
    period: "", // Default value
    expenseAccount: "", // Default value
    total: `$${formatNumber(item.totalPriceTaxIncl)}`,
    lineItemTag: item.lineItemTag,
  }));

  if (showTagTable) {
    return (
      <LineItemTagsTable
        lineItems={tagAssignmentRows}
        onClose={() => setShowTagTable(false)}
        dispatch={dispatch}
        paymentAccounts={paymentAccounts}
      />
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Line Items Table */}
      <div className="mt-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h4 className="text-xl font-semibold text-gray-900">Line Items</h4>
          </div>

          <RWAButton
            className="mb-2"
            disabled={isAddingNew}
            onClick={handleAddClick}
          >
            Add Line Item
          </RWAButton>
        </div>

        <div
          ref={tableContainerRef}
          className="overflow-x-auto rounded-lg border border-gray-200"
        >
          <table
            ref={tableRef}
            className="w-full table-fixed border-collapse bg-white"
          >
            <colgroup>
              <col style={{ width: "30%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "8%" }} />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr className="bg-gray-50">
                <th className="border-b border-gray-200 p-3 text-left">
                  Description
                </th>
                <th className="border-b border-gray-200 p-3 text-right">
                  Quantity
                </th>
                <th className="border-b border-gray-200 p-3 text-right">
                  Unit Price (excl. tax)
                </th>
                <th className="border-b border-gray-200 p-3 text-right">
                  Tax %
                </th>
                <th className="border-b border-gray-200 p-3 text-right">
                  Total (excl. tax)
                </th>
                <th className="border-b border-gray-200 p-3 text-right">
                  Total (incl. tax)
                </th>
                <th className="border-b border-gray-200 p-3 text-center">
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-sm">Actions</span>
                    <Tag
                      onClick={() => setShowTagTable(true)}
                      style={{
                        cursor: "pointer",
                        width: 28,
                        height: 28,
                        color: "white",
                        fill: "#475264",
                      }}
                    />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) =>
                editingId === item.id ? (
                  <EditableLineItem
                    currency={currency}
                    item={item}
                    key={item.id}
                    onCancel={() => setEditingId(null)}
                    onSave={(updatedItem) => {
                      onUpdateItem(updatedItem);
                      setEditingId(null);
                    }}
                  />
                ) : (
                  <tr key={item.id} className="hover:bg-gray-50 table-row">
                    <td className="border-b border-gray-200 p-3 table-cell">
                      {item.description}
                    </td>
                    <td className="border-b border-gray-200 p-3 text-right table-cell">
                      {item.quantity}
                    </td>
                    <td className="border-b border-gray-200 p-3 text-right table-cell">
                      {formatNumber(item.unitPriceTaxExcl)}
                    </td>
                    <td className="border-b border-gray-200 p-3 text-right table-cell">
                      {typeof item.taxPercent === "number"
                        ? Math.round(item.taxPercent)
                        : 0}
                      %
                    </td>
                    <td className="border-b border-gray-200 p-3 text-right font-medium table-cell">
                      {formatNumber(item.totalPriceTaxExcl)}
                    </td>
                    <td className="border-b border-gray-200 p-3 text-right font-medium table-cell">
                      {formatNumber(item.totalPriceTaxIncl)}
                    </td>
                    <td className="border-b border-gray-200 p-3 table-cell">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-200"
                          onClick={() => setEditingId(item.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                          onClick={() => onDeleteItem({ id: item.id })}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
              {isAddingNew ? (
                <EditableLineItem
                  currency={currency}
                  item={{}}
                  onCancel={handleCancelNewItem}
                  onSave={handleSaveNewItem}
                />
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
