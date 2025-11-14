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
          })
        );
      });
    });
  };
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-6 bg-white z-10">
        <span className="flex items-center gap-2">
          <h2 className="text-1xl font-semibold text-gray-900">Assign Tags </h2>
          <Tag
            style={{ width: 28, height: 28, color: "white", fill: "#475264" }}
          />
        </span>
        <div className="flex items-center gap-2">
          <Button color="light" size="small" onClick={handleReset}>
            Reset{" "}
          </Button>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-sm border border-gray-200">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-gray-50 z-10">
            <tr>
              <th className="border-b border-gray-200 p-3 text-center text-sm">
                Item
              </th>
              <th className="border-b border-gray-200 p-3 text-center text-sm">
                Period
              </th>
              <th className="border-b border-gray-200 p-3 text-center text-sm">
                Expense Account
              </th>
              <th className="border-b border-gray-200 p-3 text-center text-sm">
                Budget
              </th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border-b border-gray-200 p-2">
                  <InputField
                    value={item.description}
                    handleInputChange={(e) => {}}
                    onBlur={(e) => {
                      dispatch(
                        actions.editLineItem({
                          id: item.id,
                          description: e.target.value,
                        })
                      );
                    }}
                    className="w-full text-xs"
                  />
                </td>
                <td
                  className="border-b border-gray-200 p-2 w-50"
                >
                  <DatePicker
                    name="period"
                    dateFormat="YYYY-MM-DD"
                    autoClose={true}
                    placeholder="Select Period"
                    value={
                      item.lineItemTag.find(
                        (tag) => tag.dimension === "accounting-period"
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
                          label: new Date(e.target.value).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              year: "numeric",
                            }
                          ),
                        })
                      )
                    }
                    className="w-full text-xs"
                  />
                </td>
                <td className="border-b border-gray-200 p-2">
                  <Select
                    options={expenseAccountOptions}
                    value={
                      item.lineItemTag.find(
                        (tag) => tag.dimension === "expense-account"
                      )?.value || ""
                    }
                    placeholder="Select Expense Account"
                    searchable={true}
                    onChange={(value) => {
                      const selectedOption = expenseAccountOptions.find(
                        (option) => option.value === value
                      )
                      dispatch(
                        actions.editLineItemTag({
                          lineItemId: item.id,
                          dimension: "expense-account",
                          value: selectedOption?.value || "",
                          label: selectedOption?.label
                        })
                      );
                    }}
                    className="w-full text-xs"
                  />
                </td>
                <td className="border-b border-gray-200 p-2">
                  <Select
                    options={budgetOptions}
                    value={
                      item.lineItemTag.find((tag) => tag.dimension === "budget")
                        ?.value || ""
                    }
                    placeholder="Select Budget"
                    onChange={(value) => {
                      dispatch(
                        actions.editLineItemTag({
                          lineItemId: item.id,
                          dimension: "budget",
                          value: value as string,
                          label: budgetOptions.find(
                            (option) => option.value === value
                          )?.label,
                        })
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
  );
}

