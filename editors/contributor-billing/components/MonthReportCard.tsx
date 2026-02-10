import { useState, useCallback } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Camera,
  FileText,
  ArrowRight,
  Plus,
} from "lucide-react";
import { setSelectedNode } from "@powerhousedao/reactor-browser";
import type {
  MonthReportSet,
  ReportDocument,
  ReportStatus,
} from "../hooks/useMonthlyReports.js";

interface MonthReportCardProps {
  reportSet: MonthReportSet;
  defaultExpanded?: boolean;
  onCreateExpenseReport?: (monthName: string, folderId: string) => void;
  onCreateSnapshotReport?: (monthName: string, folderId: string) => void;
}

/**
 * Get color classes for status badges
 */
function getStatusColors(status: ReportStatus): { bg: string; text: string } {
  switch (status) {
    case "FINAL":
      return { bg: "bg-green-100", text: "text-green-700" };
    case "REVIEW":
      return { bg: "bg-blue-100", text: "text-blue-700" };
    case "DRAFT":
      return { bg: "bg-amber-100", text: "text-amber-700" };
    case "NONE":
    default:
      return { bg: "bg-gray-100", text: "text-gray-500" };
  }
}

/**
 * Get display text for status
 */
function getStatusLabel(status: ReportStatus): string {
  switch (status) {
    case "FINAL":
      return "Final";
    case "REVIEW":
      return "Review";
    case "DRAFT":
      return "Draft";
    case "NONE":
    default:
      return "None";
  }
}

/**
 * Individual report row component
 */
function ReportRow({
  report,
  isSnapshot = false,
}: {
  report: ReportDocument;
  isSnapshot?: boolean;
}) {
  const colors = getStatusColors(report.status);

  const handleClick = useCallback(() => {
    setSelectedNode(report.id);
  }, [report.id]);

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
    >
      <div className="flex items-center gap-3 min-w-0">
        {isSnapshot ? (
          <Camera className="w-4 h-4 text-purple-500 flex-shrink-0" />
        ) : (
          <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
        )}
        <span className="text-sm text-gray-900 truncate">{report.name}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}
        >
          {getStatusLabel(report.status)}
        </span>
        <ArrowRight className="w-4 h-4 text-gray-400" />
      </div>
    </button>
  );
}

/**
 * Collapsible month card showing all reports for a month
 */
export function MonthReportCard({
  reportSet,
  defaultExpanded = false,
  onCreateExpenseReport,
  onCreateSnapshotReport,
}: MonthReportCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const overallColors = getStatusColors(reportSet.overallStatus);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleCreateExpenseReport = useCallback(() => {
    if (onCreateExpenseReport && reportSet.reportingFolderId) {
      onCreateExpenseReport(reportSet.monthName, reportSet.reportingFolderId);
    }
  }, [onCreateExpenseReport, reportSet.monthName, reportSet.reportingFolderId]);

  const handleCreateSnapshotReport = useCallback(() => {
    if (onCreateSnapshotReport && reportSet.reportingFolderId) {
      onCreateSnapshotReport(reportSet.monthName, reportSet.reportingFolderId);
    }
  }, [
    onCreateSnapshotReport,
    reportSet.monthName,
    reportSet.reportingFolderId,
  ]);

  const reportCountText =
    reportSet.reportCount === 1
      ? "1 Report"
      : `${reportSet.reportCount} Reports`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header - Clickable to expand/collapse */}
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">
            {reportSet.monthName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{reportCountText}</span>
          {reportSet.reportCount > 0 && (
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${overallColors.bg} ${overallColors.text}`}
            >
              {getStatusLabel(reportSet.overallStatus)}
            </span>
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Snapshot report */}
          {reportSet.snapshotReport && (
            <ReportRow report={reportSet.snapshotReport} isSnapshot />
          )}

          {/* Expense reports */}
          {reportSet.expenseReports.map((report) => (
            <ReportRow key={report.id} report={report} />
          ))}

          {/* Empty state */}
          {reportSet.reportCount === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              No reports created yet
            </div>
          )}

          {/* Add report buttons */}
          {(onCreateExpenseReport || onCreateSnapshotReport) &&
            reportSet.reportingFolderId && (
              <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
                {onCreateSnapshotReport && !reportSet.snapshotReport && (
                  <button
                    onClick={handleCreateSnapshotReport}
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Snapshot Report
                  </button>
                )}
                {onCreateExpenseReport && (
                  <button
                    onClick={handleCreateExpenseReport}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Expense Report
                  </button>
                )}
              </div>
            )}
        </div>
      )}
    </div>
  );
}
