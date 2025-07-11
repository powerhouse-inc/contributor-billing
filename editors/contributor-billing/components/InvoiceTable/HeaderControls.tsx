import { useState, useRef } from "react";
import { Input, Select } from "@powerhousedao/document-engineering";
import ConfirmationModal from "../../../invoice/components/confirmationModal.js";

const currencyOptions = [
  { label: "CHF", value: "CHF" },
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
  { label: "JPY", value: "JPY" },
];

export const HeaderControls = ({
  contributorOptions = [],
  statusOptions = [],
  onContributorChange,
  onStatusChange,
  onSearchChange,
  onExport,
  onBatchAction,
  selectedStatuses = [],
}: {
  contributorOptions?: { label: string; value: string }[];
  statusOptions?: { label: string; value: string }[];
  onContributorChange?: (value: string | string[]) => void;
  onStatusChange?: (value: string | string[]) => void;
  onSearchChange?: (value: string) => void;
  onExport?: (baseCurrency: string) => void;
  onBatchAction?: (action: string) => void;
  selectedStatuses?: string[];
}) => {
  const batchOptions = [
    { label: "$ Pay Selected", value: "pay" },
    { label: "Approve Selected", value: "approve" },
    { label: "Reject Selected", value: "reject" },
  ];

  // Only enable if all selected statuses are in the allowed set
  const allowedStatuses = [
    "ACCEPTED",
    "AWAITINGPAYMENT",
    "PAYMENTSCHEDULED",
    "PAYMENTSENT",
    "PAYMENTRECEIVED",
  ];
  const canExport =
    selectedStatuses.length > 0 &&
    selectedStatuses.every((status) => allowedStatuses.includes(status));

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("CHF");

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Powerhouse OH Admin Drive</h3>
        <div className="flex gap-2 items-center">
          <button
            className={`bg-white border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100 ${!canExport ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => setShowCurrencyModal(true)}
            disabled={!canExport}
          >
            Export to CSV
          </button>
          <Select
            style={{
              width: "180px",
              height: "30px",
            }}
            options={batchOptions}
            onChange={(value) => onBatchAction?.(value as string)}
            placeholder="Batch Action"
            selectionIcon="checkmark"
          />
        </div>
      </div>
      <div className="flex gap-2 items-center">
        {/* <Select
          options={contributorOptions}
          onChange={onContributorChange}
          placeholder="Contributor"
        /> */}
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
        />
        <input
          type="text"
          className="border rounded px-2 py-1 text-sm"
          placeholder="Search"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
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
        <Select
          options={currencyOptions}
          onChange={(value) => setSelectedCurrency(value as string)}
          placeholder="Select Base Currency"
        />
      </ConfirmationModal>
    </div>
  );
};
