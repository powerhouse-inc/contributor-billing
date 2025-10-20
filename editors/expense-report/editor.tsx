import { useState, useMemo, useEffect } from "react";
import { useSelectedExpenseReportDocument } from "../hooks/useExpenseReportDocument.js";
import { actions } from "../../document-models/expense-report/index.js";
import { DatePicker } from "@powerhousedao/document-engineering";
import { WalletsTable } from "./components/WalletsTable.js";
import { AggregatedExpensesTable } from "./components/AggregatedExpensesTable.js";
import { AddBillingStatementModal } from "./components/AddBillingStatementModal.js";
import { useWalletSync } from "./hooks/useWalletSync.js";
import { useSyncWallet } from "./hooks/useSyncWallet.js";

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

  // Check sync status
  const { needsSync, outdatedWallets, tagChangedWallets } = useWalletSync(wallets);
  const { syncWallet } = useSyncWallet();

  // Auto-sync on component mount
  useEffect(() => {
    if (needsSync && outdatedWallets.length > 0) {
      if (tagChangedWallets.length > 0) {
        console.warn("⚠️ Tag changes detected in wallets:", tagChangedWallets);
        console.log("Auto-syncing wallets with tag changes:", outdatedWallets);
      } else {
        console.log("Auto-syncing wallets:", outdatedWallets);
      }

      // Sync each outdated wallet
      outdatedWallets.forEach((walletAddress) => {
        const wallet = wallets.find((w) => w.wallet === walletAddress);
        if (!wallet || !wallet.billingStatements || wallet.billingStatements.length === 0) {
          return;
        }

        // Remove all existing line items first
        const lineItemsToRemove = [...(wallet.lineItems || [])];
        lineItemsToRemove.forEach((item) => {
          if (item?.id) {
            dispatch(
              actions.removeLineItem({
                wallet: wallet.wallet!,
                lineItemId: item.id,
              })
            );
          }
        });

        // Re-extract line items from billing statements
        const billingStatementIds = wallet.billingStatements.filter((id): id is string => id !== null && id !== undefined);
        syncWallet(wallet.wallet!, billingStatementIds, groups, dispatch);
      });
    }
  }, [needsSync, outdatedWallets, wallets, groups, dispatch, syncWallet]);

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
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-8">
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
