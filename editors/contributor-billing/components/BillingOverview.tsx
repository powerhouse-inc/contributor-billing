import { Calendar, Plus } from "lucide-react";
import {
  useBillingFolderStructure,
  formatMonthName,
} from "../hooks/useBillingFolderStructure.js";
import { useDocumentsInSelectedDrive } from "@powerhousedao/reactor-browser";
import { useState, useMemo } from "react";

/**
 * Overview for the Billing folder showing all months
 */
export function BillingOverview() {
  const { monthFolders, createMonthFolder } = useBillingFolderStructure();
  const [isCreating, setIsCreating] = useState(false);
  const documentsInDrive = useDocumentsInSelectedDrive();

  // Get report counts and statuses
  const reportStats = useMemo(() => {
    if (!documentsInDrive)
      return { expenseCount: 0, snapshotCount: 0, expenseStatus: null };
    const expenseReports = documentsInDrive.filter(
      (doc) => doc.header.documentType === "powerhouse/expense-report",
    );
    const snapshotReports = documentsInDrive.filter(
      (doc) => doc.header.documentType === "powerhouse/snapshot-report",
    );
    // Get status from first expense report if any
    const firstExpense = expenseReports[0];
    const expenseStatus = firstExpense
      ? (firstExpense.state as { global?: { status?: string } }).global?.status
      : null;
    return {
      expenseCount: expenseReports.length,
      snapshotCount: snapshotReports.length,
      expenseStatus,
    };
  }, [documentsInDrive]);

  // Sort months by date (most recent first)
  const sortedMonths = Array.from(monthFolders.entries()).sort(
    ([nameA], [nameB]) => {
      const dateA = new Date(nameA);
      const dateB = new Date(nameB);
      return dateB.getTime() - dateA.getTime();
    },
  );

  const handleAddMonth = async () => {
    // Generate next month that doesn't exist
    const existingMonths = new Set(monthFolders.keys());
    const today = new Date();

    // Try current month first, then go backwards
    for (let i = 0; i < 24; i++) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = formatMonthName(targetDate);
      if (!existingMonths.has(monthName)) {
        setIsCreating(true);
        try {
          await createMonthFolder(monthName);
        } finally {
          setIsCreating(false);
        }
        return;
      }
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600">
            Manage monthly billing, payments, and reports
          </p>
        </div>
        <button
          onClick={() => void handleAddMonth()}
          disabled={isCreating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          {isCreating ? "Creating..." : "Add Month"}
        </button>
      </div>

      {sortedMonths.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            No months yet
          </h2>
          <p className="text-gray-600 mb-4">
            Click &quot;Add Month&quot; to create your first billing month
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedMonths.map(([monthName, info]) => (
            <div
              key={info.folder.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {monthName}
                </h2>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Expense Reports</span>
                  <span
                    className={
                      reportStats.expenseCount > 0
                        ? "text-blue-600"
                        : "text-gray-400"
                    }
                  >
                    {reportStats.expenseCount > 0
                      ? `${reportStats.expenseCount} (${reportStats.expenseStatus || "DRAFT"})`
                      : "None"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Snapshot Reports</span>
                  <span
                    className={
                      reportStats.snapshotCount > 0
                        ? "text-blue-600"
                        : "text-gray-400"
                    }
                  >
                    {reportStats.snapshotCount > 0
                      ? reportStats.snapshotCount
                      : "None"}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Click on this month in the sidebar to view details
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
