import type { EditorModule } from "document-model";
import { AccountTransactions } from "./account-transactions-editor/module.js";
import { Accounts } from "./accounts-editor/module.js";
import { BillingStatement } from "./billing-statement/module.js";
import { BuilderTeamAdmin } from "./builder-team-admin/module.js";
import { ContributorBilling } from "./contributor-billing/module.js";
import { ExpenseReport } from "./expense-report/module.js";
import { Invoice } from "./invoice/module.js";
import { OperationalHubProfileEditor } from "./operational-hub-profile-editor/module.js";
import { SnapshotReport } from "./snapshot-report-editor/module.js";

export const editors: EditorModule[] = [
  AccountTransactions,
  Accounts,
  BillingStatement,
  BuilderTeamAdmin,
  ContributorBilling,
  ExpenseReport,
  Invoice,
  OperationalHubProfileEditor,
  SnapshotReport,
];
