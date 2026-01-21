import {
  Plus,
  ChevronDown,
  Building2,
  CreditCard,
  FileText,
} from "lucide-react";
import {
  useBillingFolderStructure,
  formatMonthName,
} from "../hooks/useBillingFolderStructure.js";
import {
  useDocumentsInSelectedDrive,
  useSelectedDrive,
  isFileNodeKind,
} from "@powerhousedao/reactor-browser";
import { useState, useMemo, useRef, useEffect } from "react";
import { MonthlyReporting } from "./MonthlyReporting.js";
import type { SelectedFolderInfo } from "./FolderTree.js";

interface BillingOverviewProps {
  onFolderSelect?: (folderInfo: SelectedFolderInfo | null) => void;
}

/**
 * Overview for the Billing folder showing payment stats and monthly reporting
 */
export function BillingOverview({ onFolderSelect }: BillingOverviewProps) {
  const {
    billingFolder,
    monthFolders,
    createMonthFolder,
    createBillingFolder,
    paymentsFolderIds,
  } = useBillingFolderStructure();
  const [isCreating, setIsCreating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const documentsInDrive = useDocumentsInSelectedDrive();
  const [driveDocument] = useSelectedDrive();

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

  // Calculate payment stats across all months
  const paymentStats = useMemo(() => {
    if (!documentsInDrive || !driveDocument) {
      return {
        totalInvoices: 0,
        totalAmount: 0,
        pendingCount: 0,
        paidCount: 0,
      };
    }

    const nodes = driveDocument.state.global.nodes;

    // Get all invoice file IDs that are in any payments folder
    const invoiceIds = new Set(
      nodes
        .filter(
          (n) =>
            isFileNodeKind(n) &&
            paymentsFolderIds.has(n.parentFolder || "") &&
            n.documentType === "powerhouse/invoice",
        )
        .map((n) => n.id),
    );

    // Filter invoices in payments folders
    const invoices = documentsInDrive.filter(
      (doc) =>
        doc.header.documentType === "powerhouse/invoice" &&
        invoiceIds.has(doc.header.id),
    );

    let totalAmount = 0;
    let pendingCount = 0;
    let paidCount = 0;

    for (const invoice of invoices) {
      const state = invoice.state as {
        global?: { totalPriceTaxIncl?: number; status?: string };
      };
      totalAmount += state.global?.totalPriceTaxIncl || 0;

      const status = state.global?.status?.toUpperCase() || "DRAFT";
      if (
        status === "PAYMENTSENT" ||
        status === "PAYMENTRECEIVED" ||
        status === "PAYMENTCLOSED"
      ) {
        paidCount++;
      } else if (status !== "REJECTED" && status !== "CANCELLED") {
        pendingCount++;
      }
    }

    return {
      totalInvoices: invoices.length,
      totalAmount,
      pendingCount,
      paidCount,
    };
  }, [documentsInDrive, driveDocument, paymentsFolderIds]);

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
      {/* Header with Add Month button */}
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

      {/* Payment Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Summary
            </h2>
            <p className="text-sm text-gray-600">
              Overview of all invoices across billing months
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Total Invoices</span>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {paymentStats.totalInvoices}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Total Amount</span>
            </div>
            <p className="text-xl font-bold text-gray-900">
              $
              {paymentStats.totalAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3">
            <span className="text-sm text-amber-600">Pending</span>
            <p className="text-xl font-bold text-amber-700">
              {paymentStats.pendingCount}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <span className="text-sm text-green-600">Paid</span>
            <p className="text-xl font-bold text-green-700">
              {paymentStats.paidCount}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Reporting */}
      <MonthlyReporting onFolderSelect={onFolderSelect} showAllMonths />
    </div>
  );
}
