import { Dispatch, useState } from "react";
import { X, Tag } from "lucide-react";
import { Button } from "@powerhousedao/design-system";
import { Select, DatePicker } from "@powerhousedao/document-engineering/ui";
import { expenseAccountOptions, paymentAccountOptions } from "./tagMapping.js";
import { actions, InvoiceTag } from "../../../document-models/invoice/index.js";
import { InputField } from "../components/inputField.js";
import { TagCard } from "./tagCard.js";
import { TagMobileModal } from "./tagMobileModal.js";

interface TagAssignmentRow {
  id: string;
  item: string;
  period: string;
  expenseAccount: string;
  total: string;
  lineItemTag: InvoiceTag[];
}

interface LineItemTagsTableProps {
  lineItems: TagAssignmentRow[];
  onClose: () => void;
  dispatch: Dispatch<any>;
  paymentAccounts: InvoiceTag[];
}

export function LineItemTagsTable({
  lineItems,
  onClose,
  dispatch,
  paymentAccounts,
}: LineItemTagsTableProps) {
  const [mobileEditItem, setMobileEditItem] = useState<TagAssignmentRow | null>(
    null
  );
  const [showMobileModal, setShowMobileModal] = useState(false);

  const handleReset = () => {
    // Resetting all tags to empty values
    lineItems.forEach((item) => {
      item.lineItemTag.forEach((tag) => {
        dispatch(
          actions.setLineItemTag({
            lineItemId: item.id,
            dimension: tag.dimension,
            value: "",
            label: "",
          })
        );
      });
    });

    // Reset the payment account to empty value
    paymentAccounts.forEach((tag) => {
      dispatch(
        actions.setInvoiceTag({
          dimension: tag.dimension,
          value: "",
          label: "",
        })
      );
    });
  };

  const handleMobileEdit = (item: TagAssignmentRow) => {
    setMobileEditItem(item);
    setShowMobileModal(true);
  };

  const handleCloseMobileModal = () => {
    setShowMobileModal(false);
    setMobileEditItem(null);
  };

  // Get the last payment account value from the paymentAccounts to display in the payment account select
  const selectedPaymentAccountValue =
    paymentAccounts && paymentAccounts.length > 0
      ? (paymentAccounts[paymentAccounts.length - 1].value ?? "")
      : "";

  return (
    <div className="w-full">
      {/* Mobile Modal */}
      {showMobileModal && mobileEditItem && (
        <TagMobileModal
          item={mobileEditItem}
          onClose={handleCloseMobileModal}
          dispatch={dispatch}
        />
      )}

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

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
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
                    handleInputChange={(e) => {}}
                    onBlur={(e) => {
                      dispatch(
                        actions.editLineItem({
                          id: item.id,
                          description: e.target.value,
                        })
                      );
                    }}
                  />
                </td>
                <td className="border-b border-gray-200 w-48">
                  <DatePicker
                    name="period"
                    dateFormat="YYYY-MM"
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

      {/* Mobile Card View */}
      <div className="md:hidden p-4 space-y-3">
        {lineItems.map((item) => (
          <TagCard
            key={item.id}
            item={item}
            onEdit={() => handleMobileEdit(item)}
          />
        ))}
      </div>

      {/* Payment Account - Desktop */}
      <div className="hidden md:block border-t border-gray-200 p-6">
        <div className="flex items-center justify-end gap-4">
          <label className="text-lg font-medium text-gray-900">
            Payment Account
          </label>
          <Select
            options={paymentAccountOptions}
            value={
              paymentAccountOptions.find(
                (option) => option.value === selectedPaymentAccountValue
              )?.value ?? ""
            }
            placeholder="Select Payment Account"
            searchable={true}
            onChange={(value) => {
              const selectedLabel =
                paymentAccountOptions.find((option) => option.value === value)
                  ?.label || "";
              const cleanLabel = selectedLabel.replace(/\s+\w+$/, "").trim();
              dispatch(
                actions.setInvoiceTag({
                  dimension: "xero-payment-account",
                  value: value as string,
                  label: cleanLabel,
                })
              );
            }}
            style={{ width: "230px" }}
          />
        </div>
      </div>

      {/* Payment Account - Mobile */}
      <div className="md:hidden p-4 border-t border-gray-200">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Payment Account
          </label>
          <Select
            options={paymentAccountOptions}
            value={
              paymentAccountOptions.find(
                (option) => option.value === selectedPaymentAccountValue
              )?.value ?? ""
            }
            placeholder="Select Payment Account"
            searchable={true}
            onChange={(value) => {
              const selectedLabel =
                paymentAccountOptions.find((option) => option.value === value)
                  ?.label || "";
              const cleanLabel = selectedLabel.replace(/\s+\w+$/, "").trim();
              dispatch(
                actions.setInvoiceTag({
                  dimension: "xero-payment-account",
                  value: value as string,
                  label: cleanLabel,
                })
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
