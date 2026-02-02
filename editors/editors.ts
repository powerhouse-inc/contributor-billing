import type { EditorModule } from "document-model";
import { AccountTransactionsEditor } from "./account-transactions-editor/module.js";
import { AccountsEditor } from "./accounts-editor/module.js";
import { BillingStatement } from "./billing-statement/module.js";
import { BuilderTeamAdmin } from "./builder-team-admin/module.js";
import { ContributorBilling } from "./contributor-billing/module.js";
import { ExpenseReport } from "./expense-report/module.js";
import { Invoice } from "./invoice/module.js";
import { OperationalHubProfileEditor } from "./operational-hub-profile-editor/module.js";
import { ResourceTemplateEditor } from "./resource-template-editor/module.js";
import { ServiceOfferingEditor } from "./service-offering-editor/module.js";
import { ServiceSubscriptionsEditor } from "./service-subscriptions-editor/module.js";
import { SnapshotReportEditor } from "./snapshot-report-editor/module.js";

export const editors: EditorModule[] = [
  AccountTransactionsEditor,
  AccountsEditor,
  BillingStatement,
  BuilderTeamAdmin,
  ContributorBilling,
  ExpenseReport,
  Invoice,
  OperationalHubProfileEditor,
  ResourceTemplateEditor,
  ServiceOfferingEditor,
  ServiceSubscriptionsEditor,
  SnapshotReportEditor,
];
