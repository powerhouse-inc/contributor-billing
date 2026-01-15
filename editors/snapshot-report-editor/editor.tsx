import { generateId } from "document-model/core";
import { useState } from "react";
import {
  useDocumentsInSelectedDrive,
  useParentFolderForSelectedNode,
  setSelectedNode,
  dispatchActions,
} from "@powerhousedao/reactor-browser";
import { DocumentToolbar } from "@powerhousedao/design-system/connect";
import { DatePicker } from "@powerhousedao/document-engineering";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { useSelectedSnapshotReportDocument } from "../hooks/useSnapshotReportDocument.js";
import {
  setReportConfig,
  addSnapshotAccount,
  addTransaction,
  setOwnerId,
} from "../../document-models/snapshot-report/gen/creators.js";
import { useSyncSnapshotAccount } from "./hooks/useSyncSnapshotAccount.js";
import { formatBalance } from "./utils/balanceCalculations.js";
import { calculateTransactionFlowInfo } from "./utils/flowTypeCalculations.js";
import { deriveTransactionsForAccount } from "./utils/deriveTransactions.js";
import { actions as accountsActions } from "../../document-models/accounts/index.js";
import {
  transactionsActions,
} from "../../document-models/snapshot-report/index.js";

export default function Editor() {
  const [document, dispatch] = useSelectedSnapshotReportDocument();
  const documentsInDrive = useDocumentsInSelectedDrive();
  const [isAccountPickerOpen, setIsAccountPickerOpen] = useState(false);
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(
    new Set(),
  );
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(
    new Set(),
  );
  const [syncingAccounts, setSyncingAccounts] = useState<Set<string>>(
    new Set(),
  );
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const { syncAccount } = useSyncSnapshotAccount();

  if (!document) {
    return <div>Loading...</div>;
  }

  const {
    reportName,
    startDate,
    endDate,
    snapshotAccounts,
    accountsDocumentId,
    ownerId,
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

  // Create a map of accountId to accountEntry for quick lookup
  const accountEntryMap = new Map(
    availableAccounts.map((acc: any) => [acc.id, acc]),
  );

  // Handle sync for a single account
  const handleSyncAccount = async (snapshotAccount: any) => {
    if (!startDate || !endDate) {
      alert(
        "Please set the report period (start and end dates) before syncing",
      );
      return;
    }

    setSyncingAccounts((prev) => new Set(prev).add(snapshotAccount.id));

    try {
      const accountEntry = accountEntryMap.get(snapshotAccount.accountId);
      const result = await syncAccount(
        snapshotAccount,
        accountEntry,
        accountsDocumentId || undefined,
        startDate,
        endDate,
        dispatch,
        snapshotAccounts,
      );

      if (result.success) {
        // If account transactions document was created, update the Accounts document
        if (result.documentId && accountEntry && accountsDocumentId) {
          await dispatchActions(
            [
              accountsActions.updateAccount({
                id: accountEntry.id,
                accountTransactionsId: result.documentId,
              }),
            ],
            accountsDocumentId,
          );
        }
      } else {
        alert(`Sync failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error syncing account:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setSyncingAccounts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(snapshotAccount.id);
        return newSet;
      });
    }
  };

  // Handle sync all accounts
  const handleSyncAll = async () => {
    if (!startDate || !endDate) {
      alert(
        "Please set the report period (start and end dates) before syncing",
      );
      return;
    }

    setIsSyncingAll(true);

    try {
      for (const snapshotAccount of snapshotAccounts) {
        await handleSyncAccount(snapshotAccount);
      }
    } finally {
      setIsSyncingAll(false);
    }
  };

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

  const handleToggleAccountExpansion = (accountId: string) => {
    setExpandedAccounts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
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

    // Track newly imported accounts for two-pass import
    const newlyImportedAccounts: Array<{
      snapshotAccountId: string;
      accountAddress: string;
      accountType: string;
      accountTransactionsId?: string;
    }> = [];

    // Build a combined list of existing + newly imported accounts for flow type calculation
    const allAccountsForLookup = [
      ...snapshotAccounts,
      ...Array.from(selectedAccountIds)
        .map((accountId) => {
          const account = availableAccounts.find(
            (acc: any) => acc.id === accountId,
          );
          if (account && !existingAccountIds.has(accountId) && account.type) {
            return {
              id: generateId(),
              accountId: account.id,
              accountAddress: account.account as string,
              accountName: account.name as string,
              type: account.type as string,
              accountTransactionsId: account.accountTransactionsId || null,
              startingBalances: [],
              endingBalances: [],
              transactions: [],
            };
          }
          return null;
        })
        .filter(Boolean),
    ];

    // FIRST PASS: Import all accounts
    // - Internal accounts: Import with transactions from AccountTransactions doc
    // - Non-Internal accounts: Import account only (transactions derived later)
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

        // Track for second pass
        newlyImportedAccounts.push({
          snapshotAccountId,
          accountAddress: account.account,
          accountType: account.type,
          accountTransactionsId: account.accountTransactionsId,
        });

        // Only import transactions for Internal accounts
        // Non-Internal accounts will derive transactions from Internal accounts
        if (account.type === "Internal" && account.accountTransactionsId) {
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
              const { flowType, counterPartyAccountId } =
                calculateTransactionFlowInfo(
                  tx.direction,
                  account.type,
                  tx.counterParty,
                  allAccountsForLookup as any[],
                );

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
                  flowType: flowType,
                  counterPartyAccountId: counterPartyAccountId || undefined,
                }),
              );
            }
          }
        }
      }
    }

    // SECOND PASS: Derive transactions for non-Internal accounts
    // We need to wait a moment for state to update, then derive
    // For now, user can click "Sync" on non-Internal accounts to derive
    // TODO: Implement auto-derive after import completes

    setIsAccountPickerOpen(false);
    setSelectedAccountIds(new Set());
  };

  /**
   * Derive transactions for a non-Internal account from Internal accounts
   * This finds all transactions in Internal accounts where the counter-party
   * matches the non-Internal account's address
   */
  const handleDeriveTransactions = async (accountId: string) => {
    const account = snapshotAccounts.find((a) => a.id === accountId);
    if (!account || account.type === "Internal") {
      return;
    }

    const internalAccounts = snapshotAccounts.filter(
      (a) => a.type === "Internal",
    );
    if (internalAccounts.length === 0) {
      alert("No Internal accounts found. Import Internal accounts first.");
      return;
    }

    // Get derived transactions
    const derivedTxs = deriveTransactionsForAccount(account, internalAccounts);

    // Remove existing transactions for this account
    for (const tx of account.transactions) {
      dispatch?.(transactionsActions.removeTransaction({ id: tx.id }));
    }

    // Add derived transactions
    for (const tx of derivedTxs) {
      dispatch?.(
        addTransaction({
          accountId: account.id,
          id: tx.id,
          transactionId: tx.transactionId,
          counterParty: tx.counterParty,
          amount: tx.amount,
          datetime: tx.datetime,
          txHash: tx.txHash,
          token: tx.token,
          blockNumber: tx.blockNumber ?? undefined,
          direction: tx.direction,
          flowType: tx.flowType,
          counterPartyAccountId: tx.counterPartyAccountId,
        }),
      );
    }
  };

  /**
   * Derive transactions for all non-Internal accounts
   */
  const handleDeriveAllNonInternal = async () => {
    const internalAccounts = snapshotAccounts.filter(
      (a) => a.type === "Internal",
    );
    if (internalAccounts.length === 0) {
      alert("No Internal accounts found. Import Internal accounts first.");
      return;
    }

    const nonInternalAccounts = snapshotAccounts.filter(
      (a) => a.type !== "Internal",
    );

    for (const account of nonInternalAccounts) {
      await handleDeriveTransactions(account.id);
    }
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
                  Owner ID
                </label>
                <input
                  type="text"
                  value={ownerId || ""}
                  onChange={(e) =>
                    dispatch?.(setOwnerId({ ownerId: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter owner ID"
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
            <div className="flex gap-2">
              {snapshotAccounts.length > 0 && (
                <button
                  onClick={handleSyncAll}
                  disabled={isSyncingAll || !startDate || !endDate}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isSyncingAll ? "animate-spin" : ""}`}
                  />
                  Sync All
                </button>
              )}
              <button
                onClick={handleOpenAccountPicker}
                disabled={!accountsDocumentId}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add Account
              </button>
            </div>
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
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Header - Always Visible */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            {account.accountName}
                          </h3>
                          <button
                            onClick={() => handleSyncAccount(account)}
                            disabled={
                              syncingAccounts.has(account.id) ||
                              !startDate ||
                              !endDate
                            }
                            className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Sync account transactions and balances"
                          >
                            <RefreshCw
                              className={`w-4 h-4 ${
                                syncingAccounts.has(account.id)
                                  ? "animate-spin text-blue-600"
                                  : "text-gray-600"
                              }`}
                            />
                          </button>
                        </div>
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
                          Tokens: {account.startingBalances.length}
                        </p>
                      </div>
                    </div>

                    {/* Balances Display */}
                    {(account.startingBalances.length > 0 ||
                      account.endingBalances.length > 0) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Balances
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {account.startingBalances.map((balance: any) => {
                            const endingBalance = account.endingBalances.find(
                              (eb: any) => eb.token === balance.token,
                            );
                            return (
                              <div
                                key={balance.id}
                                className="bg-gray-50 rounded p-2 text-sm"
                              >
                                <div className="font-medium text-gray-700 mb-1">
                                  {balance.token}
                                </div>
                                <div className="text-xs text-gray-600 space-y-1">
                                  <div>
                                    Opening:{" "}
                                    <span className="font-medium">
                                      {formatBalance(balance.amount)}
                                    </span>
                                  </div>
                                  {endingBalance && (
                                    <div>
                                      Closing:{" "}
                                      <span className="font-medium">
                                        {formatBalance(endingBalance.amount)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          {account.endingBalances
                            .filter(
                              (eb: any) =>
                                !account.startingBalances.some(
                                  (sb: any) => sb.token === eb.token,
                                ),
                            )
                            .map((balance: any) => (
                              <div
                                key={balance.id}
                                className="bg-gray-50 rounded p-2 text-sm"
                              >
                                <div className="font-medium text-gray-700 mb-1">
                                  {balance.token}
                                </div>
                                <div className="text-xs text-gray-600">
                                  <div>
                                    Closing:{" "}
                                    <span className="font-medium">
                                      {formatBalance(balance.amount)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Expand/Collapse Button */}
                    {account.transactions.length > 0 && (
                      <button
                        onClick={() => handleToggleAccountExpansion(account.id)}
                        className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        {expandedAccounts.has(account.id) ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            <span>Hide Transactions</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            <span>Show Transactions</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Expandable Transaction List */}
                  {expandedAccounts.has(account.id) &&
                    account.transactions.length > 0 && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Transactions ({account.transactions.length})
                          </h4>
                          <div className="space-y-2">
                            {account.transactions.map((tx: any) => (
                              <div
                                key={tx.id}
                                className="bg-white border border-gray-200 rounded p-3 text-sm"
                              >
                                <div className="grid grid-cols-2 gap-2">
                                  {/* Transaction Details Grid */}
                                  <div>
                                    <span className="text-gray-500">
                                      Direction:
                                    </span>
                                    <span
                                      className={`ml-2 font-medium ${
                                        tx.direction === "INFLOW"
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {tx.direction}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      Amount:
                                    </span>
                                    <span className="ml-2 font-medium">
                                      {typeof tx.amount === "object" &&
                                      tx.amount?.value !== undefined
                                        ? `${tx.amount.value} ${tx.amount.unit || tx.token}`
                                        : `${tx.amount} ${tx.token}`}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Date:</span>
                                    <span className="ml-2">
                                      {new Date(
                                        tx.datetime,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Time:</span>
                                    <span className="ml-2">
                                      {new Date(
                                        tx.datetime,
                                      ).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  {tx.counterParty && (
                                    <div className="col-span-2">
                                      <span className="text-gray-500">
                                        Counter Party:
                                      </span>
                                      <span className="ml-2 font-mono text-xs">
                                        {tx.counterParty}
                                      </span>
                                    </div>
                                  )}
                                  {tx.flowType && (
                                    <div>
                                      <span className="text-gray-500">
                                        Flow Type:
                                      </span>
                                      <span
                                        className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                                          tx.flowType === "TopUp"
                                            ? "bg-green-100 text-green-800"
                                            : tx.flowType === "Return"
                                              ? "bg-orange-100 text-orange-800"
                                              : tx.flowType === "Internal"
                                                ? "bg-purple-100 text-purple-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {tx.flowType}
                                      </span>
                                    </div>
                                  )}
                                  <div className="col-span-2">
                                    <span className="text-gray-500">
                                      Tx Hash:
                                    </span>
                                    <a
                                      href={`https://etherscan.io/tx/${tx.txHash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ml-2 text-blue-600 hover:underline font-mono text-xs"
                                    >
                                      {tx.txHash.substring(0, 10)}...
                                      {tx.txHash.substring(
                                        tx.txHash.length - 8,
                                      )}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
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
