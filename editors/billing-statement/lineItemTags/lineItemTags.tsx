import type { Dispatch } from "react";
import { X, Tag } from "lucide-react";
import { PowerhouseButton as Button } from "@powerhousedao/design-system/powerhouse/components/index";
import { Select, DatePicker } from "@powerhousedao/document-engineering/ui";
import { budgetOptions, expenseAccountOptions } from "./tagMapping.js";
import {
  actions,
  type BillingStatementTag,
  type BillingStatementAction,
} from "../../../document-models/billing-statement/index.js";
import { InputField } from "../../invoice/components/inputField.js";

interface TagAssignmentRow {
  id: string;
  description: string;
  period: string;
  lineItemTag: BillingStatementTag[];
}

interface LineItemTagsTableProps {
  lineItems: TagAssignmentRow[];
  onClose: () => void;
  dispatch: Dispatch<BillingStatementAction>;
}

export function LineItemTagsTable({
  lineItems,
  onClose,
  dispatch,
}: LineItemTagsTableProps) {
  const handleReset = () => {
    // Resetting all tags to empty values
    lineItems.forEach((item) => {
      item.lineItemTag.forEach((tag) => {
        dispatch(
          actions.editLineItemTag({
            lineItemId: item.id,
            dimension: tag.dimension,
            value: "",
            label: "",
          }),
        );
      });
    });
  };
  return (
    <div className="min-h-screen w-full bg-white text-[#14120f]">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white text-[#14120f] shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-black/10 bg-[#efe8da] px-6 py-5 text-[#14120f] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-white">
                <Tag className="h-5 w-5 text-black/70" />
              </div>
              <div>
                <div className="text-[11px] font-semibold tracking-[0.22em] text-black/60">
                  TAG EDITOR
                </div>
                <h2 className="font-serif text-xl tracking-tight">
                  Assign tags to line items
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button color="light" size="small" onClick={handleReset}>
                Reset
              </Button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full border border-black/15 bg-black/5 p-2 text-black/70 transition hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#efe8da]"
                aria-label="Close tag editor"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="p-6">
            <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-[#efe8da] text-[#14120f]">
                    <tr>
                      <th className="border-b border-black/10 px-3 py-3 text-left text-[11px] font-semibold tracking-[0.20em] text-black/70">
                        ITEM
                      </th>
                      <th className="border-b border-black/10 px-3 py-3 text-left text-[11px] font-semibold tracking-[0.20em] text-black/70">
                        PERIOD
                      </th>
                      <th className="border-b border-black/10 px-3 py-3 text-left text-[11px] font-semibold tracking-[0.20em] text-black/70">
                        EXPENSE ACCOUNT
                      </th>
                      <th className="border-b border-black/10 px-3 py-3 text-left text-[11px] font-semibold tracking-[0.20em] text-black/70">
                        BUDGET
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-black/90">
                    {lineItems.map((item) => (
                      <tr
                        key={item.id}
                        className="odd:bg-[#fbf8f1] even:bg-white hover:bg-[#fff3cf]/60"
                      >
                        <td className="border-b border-gray-200 p-2">
                          <InputField
                            value={item.description}
                            handleInputChange={(e) => {}}
                            onBlur={(e) => {
                              dispatch(
                                actions.editLineItem({
                                  id: item.id,
                                  description: e.target.value,
                                }),
                              );
                            }}
                            className="w-full text-xs"
                          />
                        </td>
                        <td className="border-b border-gray-200 p-2 w-50">
                          <DatePicker
                            name="period"
                            dateFormat="YYYY-MM-DD"
                            autoClose={true}
                            placeholder="Select Period"
                            value={
                              item.lineItemTag.find(
                                (tag) => tag.dimension === "accounting-period",
                              )?.label || ""
                            }
                            onChange={(e) =>
                              dispatch(
                                actions.editLineItemTag({
                                  lineItemId: item.id,
                                  dimension: "accounting-period",
                                  value: new Date(e.target.value)
                                    .toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "numeric",
                                    })
                                    .split("/")
                                    .reverse()
                                    .join("/"),
                                  label: new Date(
                                    e.target.value,
                                  ).toLocaleDateString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                  }),
                                }),
                              )
                            }
                            className="w-full text-xs bg-white"
                          />
                        </td>
                        <td className="border-b border-gray-200 p-2">
                          <Select
                            options={expenseAccountOptions}
                            value={
                              item.lineItemTag.find(
                                (tag) => tag.dimension === "expense-account",
                              )?.value || ""
                            }
                            placeholder="Select Expense Account"
                            searchable={true}
                            onChange={(value) => {
                              const selectedOption = expenseAccountOptions.find(
                                (option) => option.value === value,
                              );
                              dispatch(
                                actions.editLineItemTag({
                                  lineItemId: item.id,
                                  dimension: "expense-account",
                                  value: selectedOption?.value || "",
                                  label: selectedOption?.label,
                                }),
                              );
                            }}
                            className="w-full text-xs"
                          />
                        </td>
                        <td className="border-b border-gray-200 p-2">
                          <Select
                            options={budgetOptions}
                            value={
                              item.lineItemTag.find(
                                (tag) => tag.dimension === "budget",
                              )?.value || ""
                            }
                            placeholder="Select Budget"
                            onChange={(value) => {
                              dispatch(
                                actions.editLineItemTag({
                                  lineItemId: item.id,
                                  dimension: "budget",
                                  value: value as string,
                                  label: budgetOptions.find(
                                    (option) => option.value === value,
                                  )?.label,
                                }),
                              );
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 text-xs text-black/50">
              Changes persist as you blur fields/selects.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
