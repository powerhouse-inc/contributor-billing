import { useState } from "react";
import { Select } from "@powerhousedao/document-engineering";
import ConfirmationModal from "../../../invoice/components/confirmationModal.js";
import { Icon } from "@powerhousedao/design-system";
import { setSelectedNode } from "@powerhousedao/reactor-browser";

const currencyOptions = [
  { label: "CHF", value: "CHF" },
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
  { label: "JPY", value: "JPY" },
];

export const HeaderControls = ({
  statusOptions = [],
  onStatusChange,
  onSearchChange,
  onExport,
  onExpenseReportExport,
  selectedStatuses = [],
  createIntegrationsDocument,
  integrationsDoc,
  canExportSelectedRows,
}: {
  statusOptions?: { label: string; value: string }[];
  onStatusChange?: (value: string | string[]) => void;
  onSearchChange?: (value: string) => void;
  onExport?: (baseCurrency: string) => void;
  onExpenseReportExport?: (baseCurrency: string) => void;
  selectedStatuses?: string[];
  createIntegrationsDocument?: () => void;
  integrationsDoc?: any | null;
  canExportSelectedRows?: () => boolean;
}) => {
  const batchOptions = [
    { label: "$ Pay Selected", value: "pay" },
    { label: "Approve Selected", value: "approve" },
    { label: "Reject Selected", value: "reject" },
    { label: "Export CSV Expense Report", value: "export-csv-expense-report" },
  ];

  // Use the function to determine if export should be enabled based on selected rows
  const canExport = canExportSelectedRows ? canExportSelectedRows() : false;

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("CHF");
  const [showExpenseReportCurrencyModal, setShowExpenseReportCurrencyModal] =
    useState(false);
  const [selectedExpenseReportCurrency, setSelectedExpenseReportCurrency] =
    useState("CHF");

  const handleBatchAction = (action: string) => {
    if (action === "export-csv-expense-report") {
      setShowExpenseReportCurrencyModal(true);
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Select
            style={{
              width: "200px",
              height: "30px",
            }}
            options={statusOptions}
            onChange={onStatusChange}
            placeholder="Status"
            selectionIcon="checkmark"
            multiple={true}
            value={selectedStatuses}
          />
          <input
            type="text"
            className="border rounded px-2 py-1 text-sm"
            placeholder="Search"
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <button
            className={`bg-white border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100 ${!canExport ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => setShowCurrencyModal(true)}
            disabled={!canExport}
          >
            Export to CSV
          </button>
          <Select
            className="h-[29px]"
            contentClassName="w-54"
            options={batchOptions}
            onChange={(value) => handleBatchAction(value as string)}
            placeholder="Batch Action"
          />
          <div className="cursor-pointer">
            <Icon
              name="Settings"
              className="hover:text-blue-300"
              onClick={() => {
                console.log("Settings");
                if (!integrationsDoc) {
                  createIntegrationsDocument?.();
                } else {
                  setSelectedNode(integrationsDoc.id);
                }
              }}
            />
          </div>
        </div>
      </div>

      {showCurrencyModal && (
        <div className="fixed inset-0">
          <div className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow-lg p-6 min-w-[300px] flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Select Base Currency</h3>

            {/* Warning above the selector */}
            <p className="text-red-600 text-sm mb-2">
              Chosen currency should match the base currency of the accounting.
            </p>

            <select
              className="border border-gray-300 rounded px-2 py-1 mb-4"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              {currencyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                onClick={() => {
                  setShowCurrencyModal(false);
                  onExport?.(selectedCurrency);
                }}
              >
                Export
              </button>
              <button
                className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
                onClick={() => setShowCurrencyModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        open={showCurrencyModal}
        onCancel={() => setShowCurrencyModal(false)}
        onContinue={() => {
          setShowCurrencyModal(false);
          onExport?.(selectedCurrency);
        }}
        header="Select Base Currency"
        continueLabel="Export"
        cancelLabel="Cancel"
      >
        {/* Warning: Ensure the selected currency matches your system's base currency */}
        <p
          style={{
            color: "red",
            marginTop: "1rem",
            marginBottom: "1rem",
            fontWeight: 500,
          }}
        >
          ⚠ Warning: the chosen currency should match the base currency of the
          accounting system.
        </p>

        <Select
          options={currencyOptions}
          onChange={(value) => setSelectedCurrency(value as string)}
          placeholder="Select Base Currency"
        />
      </ConfirmationModal>

      <ConfirmationModal
        open={showExpenseReportCurrencyModal}
        onCancel={() => setShowExpenseReportCurrencyModal(false)}
        onContinue={() => {
          setShowExpenseReportCurrencyModal(false);
          onExpenseReportExport?.(selectedExpenseReportCurrency);
        }}
        header="Select Base Currency"
        continueLabel="Export"
        cancelLabel="Cancel"
      >
        {/* Warning: Ensure the selected currency matches your system's base currency */}
        <p
          style={{
            color: "red",
            marginTop: "1rem",
            marginBottom: "1rem",
            fontWeight: 500,
          }}
        >
          ⚠ Warning: the chosen currency should match the base currency of the
          accounting system.
        </p>

        <Select
          options={currencyOptions}
          onChange={(value) =>
            setSelectedExpenseReportCurrency(value as string)
          }
          placeholder="Select Base Currency"
          value={selectedExpenseReportCurrency}
          contentClassName="w-20"
        />
      </ConfirmationModal>
    </div>
  );
};
