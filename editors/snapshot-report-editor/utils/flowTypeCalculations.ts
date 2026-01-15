import type {
  SnapshotAccount,
  TransactionFlowType,
} from "../../../document-models/snapshot-report/gen/schema/types.js";

/**
 * Calculate the flow type for a transaction based on account types
 * @param direction - Transaction direction (INFLOW or OUTFLOW)
 * @param accountType - Type of the account the transaction belongs to
 * @param counterPartyType - Type of the counter-party account (if found)
 * @returns The calculated flow type
 */
export function calculateFlowType(
  direction: string,
  accountType: string,
  counterPartyType: string | null,
): TransactionFlowType {
  if (!counterPartyType) {
    return "External";
  }

  // Determine sender and receiver types based on transaction direction
  const fromType = direction === "OUTFLOW" ? accountType : counterPartyType;
  const toType = direction === "OUTFLOW" ? counterPartyType : accountType;

  // Flow categorization rules
  if (fromType === "Source") {
    return "TopUp";
  } else if (toType === "Source") {
    return "Return";
  } else if (toType === "Destination") {
    return "TopUp";
  } else if (fromType === "External") {
    return "External";
  } else if (fromType === "Internal" && toType === "Internal") {
    return "Internal";
  } else if (fromType === "Internal" && toType === "External") {
    return "External";
  }

  return "External";
}

/**
 * Find a counter-party account by address in the snapshot accounts
 * @param counterPartyAddress - The ethereum address of the counter-party
 * @param snapshotAccounts - Array of snapshot accounts to search
 * @returns The matching account or undefined
 */
export function findCounterPartyAccount(
  counterPartyAddress: string | null | undefined,
  snapshotAccounts: SnapshotAccount[],
): SnapshotAccount | undefined {
  if (!counterPartyAddress) {
    return undefined;
  }

  return snapshotAccounts.find(
    (acc) =>
      acc.accountAddress.toLowerCase() === counterPartyAddress.toLowerCase(),
  );
}

/**
 * Calculate flow type and counter-party account ID for a transaction
 * @param direction - Transaction direction
 * @param accountType - Type of the account
 * @param counterPartyAddress - Counter-party ethereum address
 * @param snapshotAccounts - All snapshot accounts for lookup
 * @returns Object with flowType and counterPartyAccountId
 */
export function calculateTransactionFlowInfo(
  direction: string,
  accountType: string,
  counterPartyAddress: string | null | undefined,
  snapshotAccounts: SnapshotAccount[],
): {
  flowType: TransactionFlowType;
  counterPartyAccountId: string | null;
} {
  const counterPartyAccount = findCounterPartyAccount(
    counterPartyAddress,
    snapshotAccounts,
  );

  const flowType = calculateFlowType(
    direction,
    accountType,
    counterPartyAccount?.type ?? null,
  );

  return {
    flowType,
    counterPartyAccountId: counterPartyAccount?.id ?? null,
  };
}
