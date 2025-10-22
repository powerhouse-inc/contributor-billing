import { useState, useMemo } from "react";
import { useSelectedExpenseReportDocument } from "../hooks/useExpenseReportDocument.js";
import { actions } from "../../document-models/expense-report/index.js";
import { DatePicker, Icon, Button } from "@powerhousedao/document-engineering";
import { WalletsTable } from "./components/WalletsTable.js";
import { AggregatedExpensesTable } from "./components/AggregatedExpensesTable.js";
import { AddBillingStatementModal } from "./components/AddBillingStatementModal.js";

export function Editor() {
  const [document, dispatch] = useSelectedExpenseReportDocument();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [periodStart, setPeriodStart] = useState<string>(
    document.state.global.periodStart || ""
  );
  const [periodEnd, setPeriodEnd] = useState<string>(
    document.state.global.periodEnd || ""
  );

  const { wallets, groups } = document.state.global;

  // Handle period date changes
  const handlePeriodStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPeriodStart(value);
    if (value) {
      dispatch(actions.setPeriodStart({ periodStart: value }));
    }
  };

  const handlePeriodEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPeriodEnd(value);
    if (value) {
      dispatch(actions.setPeriodEnd({ periodEnd: value }));
    }
  };

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

  // Format period title for the breakdown section
  const breakdownTitle = useMemo(() => {
    if (!periodStart) return "Breakdown";

    const date = new Date(periodStart);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${month} ${year} Breakdown`;
  }, [periodStart]);

  return (
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
                      <DatePicker
                        name="periodStart"
                        value={periodStart}
                        onChange={handlePeriodStartChange}
                      />
                      <span>to</span>
                      <DatePicker
                        name="periodEnd"
                        value={periodEnd}
                        onChange={handlePeriodEndChange}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    // TODO: Implement PDF export functionality
                    console.log("Export to PDF clicked");
                  }}
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
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Wallets
              </h2>
            </div>
            <div className="p-6">
              <WalletsTable
                wallets={wallets}
                groups={groups}
                onAddBillingStatement={handleAddBillingStatement}
                dispatch={dispatch}
              />
            </div>
          </section>

          {/* Aggregated Expenses Section */}
          {wallets.length > 0 && (
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {breakdownTitle}
                </h2>
              </div>
              <div className="p-6">
                <AggregatedExpensesTable
                  wallets={wallets}
                  groups={groups}
                  periodStart={periodStart}
                  periodEnd={periodEnd}
                  dispatch={dispatch}
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
          groups={groups}
        />
      )}
    </div>
  );
}
