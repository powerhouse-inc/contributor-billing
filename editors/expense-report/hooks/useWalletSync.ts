import { useMemo } from "react";
import { useSelectedDriveDocuments } from "@powerhousedao/reactor-browser";
import type { Wallet } from "../../../document-models/expense-report/gen/types.js";

interface SyncStatus {
  needsSync: boolean;
  outdatedWallets: string[]; // wallet addresses that need sync
  tagChangedWallets: string[]; // wallet addresses with tag changes
}

export function useWalletSync(wallets: Wallet[]): SyncStatus {
  const documents = useSelectedDriveDocuments();

  const syncStatus = useMemo(() => {
    if (!documents || wallets.length === 0) {
      return { needsSync: false, outdatedWallets: [], tagChangedWallets: [] };
    }

    // Create a map of billing statement documents
    const billingStatements = new Map<string, any>();
    documents
      .filter((doc: any) => doc.header.documentType === "powerhouse/billing-statement")
      .forEach((doc: any) => {
        billingStatements.set(doc.header.id, doc);
      });

    const outdatedWallets: string[] = [];
    const tagChangedWallets: string[] = [];

    // Check each wallet
    wallets.forEach((wallet) => {
      if (!wallet.billingStatements || wallet.billingStatements.length === 0) {
        return; // No billing statements to sync
      }

      // Get current line items count and total for this wallet
      const currentLineItemsCount = wallet.lineItems?.length || 0;
      let currentTotal = 0;
      wallet.lineItems?.forEach((item) => {
        currentTotal += item?.actuals || 0;
      });

      // Calculate what the line items should be based on billing statements
      let expectedLineItemsCount = 0;
      let expectedTotal = 0;
      const expectedTags = new Set<string>();

      wallet.billingStatements.forEach((statementId) => {
        if (!statementId) return;
        const statement = billingStatements.get(statementId);
        if (statement?.state?.global?.lineItems) {
          expectedLineItemsCount += statement.state.global.lineItems.length;
          statement.state.global.lineItems.forEach((item: any) => {
            expectedTotal += item.totalPriceCash || 0;
            // Collect tags from billing statement
            const expenseAccountTag = item.lineItemTag?.find(
              (tag: any) => tag.dimension === "expense-account"
            );
            if (expenseAccountTag?.label) {
              expectedTags.add(expenseAccountTag.label);
            }
          });
        }
      });

      // Check current tags in wallet line items
      const currentTags = new Set<string>();
      wallet.lineItems?.forEach((item) => {
        if (item?.group) {
          // We need to map the group ID back to label to compare
          // This is a simplified check - just checking if tags exist
          currentTags.add(item.group);
        }
      });

      // Check if wallet needs sync (count or total mismatch)
      const needsQuantitySync =
        currentLineItemsCount !== expectedLineItemsCount ||
        Math.abs(currentTotal - expectedTotal) > 0.01; // Account for floating point precision

      // Check if tags have changed (size mismatch suggests tag changes)
      const hasTagChanges = expectedTags.size > 0 && currentTags.size !== expectedTags.size;

      if (needsQuantitySync || hasTagChanges) {
        if (wallet.wallet) {
          outdatedWallets.push(wallet.wallet);
          if (hasTagChanges) {
            tagChangedWallets.push(wallet.wallet);
          }
        }
      }
    });

    return {
      needsSync: outdatedWallets.length > 0,
      outdatedWallets,
      tagChangedWallets,
    };
  }, [documents, wallets]);

  return syncStatus;
}
