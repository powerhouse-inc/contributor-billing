import { Tag, Plus } from "lucide-react";
import { Select } from "@powerhousedao/document-engineering";
import { InputField } from "../../invoice/components/inputField.js";
import { NumberForm } from "../../invoice/components/numberForm.js";
import { actions, type BillingStatementAction, type BillingStatementState, type BillingStatementUnitInput } from "../../../document-models/billing-statement/index.js";
import { useState, useRef, useEffect } from "react";
import { formatNumber } from "../../invoice/lineItems.js";
import { LineItemTagsTable } from "../lineItemTags/lineItemTags.js";
import { generateId } from "document-model";

const initialLineItem: LocalLineItemDraft = {
  description: "",
  unit: "HOUR",
  quantity: "",
  unitPriceCash: "",
  unitPricePwt: "",
};

type BillingStatementLineItem = {
  id: string;
  description: string;
  unit: BillingStatementUnitInput;
  quantity: number;
  unitPriceCash: number;
  unitPricePwt: number;
  totalPriceCash: number;
  totalPricePwt: number;
  // other fields (e.g., tags) exist but are not needed here
};

type LocalLineItemDraft = {
  id?: string;
  description: string;
  unit: BillingStatementUnitInput;
  quantity: number | string;
  unitPriceCash: number | string;
  unitPricePwt: number | string;
};

const LineItemsTable = (props: { state: BillingStatementState; dispatch: React.Dispatch<BillingStatementAction> }) => {
  const { state, dispatch } = props;
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [localLineItem, setLocalLineItem] = useState<LocalLineItemDraft>(initialLineItem);
  const [showTagTable, setShowTagTable] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLineItem, setNewLineItem] = useState<LocalLineItemDraft>(initialLineItem);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the click is on a select menu or its dropdown
      const target = event.target as HTMLElement;
      const isSelectMenu =
        target.closest('[role="listbox"]') || target.closest('[role="option"]');

      // Check if clicking on buttons (save/cancel)
      const isButton = target.closest('button');

      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node) &&
        !isSelectMenu &&
        !isButton
      ) {
        // Save changes before clearing the editing state
        if (editingRow !== null) {
          handleSave();
        }
        if (isAddingNew) {
          handleCancelAdd();
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingRow, localLineItem, isAddingNew, newLineItem]);

  const units: Array<{ label: string; value: BillingStatementUnitInput }> = [
    { label: "Minute", value: "MINUTE" },
    { label: "Hour", value: "HOUR" },
    { label: "Day", value: "DAY" },
    { label: "Unit", value: "UNIT" },
  ];

  const handleEdit = (rowIdx: number, item: BillingStatementLineItem) => {
    setEditingRow(rowIdx);
    setLocalLineItem({ ...item });
  };

  const handleInputChange = (field: keyof LocalLineItemDraft, value: string | number) => {
    if (field === "unitPriceCash" || field === "unitPricePwt") {
      // Allow negative numbers with optional minus sign at start
      const regex = new RegExp(`^-?\\d*\\.?\\d{0,6}$`);
      const stringValue = String(value);
      if (regex.test(stringValue) || stringValue === "-") {
        setLocalLineItem((prev) => ({ ...prev, [field]: value }));
      }
    }
    setLocalLineItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const { description, unit, quantity, unitPriceCash, unitPricePwt } =
      localLineItem;
    if (
      description &&
      unit &&
      quantity !== "" &&
      unitPriceCash !== "" &&
      unitPricePwt !== ""
    ) {
      // Parse as number, allowing negative values
      const qty = Number(quantity);
      const fiat = Number(unitPriceCash);
      const powt = Number(unitPricePwt);

      // Get the original line item
      const originalItem = state.lineItems.find(
        (item: any) => item.id === localLineItem.id
      ) as BillingStatementLineItem | undefined;

      // Check if any values have actually changed
      const hasChanges =
        !originalItem ||
        originalItem.description !== description ||
        originalItem.unit !== unit ||
        originalItem.quantity !== qty ||
        originalItem.unitPriceCash !== fiat ||
        originalItem.unitPricePwt !== powt;

      if (hasChanges) {
        const id = String(localLineItem.id);
        dispatch(
          actions.editLineItem({
            id,
            description,
            unit,
            quantity: qty,
            unitPriceCash: fiat,
            unitPricePwt: powt,
            totalPriceCash: qty * fiat,
            totalPricePwt: qty * powt,
          })
        );
      }
      setEditingRow(null);
      setLocalLineItem(initialLineItem);
    }
  };

  const handleAddLineItem = () => {
    setIsAddingNew(true);
    setNewLineItem(initialLineItem);
  };

  const handleNewLineItemChange = (field: keyof LocalLineItemDraft, value: string | number) => {
    if (field === "unitPriceCash" || field === "unitPricePwt") {
      // Allow negative numbers with optional minus sign at start
      const regex = new RegExp(`^-?\\d*\\.?\\d{0,6}$`);
      const stringValue = String(value);
      if (regex.test(stringValue) || stringValue === "-") {
        setNewLineItem((prev) => ({ ...prev, [field]: value }));
      }
    } else {
      setNewLineItem((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveNewLineItem = () => {
    const { description, unit, quantity, unitPriceCash, unitPricePwt } = newLineItem;

    if (
      description &&
      unit &&
      quantity !== "" &&
      unitPriceCash !== "" &&
      unitPricePwt !== ""
    ) {
      const qty = Number(quantity);
      const fiat = Number(unitPriceCash);
      const powt = Number(unitPricePwt);

      dispatch(
        actions.addLineItem({
          id: generateId(),
          description,
          unit,
          quantity: qty,
          unitPriceCash: fiat,
          unitPricePwt: powt,
          totalPriceCash: qty * fiat,
          totalPricePwt: qty * powt,
        })
      );

      setIsAddingNew(false);
      setNewLineItem(initialLineItem);
    }
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewLineItem(initialLineItem);
  };

  if (showTagTable) {
    return (
      <LineItemTagsTable
        lineItems={state.lineItems as unknown as any}
        onClose={() => setShowTagTable(false)}
        dispatch={dispatch}
      />
    );
  }

  return (
    <div className="mt-2 overflow-x-auto">
      {/* Heading */}
      <div className="flex justify-between mt-6">
        <div className="flex items-center">
          <h1 className="text-1xl font-bold">Line Items</h1>
        </div>
        <div className="flex items-center">
          <Tag
            style={{
              cursor: "pointer",
              width: 28,
              height: 28,
              color: "white",
              fill: "#475264",
            }}
            onClick={() => setShowTagTable(!showTagTable)}
          />
        </div>
      </div>
      {/* Table */}
      <div className="mt-4 min-w-[900px]" ref={tableRef}>
        <table className="w-full border border-gray-300 text-sm">
          <thead className="h-12">
            <tr className="bg-gray-100 h-10">
              <th className="border px-2 py-1 w-10">#</th>
              <th className="border px-2 py-1 w-72">Desc</th>
              <th className="border px-2 py-1 w-40">Unit</th>
              <th className="border px-2 py-1 w-16">Qty</th>
              <th className="border px-2 py-1 w-16">FIAT/Unit</th>
              <th className="border px-2 py-1 w-16">POWT/Unit</th>
              <th className="border px-2 py-1 w-16">Total Fiat</th>
              <th className="border px-2 py-1 w-16">Total POWT</th>
            </tr>
          </thead>
          <tbody>
            {state.lineItems.map((item: any, idx: number) =>
              editingRow === idx ? (
                <tr key={item.id} className="bg-yellow-100">
                  <td className="border px-2 py-1 text-center w-10">
                    {idx + 1}
                  </td>
                  <td className="border px-2 py-1 w-72">
                    <InputField
                      input={localLineItem.description}
                      value={localLineItem.description}
                      onBlur={() => {}}
                      handleInputChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="w-full px-1 py-1 border rounded"
                    />
                  </td>
                  <td className="border px-2 py-1 w-16">
                    <Select
                      options={units}
                      value={localLineItem.unit}
                      onChange={(value) => handleInputChange("unit", value as BillingStatementUnitInput)}
                      className="w-32 px-1 py-1 border rounded"
                    />
                  </td>
                  <td className="border px-2 py-1 w-16">
                    <NumberForm
                      number={localLineItem.quantity}
                      handleInputChange={(e: any) =>
                        handleInputChange("quantity", e.target.value)
                      }
                      className="w-32 px-4 py-1 border rounded text-center"
                    />
                  </td>
                  <td className="border px-2 py-1 w-16">
                    <NumberForm
                      number={localLineItem.unitPriceCash}
                      handleInputChange={(e: any) =>
                        handleInputChange(
                          "unitPriceCash",
                          String(e.target.value)
                        )
                      }
                      className="w-32 px-4 py-1 border rounded text-center"
                    />
                  </td>
                  <td className="border px-2 py-1 w-16">
                    <NumberForm
                      number={localLineItem.unitPricePwt}
                      handleInputChange={(e: any) =>
                        handleInputChange("unitPricePwt", e.target.value)
                      }
                      className="w-32 px-4 py-1 border rounded text-center"
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {localLineItem.quantity && localLineItem.unitPriceCash
                      ? Number(localLineItem.quantity) *
                        Number(localLineItem.unitPriceCash)
                      : ""}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {localLineItem.quantity && localLineItem.unitPricePwt
                      ? Number(localLineItem.quantity) *
                        Number(localLineItem.unitPricePwt)
                      : ""}
                  </td>
                </tr>
              ) : (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onDoubleClick={() => {
                    setEditingRow(idx);
                    setLocalLineItem({ ...item });
                  }}
                >
                  <td className="border px-2 py-2 text-center w-10">
                    {idx + 1}
                  </td>
                  <td className="border px-2 py-2">{item.description}</td>
                  <td className="border px-2 py-2 w-40 text-center">
                    {item.unit}
                  </td>
                  <td className="border px-2 py-2 w-16 text-center">
                    {item.quantity}
                  </td>
                  <td className="border px-2 py-2 w-10 text-center">
                    {formatNumber(item.unitPriceCash)}
                  </td>
                  <td className="border px-2 py-2 w-10 text-center">
                    {formatNumber(item.unitPricePwt)}
                  </td>
                  <td className="border px-2 py-2 text-center">
                    {formatNumber(item.totalPriceCash)}
                  </td>
                  <td className="border px-2 py-2 text-center">
                    {formatNumber(item.totalPricePwt)}
                  </td>
                </tr>
              )
            )}
            {isAddingNew && (
              <tr className="bg-green-50">
                <td className="border px-2 py-1 text-center w-10">
                  {state.lineItems.length + 1}
                </td>
                <td className="border px-2 py-1 w-72">
                  <InputField
                    input={newLineItem.description}
                    value={newLineItem.description}
                    onBlur={() => {}}
                    handleInputChange={(e) =>
                      handleNewLineItemChange("description", e.target.value)
                    }
                    className="w-full px-1 py-1 border rounded"
                  />
                </td>
                <td className="border px-2 py-1 w-16">
                  <Select
                    options={units}
                    value={newLineItem.unit}
                    onChange={(value) => handleNewLineItemChange("unit", value as BillingStatementUnitInput)}
                    className="w-32 px-1 py-1 border rounded"
                  />
                </td>
                <td className="border px-2 py-1 w-16">
                  <NumberForm
                    number={newLineItem.quantity}
                    handleInputChange={(e: any) =>
                      handleNewLineItemChange("quantity", e.target.value)
                    }
                    className="w-32 px-4 py-1 border rounded text-center"
                  />
                </td>
                <td className="border px-2 py-1 w-16">
                  <NumberForm
                    number={newLineItem.unitPriceCash}
                    handleInputChange={(e: any) =>
                      handleNewLineItemChange("unitPriceCash", String(e.target.value))
                    }
                    className="w-32 px-4 py-1 border rounded text-center"
                  />
                </td>
                <td className="border px-2 py-1 w-16">
                  <NumberForm
                    number={newLineItem.unitPricePwt}
                    handleInputChange={(e: any) =>
                      handleNewLineItemChange("unitPricePwt", e.target.value)
                    }
                    className="w-32 px-4 py-1 border rounded text-center"
                  />
                </td>
                <td className="border px-2 py-1 text-center">
                  {newLineItem.quantity && newLineItem.unitPriceCash
                    ? Number(newLineItem.quantity) * Number(newLineItem.unitPriceCash)
                    : ""}
                </td>
                <td className="border px-2 py-1 text-center">
                  {newLineItem.quantity && newLineItem.unitPricePwt
                    ? Number(newLineItem.quantity) * Number(newLineItem.unitPricePwt)
                    : ""}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Add Line Item Button */}
        {!isAddingNew && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleAddLineItem}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              <Plus size={16} />
              Add Line Item
            </button>
          </div>
        )}

        {/* Save/Cancel buttons when adding new item */}
        {isAddingNew && (
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={handleSaveNewLineItem}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Save Line Item
            </button>
            <button
              onClick={handleCancelAdd}
              className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LineItemsTable;
