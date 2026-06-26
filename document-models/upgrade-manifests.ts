/**
 * WARNING: DO NOT EDIT
 * This file is auto-generated and updated by codegen
 */
import type { UpgradeManifest } from "document-model";
import { accountTransactionsUpgradeManifest } from "document-models/account-transactions/upgrades";
import { accountsUpgradeManifest } from "document-models/accounts/upgrades";
import { billingStatementUpgradeManifest } from "document-models/billing-statement/upgrades";
import { expenseReportUpgradeManifest } from "document-models/expense-report/upgrades";
import { invoiceUpgradeManifest } from "document-models/invoice/upgrades";
import { operationalHubProfileUpgradeManifest } from "document-models/operational-hub-profile/upgrades";
import { snapshotReportUpgradeManifest } from "document-models/snapshot-report/upgrades";

export const upgradeManifests: UpgradeManifest<readonly number[]>[] = [
  accountTransactionsUpgradeManifest,
  accountsUpgradeManifest,
  billingStatementUpgradeManifest,
  expenseReportUpgradeManifest,
  invoiceUpgradeManifest,
  operationalHubProfileUpgradeManifest,
  snapshotReportUpgradeManifest,
];
