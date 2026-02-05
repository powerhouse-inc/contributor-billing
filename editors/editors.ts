import type { EditorModule } from "document-model";
import { AccountTransactions } from "./account-transactions-editor/module.js";
import { Accounts } from "./accounts-editor/module.js";
import { BillingStatement } from "./billing-statement/module.js";
import { BuilderTeamAdmin } from "./builder-team-admin/module.js";
import { ContributorBilling } from "./contributor-billing/module.js";
import { ExpenseReport } from "./expense-report/module.js";
import { Invoice } from "./invoice/module.js";
import { OperationalHubProfileEditor } from "./operational-hub-profile-editor/module.js";
import { ResourceInstanceEditor } from "./resource-instance-editor/module.js";
import { ResourceTemplateEditor } from "./resource-template-editor/module.js";
import { ServiceOfferingEditor } from "./service-offering-editor/module.js";
import { ServiceSubscriptionsEditor } from "./service-subscriptions-editor/module.js";
import { SnapshotReport } from "./snapshot-report-editor/module.js";
import { SubscriptionInstanceEditor } from "./subscription-instance-editor/module.js";

export const editors: EditorModule[] = [
  AccountTransactions,
  Accounts,
  BillingStatement,
  BuilderTeamAdmin,
  ContributorBilling,
  ExpenseReport,
  Invoice,
  OperationalHubProfileEditor,
  ResourceInstanceEditor,
  ResourceTemplateEditor,
  ServiceOfferingEditor,
  ServiceSubscriptionsEditor,
  SnapshotReport,
  SubscriptionInstanceEditor,
];
