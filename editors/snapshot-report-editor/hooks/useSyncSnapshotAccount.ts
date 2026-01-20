/**
 * Hook for syncing snapshot accounts with account transactions documents
 * Similar to useSyncWallet in expense-report
 */

import {
  useDocumentsInSelectedDrive,
  useSelectedDrive,
  dispatchActions,
} from "@powerhousedao/reactor-browser";
import { generateId } from "document-model/core";
import { accountTransactionsService } from "../../accounts-editor/services/accountTransactionsService.js";
import { actions as accountsActions } from "../../../document-models/accounts/index.js";
import {
  actions as snapshotActions,
  balancesActions,
  transactionsActions,
} from "../../../document-models/snapshot-report/index.js";
import { calculateBalances } from "../utils/balanceCalculations.js";
import { deriveTransactionsForAccount } from "../utils/deriveTransactions.js";
import type {
  SnapshotAccount,
  SnapshotTransaction,
} from "../../../document-models/snapshot-report/gen/types.js";
import type { AccountEntry } from "../../../document-models/accounts/gen/schema/types.js";
import { calculateTransactionFlowInfo } from "../utils/flowTypeCalculations.js";

export function useSyncSnapshotAccount() {
  const documents = useDocumentsInSelectedDrive();
  const [selectedDrive] = useSelectedDrive();

  const syncAccount = async (
    snapshotAccount: SnapshotAccount,
    accountEntry: AccountEntry | undefined,
    accountsDocumentId: string | null | undefined,
    startDate: string | null | undefined,
    endDate: string | null | undefined,
    dispatch: any,
    allSnapshotAccounts: SnapshotAccount[] = [],
    snapshotDocumentId?: string,
  ): Promise<{
    success: boolean;
    message: string;
    transactionsAdded?: number;
    documentId?: string;
  }> => {
    if (!documents || !startDate || !endDate) {
      return {
        success: false,
        message: "Missing required data (documents, startDate, or endDate)",
      };
    }

    try {
      // Handle non-Internal accounts differently - derive from Internal accounts
      if (snapshotAccount.type !== "Internal") {
        return await syncNonInternalAccount(
          snapshotAccount,
          startDate,
          endDate,
          dispatch,
          allSnapshotAccounts,
          snapshotDocumentId,
        );
      }

      // For Internal accounts: sync from AccountTransactions document
      // Step 1: Ensure account transactions document exists
      let accountTransactionsDocId = snapshotAccount.accountTransactionsId;

      if (!accountTransactionsDocId && accountEntry) {
        // Create account transactions document
        const driveId = selectedDrive?.header?.id;
        if (!driveId) {
          return {
            success: false,
            message: "No drive selected",
          };
        }

        const result =
          await accountTransactionsService.createAccountTransactionsDocument(
            accountEntry,
            accountsDocumentId || "",
            driveId,
          );

        if (!result.success || !result.documentId) {
          return {
            success: false,
            message:
              result.message ||
              "Failed to create account transactions document",
          };
        }

        accountTransactionsDocId = result.documentId;
      }

      // Step 2: Get account transactions document
      if (!accountTransactionsDocId) {
        return {
          success: false,
          message: "No account transactions document available",
        };
      }

      const txDoc = documents.find(
        (doc) =>
          doc.header.id === accountTransactionsDocId &&
          doc.header.documentType === "powerhouse/account-transactions",
      ) as any;

      if (!txDoc?.state?.global?.transactions) {
        return {
          success: false,
          message:
            "Account transactions document not found or has no transactions",
        };
      }

      const allTransactions = txDoc.state.global.transactions as any[];

      // Step 3: Filter transactions by period
      const start = new Date(startDate);
      const end = new Date(endDate);
      const periodTransactions = allTransactions.filter((tx: any) => {
        if (!tx?.datetime) return false;
        const txDate = new Date(tx.datetime);
        if (isNaN(txDate.getTime())) return false;
        return txDate >= start && txDate <= end;
      });

      // Step 4: Check if transactions have changed before updating
      // Compare by transactionId to detect actual changes
      const existingTransactionIds = new Set(
        snapshotAccount.transactions.map((tx) => tx.transactionId),
      );
      const newTransactionIds = new Set(
        periodTransactions.map((tx: any) => tx.id as string),
      );

      // Check if the sets are identical (no changes needed)
      const hasChanges =
        existingTransactionIds.size !== newTransactionIds.size ||
        [...existingTransactionIds].some((id) => !newTransactionIds.has(id)) ||
        [...newTransactionIds].some((id) => !existingTransactionIds.has(id));

      if (!hasChanges) {
        return {
          success: true,
          message: "No changes detected - already in sync",
          transactionsAdded: snapshotAccount.transactions.length,
          documentId: accountTransactionsDocId,
        };
      }

      // Step 5: Calculate balances BEFORE making any changes
      // Map account transactions format to snapshot transaction format
      const allTransactionsForBalance: SnapshotTransaction[] =
        allTransactions.map((tx: any): SnapshotTransaction => {
          // Extract token from transaction
          const token =
            tx.details?.token ||
            (typeof tx.amount === "object" && tx.amount?.unit
              ? tx.amount.unit
              : typeof tx.amount === "string"
                ? tx.amount.split(" ")[1] || ""
                : "");

          return {
            id: String(tx.id),
            transactionId: String(tx.id),
            counterParty: tx.counterParty || null,
            amount: tx.amount,
            datetime: tx.datetime,
            txHash: tx.details?.txHash || "",
            token: token,
            blockNumber: tx.details?.blockNumber ?? null,
            direction: tx.direction as "INFLOW" | "OUTFLOW",
            flowType: null,
            counterPartyAccountId: null,
          };
        });

      const balances = calculateBalances(
        allTransactionsForBalance,
        startDate,
        endDate,
        snapshotAccount.type,
      );

      // Build all actions into a single batch for efficiency
      const allActions: any[] = [];

      // 1. Remove existing transactions
      snapshotAccount.transactions.forEach((tx) => {
        allActions.push(transactionsActions.removeTransaction({ id: tx.id }));
      });

      // 2. Add new transactions
      for (const tx of periodTransactions) {
        const { flowType, counterPartyAccountId } =
          calculateTransactionFlowInfo(
            tx.direction,
            snapshotAccount.type,
            tx.counterParty,
            allSnapshotAccounts.length > 0
              ? allSnapshotAccounts
              : [snapshotAccount],
          );

        allActions.push(
          transactionsActions.addTransaction({
            accountId: snapshotAccount.id,
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

      // 3. Remove existing starting balances
      snapshotAccount.startingBalances.forEach((b) => {
        allActions.push(
          balancesActions.removeStartingBalance({
            accountId: snapshotAccount.id,
            balanceId: b.id,
          }),
        );
      });

      // 4. Add new starting balances
      balances.forEach((balance) => {
        allActions.push(
          balancesActions.setStartingBalance({
            accountId: snapshotAccount.id,
            balanceId: generateId(),
            token: balance.token,
            amount: balance.opening,
          }),
        );
      });

      // 5. Remove existing ending balances
      snapshotAccount.endingBalances.forEach((b) => {
        allActions.push(
          balancesActions.removeEndingBalance({
            accountId: snapshotAccount.id,
            balanceId: b.id,
          }),
        );
      });

      // 6. Add new ending balances
      balances.forEach((balance) => {
        allActions.push(
          balancesActions.setEndingBalance({
            accountId: snapshotAccount.id,
            balanceId: generateId(),
            token: balance.token,
            amount: balance.closing,
          }),
        );
      });

      // Dispatch all actions in a single batch if we have a document ID
      if (snapshotDocumentId && allActions.length > 0) {
        await dispatchActions(allActions, snapshotDocumentId);
      } else {
        // Fallback to individual dispatches if no document ID
        allActions.forEach((action) => dispatch(action));
      }

      return {
        success: true,
        message: `Synced ${periodTransactions.length} transactions and updated balances`,
        transactionsAdded: periodTransactions.length,
        documentId: accountTransactionsDocId,
      };
    } catch (error) {
      console.error("[useSyncSnapshotAccount] Error syncing account:", error);
      return {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  };

  /**
   * Sync a non-Internal account by deriving transactions from Internal accounts
   */
  const syncNonInternalAccount = async (
    snapshotAccount: SnapshotAccount,
    startDate: string,
    endDate: string,
    dispatch: any,
    allSnapshotAccounts: SnapshotAccount[],
    snapshotDocumentId?: string,
  ): Promise<{
    success: boolean;
    message: string;
    transactionsAdded?: number;
    documentId?: string;
  }> => {
    try {
      // Get Internal accounts with their transactions
      const internalAccounts = allSnapshotAccounts.filter(
        (acc) => acc.type === "Internal",
      );

      if (internalAccounts.length === 0) {
        return {
          success: false,
          message:
            "No Internal accounts found. Import Internal accounts first to derive transactions.",
        };
      }

      // Derive transactions from Internal accounts
      const derivedTransactions = deriveTransactionsForAccount(
        snapshotAccount,
        internalAccounts,
      );

      // Filter to period for snapshot
      const start = new Date(startDate);
      const end = new Date(endDate);
      const periodTransactions = derivedTransactions.filter((tx) => {
        const txDate = new Date(tx.datetime);
        return txDate >= start && txDate <= end;
      });

      // Check if transactions have changed before updating
      const existingTransactionIds = new Set(
        snapshotAccount.transactions.map((tx) => tx.transactionId),
      );
      const newTransactionIds = new Set(
        periodTransactions.map((tx) => tx.transactionId),
      );

      const hasChanges =
        existingTransactionIds.size !== newTransactionIds.size ||
        [...existingTransactionIds].some((id) => !newTransactionIds.has(id)) ||
        [...newTransactionIds].some((id) => !existingTransactionIds.has(id));

      if (!hasChanges) {
        return {
          success: true,
          message: "No changes detected - already in sync",
          transactionsAdded: snapshotAccount.transactions.length,
        };
      }

      // Calculate balances using ALL derived transactions (not just period)
      const allTransactionsForBalance: SnapshotTransaction[] =
        derivedTransactions.map((tx) => ({
          id: tx.id,
          transactionId: tx.transactionId,
          counterParty: tx.counterParty,
          amount: tx.amount,
          datetime: tx.datetime,
          txHash: tx.txHash,
          token: tx.token,
          blockNumber: tx.blockNumber,
          direction: tx.direction,
          flowType: tx.flowType,
          counterPartyAccountId: tx.counterPartyAccountId,
        }));

      const balances = calculateBalances(
        allTransactionsForBalance,
        startDate,
        endDate,
        snapshotAccount.type,
      );

      // Build all actions into a single batch for efficiency
      const allActions: any[] = [];

      // 1. Remove existing transactions
      snapshotAccount.transactions.forEach((tx) => {
        allActions.push(transactionsActions.removeTransaction({ id: tx.id }));
      });

      // 2. Add derived transactions
      for (const tx of periodTransactions) {
        allActions.push(
          transactionsActions.addTransaction({
            accountId: snapshotAccount.id,
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

      // 3. Remove existing starting balances
      snapshotAccount.startingBalances.forEach((b) => {
        allActions.push(
          balancesActions.removeStartingBalance({
            accountId: snapshotAccount.id,
            balanceId: b.id,
          }),
        );
      });

      // 4. Add new starting balances
      balances.forEach((balance) => {
        allActions.push(
          balancesActions.setStartingBalance({
            accountId: snapshotAccount.id,
            balanceId: generateId(),
            token: balance.token,
            amount: balance.opening,
          }),
        );
      });

      // 5. Remove existing ending balances
      snapshotAccount.endingBalances.forEach((b) => {
        allActions.push(
          balancesActions.removeEndingBalance({
            accountId: snapshotAccount.id,
            balanceId: b.id,
          }),
        );
      });

      // 6. Add new ending balances
      balances.forEach((balance) => {
        allActions.push(
          balancesActions.setEndingBalance({
            accountId: snapshotAccount.id,
            balanceId: generateId(),
            token: balance.token,
            amount: balance.closing,
          }),
        );
      });

      // Dispatch all actions in a single batch if we have a document ID
      if (snapshotDocumentId && allActions.length > 0) {
        await dispatchActions(allActions, snapshotDocumentId);
      } else {
        // Fallback to individual dispatches if no document ID
        allActions.forEach((action) => dispatch(action));
      }

      return {
        success: true,
        message: `Derived ${periodTransactions.length} transactions from Internal accounts`,
        transactionsAdded: periodTransactions.length,
      };
    } catch (error) {
      console.error(
        "[useSyncSnapshotAccount] Error syncing non-Internal account:",
        error,
      );
      return {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  };

  return { syncAccount };
}
