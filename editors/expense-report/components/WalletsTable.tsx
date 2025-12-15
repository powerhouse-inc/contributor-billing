import { useState } from "react";
import { Button, TextInput } from "@powerhousedao/document-engineering";
import {
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Copy,
  CheckCheck,
  RefreshCw,
} from "lucide-react";
import type {
  Wallet,
  LineItemGroup,
} from "../../../document-models/expense-report/gen/types.js";
import { actions } from "../../../document-models/expense-report/index.js";
import { useWalletSync } from "../hooks/useWalletSync.js";
import { useSyncWallet } from "../hooks/useSyncWallet.js";
import { walletAccountService } from "../services/walletAccountService.js";
import { useDocumentsInSelectedDrive, useSelectedDrive } from "@powerhousedao/reactor-browser";

interface WalletsTableProps {
  wallets: Wallet[];
  groups: LineItemGroup[];
  onAddBillingStatement: (walletAddress: string) => void;
  dispatch: any;
}

export function WalletsTable({
  wallets,
  groups,
  onAddBillingStatement,
  dispatch,
}: WalletsTableProps) {
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [newWalletName, setNewWalletName] = useState("");
  const [walletError, setWalletError] = useState("");
  const [hoveredWallet, setHoveredWallet] = useState<string | null>(null);
  const [editingWallet, setEditingWallet] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
  const [syncingWallet, setSyncingWallet] = useState<string | null>(null);
  const [addingWallet, setAddingWallet] = useState(false);

  // Get drive and documents for account/transactions document management
  const [selectedDrive] = useSelectedDrive();
  const allDocuments = useDocumentsInSelectedDrive();

  // Check sync status
  const { needsSync, outdatedWallets, tagChangedWallets } =
    useWalletSync(wallets);
  const { syncWallet } = useSyncWallet();

  const handleAddWallet = async () => {
    console.log('[WalletsTable] handleAddWallet called');
    const trimmedAddress = newWalletAddress.trim();

    if (!trimmedAddress) {
      console.log('[WalletsTable] No wallet address provided');
      return;
    }

    // Check if wallet already exists
    const walletExists = wallets.some((w) => w.wallet === trimmedAddress);

    if (walletExists) {
      setWalletError("This wallet already exists");
      return;
    }

    setAddingWallet(true);
    setWalletError("");

    console.log('[WalletsTable] Starting wallet addition process', {
      address: trimmedAddress,
      name: newWalletName.trim() || undefined,
      driveId: selectedDrive?.header.id,
      documentsCount: allDocuments?.length || 0
    });

    try {
      // First, add the wallet to the expense report
      dispatch(
        actions.addWallet({
          wallet: trimmedAddress,
          name: newWalletName.trim() || undefined,
        })
      );

      // Then, process account and transactions documents
      const driveId = selectedDrive?.header.id;
      
      console.log('[WalletsTable] Drive information:', {
        hasSelectedDrive: !!selectedDrive,
        driveId,
        driveHeader: selectedDrive?.header,
        driveName: selectedDrive?.header?.name
      });
      
      if (!driveId) {
        console.warn('[WalletsTable] No drive selected - documents will be created but not added to drive');
        // Still proceed, but documents won't be added to drive
      }

      console.log('[WalletsTable] Processing wallet account documents...', {
        driveId,
        hasDrive: !!selectedDrive,
        hasDocuments: !!allDocuments,
        documentsCount: allDocuments?.length || 0
      });
      
      const result = await walletAccountService.processWalletAddition(
        trimmedAddress,
        newWalletName.trim() || undefined,
        driveId,
        allDocuments
      );

      console.log('[WalletsTable] Wallet account service result:', result);

      if (result.success) {
        // Update wallet with document IDs
        if (result.accountDocumentId || result.accountTransactionsDocumentId) {
          console.log('[WalletsTable] Updating wallet with document IDs:', {
            accountDocumentId: result.accountDocumentId,
            accountTransactionsDocumentId: result.accountTransactionsDocumentId
          });
          dispatch(
            actions.updateWallet({
              address: trimmedAddress,
              accountDocumentId: result.accountDocumentId || undefined,
              accountTransactionsDocumentId: result.accountTransactionsDocumentId || undefined,
            })
          );
        } else {
          console.warn('[WalletsTable] Service succeeded but no document IDs returned');
        }
        
        // Note: Documents are created and added to the drive, but the UI may need a moment to refresh
        // The useDocumentsInSelectedDrive hook should automatically detect the new documents
        console.log('[WalletsTable] Documents created successfully. UI should refresh automatically.');
      } else {
        console.error('[WalletsTable] Failed to process wallet account documents:', result.message);
        // Show error to user
        setWalletError(`Wallet added, but failed to link documents: ${result.message}`);
      }

      setNewWalletAddress("");
      setNewWalletName("");
    } catch (error) {
      console.error("Error adding wallet:", error);
      setWalletError("Failed to add wallet. Please try again.");
    } finally {
      setAddingWallet(false);
    }
  };

  const handleStartEditName = (wallet: Wallet) => {
    setEditingWallet(wallet.wallet || null);
    setEditingName(wallet.name || "");
  };

  const handleSaveEditName = (walletAddress: string) => {
    const wallet = wallets.find((w) => w.wallet === walletAddress);
    const trimmedName = editingName.trim();

    // Only update if the name has changed
    if (trimmedName && wallet && trimmedName !== (wallet.name || "")) {
      dispatch(
        actions.updateWallet({
          address: walletAddress,
          name: trimmedName,
        })
      );
    }
    setEditingWallet(null);
    setEditingName("");
  };

  const handleCancelEditName = () => {
    setEditingWallet(null);
    setEditingName("");
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedWallet(address);
    setTimeout(() => setCopiedWallet(null), 2000);
  };

  const formatAddress = (address: string) => {
    if (!address || address.length < 11) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 5)}`;
  };

  const handleSyncWallet = async (wallet: Wallet) => {
    if (
      !wallet.wallet ||
      !wallet.billingStatements ||
      wallet.billingStatements.length === 0
    ) {
      return;
    }

    setSyncingWallet(wallet.wallet);

    try {
      // Remove all existing line items first
      const lineItemsToRemove = [...(wallet.lineItems || [])];
      lineItemsToRemove.forEach((item) => {
        if (item?.id) {
          dispatch(
            actions.removeLineItem({
              wallet: wallet.wallet!,
              lineItemId: item.id,
            })
          );
        }
      });

      // Re-extract line items from billing statements
      const billingStatementIds = wallet.billingStatements.filter(
        (id): id is string => id !== null && id !== undefined
      );
      syncWallet(wallet.wallet, billingStatementIds, groups, dispatch);

      // Small delay to show sync animation
      setTimeout(() => {
        setSyncingWallet(null);
      }, 500);
    } catch (error) {
      console.error("Error syncing wallet:", error);
      setSyncingWallet(null);
    }
  };

  const handleRemoveWallet = (walletAddress: string) => {
    dispatch(
      actions.removeWallet({
        wallet: walletAddress,
      })
    );
  };

  // Calculate totals for a wallet
  const calculateWalletTotals = (wallet: Wallet) => {
    const lineItems = wallet.lineItems || [];
    return {
      budget: lineItems.reduce((sum, item) => sum + (item?.budget || 0), 0),
      forecast: lineItems.reduce((sum, item) => sum + (item?.forecast || 0), 0),
      actuals: lineItems.reduce((sum, item) => sum + (item?.actuals || 0), 0),
      difference: lineItems.reduce((sum, item) => {
        const budget = item?.budget || 0;
        const actuals = item?.actuals || 0;
        return sum + (actuals - budget);
      }, 0),
      payments: lineItems.reduce((sum, item) => sum + (item?.payments || 0), 0),
    };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      {/* Wallets Table */}
      {wallets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Wallet
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Monthly Budget
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Forecast
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center justify-end gap-2">
                    {needsSync && (
                      <button
                        onClick={() => {
                          // Sync all outdated wallets
                          [...tagChangedWallets, ...outdatedWallets].forEach(
                            (walletAddress) => {
                              const wallet = wallets.find(
                                (w) => w.wallet === walletAddress
                              );
                              if (wallet) {
                                handleSyncWallet(wallet);
                              }
                            }
                          );
                        }}
                        disabled={syncingWallet !== null}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                          tagChangedWallets.length > 0
                            ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 animate-pulse"
                            : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 animate-pulse"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={
                          tagChangedWallets.length > 0
                            ? "ALERT: Tags have changed in billing statements - sync all wallets!"
                            : "Sync all wallets with latest billing statements"
                        }
                      >
                        <RefreshCw
                          size={16}
                          className={
                            syncingWallet !== null ? "animate-spin" : ""
                          }
                        />
                      </button>
                    )}
                    <span>Actuals</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Difference
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Payments
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {wallets.map((wallet) => {
                const totals = calculateWalletTotals(wallet);
                const isHovered = hoveredWallet === wallet.wallet;

                return (
                  <tr
                    key={wallet.wallet}
                    onMouseEnter={() => setHoveredWallet(wallet.wallet || null)}
                    onMouseLeave={() => setHoveredWallet(null)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingWallet === wallet.wallet ? (
                        <div className="flex items-center gap-2">
                          <TextInput
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            placeholder="Enter wallet name"
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveEditName(wallet.wallet || "");
                              } else if (e.key === "Escape") {
                                handleCancelEditName();
                              }
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() =>
                              handleSaveEditName(wallet.wallet || "")
                            }
                            className="inline-flex items-center justify-center w-7 h-7 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                            title="Save"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={handleCancelEditName}
                            className="inline-flex items-center justify-center w-7 h-7 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/20 rounded-md transition-colors"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {wallet.name || "Unnamed Wallet"}
                          </span>
                          <button
                            onClick={() => handleStartEditName(wallet)}
                            className="inline-flex items-center justify-center w-6 h-6 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            title="Edit name"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() =>
                              handleCopyAddress(wallet.wallet || "")
                            }
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 font-mono hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title={`Copy address: ${wallet.wallet}`}
                          >
                            {formatAddress(wallet.wallet || "")}
                            {copiedWallet === wallet.wallet ? (
                              <CheckCheck
                                size={12}
                                className="text-green-500"
                              />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                          {/* <button className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 font-mono hover:bg-blue-100 dark:hover:bg-gray-700 rounded transition-colors">
                            View Txns
                          </button> */}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                      {formatCurrency(totals.budget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                      {formatCurrency(totals.forecast)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {totals.actuals === 0 &&
                      (!wallet.billingStatements ||
                        wallet.billingStatements.length === 0) ? (
                        // When actuals is 0 and no billing statements, only show the Add Bills button
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() =>
                              onAddBillingStatement(wallet.wallet || "")
                            }
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                            title="Add billing statement for this wallet"
                          >
                            <Plus size={16} />
                            <span>Add Bills</span>
                          </button>
                        </div>
                      ) : (
                        // When actuals is not 0 or has billing statements, show compact buttons + value horizontally
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              onAddBillingStatement(wallet.wallet || "")
                            }
                            className="inline-flex items-center justify-center w-8 h-8 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                            title="Add billing statement for this wallet"
                          >
                            <Plus size={16} />
                          </button>
                          {wallet.billingStatements &&
                            wallet.billingStatements.length > 0 && (
                              <button
                                onClick={() => handleSyncWallet(wallet)}
                                disabled={syncingWallet === wallet.wallet}
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                                  tagChangedWallets.includes(
                                    wallet.wallet || ""
                                  )
                                    ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 animate-pulse"
                                    : outdatedWallets.includes(
                                          wallet.wallet || ""
                                        )
                                      ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 animate-pulse"
                                      : "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                title={
                                  tagChangedWallets.includes(
                                    wallet.wallet || ""
                                  )
                                    ? "ALERT: Tags have changed - sync required!"
                                    : outdatedWallets.includes(
                                          wallet.wallet || ""
                                        )
                                      ? "Sync needed - billing statements updated"
                                      : "Sync with latest billing statements"
                                }
                              >
                                <RefreshCw
                                  size={16}
                                  className={
                                    syncingWallet === wallet.wallet
                                      ? "animate-spin"
                                      : ""
                                  }
                                />
                              </button>
                            )}
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(totals.actuals)}
                          </span>
                        </div>
                      )}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                        totals.difference > 0
                          ? "text-red-600 dark:text-red-400"
                          : totals.difference < 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {formatCurrency(totals.difference)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                      {formatCurrency(totals.payments)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleRemoveWallet(wallet.wallet || "")
                          }
                          className="inline-flex items-center justify-center w-8 h-8 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          title="Remove wallet"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            No wallets added yet. Add a wallet to get started.
          </p>
        </div>
      )}

      {/* Add Wallet Form */}
      <div className="flex items-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Wallet Name
          </label>
          <TextInput
            value={newWalletName}
            onChange={(e) => setNewWalletName(e.target.value)}
            placeholder="Enter wallet name (optional)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddWallet();
              }
            }}
          />
        </div>
        <div className="flex-1 relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Wallet Address
          </label>
          <TextInput
            value={newWalletAddress}
            onChange={(e) => {
              setNewWalletAddress(e.target.value);
              setWalletError(""); // Clear error when typing
            }}
            placeholder="Enter wallet address (e.g., 0x1234...)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddWallet();
              }
            }}
          />
          {walletError && (
            <div className="absolute left-0 right-0 top-full mt-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md shadow-lg z-10">
              <p className="text-sm text-red-600 dark:text-red-400">
                {walletError}
              </p>
            </div>
          )}
        </div>
        <Button onClick={handleAddWallet} disabled={!newWalletAddress.trim() || addingWallet}>
          {addingWallet ? "Adding..." : "Add Wallet"}
        </Button>
      </div>
    </div>
  );
}
