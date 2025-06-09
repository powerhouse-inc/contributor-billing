import { Dispatch } from "react";
import { X, Tag } from "lucide-react";
import { Button } from "@powerhousedao/design-system";
import { Select, DatePicker } from "@powerhousedao/document-engineering/ui";
import { expenseAccountOptions } from "./tagMapping.js";
import {
  actions,
  InvoiceLineItemTag,
} from "../../../document-models/invoice/index.js";
import { InputField } from "../components/inputField.js";

interface TagAssignmentRow {
  id: string;
  item: string;
  period: string;
  expenseAccount: string;
  total: string;
  lineItemTag: InvoiceLineItemTag[];
}

interface LineItemTagsTableProps {
  lineItems: TagAssignmentRow[];
  onClose: () => void;
  dispatch: Dispatch<any>;
  paymentAccounts: string[];
}

export function LineItemTagsTable({
  lineItems,
  onClose,
  dispatch,
  paymentAccounts,
}: LineItemTagsTableProps) {

  const handleReset = () => {
    // Resetting all tags to empty values
    lineItems.forEach((item) => {
      item.lineItemTag.forEach((tag) => {
        dispatch(actions.setLineItemTag({
          lineItemId: item.id,
          dimension: tag.dimension,
          value: "",
          label: "",
        }));
      });
    });
    // Resetting payment accounts to empty array
    paymentAccounts.forEach((paymentAccount) => {
      dispatch(actions.deletePaymentAccount({ paymentAccount: paymentAccount }));
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-6 bg-white z-10">
        <span className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-gray-900">Assign Tags </h2>
          <Tag
            style={{ width: 28, height: 28, color: "white", fill: "#475264" }}
          />
        </span>
        <div className="flex items-center gap-2">
          <Button color="light" size="medium" onClick={handleReset}>
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
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-gray-50 z-10">
            <tr>
              <th className="border-b border-gray-200 p-3 text-left">Item</th>
              <th className="border-b border-gray-200 p-3 text-left">Period</th>
              <th className="border-b border-gray-200 p-3 text-left">
                Xero Expense Account
              </th>
              <th className="border-b border-gray-200 p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border-b border-gray-200 p-3">
                  <InputField 
                    value={item.item}
                    handleInputChange={(e) => {
                      
                    }}
                    onBlur={(e) => {
                      dispatch(
                        actions.editLineItem({
                          id: item.id,
                          description: e.target.value,
                        })
                      );
                    }}
                    className="w-full"
                  />
                </td>
                <td className="border-b border-gray-200 p-3" style={{ width: "100px" }}>
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
                        actions.setLineItemTag({
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
                  />
                </td>
                <td className="border-b border-gray-200 p-3">
                  <Select
                    options={expenseAccountOptions}
                    value={
                      item.lineItemTag.find(
                        (tag) => tag.dimension === "xero-expense-account"
                      )?.value || ""
                    }
                    placeholder="Select Expense Account"
                    searchable={true}
                    onChange={(value) => {
                      dispatch(
                        actions.setLineItemTag({
                          lineItemId: item.id,
                          dimension: "xero-expense-account",
                          value: value as string,
                          label: expenseAccountOptions.find(
                            (option) => option.value === value
                          )?.label,
                        })
                      );
                    }}
                  />
                </td>
                <td className="border-b border-gray-200 p-3 text-right font-medium">
                  {item.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Payment Account - Below Table */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex items-center justify-end gap-4">
          <label className="text-lg font-medium text-gray-900">
            Payment Account
          </label>
          <Select
            options={[
              { label: "Powerhouse USD", value: "Powerhouse USD" },
              { label: "Powerhouse EUR", value: "Powerhouse EUR" },
            ]}
            value={
              paymentAccounts && paymentAccounts.length > 0
                ? paymentAccounts[paymentAccounts.length - 1]
                : ""
            }
            placeholder="Select Payment Account"
            searchable={true}
            onChange={(value) => {
              dispatch(
                actions.addPaymentAccount({ paymentAccount: value as string })
              );
            }}
            style={{ width: "200px" }}
          />
        </div>
      </div>
    </div>
  );
}
