import { Tag } from "lucide-react";
import { Select, StringField } from "@powerhousedao/document-engineering";
import { InputField } from "../../invoice/components/inputField.js";
import { NumberForm } from "../../invoice/components/numberForm.js";
import {
  type BillingStatementDocument,
  actions,
} from "../../../document-models/billing-statement/index.js";
import { useState, useRef, useEffect } from "react";
import { formatNumber } from "../../invoice/lineItems.js";
import { LineItemTagsTable } from "../lineItemTags/lineItemTags.js";

const initialLineItem = {
  description: "",
  unit: "Hour",
  quantity: "",
  unitPriceCash: "",
  unitPricePwt: "",
};

const LineItemsTable = (props: { state: any; dispatch: any }) => {
  const { state, dispatch } = props;
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [localLineItem, setLocalLineItem] = useState<any>(initialLineItem);
  const [showTagTable, setShowTagTable] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the click is on a select menu or its dropdown
      const target = event.target as HTMLElement;
      const isSelectMenu = target.closest('[role="listbox"]') || target.closest('[role="option"]');
      
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node) &&
        !isSelectMenu
      ) {
        // Save changes before clearing the editing state
        if (editingRow !== null) {
          handleSave();
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingRow, localLineItem]);

  const units = [
    { label: "Minute", value: "MINUTE" },
    { label: "Hour", value: "HOUR" },
    { label: "Day", value: "DAY" },
    { label: "Unit", value: "UNIT" },
  ];

  const handleEdit = (rowIdx: number, item: any) => {
    setEditingRow(rowIdx);
    setLocalLineItem({ ...item });
  };

  const handleInputChange = (field: string, value: any) => {
    if (field === "unitPriceCash" || field === "unitPricePwt") {
      // Allow negative numbers with optional minus sign at start
      const regex = new RegExp(`^-?\\d*\\.?\\d{0,6}$`);
      if (regex.test(value) || value === "-") {
        setLocalLineItem((prev: any) => ({ ...prev, [field]: value }));
      }
    } 
    setLocalLineItem((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const { description, unit, quantity, unitPriceCash, unitPricePwt } = localLineItem;
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
      const originalItem = state.lineItems.find((item: any) => item.id === localLineItem.id);
      
      // Check if any values have actually changed
      const hasChanges = !originalItem || 
        originalItem.description !== description ||
        originalItem.unit !== unit ||
        originalItem.quantity !== qty ||
        originalItem.unitPriceCash !== fiat ||
        originalItem.unitPricePwt !== powt;

      if (hasChanges) {
        dispatch(
          actions.editLineItem({
            id: localLineItem.id,
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


  if (showTagTable) {
    return (
      <LineItemTagsTable
        lineItems={state.lineItems}
        onClose={() => setShowTagTable(false)}
        dispatch={dispatch}
      />
    );
  }

  return (
    <div className="mt-2 overflow-x-auto" ref={tableRef}>
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
      <div className="mt-4 min-w-[900px]">
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 w-10">#</th>
              <th className="border px-2 py-1">Desc</th>
              <th className="border px-2 py-1 w-40">Unit</th>
              <th className="border px-2 py-1 w-16">Qty</th>
              <th className="border px-2 py-1 w-16">FIAT/Uni</th>
              <th className="border px-2 py-1 w-16">POWT/Uni</th>
              <th className="border px-2 py-1 w-16">Total Fiat</th>
              <th className="border px-2 py-1 w-16">Total POWT</th>
            </tr>
          </thead>
          <tbody>
            {state.lineItems.map((item: any, idx: number) => (
              editingRow === idx ? (
                <tr key={item.id} className="bg-yellow-50">
                  <td className="border px-2 py-1 text-center w-10">{idx + 1}</td>
                  <td className="border px-2 py-1 w-40">
                    <InputField
                      input={localLineItem.description}
                      value={localLineItem.description}
                      onBlur={() => {}}
                      handleInputChange={(e) => handleInputChange("description", e.target.value)}
                      className="w-full px-1 py-1 border rounded"
                    />
                  </td>
                  <td className="border px-2 py-1 w-16">
                    <Select
                      options={units}
                      value={localLineItem.unit}
                      onChange={(value) => handleInputChange("unit", value)}
                      className="w-32 px-1 py-1 border rounded"
                    />
                  </td>
                  <td className="border px-2 py-1 w-16">
                    <NumberForm
                      number={localLineItem.quantity}
                      handleInputChange={(e: any) => handleInputChange("quantity", e.target.value)}
                      className="w-32 px-4 py-1 border rounded text-center"
                    />
                  </td>
                  <td className="border px-2 py-1 w-16">
                    <NumberForm
                      number={localLineItem.unitPriceCash}
                      handleInputChange={(e: any) => handleInputChange("unitPriceCash", String(e.target.value))}
                      className="w-32 px-4 py-1 border rounded text-center"
                    />
                  </td>
                  <td className="border px-2 py-1 w-16">
                    <NumberForm
                      number={localLineItem.unitPricePwt}
                      handleInputChange={(e: any) => handleInputChange("unitPricePwt", e.target.value)}
                      className="w-32 px-4 py-1 border rounded text-center"
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {localLineItem.quantity && localLineItem.unitPriceCash
                      ? Number(localLineItem.quantity) * Number(localLineItem.unitPriceCash)
                      : ""}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {localLineItem.quantity && localLineItem.unitPricePwt
                      ? Number(localLineItem.quantity) * Number(localLineItem.unitPricePwt)
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
                  <td className="border px-2 py-2 text-center w-10">{idx + 1}</td>
                  <td className="border px-2 py-2">{item.description}</td>
                  <td className="border px-2 py-2 w-40 text-center">{item.unit}</td>
                  <td className="border px-2 py-2 w-16 text-center">{item.quantity}</td>
                  <td className="border px-2 py-2 w-10 text-center">{formatNumber(item.unitPriceCash)}</td>
                  <td className="border px-2 py-2 w-10 text-center">{formatNumber(item.unitPricePwt)}</td>
                  <td className="border px-2 py-2 text-center">{formatNumber(item.totalPriceCash)}</td>
                  <td className="border px-2 py-2 text-center">{formatNumber(item.totalPricePwt)}</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LineItemsTable;
