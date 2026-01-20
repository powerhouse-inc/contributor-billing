import { Calendar, Plus, ChevronDown, Building2 } from "lucide-react";
import {
  useBillingFolderStructure,
  formatMonthName,
} from "../hooks/useBillingFolderStructure.js";
import {
  useDocumentsInSelectedDrive,
  setSelectedNode,
} from "@powerhousedao/reactor-browser";
import { useState, useMemo, useRef, useEffect } from "react";
import type { SelectedFolderInfo } from "./FolderTree.js";

interface BillingOverviewProps {
  onFolderSelect?: (folderInfo: SelectedFolderInfo | null) => void;
}

/**
 * Overview for the Billing folder showing all months
 */
export function BillingOverview({ onFolderSelect }: BillingOverviewProps) {
  const {
    billingFolder,
    monthFolders,
    createMonthFolder,
    createBillingFolder,
  } = useBillingFolderStructure();
  const [isCreating, setIsCreating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const documentsInDrive = useDocumentsInSelectedDrive();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get all months from January 2025 to next month, with exists flag
  const allMonths = useMemo(() => {
    const months: Array<{ name: string; exists: boolean }> = [];
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const startDate = new Date(2025, 0, 1);

    const currentDate = new Date(endDate);
    while (currentDate >= startDate) {
      const monthName = formatMonthName(currentDate);
      months.push({
        name: monthName,
        exists: monthFolders.has(monthName),
      });
      currentDate.setMonth(currentDate.getMonth() - 1);
    }
    return months;
  }, [monthFolders]);

  // Pre-compute report stats for all months at once (memoized)
  const monthStats = useMemo(() => {
    const stats = new Map<
      string,
      {
        hasExpense: boolean;
        hasSnapshot: boolean;
        expenseStatus: string | null;
      }
    >();
    if (!documentsInDrive) return stats;

    for (const [monthName] of monthFolders.entries()) {
      const monthLower = monthName.toLowerCase();

      const expenseReport = documentsInDrive.find(
        (doc) =>
          doc.header.documentType === "powerhouse/expense-report" &&
          doc.header.name?.toLowerCase().includes(monthLower),
      );
      const snapshotReport = documentsInDrive.find(
        (doc) =>
          doc.header.documentType === "powerhouse/snapshot-report" &&
          doc.header.name?.toLowerCase().includes(monthLower),
      );

      const expenseStatus = expenseReport
        ? (expenseReport.state as { global?: { status?: string } }).global
            ?.status || "DRAFT"
        : null;

      stats.set(monthName, {
        hasExpense: !!expenseReport,
        hasSnapshot: !!snapshotReport,
        expenseStatus,
      });
    }
    return stats;
  }, [documentsInDrive, monthFolders]);

  // Sort months by date (most recent first)
  const sortedMonths = Array.from(monthFolders.entries()).sort(
    ([nameA], [nameB]) => {
      const dateA = new Date(nameA);
      const dateB = new Date(nameB);
      return dateB.getTime() - dateA.getTime();
    },
  );

  const handleCreateMonth = async (monthName: string) => {
    setIsCreating(true);
    try {
      await createMonthFolder(monthName);
      setIsDropdownOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSetupBilling = async () => {
    setIsCreating(true);
    try {
      await createBillingFolder();
    } finally {
      setIsCreating(false);
    }
  };

  // Show setup prompt if Billing folder doesn't exist
  if (!billingFolder) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600">
            Manage monthly billing, payments, and reports
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Building2 className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Set up Billing
          </h2>
          <p className="text-gray-600 mb-4">
            Create the Billing folder to start managing monthly billing cycles
          </p>
          <button
            onClick={() => void handleSetupBilling()}
            disabled={isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating..." : "Set up Billing"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600">
            Manage monthly billing, payments, and reports
          </p>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={isCreating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            {isCreating ? "Creating..." : "Add Month"}
            <ChevronDown className="w-4 h-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                Select a month to add
              </div>
              <div className="max-h-72 overflow-y-auto">
                {allMonths.map(({ name, exists }) => (
                  <button
                    key={name}
                    onClick={() => void handleCreateMonth(name)}
                    disabled={isCreating || exists}
                    className={`w-full px-3 py-2 text-left text-sm ${
                      exists
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-50"
                    } disabled:cursor-not-allowed`}
                  >
                    {name}
                    {exists && (
                      <span className="ml-2 text-xs text-gray-400">
                        (exists)
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
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
          {sortedMonths.map(([monthName, info]) => {
            const stats = monthStats.get(monthName) || {
              hasExpense: false,
              hasSnapshot: false,
              expenseStatus: null,
            };
            const handleMonthClick = () => {
              setSelectedNode(info.folder.id);
              onFolderSelect?.({
                folderId: info.folder.id,
                folderType: "month",
                monthName,
              });
            };
            return (
              <button
                key={info.folder.id}
                onClick={handleMonthClick}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all text-left cursor-pointer"
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
                    <span>Expense Report</span>
                    <span
                      className={
                        stats.hasExpense ? "text-blue-600" : "text-gray-400"
                      }
                    >
                      {stats.hasExpense ? stats.expenseStatus : "None"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Snapshot Report</span>
                    <span
                      className={
                        stats.hasSnapshot ? "text-blue-600" : "text-gray-400"
                      }
                    >
                      {stats.hasSnapshot ? "Yes" : "None"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
