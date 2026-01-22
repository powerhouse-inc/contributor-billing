import { useState } from "react";
import { Button } from "@powerhousedao/document-engineering";
import { ChevronDown, ChevronUp, HelpCircle, X } from "lucide-react";
import { DocumentToolbar } from "@powerhousedao/design-system/connect";
import {
  setSelectedNode,
  useParentFolderForSelectedNode,
  useSelectedDrive,
} from "@powerhousedao/reactor-browser";
import { generateId } from "document-model/core";
import { setName } from "document-model";
import { useSelectedAccountsDocument } from "../hooks/useAccountsDocument.js";
import {
  addAccount,
  updateAccount,
  deleteAccount,
  updateKycStatus,
} from "../../document-models/accounts/gen/accounts/creators.js";
import type {
  AccountEntry,
  AccountTypeInput,
  KycAmlStatusTypeInput,
} from "../../document-models/accounts/gen/schema/types.js";
import { AccountForm } from "./components/AccountForm.js";
import { DocumentHeader } from "./components/DocumentHeader.js";
import { AccountsList } from "./components/AccountsList.js";
import { AccountsFilter } from "./components/AccountsFilter.js";
import { accountTransactionsService } from "./services/accountTransactionsService.js";

type ViewMode = "list" | "add" | "edit";

const HELP_DISMISSED_KEY = "accountsEditor.helpDismissed";

function InstructionSection({ onDismiss }: { onDismiss: () => void }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900">
            Getting Started with Accounts
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="p-1 hover:bg-blue-200 rounded text-blue-600"
            title="Don't show again"
          >
            <X className="w-4 h-4" />
          </button>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-blue-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-blue-600" />
          )}
        </div>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 text-sm text-blue-800 space-y-3">
          <div>
            <strong className="text-blue-900">What is an Account?</strong>
            <p className="mt-1">
              An account represents a wallet address or entity that participates
              in your financial flows. This could be a treasury wallet, a
              contributor's address, or an external service provider.
            </p>
          </div>
          <div>
            <strong className="text-blue-900">
              Why specify an Account Type?
            </strong>
            <p className="mt-1">
              The account type helps categorize how funds flow in and out,
              making it easier to track transactions and generate accurate
              reports. It also enables automatic flow type detection.
            </p>
          </div>
          <div>
            <strong className="text-blue-900">Account Type Meanings:</strong>
            <ul className="mt-1 ml-4 list-disc space-y-1">
              <li>
                <strong>Source:</strong> Where funds originate (e.g., revenue
                streams, grants)
              </li>
              <li>
                <strong>Internal:</strong> Wallets within your organization
              </li>
              <li>
                <strong>Destination:</strong> Where you send payments (e.g.,
                contributor wallets)
              </li>
              <li>
                <strong>External:</strong> Third-party accounts outside your
                organization
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export function Editor() {
  const [document, dispatch] = useSelectedAccountsDocument();
  const parentFolder = useParentFolderForSelectedNode();
  const [selectedDrive] = useSelectedDrive();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingAccount, setEditingAccount] = useState<AccountEntry | null>(
    null,
  );
  const [filteredAccounts, setFilteredAccounts] = useState<AccountEntry[]>([]);
  const [creatingTransactionsFor, setCreatingTransactionsFor] = useState<
    string | null
  >(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{
    current: number;
    total: number;
    account: string;
  } | null>(null);
  const [showHelp, setShowHelp] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(HELP_DISMISSED_KEY) !== "true";
    }
    return true;
  });

  function handleDismissHelp() {
    setShowHelp(false);
    localStorage.setItem(HELP_DISMISSED_KEY, "true");
  }

  function handleClose() {
    setSelectedNode(parentFolder?.id);
  }

  function handleAddAccount(values: {
    account: string;
    name: string;
    budgetPath?: string;
    accountTransactionsId?: string;
    chain?: string[];
    type?: AccountTypeInput;
    owners?: string[];
    KycAmlStatus?: KycAmlStatusTypeInput;
  }) {
    dispatch(
      addAccount({
        id: generateId(),
        account: values.account,
        name: values.name,
        budgetPath: values.budgetPath,
        accountTransactionsId: values.accountTransactionsId,
        chain: values.chain,
        type: values.type || "External",
        owners: values.owners,
        KycAmlStatus: values.KycAmlStatus,
      }),
    );
    setViewMode("list");
  }

  function handleUpdateAccount(values: {
    id?: string;
    account: string;
    name: string;
    budgetPath?: string;
    accountTransactionsId?: string;
    chain?: string[];
    type?: AccountTypeInput;
    owners?: string[];
    KycAmlStatus?: KycAmlStatusTypeInput;
  }) {
    if (!values.id) return;
    dispatch(
      updateAccount({
        id: values.id,
        account: values.account,
        name: values.name,
        budgetPath: values.budgetPath,
        accountTransactionsId: values.accountTransactionsId,
        chain: values.chain,
        type: values.type,
        owners: values.owners,
        KycAmlStatus: values.KycAmlStatus,
      }),
    );
    setViewMode("list");
    setEditingAccount(null);
  }

  function handleDeleteAccount(id: string) {
    if (window.confirm("Are you sure you want to delete this account?")) {
      dispatch(deleteAccount({ id }));
    }
  }

  function handleUpdateKycStatus(
    id: string,
    KycAmlStatus: KycAmlStatusTypeInput,
  ) {
    dispatch(updateKycStatus({ id, KycAmlStatus }));
  }

  function handleEditClick(account: AccountEntry) {
    setEditingAccount(account);
    setViewMode("edit");
  }

  function handleCancelForm() {
    setViewMode("list");
    setEditingAccount(null);
  }

  async function handleCreateTransactions(account: AccountEntry) {
    setCreatingTransactionsFor(account.id);
    try {
      const driveId = selectedDrive?.header?.id;
      const accountsDocumentId = document.header.id;
      const result =
        await accountTransactionsService.createAccountTransactionsDocument(
          account,
          accountsDocumentId,
          driveId,
        );

      if (result.success) {
        // Dispatch local update to ensure UI re-renders immediately
        // The service already dispatched to the store, but this ensures local state updates
        if (result.documentId) {
          dispatch(
            updateAccount({
              id: account.id,
              accountTransactionsId: result.documentId,
            }),
          );
        }
        alert(
          `Success! Created document and fetched ${result.transactionsAdded} transactions`,
        );
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
      );
    } finally {
      setCreatingTransactionsFor(null);
    }
  }

  async function handleSyncAllTransactions() {
    // Filter accounts that have transaction documents
    const accountsWithTransactions = accounts.filter(
      (account) =>
        account.accountTransactionsId &&
        account.accountTransactionsId.trim() !== "",
    );

    if (accountsWithTransactions.length === 0) {
      alert(
        "No accounts have transaction documents to sync. Create transaction documents first.",
      );
      return;
    }

    if (
      !window.confirm(
        `This will sync transactions for ${accountsWithTransactions.length} account(s). Continue?`,
      )
    ) {
      return;
    }

    setIsSyncingAll(true);
    const results: Array<{
      account: string;
      success: boolean;
      transactionsAdded: number;
      message: string;
    }> = [];

    try {
      for (let i = 0; i < accountsWithTransactions.length; i++) {
        const account = accountsWithTransactions[i];
        setSyncProgress({
          current: i + 1,
          total: accountsWithTransactions.length,
          account: account.name,
        });

        const result =
          await accountTransactionsService.syncTransactionsForDocument(
            account.accountTransactionsId!,
            account.account,
          );

        results.push({
          account: account.name,
          success: result.success,
          transactionsAdded: result.transactionsAdded || 0,
          message: result.message,
        });
      }

      // Show summary
      const totalAdded = results.reduce(
        (sum, r) => sum + r.transactionsAdded,
        0,
      );
      const successCount = results.filter((r) => r.success).length;
      const failedCount = results.length - successCount;

      let message = `Sync complete!\n\n`;
      message += `Successfully synced: ${successCount}/${results.length} accounts\n`;
      message += `Total new transactions: ${totalAdded}\n`;

      if (failedCount > 0) {
        message += `\nFailed accounts:\n`;
        results
          .filter((r) => !r.success)
          .forEach((r) => {
            message += `- ${r.account}: ${r.message}\n`;
          });
      }

      alert(message);
    } catch (error) {
      alert(
        `Error during bulk sync: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
      );
    } finally {
      setIsSyncingAll(false);
      setSyncProgress(null);
    }
  }

  const accounts = document.state.global.accounts;
  const displayAccounts =
    filteredAccounts.length > 0 || accounts.length === 0
      ? filteredAccounts
      : accounts;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <DocumentToolbar document={document} onClose={handleClose} />
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Accounts</h1>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DocumentHeader
            document={document}
            onNameChange={(name) => dispatch(setName(name))}
          />

          <div className="mt-8">
            {viewMode === "list" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Accounts
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Manage your accounts and sync transactions
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSyncAllTransactions}
                      disabled={
                        isSyncingAll ||
                        accounts.filter((a) => a.accountTransactionsId)
                          .length === 0
                      }
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
                    >
                      {isSyncingAll ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {syncProgress
                            ? `${syncProgress.current}/${syncProgress.total}`
                            : "Syncing..."}
                        </span>
                      ) : (
                        "Sync All Transactions"
                      )}
                    </Button>
                    <Button
                      onClick={() => setViewMode("add")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
                    >
                      Add Account
                    </Button>
                  </div>
                </div>

                {showHelp && (
                  <InstructionSection onDismiss={handleDismissHelp} />
                )}

                {syncProgress && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Syncing transactions: {syncProgress.account}
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          Progress: {syncProgress.current} of{" "}
                          {syncProgress.total} accounts
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {accounts.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No accounts yet
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Get started by creating your first account
                    </p>
                    <Button
                      onClick={() => setViewMode("add")}
                      className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
                    >
                      Add Account
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Filter Component */}
                    <AccountsFilter
                      accounts={accounts}
                      onFilteredAccountsChange={setFilteredAccounts}
                    />

                    {/* Accounts List */}
                    <AccountsList
                      accounts={displayAccounts}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteAccount}
                      onUpdateKycStatus={handleUpdateKycStatus}
                      onCreateTransactions={handleCreateTransactions}
                      creatingTransactionsFor={
                        creatingTransactionsFor || undefined
                      }
                    />
                  </div>
                )}
              </div>
            )}

            {viewMode === "add" && (
              <div className="max-w-3xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Add New Account
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Fill in the account details below
                  </p>
                </div>
                <AccountForm
                  onSubmit={handleAddAccount}
                  onCancel={handleCancelForm}
                />
              </div>
            )}

            {viewMode === "edit" && editingAccount && (
              <div className="max-w-3xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Edit Account
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Update the account details below
                  </p>
                </div>
                <AccountForm
                  account={editingAccount}
                  onSubmit={handleUpdateAccount}
                  onCancel={handleCancelForm}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
