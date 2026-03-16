import type { UpgradeManifest } from "document-model";
import { accountTransactionsUpgradeManifest } from "./account-transactions/upgrades/upgrade-manifest.js";
import { accountsUpgradeManifest } from "./accounts/upgrades/upgrade-manifest.js";
import { billingStatementUpgradeManifest } from "./billing-statement/upgrades/upgrade-manifest.js";
import { expenseReportUpgradeManifest } from "./expense-report/upgrades/upgrade-manifest.js";
import { invoiceUpgradeManifest } from "./invoice/upgrades/upgrade-manifest.js";
import { operationalHubProfileUpgradeManifest } from "./operational-hub-profile/upgrades/upgrade-manifest.js";
import { snapshotReportUpgradeManifest } from "./snapshot-report/upgrades/upgrade-manifest.js";

export const upgradeManifests: UpgradeManifest<readonly number[]>[] = [
  accountTransactionsUpgradeManifest,
  accountsUpgradeManifest,
  billingStatementUpgradeManifest,
  expenseReportUpgradeManifest,
  invoiceUpgradeManifest,
  operationalHubProfileUpgradeManifest,
  snapshotReportUpgradeManifest,
];
