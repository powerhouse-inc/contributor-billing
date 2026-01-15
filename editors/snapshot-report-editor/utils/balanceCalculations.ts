/**
 * Utility functions for calculating opening and closing balances
 * from transactions in snapshot reports
 */

import type { SnapshotTransaction } from "../../../document-models/snapshot-report/gen/types.js";
import type {
  Scalars,
  AccountType,
} from "../../../document-models/snapshot-report/gen/schema/types.js";

export type Amount_Currency = Scalars["Amount_Currency"]["output"];

export interface TokenBalance {
  token: string;
  opening: Amount_Currency;
  closing: Amount_Currency;
}

/**
 * Calculate the effect of a transaction on balance based on account type
 *
 * - Internal accounts: Standard balance (INFLOW +, OUTFLOW -)
 * - Source accounts: Track "cumulative provided" (OUTFLOW = funds sent to team = positive)
 * - Destination accounts: Track "cumulative received" (INFLOW = funds received from team = positive)
 * - External accounts: Net flows with team (standard balance)
 */
function getTransactionEffect(
  direction: string,
  amountValue: number,
  accountType?: string,
): number {
  // For Source accounts: OUTFLOW means funds provided (positive)
  if (accountType === "Source") {
    return direction === "OUTFLOW" ? amountValue : -amountValue;
  }

  // For Destination accounts: INFLOW means funds received (positive)
  if (accountType === "Destination") {
    return direction === "INFLOW" ? amountValue : -amountValue;
  }

  // For Internal and External accounts: Standard balance
  // INFLOW = positive, OUTFLOW = negative
  return direction === "INFLOW" ? amountValue : -amountValue;
}

/**
 * Calculate opening and closing balances for all tokens from transactions
 * @param transactions - All transactions for the account
 * @param startDate - Period start date (ISO string)
 * @param endDate - Period end date (ISO string)
 * @param accountType - Optional account type for type-specific balance logic
 * @returns Map of token to balance information
 */
export function calculateBalances(
  transactions: SnapshotTransaction[],
  startDate: string,
  endDate: string,
  accountType?: AccountType,
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
    let amountStr: string;
    const txAmount = tx.amount as { value?: string; unit?: string } | string;
    if (typeof txAmount === "object" && txAmount?.value !== undefined) {
      amountStr = txAmount.value;
    } else if (typeof txAmount === "string") {
      amountStr = txAmount.split(" ")[0] || "0";
    } else {
      amountStr = "0";
    }
    const amountValue = parseFloat(amountStr);

    const effect = getTransactionEffect(tx.direction, amountValue, accountType);

    // Calculate opening balance (transactions before period start)
    if (txDate < start) {
      const currentOpening = parseFloat(balance.opening.value || "0");
      balance.opening.value = (currentOpening + effect).toString();
    }

    // Calculate period change (transactions during period)
    if (txDate >= start && txDate <= end) {
      const currentClosing = parseFloat(balance.closing.value || "0");
      balance.closing.value = (currentClosing + effect).toString();
    }
  });

  // Finalize closing balances (opening + period changes)
  // Clamp to 0 if very small negative (floating-point precision errors)
  balances.forEach((balance) => {
    const openingValue = parseFloat(balance.opening.value || "0");
    const periodChange = parseFloat(balance.closing.value || "0");
    const closingValue = openingValue + periodChange;

    // Clamp small negative values to 0 (floating-point precision fix)
    balance.opening.value = Math.max(0, openingValue).toString();
    balance.closing.value = Math.max(0, closingValue).toString();
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
  // Amount_Currency should always be an object with value/unit
  return "0";
}
