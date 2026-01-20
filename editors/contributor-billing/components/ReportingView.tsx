import {
  useDocumentsInSelectedDrive,
  setSelectedNode,
  addDocument,
  dispatchActions,
  useSelectedDrive,
} from "@powerhousedao/reactor-browser";
import { useMemo, useState } from "react";
import { FileText, Camera, Plus } from "lucide-react";
import { setName } from "document-model";
import { moveNode } from "document-drive";
import { actions as expenseReportActions } from "../../../document-models/expense-report/index.js";
import { actions as snapshotReportActions } from "../../../document-models/snapshot-report/index.js";

interface ReportingViewProps {
  folderId: string;
  monthName?: string;
}

/**
 * Parse a month name like "January 2026" into start and end dates
 */
function parseMonthDates(monthName: string): {
  start: Date;
  end: Date;
} | null {
  const date = new Date(monthName + " 1"); // e.g., "January 2026 1"
  if (isNaN(date.getTime())) return null;

  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Last day of month
  return { start, end };
}

/**
 * View for the Reporting folder showing Expense Reports and Snapshot Reports
 */
export function ReportingView({
  folderId,
  monthName,
}: ReportingViewProps) {
  const documentsInDrive = useDocumentsInSelectedDrive();
  const [selectedDrive] = useSelectedDrive();
  const [isCreating, setIsCreating] = useState(false);

  // Find expense reports and snapshot reports that match this month
  const { expenseReports, snapshotReports } = useMemo(() => {
    if (!documentsInDrive || !monthName) {
      return { expenseReports: [], snapshotReports: [] };
    }

    const monthLower = monthName.toLowerCase();

    const expense = documentsInDrive.filter(
      (doc) =>
        doc.header.documentType === "powerhouse/expense-report" &&
        doc.header.name?.toLowerCase().includes(monthLower),
    );
    const snapshot = documentsInDrive.filter(
      (doc) =>
        doc.header.documentType === "powerhouse/snapshot-report" &&
        doc.header.name?.toLowerCase().includes(monthLower),
    );

    return { expenseReports: expense, snapshotReports: snapshot };
  }, [documentsInDrive, monthName]);

  const handleOpenDocument = (docId: string) => {
    setSelectedNode(docId);
  };

  const driveId = selectedDrive?.header.id;

  const handleCreateExpenseReport = async () => {
    if (!driveId || !monthName || isCreating) return;
    setIsCreating(true);

    try {
      const reportName = `${monthName} - Expense Report`;
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
          moveNode({ srcFolder: createdNode.id, targetParentFolder: folderId }),
          driveId,
        );
      }

      // Set the document name
      await dispatchActions(setName(reportName), createdNode.id);

      // Set period dates based on month
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
  };

  const handleCreateSnapshotReport = async () => {
    if (!driveId || !monthName || isCreating) return;
    setIsCreating(true);

    try {
      const reportName = `${monthName} - Snapshot Report`;
      const createdNode = await addDocument(
        driveId,
        reportName,
        "powerhouse/snapshot-report",
        undefined,
        undefined,
        undefined,
        "powerhouse-snapshot-report-editor",
      );

      if (!createdNode?.id) return;

      // Move to reporting folder
      if (folderId) {
        await dispatchActions(
          moveNode({ srcFolder: createdNode.id, targetParentFolder: folderId }),
          driveId,
        );
      }

      // Set the document name
      await dispatchActions(setName(reportName), createdNode.id);

      // Set period dates based on month
      const dates = parseMonthDates(monthName);
      if (dates) {
        await dispatchActions(
          [
            snapshotReportActions.setPeriodStart({
              periodStart: dates.start.toISOString(),
            }),
            snapshotReportActions.setPeriodEnd({
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
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Reporting {monthName ? `- ${monthName}` : ""}
        </h1>
        <p className="text-gray-600">
          Manage expense reports and snapshot reports
          {monthName ? ` for ${monthName}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Reports Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Expense Reports
              </h2>
            </div>
            {expenseReports.length === 0 && (
              <button
                onClick={() => void handleCreateExpenseReport()}
                disabled={isCreating}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                {isCreating ? "Creating..." : "New"}
              </button>
            )}
          </div>

          {expenseReports.length === 0 ? (
            <p className="text-gray-500 text-sm">No expense reports yet</p>
          ) : (
            <div className="space-y-2">
              {expenseReports.map((doc) => (
                <button
                  key={doc.header.id}
                  onClick={() => handleOpenDocument(doc.header.id)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-md transition-colors border border-gray-100"
                >
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.header.name || "Untitled"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Modified:{" "}
                      {new Date(
                        doc.header.lastModifiedAtUtcIso || Date.now(),
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Snapshot Reports Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Snapshot Reports
              </h2>
            </div>
            {snapshotReports.length === 0 && (
              <button
                onClick={() => void handleCreateSnapshotReport()}
                disabled={isCreating}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                {isCreating ? "Creating..." : "New"}
              </button>
            )}
          </div>

          {snapshotReports.length === 0 ? (
            <p className="text-gray-500 text-sm">No snapshot reports yet</p>
          ) : (
            <div className="space-y-2">
              {snapshotReports.map((doc) => (
                <button
                  key={doc.header.id}
                  onClick={() => handleOpenDocument(doc.header.id)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-md transition-colors border border-gray-100"
                >
                  <Camera className="w-4 h-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.header.name || "Untitled"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Modified:{" "}
                      {new Date(
                        doc.header.lastModifiedAtUtcIso || Date.now(),
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
