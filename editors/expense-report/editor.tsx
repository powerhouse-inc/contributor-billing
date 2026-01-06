import { useState, useMemo } from "react";
import { useSelectedExpenseReportDocument } from "../hooks/useExpenseReportDocument.js";
import { actions } from "../../document-models/expense-report/index.js";
import { DatePicker, Icon, Button } from "@powerhousedao/document-engineering";
import { WalletsTable } from "./components/WalletsTable.js";
import { AggregatedExpensesTable } from "./components/AggregatedExpensesTable.js";
import { AddBillingStatementModal } from "./components/AddBillingStatementModal.js";
import { ExpenseReportPDF } from "./components/ExpenseReportPDF.js";
import { ExpenseReportTransactionsTable } from "./components/ExpenseReportTransactionsTable.js";
import type { TransactionEntry } from "../../document-models/account-transactions/gen/types.js";
import { pdf } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import { DocumentToolbar } from "@powerhousedao/design-system/connect";
import {
  setSelectedNode,
  useParentFolderForSelectedNode,
  useDocumentsInSelectedDrive,
} from "@powerhousedao/reactor-browser";

export default function Editor() {
  const [document, dispatch] = useSelectedExpenseReportDocument();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [periodStart, setPeriodStart] = useState<string>(
    document.state.global.periodStart || "",
  );
  const [periodEnd, setPeriodEnd] = useState<string>(
    document.state.global.periodEnd || "",
  );

  const { wallets, groups } = document.state.global;
  const documentsInDrive = useDocumentsInSelectedDrive();

  const transactionsByWallet = useMemo(() => {
    if (!documentsInDrive) return [];

    const start = periodStart ? new Date(periodStart) : null;
    const end = periodEnd ? new Date(periodEnd) : null;

    // Create a set of all wallet addresses in the expense report for intergroup detection
    const walletAddresses = new Set(wallets.map((w) => w.wallet.toLowerCase()));

    return wallets.flatMap((wallet) => {
      const txDocId = (wallet as any).accountTransactionsDocumentId;
      if (!txDocId) return [];

      const txDoc = documentsInDrive.find(
        (doc) =>
          doc.header.id === txDocId &&
          doc.header.documentType === "powerhouse/account-transactions",
      ) as any;

      const txs: TransactionEntry[] = txDoc?.state?.global?.transactions || [];
      return txs
        .filter((tx: TransactionEntry) => {
          if (!tx?.datetime) return false;
          const dt = new Date(tx.datetime);
          if (Number.isNaN(dt.getTime())) return false;
          if (start && dt < start) return false;
          if (end && dt > end) return false;
          return true;
        })
        .map((tx: TransactionEntry) => {
          // Check if counterParty is another wallet in the expense report
          const isIntergroup = tx.counterParty
            ? walletAddresses.has(tx.counterParty.toLowerCase())
            : false;

          return {
            walletName: wallet.name || wallet.wallet,
            walletAddress: wallet.wallet,
            transaction: tx,
            isIntergroup,
          };
        });
    });
  }, [documentsInDrive, wallets, periodStart, periodEnd]);

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

  // Handle PDF export
  const handleExportPDF = async () => {
    try {
      const blob = await pdf(
        <ExpenseReportPDF
          periodStart={periodStart}
          periodEnd={periodEnd}
          wallets={wallets}
          groups={groups}
        />,
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
                        <DatePicker
                          name="periodStart"
                          value={periodStart}
                          onChange={handlePeriodStartChange}
                          className="bg-white"
                        />
                        <span>to</span>
                        <DatePicker
                          name="periodEnd"
                          value={periodEnd}
                          onChange={handlePeriodEndChange}
                          className="bg-white"
                        />
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
                  periodStart={periodStart}
                  periodEnd={periodEnd}
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

            {/* Live PDF Preview */}
            {/* <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="text-lg font-semibold">PDF Preview</h3>
            </div>
            <div style={{ height: "1000px" }}>
              <PDFViewer width="100%" height="100%">
                <ExpenseReportPDF
                  periodStart={periodStart}
                  periodEnd={periodEnd}
                  wallets={wallets}
                  groups={groups}
                />
              </PDFViewer>
            </div>
          </div> */}
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

        {/* Transactions Section */}
        {transactionsByWallet.length > 0 && (
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Transactions ({transactionsByWallet.length})
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Filtered by selected period
              </span>
            </div>
            <div className="p-6">
              <ExpenseReportTransactionsTable
                transactions={transactionsByWallet}
                wallets={wallets}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
