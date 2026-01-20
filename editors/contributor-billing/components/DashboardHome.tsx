import {
  Wallet,
  FileText,
  Camera,
  CheckCircle2,
  Circle,
  ArrowRight,
  Building2,
  Calendar,
} from "lucide-react";
import { useMemo } from "react";
import {
  useDocumentsInSelectedDrive,
  setSelectedNode,
  showCreateDocumentModal,
} from "@powerhousedao/reactor-browser";
import {
  useBillingFolderStructure,
  formatMonthName,
} from "../hooks/useBillingFolderStructure.js";
import type { SelectedFolderInfo } from "./FolderTree.js";

interface DashboardHomeProps {
  onFolderSelect?: (folderInfo: SelectedFolderInfo | null) => void;
}

/**
 * Get color classes for report status badge
 */
function getStatusColors(status: string | null): {
  bg: string;
  text: string;
} {
  const statusLower = status?.toLowerCase() || "draft";

  switch (statusLower) {
    case "final":
    case "approved":
    case "completed":
      return { bg: "bg-green-100", text: "text-green-700" };
    case "submitted":
    case "review":
    case "in_review":
      return { bg: "bg-blue-100", text: "text-blue-700" };
    case "rejected":
    case "cancelled":
      return { bg: "bg-red-100", text: "text-red-700" };
    case "draft":
    default:
      return { bg: "bg-amber-100", text: "text-amber-700" };
  }
}

/**
 * Dashboard home page for the Operational Hub
 * Shows setup status and guides users through important actions
 */
export function DashboardHome({ onFolderSelect }: DashboardHomeProps) {
  const documentsInDrive = useDocumentsInSelectedDrive();
  const { billingFolder, monthFolders } = useBillingFolderStructure();

  // Check if accounts document exists
  const accountsDocument = useMemo(() => {
    if (!documentsInDrive) return null;
    return documentsInDrive.find(
      (doc) => doc.header.documentType === "powerhouse/accounts",
    );
  }, [documentsInDrive]);

  // Get current and prior month names
  const { currentMonth, priorMonth } = useMemo(() => {
    const now = new Date();
    const current = formatMonthName(now);
    const prior = formatMonthName(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
    );
    return { currentMonth: current, priorMonth: prior };
  }, []);

  // Check reporting status for current and prior months
  const reportingStatus = useMemo(() => {
    type ReportInfo = {
      exists: boolean;
      status: string | null;
      colors: { bg: string; text: string };
    };
    const emptyColors = { bg: "bg-gray-100", text: "text-gray-500" };
    const emptyReport: ReportInfo = {
      exists: false,
      status: null,
      colors: emptyColors,
    };

    if (!documentsInDrive) {
      return {
        currentExpense: emptyReport,
        currentSnapshot: emptyReport,
        priorExpense: emptyReport,
        priorSnapshot: emptyReport,
      };
    }

    const currentLower = currentMonth.toLowerCase();
    const priorLower = priorMonth.toLowerCase();

    const getReportInfo = (month: string, type: string): ReportInfo => {
      const doc = documentsInDrive.find(
        (d) =>
          d.header.documentType === type &&
          d.header.name?.toLowerCase().includes(month),
      );
      if (!doc) return emptyReport;

      // Extract status from document state
      const status =
        (doc.state as { global?: { status?: string } })?.global?.status ||
        "Draft";
      return { exists: true, status, colors: getStatusColors(status) };
    };

    return {
      currentExpense: getReportInfo(currentLower, "powerhouse/expense-report"),
      currentSnapshot: getReportInfo(
        currentLower,
        "powerhouse/snapshot-report",
      ),
      priorExpense: getReportInfo(priorLower, "powerhouse/expense-report"),
      priorSnapshot: getReportInfo(priorLower, "powerhouse/snapshot-report"),
    };
  }, [documentsInDrive, currentMonth, priorMonth]);

  // Calculate setup progress
  const setupProgress = useMemo(() => {
    const steps = [
      { done: !!accountsDocument, label: "Accounts configured" },
      { done: !!billingFolder, label: "Billing folder created" },
      { done: monthFolders.size > 0, label: "Billing months created" },
    ];
    const completed = steps.filter((s) => s.done).length;
    return { steps, completed, total: steps.length };
  }, [accountsDocument, billingFolder, monthFolders]);

  const handleOpenAccounts = () => {
    if (accountsDocument) {
      setSelectedNode(accountsDocument.header.id);
    } else {
      showCreateDocumentModal("powerhouse/accounts");
    }
  };

  const handleOpenBilling = () => {
    if (billingFolder) {
      onFolderSelect?.({
        folderId: billingFolder.id,
        folderType: "billing",
      });
    }
  };

  const handleOpenMonth = (monthName: string) => {
    const monthInfo = monthFolders.get(monthName);
    if (monthInfo?.reportingFolder) {
      setSelectedNode(monthInfo.reportingFolder.id);
      onFolderSelect?.({
        folderId: monthInfo.reportingFolder.id,
        folderType: "reporting",
        monthName,
      });
    }
  };

  const isSetupComplete = setupProgress.completed === setupProgress.total;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Operational Hub</h1>
        <p className="text-gray-600 mt-1">
          Manage accounts, billing, and financial reporting
        </p>
      </div>

      {/* Setup Progress - Only show if not complete */}
      {!isSetupComplete && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Getting Started
              </h2>
              <p className="text-sm text-gray-600">
                Complete these steps to set up your operational hub
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {setupProgress.steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                {step.done ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
                <span
                  className={
                    step.done ? "text-gray-500 line-through" : "text-gray-900"
                  }
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Accounts Card */}
        <button
          onClick={handleOpenAccounts}
          className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-lg ${accountsDocument ? "bg-green-100" : "bg-amber-100"}`}
              >
                <Wallet
                  className={`w-5 h-5 ${accountsDocument ? "text-green-600" : "text-amber-600"}`}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Accounts</h3>
                <p className="text-sm text-gray-500">
                  {accountsDocument
                    ? "View and manage accounts"
                    : "Set up your accounts first"}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
          {!accountsDocument && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                Action Required
              </span>
            </div>
          )}
        </button>

        {/* Billing Card */}
        <button
          onClick={handleOpenBilling}
          className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Billing</h3>
                <p className="text-sm text-gray-500">
                  {monthFolders.size > 0
                    ? `${monthFolders.size} month${monthFolders.size > 1 ? "s" : ""} configured`
                    : "Manage monthly billing cycles"}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </button>
      </div>

      {/* Reporting Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Monthly Reporting
            </h2>
            <p className="text-sm text-gray-600">
              Track expense and snapshot reports for each period
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Current Month */}
          <div className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">{currentMonth}</h3>
              {monthFolders.has(currentMonth) ? (
                <button
                  onClick={() => handleOpenMonth(currentMonth)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Open Reporting
                </button>
              ) : (
                <span className="text-xs text-gray-400">Month not created</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`flex items-center gap-2 p-2 rounded ${reportingStatus.currentExpense.exists ? "bg-blue-50" : "bg-gray-50"}`}
              >
                <FileText
                  className={`w-4 h-4 ${reportingStatus.currentExpense.exists ? "text-blue-600" : "text-gray-400"}`}
                />
                <span
                  className={`text-sm ${reportingStatus.currentExpense.exists ? "text-blue-700" : "text-gray-500"}`}
                >
                  Expense Report
                </span>
                {reportingStatus.currentExpense.exists && (
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ml-auto ${reportingStatus.currentExpense.colors.bg} ${reportingStatus.currentExpense.colors.text}`}
                  >
                    {reportingStatus.currentExpense.status}
                  </span>
                )}
              </div>
              <div
                className={`flex items-center gap-2 p-2 rounded ${reportingStatus.currentSnapshot.exists ? "bg-purple-50" : "bg-gray-50"}`}
              >
                <Camera
                  className={`w-4 h-4 ${reportingStatus.currentSnapshot.exists ? "text-purple-600" : "text-gray-400"}`}
                />
                <span
                  className={`text-sm ${reportingStatus.currentSnapshot.exists ? "text-purple-700" : "text-gray-500"}`}
                >
                  Snapshot Report
                </span>
                {reportingStatus.currentSnapshot.exists && (
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ml-auto ${reportingStatus.currentSnapshot.colors.bg} ${reportingStatus.currentSnapshot.colors.text}`}
                  >
                    {reportingStatus.currentSnapshot.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Prior Month */}
          <div className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">{priorMonth}</h3>
              {monthFolders.has(priorMonth) ? (
                <button
                  onClick={() => handleOpenMonth(priorMonth)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Open Reporting
                </button>
              ) : (
                <span className="text-xs text-gray-400">Month not created</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`flex items-center gap-2 p-2 rounded ${reportingStatus.priorExpense.exists ? "bg-blue-50" : "bg-gray-50"}`}
              >
                <FileText
                  className={`w-4 h-4 ${reportingStatus.priorExpense.exists ? "text-blue-600" : "text-gray-400"}`}
                />
                <span
                  className={`text-sm ${reportingStatus.priorExpense.exists ? "text-blue-700" : "text-gray-500"}`}
                >
                  Expense Report
                </span>
                {reportingStatus.priorExpense.exists && (
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ml-auto ${reportingStatus.priorExpense.colors.bg} ${reportingStatus.priorExpense.colors.text}`}
                  >
                    {reportingStatus.priorExpense.status}
                  </span>
                )}
              </div>
              <div
                className={`flex items-center gap-2 p-2 rounded ${reportingStatus.priorSnapshot.exists ? "bg-purple-50" : "bg-gray-50"}`}
              >
                <Camera
                  className={`w-4 h-4 ${reportingStatus.priorSnapshot.exists ? "text-purple-600" : "text-gray-400"}`}
                />
                <span
                  className={`text-sm ${reportingStatus.priorSnapshot.exists ? "text-purple-700" : "text-gray-500"}`}
                >
                  Snapshot Report
                </span>
                {reportingStatus.priorSnapshot.exists && (
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ml-auto ${reportingStatus.priorSnapshot.colors.bg} ${reportingStatus.priorSnapshot.colors.text}`}
                  >
                    {reportingStatus.priorSnapshot.status}
                  </span>
                )}
              </div>
            </div>
            {!reportingStatus.priorExpense.exists &&
              !reportingStatus.priorSnapshot.exists && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    Reports pending for {priorMonth}
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
