import { useState, useMemo, useEffect } from "react";
import { useSelectedExpenseReportDocument } from "../../document-models/expense-report/hooks.js";
import { actions } from "../../document-models/expense-report/index.js";
import { Icon, Button, Select } from "@powerhousedao/document-engineering";
import { WalletsTable } from "./components/WalletsTable.js";
import { AggregatedExpensesTable } from "./components/AggregatedExpensesTable.js";
import { AddBillingStatementModal } from "./components/AddBillingStatementModal.js";
import { ExpenseReportPDF } from "./components/ExpenseReportPDF.js";
import { pdf } from "@react-pdf/renderer";
import { DocumentToolbar } from "@powerhousedao/design-system/connect";
import {
  setSelectedNode,
  useParentFolderForSelectedNode,
} from "@powerhousedao/reactor-browser";
import { useSyncWallet } from "./hooks/useSyncWallet.js";
import { RefreshCw } from "lucide-react";

// Helper function to generate month options from January 2025 to current month
function generateMonthOptions() {
  const options: Array<{ label: string; value: string }> = [];
  const startDate = new Date(2025, 0, 1); // January 2025
  const currentDate = new Date();

  const date = new Date(startDate);

  while (date <= currentDate) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = date.toLocaleDateString("en-US", { month: "long" });
    const label = `${monthName} ${year}`;

    // Value format: YYYY-MM (e.g., "2025-01")
    const value = `${year}-${String(month + 1).padStart(2, "0")}`;

    options.push({ label, value });

    // Move to next month
    date.setMonth(date.getMonth() + 1);
  }

  // Reverse to show most recent first
  return options.reverse();
}

// Helper function to get start and end dates for a given month
function getMonthDateRange(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);

  // First day of month at 00:00:00 UTC
  const periodStart = new Date(
    Date.UTC(year, month - 1, 1, 0, 0, 0, 0),
  ).toISOString();

  // Last day of month at 23:59:59.999 UTC
  // Get the last day by using day 0 of the next month
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const periodEnd = new Date(
    Date.UTC(year, month - 1, lastDay, 23, 59, 59, 999),
  ).toISOString();

  return { periodStart, periodEnd };
}

export default function Editor() {
  const [document, dispatch] = useSelectedExpenseReportDocument();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [periodStart, setPeriodStart] = useState<string>(
    document?.state.global.periodStart || ""
  );
  const [periodEnd, setPeriodEnd] = useState<string>(
    document?.state.global.periodEnd || ""
  );
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    document?.state.global.periodStart || ""
  );
  const [isPeriodChanged, setIsPeriodChanged] = useState(false);
  const [isEditingPeriod, setIsEditingPeriod] = useState(false);
  const [periodDisplayLabel, setPeriodDisplayLabel] = useState<string>(
    document?.state.global.periodStart || ""
  );

  const { wallets = [], groups = [] } = document?.state.global || {};
  const { syncWallet } = useSyncWallet();

  // Handle wallet selection for adding billing statements
  const handleAddBillingStatement = (walletAddress: string) => {
    setSelectedWallet(walletAddress);
    setIsModalOpen(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWallet(null);
  };

  // Handle sync all wallets
  const handleSyncAllWallets = () => {
    if (!periodStart || !periodEnd) {
      alert(
        "Please set the period start and end dates before syncing wallet transactions.",
      );
      return;
    }

    setIsSyncingAll(true);

    // Sync all wallets that have either billing statements or transactions
    wallets?.forEach((wallet) => {
      if (
        wallet.wallet &&
        ((wallet.billingStatements && wallet.billingStatements.length > 0) ||
          wallet.accountTransactionsDocumentId)
      ) {
        syncWallet(
          wallet.wallet,
          (wallet.lineItems || []).filter((item) => item !== null),
          (wallet.billingStatements || []).filter((id) => id !== null),
          groups,
          wallets,
          wallet.accountTransactionsDocumentId,
          periodStart,
          periodEnd,
          dispatch,
        );
      }
    });

    setIsSyncingAll(false);
  };

  // Handle PDF export
  const handleExportPDF = async () => {
    try {
      const blob = await pdf(
        <ExpenseReportPDF
          periodStart={periodStart}
          periodEnd={periodEnd}
          wallets={wallets}
          groups={groups}
        />
      ).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;

      // Generate filename with period
      const filename = periodStart
        ? `expense-report-${new Date(periodStart).toISOString().split("T")[0]}.pdf`
        : "expense-report.pdf";

      link.download = filename;
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Format period title for the breakdown section
  const breakdownTitle = useMemo(() => {
    if (!periodStart) return "Breakdown";

    const date = new Date(periodStart);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${month} ${year} Breakdown`;
  }, [periodStart]);

  // Get the parent folder node for the currently selected node
  const parentFolder = useParentFolderForSelectedNode();
  // Set the selected node to the parent folder node (close the editor)
  function handleClose() {
    setSelectedNode(parentFolder?.id);
  }

  return (
    <div>
      <DocumentToolbar document={document} onClose={handleClose} />
      <div className="ph-default-styles flex flex-col h-full w-full bg-gray-50 dark:bg-gray-900">
        {/* Main Content */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-6">
                <div className="relative">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      Expense Report
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Period:</span>
                        {isEditingPeriod ? (
                          <>
                            <Select
                              options={generateMonthOptions()}
                              value={selectedPeriod}
                              onChange={(value) =>
                                setSelectedPeriod(value as string)
                              }
                              className="min-w-[200px]"
                            />
                            {isPeriodChanged && (
                              <Button
                                variant="default"
                                onClick={() => {
                                  setIsEditingPeriod(false);
                                  setIsPeriodChanged(false);
                                  setPeriodDisplayLabel(selectedPeriod);
                                }}
                                className="text-sm"
                              >
                                Set Period
                              </Button>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {periodDisplayLabel}
                            </span>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setIsEditingPeriod(true);
                                setIsPeriodChanged(false);
                                setPeriodDisplayLabel(selectedPeriod);
                              }}
                              className="text-sm"
                            >
                              Change
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleExportPDF}
                    className="absolute top-0 right-0 flex items-center gap-2"
                  >
                    <Icon name="ExportPdf" size={18} />
                    Export to PDF
                  </Button>
                </div>
              </div>
            </section>

            {/* Wallets Section */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Wallets
                </h2>
                <Button
                  variant="ghost"
                  onClick={handleSyncAllWallets}
                  disabled={isSyncingAll}
                  className="flex items-center gap-2"
                >
                  <RefreshCw
                    size={16}
                    className={isSyncingAll ? "animate-spin" : ""}
                  />
                  <span>{isSyncingAll ? "Syncing..." : "Sync All"}</span>
                </Button>
              </div>
              <div className="p-6">
                <WalletsTable
                  wallets={wallets || []}
                  groups={groups || []}
                  onAddBillingStatement={handleAddBillingStatement}
                  periodStart={periodStart}
                  periodEnd={periodEnd}
                  dispatch={dispatch}
                />
              </div>
            </section>

            {/* Aggregated Expenses Section */}
            {wallets && wallets.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {breakdownTitle}
                  </h2>
                </div>
                <div className="p-6">
                  <AggregatedExpensesTable
                    wallets={wallets}
                    groups={groups || []}
                    periodStart={periodStart}
                    periodEnd={periodEnd}
                    dispatch={dispatch || (() => {})}
                  />
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Add Billing Statement Modal */}
        {isModalOpen && selectedWallet && (
          <AddBillingStatementModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            walletAddress={selectedWallet}
            dispatch={dispatch}
            groups={groups || []}
          />
        )}
      </div>
    </div>
  );
}
