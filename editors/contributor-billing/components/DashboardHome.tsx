import {
  Wallet,
  CheckCircle2,
  Circle,
  ArrowRight,
  Building2,
} from "lucide-react";
import { useMemo } from "react";
import {
  useDocumentsInSelectedDrive,
  setSelectedNode,
  showCreateDocumentModal,
} from "@powerhousedao/reactor-browser";
import { useBillingFolderStructure } from "../hooks/useBillingFolderStructure.js";
import { MonthlyReporting } from "./MonthlyReporting.js";
import type { SelectedFolderInfo } from "./FolderTree.js";

interface DashboardHomeProps {
  onFolderSelect?: (folderInfo: SelectedFolderInfo | null) => void;
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
    // Navigate to billing view - BillingOverview handles the case when folder doesn't exist
    onFolderSelect?.({
      folderId: billingFolder?.id || "",
      folderType: "billing",
    });
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

      {/* Monthly Reporting */}
      <MonthlyReporting onFolderSelect={onFolderSelect} />
    </div>
  );
}
