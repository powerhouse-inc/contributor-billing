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
import {
  balancesActions,
  transactionsActions,
} from "../../../document-models/snapshot-report/index.js";
import { calculateBalances } from "../utils/balanceCalculations.js";
// deriveTransactionsForAccount not used - syncNonInternalAccount fetches from AccountTransactions docs directly
import type {
  SnapshotAccount,
  SnapshotTransaction,
  TransactionFlowType,
} from "../../../document-models/snapshot-report/gen/types.js";
import type { AccountEntry } from "../../../document-models/accounts/gen/schema/types.js";
import { calculateTransactionFlowInfo } from "../utils/flowTypeCalculations.js";

/**
 * Calculate starting balances for non-Internal accounts from Internal account transactions
 */
function calculateNonInternalStartingBalances(
  allTransactions: any[],
  nonInternalAccounts: SnapshotAccount[],
  startDate: string,
): Map<string, Map<string, { value: string; unit: string }>> {
  const start = new Date(startDate);
  const result = new Map<
    string,
    Map<string, { value: string; unit: string }>
  >();

  for (const account of nonInternalAccounts) {
    const addressLower = account.accountAddress.toLowerCase();
    const tokenBalances = new Map<string, number>();

    // Find pre-period transactions where this account is counter-party
    for (const tx of allTransactions) {
      if (!tx.counterParty || tx.counterParty.toLowerCase() !== addressLower)
        continue;
      const txDate = new Date(tx.datetime);
      if (txDate >= start) continue;

      const token = tx.details?.token || tx.token || "";
      const amountObj = tx.amount as { value?: string; unit?: string } | string;
      const amountValue = parseFloat(
        typeof amountObj === "object"
          ? amountObj.value || "0"
          : String(amountObj).split(" ")[0],
      );

      // Invert direction: Internal OUTFLOW = non-Internal INFLOW
      const invertedDirection =
        tx.direction === "OUTFLOW" ? "INFLOW" : "OUTFLOW";
      const effect =
        account.type === "Source"
          ? invertedDirection === "OUTFLOW"
            ? amountValue
            : -amountValue
          : invertedDirection === "INFLOW"
            ? amountValue
            : -amountValue;

      tokenBalances.set(token, (tokenBalances.get(token) || 0) + effect);
    }

    const balances = new Map<string, { value: string; unit: string }>();
    tokenBalances.forEach((value, token) => {
      if (Math.abs(value) > 1e-10) {
        balances.set(token, { value: value.toString(), unit: token });
      }
    });
    result.set(account.id, balances);
  }

  return result;
}

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

      // 7. Update starting balances for non-Internal accounts from this Internal's transactions
      const nonInternalAccounts = allSnapshotAccounts.filter(
        (a) => a.type !== "Internal" && a.id !== snapshotAccount.id,
      );
      if (nonInternalAccounts.length > 0) {
        const nonInternalBalances = calculateNonInternalStartingBalances(
          allTransactions,
          nonInternalAccounts,
          startDate,
        );

        nonInternalBalances.forEach((tokenBalances, accountId) => {
          const account = allSnapshotAccounts.find((a) => a.id === accountId);
          if (!account) return;

          // Remove existing starting balances for this account
          account.startingBalances.forEach((b) => {
            allActions.push(
              balancesActions.removeStartingBalance({
                accountId,
                balanceId: b.id,
              }),
            );
          });

          // Add new starting balances
          tokenBalances.forEach((amount, token) => {
            allActions.push(
              balancesActions.setStartingBalance({
                accountId,
                balanceId: generateId(),
                token,
                amount,
              }),
            );
          });
        });
      }

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
   * Uses FULL transaction history from AccountTransactions documents (not just snapshot transactions)
   * to correctly calculate opening balances from pre-period transactions
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
      // Get Internal accounts
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

      // For starting balance calculation, we need ALL transactions from Internal accounts,
      // not just the ones in the snapshot. Fetch from AccountTransactions documents.
      const accountAddressLower = snapshotAccount.accountAddress.toLowerCase();
      const allDerivedTransactions: Array<{
        id: string;
        transactionId: string;
        counterParty: string;
        counterPartyAccountId: string;
        amount: { value: string; unit: string };
        datetime: string;
        txHash: string;
        token: string;
        blockNumber: number | null;
        direction: "INFLOW" | "OUTFLOW";
        flowType: TransactionFlowType;
      }> = [];

      // Scan ALL transactions from each Internal account's AccountTransactions document
      for (const internalAccount of internalAccounts) {
        const accountTxDocId = internalAccount.accountTransactionsId;
        if (!accountTxDocId) continue;

        // Find the AccountTransactions document
        const txDoc = documents?.find(
          (doc) =>
            doc.header.id === accountTxDocId &&
            doc.header.documentType === "powerhouse/account-transactions",
        ) as any;

        if (!txDoc?.state?.global?.transactions) continue;

        const allTxFromDoc = txDoc.state.global.transactions as any[];

        // Find transactions where non-Internal account is counter-party
        for (const tx of allTxFromDoc) {
          if (tx.counterParty?.toLowerCase() === accountAddressLower) {
            // Invert direction from Internal's perspective to non-Internal's perspective
            const invertedDirection: "INFLOW" | "OUTFLOW" =
              tx.direction === "INFLOW" ? "OUTFLOW" : "INFLOW";

            // Calculate flow type
            const flowType = calculateTransactionFlowInfo(
              invertedDirection,
              snapshotAccount.type,
              internalAccount.accountAddress,
              allSnapshotAccounts,
            ).flowType;

            // Parse amount
            const txAmount = tx.amount as
              | { value?: string; unit?: string }
              | string;
            let amount: { value: string; unit: string };
            if (typeof txAmount === "object" && txAmount.value !== undefined) {
              amount = {
                value: txAmount.value,
                unit: txAmount.unit || tx.details?.token || "",
              };
            } else if (typeof txAmount === "string") {
              amount = {
                value: txAmount.split(" ")[0] || "0",
                unit: tx.details?.token || "",
              };
            } else {
              amount = { value: "0", unit: tx.details?.token || "" };
            }

            allDerivedTransactions.push({
              id: generateId(),
              transactionId: tx.id,
              counterParty: internalAccount.accountAddress,
              counterPartyAccountId: internalAccount.id,
              amount,
              datetime: tx.datetime,
              txHash: tx.details?.txHash || "",
              token: tx.details?.token || amount.unit,
              blockNumber: tx.details?.blockNumber ?? null,
              direction: invertedDirection,
              flowType,
            });
          }
        }
      }

      // Sort by datetime
      allDerivedTransactions.sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
      );

      // Filter to period for snapshot transactions
      const start = new Date(startDate);
      const end = new Date(endDate);
      const periodTransactions = allDerivedTransactions.filter((tx) => {
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

      // Calculate balances using ALL derived transactions (including pre-period for opening balance)
      const allTransactionsForBalance: SnapshotTransaction[] =
        allDerivedTransactions.map((tx) => ({
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
