import { type ISubgraph } from "@powerhousedao/reactor-api";
import type { PHDocument } from "document-model";
import type { SnapshotReportDocument } from "../../document-models/snapshot-report/index.js";
import type { ExpenseReportDocument } from "../../document-models/expense-report/index.js";
import type { AccountTransactionsDocument } from "../../document-models/account-transactions/index.js";

// Type definitions for builder profile (from external package)
interface BuilderProfileState {
  id: string | null;
  name: string | null;
  code: string | null;
  icon: string | null;
}

// Helper to create a period key from start and end dates
const getPeriodKey = (
  periodStart: string | null | undefined,
  periodEnd: string | null | undefined,
): string | null => {
  if (!periodStart || !periodEnd) return null;
  // Normalize dates to YYYY-MM-DD format for consistent matching
  const startDate = new Date(periodStart);
  const endDate = new Date(periodEnd);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;
  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  return `${formatDate(startDate)}_${formatDate(endDate)}`;
};

// Helper to extract month key from date (format: "JAN2026")
const getMonthKey = (dateStr: string | null): string | null => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  return `${months[date.getMonth()]}${date.getFullYear()}`;
};

// Helper to sort budget statements by month (most recent first)
const sortByMonth = (a: { month: string }, b: { month: string }): number => {
  const parseMonth = (m: string) => {
    const months: Record<string, number> = {
      JAN: 0,
      FEB: 1,
      MAR: 2,
      APR: 3,
      MAY: 4,
      JUN: 5,
      JUL: 6,
      AUG: 7,
      SEP: 8,
      OCT: 9,
      NOV: 10,
      DEC: 11,
    };
    const monthStr = m.substring(0, 3);
    const year = parseInt(m.substring(3), 10);
    return new Date(year, months[monthStr] || 0).getTime();
  };
  return parseMonth(b.month) - parseMonth(a.month);
};

export const getResolvers = (subgraph: ISubgraph): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      budgetStatements: async (
        _: unknown,
        args: { filter?: { teamId?: string; networkSlug?: string } },
      ) => {
        const { teamId, networkSlug } = args.filter || {};

        const drives = await reactor.getDrives();

        // Step 1: Collect all documents from all drives (or filtered by networkSlug)
        const snapshotReportDocs: SnapshotReportDocument[] = [];
        const expenseReportDocs: ExpenseReportDocument[] = [];
        const accountTransactionsDocs = new Map<
          string,
          AccountTransactionsDocument
        >();
        const builderProfileDocs = new Map<string, PHDocument>();

        // If networkSlug is provided, find the network drive and get valid builder PHIDs
        let allowedBuilderPhids: Set<string> | null = null;

        if (networkSlug) {
          const targetNetworkSlug = networkSlug.toLowerCase().trim();

          // Find the network drive matching the slug
          for (const driveId of drives) {
            try {
              const docIds = await reactor.getDocuments(driveId);
              const docs = await Promise.all(
                docIds.map(async (docId) => {
                  try {
                    return await reactor.getDocument<PHDocument>(docId);
                  } catch {
                    return null;
                  }
                }),
              );

              const networkDoc = docs.find((doc) => {
                if (
                  !doc ||
                  doc.header.documentType !== "powerhouse/network-profile"
                )
                  return false;
                const state = (doc.state as { global?: { name?: string } })
                  .global;
                if (!state?.name) return false;
                const slug = state.name
                  .toLowerCase()
                  .trim()
                  .split(/\s+/)
                  .join("-");
                return slug === targetNetworkSlug;
              });

              if (networkDoc) {
                // Get the builders list from this drive
                const buildersDoc = docs.find(
                  (doc) =>
                    doc && doc.header.documentType === "powerhouse/builders",
                );

                if (buildersDoc) {
                  const state = (
                    buildersDoc.state as {
                      global?: { builders?: unknown[] };
                    }
                  ).global;
                  if (Array.isArray(state?.builders)) {
                    allowedBuilderPhids = new Set(
                      state.builders.filter(
                        (id): id is string => typeof id === "string",
                      ),
                    );
                  }
                }
                break;
              }
            } catch (error) {
              console.warn(`Failed to inspect drive ${driveId}:`, error);
            }
          }

          // If no network found or no builders list, return empty results
          if (!allowedBuilderPhids) {
            return [];
          }
        }

        // Always scan all drives - reports may be in different drives than the network drive
        // Filter is applied by ownerId matching allowedBuilderPhids
        const drivesToScan = drives;

        for (const driveId of drivesToScan) {
          const docsIds = await reactor.getDocuments(driveId);

          const docs = await Promise.all(
            docsIds.map(async (docId) =>
              reactor.getDocument<PHDocument>(docId),
            ),
          );

          for (const doc of docs) {
            const docType = doc.header.documentType;

            if (docType === "powerhouse/snapshot-report") {
              const snapshotDoc = doc as SnapshotReportDocument;
              const ownerId = snapshotDoc.state.global.ownerIds?.[0] ?? null;

              // Apply filters: teamId takes precedence, then networkSlug (via allowedBuilderPhids)
              if (teamId && ownerId !== teamId) continue;
              if (
                allowedBuilderPhids &&
                ownerId &&
                !allowedBuilderPhids.has(ownerId)
              )
                continue;

              snapshotReportDocs.push(snapshotDoc);
            } else if (docType === "powerhouse/expense-report") {
              const expenseDoc = doc as ExpenseReportDocument;
              const ownerId = expenseDoc.state.global.ownerId;

              // Apply filters: teamId takes precedence, then networkSlug (via allowedBuilderPhids)
              if (teamId && ownerId !== teamId) continue;
              if (
                allowedBuilderPhids &&
                ownerId &&
                !allowedBuilderPhids.has(ownerId)
              )
                continue;

              expenseReportDocs.push(expenseDoc);
            } else if (docType === "powerhouse/account-transactions") {
              const txDoc = doc as AccountTransactionsDocument;
              accountTransactionsDocs.set(doc.header.id, txDoc);
            } else if (docType === "powerhouse/builder-profile") {
              builderProfileDocs.set(doc.header.id, doc);
            }
          }
        }

        // Step 2: Group reports by ownerId AND period
        // Key format: "ownerId_periodStart_periodEnd"
        const budgetStatementsByOwnerAndPeriod = new Map<
          string,
          {
            ownerId: string;
            periodKey: string;
            snapshotReport: SnapshotReportDocument | null;
            expenseReport: ExpenseReportDocument | null;
          }
        >();

        // Group snapshot reports
        for (const snapshotDoc of snapshotReportDocs) {
          const state = snapshotDoc.state.global;
          const ownerId = state.ownerIds?.[0] ?? null;
          if (!ownerId) continue;

          const periodKey = getPeriodKey(
            state.reportPeriodStart,
            state.reportPeriodEnd,
          );
          if (!periodKey) continue;

          const key = `${ownerId}_${periodKey}`;
          if (!budgetStatementsByOwnerAndPeriod.has(key)) {
            budgetStatementsByOwnerAndPeriod.set(key, {
              ownerId,
              periodKey,
              snapshotReport: null,
              expenseReport: null,
            });
          }
          budgetStatementsByOwnerAndPeriod.get(key)!.snapshotReport =
            snapshotDoc;
        }

        // Group expense reports and match with snapshot reports
        for (const expenseDoc of expenseReportDocs) {
          const state = expenseDoc.state.global;
          const ownerId = state.ownerId;
          if (!ownerId) continue;

          const periodKey = getPeriodKey(state.periodStart, state.periodEnd);
          if (!periodKey) continue;

          const key = `${ownerId}_${periodKey}`;
          if (!budgetStatementsByOwnerAndPeriod.has(key)) {
            budgetStatementsByOwnerAndPeriod.set(key, {
              ownerId,
              periodKey,
              snapshotReport: null,
              expenseReport: null,
            });
          }
          budgetStatementsByOwnerAndPeriod.get(key)!.expenseReport = expenseDoc;
        }

        // Step 3: Build the budget statements
        const budgetStatements = [];

        for (const [
          key,
          { ownerId, periodKey, snapshotReport, expenseReport },
        ] of budgetStatementsByOwnerAndPeriod.entries()) {
          // Get the builder profile for this owner
          let builderProfileDoc = builderProfileDocs.get(ownerId) || null;

          // Try to fetch directly if not found
          if (!builderProfileDoc) {
            try {
              builderProfileDoc =
                await reactor.getDocument<PHDocument>(ownerId);
            } catch {
              // Ignore errors - profile may not exist
            }
          }

          // Build owner object
          const ownerState = builderProfileDoc
            ? ((
                builderProfileDoc.state as unknown as {
                  global: BuilderProfileState;
                }
              )?.global ?? null)
            : null;

          const owner = {
            id: ownerId,
            name: ownerState?.name || "Unknown",
            code: ownerState?.code || "",
            logo: ownerState?.icon || "",
          };

          // Derive the month from the period start date
          const periodStartDate =
            snapshotReport?.state.global.reportPeriodStart ||
            expenseReport?.state.global.periodStart ||
            null;
          const month = getMonthKey(periodStartDate) || periodKey;

          // Build snapshot report data
          const snapshotReportData = snapshotReport
            ? buildSnapshotReportData(snapshotReport, accountTransactionsDocs)
            : {
                startDate: "",
                endDate: "",
                accounts: [],
              };

          // Build expense report data
          const expenseReportData = expenseReport
            ? buildExpenseReportData(expenseReport)
            : {
                periodStart: "",
                periodEnd: "",
                groups: [],
                wallets: [],
              };

          // Get status from expense report state (default to empty string if not available)
          const status = expenseReport?.state.global.status || "DRAFT";

          // Get lastModifiedAtUtcIso from the expense report document header
          const lastModifiedAtUtcIso =
            expenseReport?.header.lastModifiedAtUtcIso || "";

          budgetStatements.push({
            id: key,
            owner,
            month,
            status,
            lastModifiedAtUtcIso,
            snapshotReport: snapshotReportData,
            expenseReport: expenseReportData,
          });
        }

        // Sort by month (most recent first)
        budgetStatements.sort(sortByMonth);

        return budgetStatements;
      },
    },
  };
};

/**
 * Build snapshot report data from a SnapshotReportDocument
 */
function buildSnapshotReportData(
  doc: SnapshotReportDocument,
  accountTransactionsDocs: Map<string, AccountTransactionsDocument>,
) {
  const state = doc.state.global;

  return {
    startDate: state.reportPeriodStart || state.startDate || "",
    endDate: state.reportPeriodEnd || state.endDate || "",
    accounts: state.snapshotAccounts.map((account) => {
      // Build balances from startingBalances and endingBalances
      const balances = account.startingBalances.map((startBal, index) => {
        const endBal = account.endingBalances[index] || {
          amount: { unit: startBal.token, value: "0" },
          token: startBal.token,
        };
        return {
          startingBalance: startBal.amount,
          endingBalance: endBal.amount,
          token: {
            symbol: startBal.token,
            contractAddress: "", // Not available in the document model
          },
        };
      });

      // Build transactions from snapshot account transactions
      const transactions = account.transactions.map((tx) => ({
        id: tx.id,
        datetime: tx.datetime,
        txHash: tx.txHash,
        counterParty: tx.counterParty || "",
        counterPartyName: getCounterPartyName(
          tx.counterPartyAccountId,
          accountTransactionsDocs,
        ),
        amount: {
          value: tx.amount,
          unit: tx.token,
        },
        direction: tx.direction,
        flowType: tx.flowType || "External",
      }));

      return {
        id: account.id,
        name: account.accountName,
        address: account.accountAddress,
        type: account.type,
        balances,
        transactions,
      };
    }),
  };
}

/**
 * Build expense report data from an ExpenseReportDocument
 */
function buildExpenseReportData(doc: ExpenseReportDocument) {
  const state = doc.state.global;

  // Build groups
  const groups = state.groups.map((group) => ({
    id: group.id,
    label: group.label || "",
    parentId: group.parentId || "",
  }));

  // Create a map for quick group label lookup
  const groupLabelMap = new Map<string, string>();
  for (const group of state.groups) {
    groupLabelMap.set(group.id, group.label || "");
  }

  // Build wallets
  const wallets = state.wallets.map((wallet) => {
    // Build totals from wallet totals
    const totals = (wallet.totals || [])
      .filter((t): t is NonNullable<typeof t> => t !== null)
      .map((total) => ({
        group: total.group || "",
        groupLabel: groupLabelMap.get(total.group || "") || "",
        totalBudget: { unit: "USDS", value: String(total.totalBudget || 0) },
        totalForecast: {
          unit: "USDS",
          value: String(total.totalForecast || 0),
        },
        totalActuals: { unit: "USDS", value: String(total.totalActuals || 0) },
        totalPayments: {
          unit: "USDS",
          value: String(total.totalPayments || 0),
        },
      }));

    // Build line items
    const lineItems = (wallet.lineItems || [])
      .filter((li): li is NonNullable<typeof li> => li !== null)
      .map((item) => ({
        id: item.id || "",
        label: item.label || "",
        groupId: item.group || "",
        groupLabel: groupLabelMap.get(item.group || "") || "",
        budget: { unit: "USDS", value: String(item.budget || 0) },
        forecast: { unit: "USDS", value: String(item.forecast || 0) },
        actuals: { unit: "USDS", value: String(item.actuals || 0) },
        payments: { unit: "USDS", value: String(item.payments || 0) },
        comments: item.comments || null,
      }));

    // Collect billing statement IDs
    const billingStatementIds = (wallet.billingStatements || []).filter(
      (id): id is string => id !== null,
    );

    return {
      name: wallet.name || null,
      address: wallet.wallet || null,
      totals,
      lineItems,
      billingStatementIds,
    };
  });

  return {
    periodStart: state.periodStart || "",
    periodEnd: state.periodEnd || "",
    groups,
    wallets,
  };
}

/**
 * Get counter party name from account-transactions document
 */
function getCounterPartyName(
  counterPartyAccountId: string | null | undefined,
  accountTransactionsDocs: Map<string, AccountTransactionsDocument>,
): string {
  if (!counterPartyAccountId) return "";

  // Search through all account-transactions docs to find the account name
  for (const txDoc of accountTransactionsDocs.values()) {
    const account = txDoc.state.global.account;
    if (account && account.id === counterPartyAccountId) {
      return account.name || "";
    }
  }

  return "";
}
