import { Tag, Plus, Trash2 } from "lucide-react";
import { Select } from "@powerhousedao/document-engineering";
import { InputField } from "../../invoice/components/inputField.js";
import { NumberForm } from "../../invoice/components/numberForm.js";
import {
  actions,
  type BillingStatementAction,
  type BillingStatementState,
  type BillingStatementUnitInput,
} from "../../../document-models/billing-statement/index.js";
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

const LineItemsTable = (props: {
  state: BillingStatementState;
  dispatch: React.Dispatch<BillingStatementAction>;
}) => {
  const { state, dispatch } = props;
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [localLineItem, setLocalLineItem] =
    useState<LocalLineItemDraft>(initialLineItem);
  const [showTagTable, setShowTagTable] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLineItem, setNewLineItem] =
    useState<LocalLineItemDraft>(initialLineItem);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the click is on a select menu or its dropdown
      const target = event.target as HTMLElement;
      const isSelectMenu =
        target.closest('[role="listbox"]') || target.closest('[role="option"]');

      // Check if clicking on buttons (save/cancel)
      const isButton = target.closest("button");

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

  const handleInputChange = (
    field: keyof LocalLineItemDraft,
    value: string | number,
  ) => {
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
        (item: any) => item.id === localLineItem.id,
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
          }),
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

  const handleNewLineItemChange = (
    field: keyof LocalLineItemDraft,
    value: string | number,
  ) => {
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
    const { description, unit, quantity, unitPriceCash, unitPricePwt } =
      newLineItem;

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
        }),
      );

      setIsAddingNew(false);
      setNewLineItem(initialLineItem);
    }
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewLineItem(initialLineItem);
  };

  const handleDeleteLineItem = (id: string) => {
    if (editingRow !== null) {
      setEditingRow(null);
      setLocalLineItem(initialLineItem);
    }
    dispatch(actions.deleteLineItem({ id }));
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
    <div className="w-full">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-xs font-semibold tracking-[0.24em] text-black/60">
            LINE ITEMS
          </div>
          <div className="text-sm text-black/50">
            Double‑click a row to edit. Click outside to save.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowTagTable(!showTagTable)}
            className="group inline-flex items-center gap-2 rounded-full border border-black/15 bg-[#efe8da] px-3 py-2 text-xs font-semibold tracking-wide text-black/80 shadow-[0_10px_28px_rgba(15,23,42,0.10)] transition hover:bg-[#e7ddc9] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Open tag editor"
          >
            <Tag className="h-4 w-4 text-black/70" />
            Tags
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="overflow-x-auto" ref={tableRef}>
          <div className="min-w-[980px]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#efe8da] text-[#14120f]">
                  <th className="w-10 border-b border-black/10 px-2 py-3 text-center text-[11px] font-semibold tracking-[0.20em] text-black/70">
                    #
                  </th>
                  <th className="w-[28rem] border-b border-black/10 px-3 py-3 text-left text-[11px] font-semibold tracking-[0.20em] text-black/70">
                    DESCRIPTION
                  </th>
                  <th className="w-44 border-b border-black/10 px-3 py-3 text-left text-[11px] font-semibold tracking-[0.20em] text-black/70">
                    UNIT
                  </th>
                  <th className="w-20 border-b border-black/10 px-3 py-3 text-right text-[11px] font-semibold tracking-[0.20em] text-black/70">
                    QTY
                  </th>
                  <th className="w-28 border-b border-black/10 px-3 py-3 text-right text-[11px] font-semibold tracking-[0.20em] text-black/70">
                    FIAT/UNIT
                  </th>
                  <th className="w-28 border-b border-black/10 px-3 py-3 text-right text-[11px] font-semibold tracking-[0.20em] text-black/70">
                    POWT/UNIT
                  </th>
                  <th className="w-32 border-b border-black/10 px-3 py-3 text-right text-[11px] font-semibold tracking-[0.20em] text-black/70">
                    TOTAL FIAT
                  </th>
                  <th className="w-32 border-b border-black/10 px-3 py-3 text-right text-[11px] font-semibold tracking-[0.20em] text-black/70">
                    TOTAL POWT
                  </th>
                  <th className="w-16 border-b border-black/10 px-2 py-3 text-center text-[11px] font-semibold tracking-[0.20em] text-black/70">
                    {/* Delete column header */}
                  </th>
                </tr>
              </thead>
              <tbody className="text-black/90">
                {state.lineItems.map((item: any, idx: number) =>
                  editingRow === idx ? (
                    <tr
                      key={item.id}
                      className="bg-[#fff3cf] shadow-[inset_0_0_0_1px_rgba(245,158,11,0.35)]"
                    >
                      <td className="border-b border-black/10 px-2 py-3 text-center font-mono text-xs tabular-nums text-black/60">
                        {idx + 1}
                      </td>
                      <td className="border-b border-black/10 px-3 py-2">
                        <InputField
                          input={localLineItem.description}
                          value={localLineItem.description}
                          onBlur={() => {}}
                          handleInputChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                        />
                      </td>
                      <td className="border-b border-black/10 px-3 py-2">
                        <Select
                          options={units}
                          value={localLineItem.unit}
                          onChange={(value) =>
                            handleInputChange(
                              "unit",
                              value as BillingStatementUnitInput,
                            )
                          }
                          className="w-44 rounded-lg border border-black/15 bg-white px-2 py-2 text-sm"
                        />
                      </td>
                      <td className="border-b border-black/10 px-3 py-2">
                        <NumberForm
                          number={localLineItem.quantity}
                          handleInputChange={(e: any) =>
                            handleInputChange("quantity", e.target.value)
                          }
                          className="w-24 rounded-lg border border-black/15 bg-white px-3 py-2 text-right font-mono tabular-nums shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                        />
                      </td>
                      <td className="border-b border-black/10 px-3 py-2">
                        <NumberForm
                          number={localLineItem.unitPriceCash}
                          handleInputChange={(e: any) =>
                            handleInputChange(
                              "unitPriceCash",
                              String(e.target.value),
                            )
                          }
                          className="w-28 rounded-lg border border-black/15 bg-white px-3 py-2 text-right font-mono tabular-nums shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                        />
                      </td>
                      <td className="border-b border-black/10 px-3 py-2">
                        <NumberForm
                          number={localLineItem.unitPricePwt}
                          handleInputChange={(e: any) =>
                            handleInputChange("unitPricePwt", e.target.value)
                          }
                          className="w-28 rounded-lg border border-black/15 bg-white px-3 py-2 text-right font-mono tabular-nums shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                        />
                      </td>
                      <td className="border-b border-black/10 px-3 py-3 text-right font-mono tabular-nums text-black/70">
                        {localLineItem.quantity && localLineItem.unitPriceCash
                          ? Number(localLineItem.quantity) *
                            Number(localLineItem.unitPriceCash)
                          : ""}
                      </td>
                      <td className="border-b border-black/10 px-3 py-3 text-right font-mono tabular-nums text-black/70">
                        {localLineItem.quantity && localLineItem.unitPricePwt
                          ? Number(localLineItem.quantity) *
                            Number(localLineItem.unitPricePwt)
                          : ""}
                      </td>
                      <td className="border-b border-black/10 px-2 py-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLineItem(String(localLineItem.id));
                          }}
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-red-600/70 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/20 focus-visible:ring-offset-1"
                          aria-label="Delete line item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={item.id}
                      className="cursor-pointer odd:bg-[#fbf8f1] even:bg-white hover:bg-[#fff3cf]/60"
                      onDoubleClick={() => {
                        setEditingRow(idx);
                        setLocalLineItem({ ...item });
                      }}
                    >
                      <td className="border-b border-black/10 px-2 py-3 text-center font-mono text-xs tabular-nums text-black/60">
                        {idx + 1}
                      </td>
                      <td className="border-b border-black/10 px-3 py-3">
                        {item.description}
                      </td>
                      <td className="border-b border-black/10 px-3 py-3 text-center text-xs font-semibold tracking-wide text-black/60">
                        {item.unit}
                      </td>
                      <td className="border-b border-black/10 px-3 py-3 text-right font-mono tabular-nums">
                        {item.quantity}
                      </td>
                      <td className="border-b border-black/10 px-3 py-3 text-right font-mono tabular-nums">
                        {formatNumber(item.unitPriceCash)}
                      </td>
                      <td className="border-b border-black/10 px-3 py-3 text-right font-mono tabular-nums">
                        {formatNumber(item.unitPricePwt)}
                      </td>
                      <td className="border-b border-black/10 px-3 py-3 text-right font-mono tabular-nums">
                        {formatNumber(item.totalPriceCash)}
                      </td>
                      <td className="border-b border-black/10 px-3 py-3 text-right font-mono tabular-nums">
                        {formatNumber(item.totalPricePwt)}
                      </td>
                      <td className="border-b border-black/10 px-2 py-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLineItem(item.id);
                          }}
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-red-600/70 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/20 focus-visible:ring-offset-1"
                          aria-label="Delete line item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ),
                )}
                {isAddingNew && (
                  <tr className="bg-[#e8fff3] shadow-[inset_0_0_0_1px_rgba(16,185,129,0.22)]">
                    <td className="border-b border-black/10 px-2 py-3 text-center font-mono text-xs tabular-nums text-black/60">
                      {state.lineItems.length + 1}
                    </td>
                    <td className="border-b border-black/10 px-3 py-2">
                      <InputField
                        input={newLineItem.description}
                        value={newLineItem.description}
                        onBlur={() => {}}
                        handleInputChange={(e) =>
                          handleNewLineItemChange("description", e.target.value)
                        }
                        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                      />
                    </td>
                    <td className="border-b border-black/10 px-3 py-2">
                      <Select
                        options={units}
                        value={newLineItem.unit}
                        onChange={(value) =>
                          handleNewLineItemChange(
                            "unit",
                            value as BillingStatementUnitInput,
                          )
                        }
                        className="w-44 rounded-lg border border-black/15 bg-white px-2 py-2 text-sm"
                      />
                    </td>
                    <td className="border-b border-black/10 px-3 py-2">
                      <NumberForm
                        number={newLineItem.quantity}
                        handleInputChange={(e: any) =>
                          handleNewLineItemChange("quantity", e.target.value)
                        }
                        className="w-24 rounded-lg border border-black/15 bg-white px-3 py-2 text-right font-mono tabular-nums shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                      />
                    </td>
                    <td className="border-b border-black/10 px-3 py-2">
                      <NumberForm
                        number={newLineItem.unitPriceCash}
                        handleInputChange={(e: any) =>
                          handleNewLineItemChange(
                            "unitPriceCash",
                            String(e.target.value),
                          )
                        }
                        className="w-28 rounded-lg border border-black/15 bg-white px-3 py-2 text-right font-mono tabular-nums shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                      />
                    </td>
                    <td className="border-b border-black/10 px-3 py-2">
                      <NumberForm
                        number={newLineItem.unitPricePwt}
                        handleInputChange={(e: any) =>
                          handleNewLineItemChange(
                            "unitPricePwt",
                            e.target.value,
                          )
                        }
                        className="w-28 rounded-lg border border-black/15 bg-white px-3 py-2 text-right font-mono tabular-nums shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                      />
                    </td>
                    <td className="border-b border-black/10 px-3 py-3 text-right font-mono tabular-nums text-black/70">
                      {newLineItem.quantity && newLineItem.unitPriceCash
                        ? Number(newLineItem.quantity) *
                          Number(newLineItem.unitPriceCash)
                        : ""}
                    </td>
                    <td className="border-b border-black/10 px-3 py-3 text-right font-mono tabular-nums text-black/70">
                      {newLineItem.quantity && newLineItem.unitPricePwt
                        ? Number(newLineItem.quantity) *
                          Number(newLineItem.unitPricePwt)
                        : ""}
                    </td>
                    <td className="border-b border-black/10 px-2 py-3 text-center">
                      {/* Empty cell for new item row */}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Line Item Button */}
        {!isAddingNew && (
          <div className="flex justify-center bg-[#fbf8f1] px-4 py-4">
            <button
              onClick={handleAddLineItem}
              className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-[#efe8da] px-4 py-2 text-xs font-semibold tracking-wide text-black/80 shadow-[0_10px_28px_rgba(15,23,42,0.10)] transition hover:bg-[#e7ddc9] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <Plus className="h-4 w-4 text-black/70" />
              Add Line Item
            </button>
          </div>
        )}

        {/* Save/Cancel buttons when adding new item */}
        {isAddingNew && (
          <div className="flex justify-center gap-2 bg-[#fbf8f1] px-4 py-4">
            <button
              onClick={handleSaveNewLineItem}
              className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-[0_10px_28px_rgba(0,0,0,0.18)] transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Save Line Item
            </button>
            <button
              onClick={handleCancelAdd}
              className="rounded-full bg-[#121319] px-4 py-2 text-xs font-semibold tracking-wide text-[#f6f1e7] shadow-[0_10px_28px_rgba(0,0,0,0.18)] transition hover:bg-[#1b1d26] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d38a]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
