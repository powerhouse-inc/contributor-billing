import { useCallback, useState } from "react";
import { BarChart3 } from "lucide-react";
import {
  useSelectedDrive,
  addDocument,
  dispatchActions,
  setSelectedNode,
} from "@powerhousedao/reactor-browser";
import { setName } from "document-model";
import { moveNode } from "document-drive";
import { useMonthlyReports } from "../hooks/useMonthlyReports.js";
import { MonthReportCard } from "./MonthReportCard.js";
import { actions as expenseReportActions } from "../../../document-models/expense-report/index.js";
import type { SelectedFolderInfo } from "./FolderTree.js";

interface MonthlyReportsOverviewProps {
  onFolderSelect?: (folderInfo: SelectedFolderInfo | null) => void;
}

/**
 * Format month name like "January 2026" to "01-2026"
 */
function formatMonthCode(monthName: string): string {
  const date = new Date(monthName + " 1");
  if (isNaN(date.getTime())) return monthName;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${year}`;
}

/**
 * Parse a month name like "January 2026" into start and end dates (UTC)
 */
function parseMonthDates(monthName: string): {
  start: Date;
  end: Date;
} | null {
  const date = new Date(monthName + " 1");
  if (isNaN(date.getTime())) return null;

  // Use UTC to avoid timezone issues
  const start = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
  const end = new Date(
    Date.UTC(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999),
  );
  return { start, end };
}

/**
 * Monthly Reports Overview component for the billing page
 * Shows collapsible month cards with reports and status
 */
export function MonthlyReportsOverview(_props: MonthlyReportsOverviewProps) {
  const { monthReportSets, isLoading } = useMonthlyReports();
  const [selectedDrive] = useSelectedDrive();
  const [isCreating, setIsCreating] = useState(false);

  const driveId = selectedDrive?.header.id;

  const handleCreateExpenseReport = useCallback(
    async (monthName: string, folderId: string) => {
      if (!driveId || isCreating) return;
      setIsCreating(true);

      try {
        const monthCode = formatMonthCode(monthName);
        // Find existing expense reports for this month to determine number
        const monthSet = monthReportSets.find((s) => s.monthName === monthName);
        const reportNumber = (monthSet?.expenseReports.length || 0) + 1;
        const reportName = `${monthCode} Expense Report ${reportNumber}`;

        const createdNode = await addDocument(
          driveId,
          reportName,
          "powerhouse/expense-report",
          undefined,
          undefined,
          undefined,
          "powerhouse-expense-report-editor",
        );

        if (!createdNode?.id) return;

        // Move to reporting folder
        if (folderId) {
          await dispatchActions(
            moveNode({
              srcFolder: createdNode.id,
              targetParentFolder: folderId,
            }),
            driveId,
          );
        }

        // Set the document name
        await dispatchActions(setName(reportName), createdNode.id);

        // Set Reporting Period based on month (Transaction Period is set by user)
        const dates = parseMonthDates(monthName);
        if (dates) {
          await dispatchActions(
            [
              expenseReportActions.setPeriodStart({
                periodStart: dates.start.toISOString(),
              }),
              expenseReportActions.setPeriodEnd({
                periodEnd: dates.end.toISOString(),
              }),
            ],
            createdNode.id,
          );
        }

        // Open the created report
        setSelectedNode(createdNode.id);
      } finally {
        setIsCreating(false);
      }
    },
    [driveId, isCreating, monthReportSets],
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-gray-200 rounded-lg" />
            <div>
              <div className="h-5 bg-gray-200 rounded w-36 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-56" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-100 rounded-xl" />
            <div className="h-16 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (monthReportSets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Monthly Reports
            </h2>
            <p className="text-sm text-gray-600">
              Quick access to expense and snapshot reports
            </p>
          </div>
        </div>
        <p className="text-gray-500 text-sm text-center py-4">
          No months configured yet. Add a month using the button above to get
          started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Monthly Reports
          </h2>
          <p className="text-sm text-gray-600">
            Quick access to expense and snapshot reports
          </p>
        </div>
      </div>

      {/* Month cards */}
      <div className="space-y-3">
        {monthReportSets.map((reportSet, index) => (
          <MonthReportCard
            key={reportSet.monthName}
            reportSet={reportSet}
            defaultExpanded={index === 0}
            onCreateExpenseReport={handleCreateExpenseReport}
          />
        ))}
      </div>
    </div>
  );
}
