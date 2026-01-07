import { generateId } from "document-model/core";
import { useState } from "react";
import {
  useDocumentsInSelectedDrive,
  useParentFolderForSelectedNode,
  setSelectedNode,
} from "@powerhousedao/reactor-browser";
import { DocumentToolbar } from "@powerhousedao/design-system/connect";
import { DatePicker } from "@powerhousedao/document-engineering";
import { useSelectedSnapshotReportDocument } from "../hooks/useSnapshotReportDocument.js";
import {
  setReportConfig,
  addSnapshotAccount,
  addTransaction,
} from "../../document-models/snapshot-report/gen/creators.js";

export default function Editor() {
  const [document, dispatch] = useSelectedSnapshotReportDocument();
  const documentsInDrive = useDocumentsInSelectedDrive();
  const [isAccountPickerOpen, setIsAccountPickerOpen] = useState(false);
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(
    new Set(),
  );

  if (!document) {
    return <div>Loading...</div>;
  }

  const {
    reportName,
    startDate,
    endDate,
    snapshotAccounts,
    accountsDocumentId,
  } = document.state.global;

  // Filter for Accounts documents
  const accountsDocuments = documentsInDrive
    ? documentsInDrive.filter(
        (doc) => doc.header.documentType === "powerhouse/accounts",
      )
    : [];

  // Find selected accounts document
  const selectedAccountsDoc = accountsDocuments.find(
    (doc) => doc.header.id === accountsDocumentId,
  );

  // Get available accounts from the selected Accounts document
  const availableAccounts = selectedAccountsDoc
    ? ((selectedAccountsDoc.state as any).global?.accounts as any[]) || []
    : [];

  // Get IDs of accounts already in the snapshot
  const existingAccountIds = new Set(
    snapshotAccounts.map((acc) => acc.accountId),
  );

  const handleSetReportName = (name: string) => {
    dispatch?.(
      setReportConfig({
        reportName: name,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        accountsDocumentId: undefined,
      }),
    );
  };

  const handleOpenAccountPicker = () => {
    if (!accountsDocumentId) {
      alert("Please select an Accounts document first");
      return;
    }
    setIsAccountPickerOpen(true);
    setSelectedAccountIds(new Set());
  };

  const handleToggleAccount = (accountId: string) => {
    const newSelection = new Set(selectedAccountIds);
    if (newSelection.has(accountId)) {
      newSelection.delete(accountId);
    } else {
      newSelection.add(accountId);
    }
    setSelectedAccountIds(newSelection);
  };

  const handleImportAccounts = async () => {
    if (!documentsInDrive || !startDate || !endDate) {
      alert(
        "Please set the report period (start and end dates) before importing accounts",
      );
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    for (const accountId of selectedAccountIds) {
      const account = availableAccounts.find(
        (acc: any) => acc.id === accountId,
      );
      if (account && !existingAccountIds.has(accountId)) {
        if (!account.type) {
          alert(
            `Account "${account.name}" does not have a type set. Please update the account first.`,
          );
          continue;
        }

        // Add the snapshot account
        const snapshotAccountId = generateId();
        dispatch?.(
          addSnapshotAccount({
            id: snapshotAccountId,
            accountId: account.id,
            accountAddress: account.account,
            accountName: account.name,
            type: account.type,
            accountTransactionsId: account.accountTransactionsId || undefined,
          }),
        );

        // If the account has linked transactions, import them
        if (account.accountTransactionsId) {
          const txDoc = documentsInDrive.find(
            (doc) =>
              doc.header.id === account.accountTransactionsId &&
              doc.header.documentType === "powerhouse/account-transactions",
          ) as any;

          if (txDoc?.state?.global?.transactions) {
            const transactions = txDoc.state.global.transactions as any[];

            // Filter transactions by the report period
            const filteredTransactions = transactions.filter((tx: any) => {
              if (!tx?.datetime) return false;
              const txDate = new Date(tx.datetime);
              if (isNaN(txDate.getTime())) return false;
              return txDate >= start && txDate <= end;
            });

            // Add each transaction to the snapshot account
            for (const tx of filteredTransactions) {
              dispatch?.(
                addTransaction({
                  accountId: snapshotAccountId,
                  id: generateId(),
                  transactionId: tx.id,
                  counterParty: tx.counterParty || undefined,
                  amount: tx.amount,
                  datetime: tx.datetime,
                  txHash: tx.details?.txHash || "",
                  token: tx.details?.token || "",
                  blockNumber: tx.details?.blockNumber || undefined,
                  direction: tx.direction,
                  flowType: undefined, // Can be set later
                  counterPartyAccountId: undefined, // Can be set later if counterParty matches another account
                }),
              );
            }
          }
        }
      }
    }
    setIsAccountPickerOpen(false);
    setSelectedAccountIds(new Set());
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (!dateValue) return;

    // DatePicker may return ISO string or date string - extract just the date part
    const dateString = dateValue.split("T")[0]; // Get YYYY-MM-DD part if ISO string
    if (!dateString) return;

    // Create date at start of day (00:00:00)
    const date = new Date(dateString + "T00:00:00.000Z");
    if (isNaN(date.getTime())) {
      console.error("Invalid date value:", dateValue);
      return;
    }

    const isoDateTime = date.toISOString();
    dispatch?.(
      setReportConfig({
        startDate: isoDateTime,
        endDate: endDate || undefined,
        reportName: reportName || undefined,
        accountsDocumentId: accountsDocumentId || undefined,
      }),
    );
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (!dateValue) return;

    // DatePicker may return ISO string or date string - extract just the date part
    const dateString = dateValue.split("T")[0]; // Get YYYY-MM-DD part if ISO string
    if (!dateString) return;

    // Create date at end of day (23:59:59.999)
    const endOfDay = new Date(dateString + "T23:59:59.999Z");
    if (isNaN(endOfDay.getTime())) {
      console.error("Invalid date value:", dateValue);
      return;
    }

    const isoDateTime = endOfDay.toISOString();
    dispatch?.(
      setReportConfig({
        endDate: isoDateTime,
        startDate: startDate || undefined,
        reportName: reportName || undefined,
        accountsDocumentId: accountsDocumentId || undefined,
      }),
    );
  };

  // Get the parent folder node for the currently selected node
  const parentFolder = useParentFolderForSelectedNode();
  // Set the selected node to the parent folder node (close the editor)
  function handleClose() {
    setSelectedNode(parentFolder?.id);
  }

  return (
    <div>
      <DocumentToolbar document={document} onClose={handleClose} />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Snapshot Report</h1>

        {/* Report Configuration */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Report Configuration</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Name
                </label>
                <input
                  type="text"
                  value={reportName || ""}
                  onChange={(e) => handleSetReportName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Q4 2024 Treasury Report"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accounts Document
                </label>
                <select
                  value={accountsDocumentId || ""}
                  onChange={(e) =>
                    dispatch?.(
                      setReportConfig({
                        accountsDocumentId: e.target.value || undefined,
                        reportName: reportName || undefined,
                        startDate: startDate || undefined,
                        endDate: endDate || undefined,
                      }),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an Accounts document...</option>
                  {accountsDocuments.map((doc) => (
                    <option key={doc.header.id} value={doc.header.id}>
                      {doc.header.name ||
                        `Accounts (${doc.header.id.slice(0, 8)}...)`}
                    </option>
                  ))}
                </select>
                {selectedAccountsDoc && (
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedAccountsDoc.state as any).global?.accounts
                      ?.length || 0}{" "}
                    accounts available
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <div className="flex gap-2 items-center">
                <DatePicker
                  name="startDate"
                  value={startDate ? startDate.split("T")[0] : ""}
                  onChange={handleStartDateChange}
                  dateFormat="YYYY-MM-DD"
                  className="flex-1"
                />
                <span className="self-center">to</span>
                <DatePicker
                  name="endDate"
                  value={endDate ? endDate.split("T")[0] : ""}
                  onChange={handleEndDateChange}
                  dateFormat="YYYY-MM-DD"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Accounts Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Snapshot Accounts</h2>
            <button
              onClick={handleOpenAccountPicker}
              disabled={!accountsDocumentId}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add Account
            </button>
          </div>

          {snapshotAccounts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No accounts added yet</p>
              <p className="text-sm mt-2">
                Click "Add Account" to select accounts for this snapshot
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {snapshotAccounts.map((account: any) => (
                <div
                  key={account.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{account.accountName}</h3>
                      <p className="text-sm text-gray-600">
                        {account.accountAddress}
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {account.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Transactions: {account.transactions.length}
                      </p>
                      <p className="text-sm text-gray-600">
                        Balances: {account.startingBalances.length}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Picker Modal */}
        {isAccountPickerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">
                  Select Accounts to Import
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Choose accounts from the selected Accounts document
                </p>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {availableAccounts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No accounts available in the selected document
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableAccounts.map((account: any) => {
                      const isAlreadyAdded = existingAccountIds.has(account.id);
                      const isSelected = selectedAccountIds.has(account.id);

                      return (
                        <div
                          key={account.id}
                          onClick={() =>
                            !isAlreadyAdded && handleToggleAccount(account.id)
                          }
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            isAlreadyAdded
                              ? "bg-gray-100 cursor-not-allowed opacity-50"
                              : isSelected
                                ? "bg-blue-50 border-blue-500"
                                : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={isAlreadyAdded}
                                onChange={() => {}}
                                className="mt-1"
                              />
                              <div>
                                <h4 className="font-medium">{account.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {account.account}
                                </p>
                                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {account.type || "External"}
                                </span>
                              </div>
                            </div>
                            {isAlreadyAdded && (
                              <span className="text-xs text-gray-500">
                                Already added
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsAccountPickerOpen(false);
                    setSelectedAccountIds(new Set());
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportAccounts}
                  disabled={selectedAccountIds.size === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Import{" "}
                  {selectedAccountIds.size > 0
                    ? `(${selectedAccountIds.size})`
                    : ""}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
