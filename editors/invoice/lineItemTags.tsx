import React, { useState } from "react";
import { X, Tag } from "lucide-react";
import { Button } from "@powerhousedao/design-system";
import { Select, SelectOption } from "@powerhousedao/document-engineering/ui";

interface TagAssignmentRow {
  id: string;
  item: string;
  period: string;
  expenseAccount: string;
  total: string;
}

interface LineItemTagsTableProps {
  lineItems: TagAssignmentRow[];
  onSave: (
    updatedLineItems: TagAssignmentRow[],
    paymentAccount: string
  ) => void;
  onClose: () => void;
}

export function LineItemTagsTable({
  lineItems,
  onSave,
  onClose,
}: LineItemTagsTableProps) {
  const [taggedItems, setTaggedItems] = useState<TagAssignmentRow[]>(lineItems);
  const [paymentAccount, setPaymentAccount] =
    useState<string>("Powerhouse USD");

  const periodOptions = [
    "Jan 2025",
    "Feb 2025",
    "Mar 2025",
    "Apr 2025",
    "May 2025",
    "Jun 2025",
  ];
  const expenseAccountOptions: SelectOption[] = [
    { label: "Adjustment A/C", value: "Adjustment A/C" },
    { label: "Admin Expense", value: "Admin Expense" },
    { label: "Budget", value: "Budget" },
    { label: "Compensation & Benefits", value: "Compensation & Benefits" },
    { label: "Cost of Goods Sold", value: "Cost of Goods Sold" },
    { label: "Current Asset", value: "Current Asset" },
    { label: "Current Liability", value: "Current Liability" },
    { label: "Equity", value: "Equity" },
    { label: "Fixed Asset", value: "Fixed Asset" },
    { label: "Gas Expense", value: "Gas Expense" },
    { label: "Income Tax Expense", value: "Income Tax Expense" },
    { label: "Interest Income", value: "Interest Income" },
    { label: "Internal Transfers", value: "Internal Transfers" },
    { label: "Marketing Expense", value: "Marketing Expense" },
    { label: "Non-Current Asset", value: "Non-Current Asset" },
    { label: "Non-current Liability", value: "Non-current Liability" },
    { label: "Other", value: "Other" },
    { label: "Other Income", value: "Other Income" },
    {
      label: "Other Income Expense (Non-operating)",
      value: "Other Income Expense (Non-operating)",
    },
    { label: "Owner Equity", value: "Owner Equity" },
    { label: "Professional Services", value: "Professional Services" },
    {
      label: "Software Development Expense",
      value: "Software Development Expense",
    },
    { label: "Software Expense", value: "Software Expense" },
    { label: "Temporary Holding Account", value: "Temporary Holding Account" },
    { label: "Travel & Entertainment", value: "Travel & Entertainment" },
  ];
  const paymentAccountOptions = [
    "Powerhouse USD",
    "Powerhouse EUR",
    "Bank Account",
  ];

  const handleFieldChange = (
    id: string,
    field: keyof TagAssignmentRow,
    value: string
  ) => {
    setTaggedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = () => {
    onSave(taggedItems, paymentAccount);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
          <Button color="light" size="medium">
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
            {taggedItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border-b border-gray-200 p-3">
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) =>
                      setTaggedItems((prev) =>
                        prev.map((row) =>
                          row.id === item.id
                            ? { ...row, item: e.target.value }
                            : row
                        )
                      )
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </td>
                <td className="border-b border-gray-200 p-3">
                  <select
                    value={item.period}
                    onChange={(e) =>
                      setTaggedItems((prev) =>
                        prev.map((row) =>
                          row.id === item.id
                            ? { ...row, period: e.target.value }
                            : row
                        )
                      )
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Period</option>
                    {periodOptions.map((period) => (
                      <option key={period} value={period}>
                        {period}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border-b border-gray-200 p-3">
                  {/* <select
                    value={item.expenseAccount}
                    onChange={(e) =>
                      setTaggedItems((prev) =>
                        prev.map((row) =>
                          row.id === item.id
                            ? { ...row, expenseAccount: e.target.value }
                            : row
                        )
                      )
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Expense Account</option>
                    {expenseAccountOptions.map((account) => (
                      <option key={account} value={account}>
                        {account}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={expenseAccountOptions}
                    value={item.expenseAccount}
                    placeholder="Select Expense Account"
                    searchable={true}
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
          <select
            value={paymentAccount}
            onChange={(e) => setPaymentAccount(e.target.value)}
            className="w-64 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          >
            {paymentAccountOptions.map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Save Button */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Save Tags
          </button>
        </div>
      </div>
    </div>
  );
}
