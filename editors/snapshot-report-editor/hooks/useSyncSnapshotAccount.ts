/**
 * Hook for syncing snapshot accounts with account transactions documents
 * Similar to useSyncWallet in expense-report
 */

import {
  useDocumentsInSelectedDrive,
  useSelectedDrive,
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

      // Step 4: Update snapshot report transactions
      // Remove existing transactions for this account
      const existingTxIds = snapshotAccount.transactions.map((tx) => tx.id);
      existingTxIds.forEach((txId) => {
        dispatch(transactionsActions.removeTransaction({ id: txId }));
      });

      // Add filtered transactions
      for (const tx of periodTransactions) {
        // Calculate flow type before dispatch so it's stored in operation history
        const { flowType, counterPartyAccountId } =
          calculateTransactionFlowInfo(
            tx.direction,
            snapshotAccount.type,
            tx.counterParty,
            allSnapshotAccounts.length > 0
              ? allSnapshotAccounts
              : [snapshotAccount],
          );

        dispatch(
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

      // Step 5: Calculate and update balances
      // Get all transactions (including those before period for opening balance)
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
            id: String(tx.id), // Ensure it's a string (OID)
            transactionId: String(tx.id), // transactionId is String type
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

      // Update starting balances
      const existingStartingBalanceIds = snapshotAccount.startingBalances.map(
        (b) => b.id,
      );
      existingStartingBalanceIds.forEach((balanceId) => {
        dispatch(
          balancesActions.removeStartingBalance({
            accountId: snapshotAccount.id,
            balanceId,
          }),
        );
      });

      balances.forEach((balance, _token) => {
        const balanceId = generateId();
        dispatch(
          balancesActions.setStartingBalance({
            accountId: snapshotAccount.id,
            balanceId,
            token: balance.token,
            amount: balance.opening,
          }),
        );
      });

      // Update ending balances
      const existingEndingBalanceIds = snapshotAccount.endingBalances.map(
        (b) => b.id,
      );
      existingEndingBalanceIds.forEach((balanceId) => {
        dispatch(
          balancesActions.removeEndingBalance({
            accountId: snapshotAccount.id,
            balanceId,
          }),
        );
      });

      balances.forEach((balance, _token) => {
        const balanceId = generateId();
        dispatch(
          balancesActions.setEndingBalance({
            accountId: snapshotAccount.id,
            balanceId,
            token: balance.token,
            amount: balance.closing,
          }),
        );
      });

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

      // Remove existing transactions for this account
      const existingTxIds = snapshotAccount.transactions.map((tx) => tx.id);
      existingTxIds.forEach((txId) => {
        dispatch(transactionsActions.removeTransaction({ id: txId }));
      });

      // Add derived transactions
      for (const tx of periodTransactions) {
        dispatch(
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

      // Calculate balances using ALL derived transactions (not just period)
      // This gives us cumulative "funds provided" / "funds received"
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

      // Update starting balances
      const existingStartingBalanceIds = snapshotAccount.startingBalances.map(
        (b) => b.id,
      );
      existingStartingBalanceIds.forEach((balanceId) => {
        dispatch(
          balancesActions.removeStartingBalance({
            accountId: snapshotAccount.id,
            balanceId,
          }),
        );
      });

      balances.forEach((balance, _token) => {
        const balanceId = generateId();
        dispatch(
          balancesActions.setStartingBalance({
            accountId: snapshotAccount.id,
            balanceId,
            token: balance.token,
            amount: balance.opening,
          }),
        );
      });

      // Update ending balances
      const existingEndingBalanceIds = snapshotAccount.endingBalances.map(
        (b) => b.id,
      );
      existingEndingBalanceIds.forEach((balanceId) => {
        dispatch(
          balancesActions.removeEndingBalance({
            accountId: snapshotAccount.id,
            balanceId,
          }),
        );
      });

      balances.forEach((balance, _token) => {
        const balanceId = generateId();
        dispatch(
          balancesActions.setEndingBalance({
            accountId: snapshotAccount.id,
            balanceId,
            token: balance.token,
            amount: balance.closing,
          }),
        );
      });

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
