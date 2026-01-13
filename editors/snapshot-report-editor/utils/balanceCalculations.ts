/**
 * Utility functions for calculating opening and closing balances
 * from transactions in snapshot reports
 */

import type { SnapshotTransaction } from "../../../document-models/snapshot-report/gen/types.js";
import type { Scalars } from "../../../document-models/snapshot-report/gen/schema/types.js";

export type Amount_Currency = Scalars["Amount_Currency"]["output"];

export interface TokenBalance {
  token: string;
  opening: Amount_Currency;
  closing: Amount_Currency;
}

/**
 * Calculate opening and closing balances for all tokens from transactions
 * @param transactions - All transactions for the account
 * @param startDate - Period start date (ISO string)
 * @param endDate - Period end date (ISO string)
 * @returns Map of token to balance information
 */
export function calculateBalances(
  transactions: SnapshotTransaction[],
  startDate: string,
  endDate: string,
): Map<string, TokenBalance> {
  const balances = new Map<string, TokenBalance>();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Process all transactions
  transactions.forEach((tx) => {
    const txDate = new Date(tx.datetime);
    const token = tx.token;

    // Initialize balance for this token if not exists
    if (!balances.has(token)) {
      balances.set(token, {
        token,
        opening: { value: "0", unit: token },
        closing: { value: "0", unit: token },
      });
    }

    const balance = balances.get(token)!;
    const amountValue = parseFloat(
      typeof tx.amount === "object" && tx.amount?.value !== undefined
        ? tx.amount.value
        : String(tx.amount).split(" ")[0] || "0",
    );

    // Calculate opening balance (transactions before period start)
    if (txDate < start) {
      if (tx.direction === "INFLOW") {
        const currentOpening = parseFloat(balance.opening.value || "0");
        balance.opening.value = (currentOpening + amountValue).toString();
      } else if (tx.direction === "OUTFLOW") {
        const currentOpening = parseFloat(balance.opening.value || "0");
        balance.opening.value = (currentOpening - amountValue).toString();
      }
    }

    // Calculate closing balance (opening + transactions during period)
    if (txDate >= start && txDate <= end) {
      if (tx.direction === "INFLOW") {
        const currentClosing = parseFloat(balance.closing.value || "0");
        balance.closing.value = (currentClosing + amountValue).toString();
      } else if (tx.direction === "OUTFLOW") {
        const currentClosing = parseFloat(balance.closing.value || "0");
        balance.closing.value = (currentClosing - amountValue).toString();
      }
    }
  });

  // Finalize closing balances (opening + period changes)
  balances.forEach((balance) => {
    const openingValue = parseFloat(balance.opening.value || "0");
    const periodChange = parseFloat(balance.closing.value || "0");
    balance.closing.value = (openingValue + periodChange).toString();
  });

  return balances;
}

/**
 * Format balance amount for display
 */
export function formatBalance(amount: Amount_Currency): string {
  if (typeof amount === "object" && amount?.value !== undefined) {
    const value = parseFloat(amount.value);
    return `${value.toFixed(6)} ${amount.unit || ""}`.trim();
  }
  return String(amount);
}
