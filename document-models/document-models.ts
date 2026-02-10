import type { DocumentModelModule } from "document-model";
import { AccountTransactions } from "./account-transactions/module.js";
import { Accounts } from "./accounts/module.js";
import { BillingStatement } from "./billing-statement/module.js";
import { ExpenseReport } from "./expense-report/module.js";
import { Invoice } from "./invoice/module.js";
import { OperationalHubProfile } from "./operational-hub-profile/module.js";
import { ResourceInstance } from "./resource-instance/module.js";
import { ResourceTemplate } from "./resource-template/module.js";
import { ServiceOffering } from "./service-offering/module.js";
import { ServiceSubscriptions } from "./service-subscriptions/module.js";
import { SnapshotReport } from "./snapshot-report/module.js";
import { SubscriptionInstance } from "./subscription-instance/module.js";

export const documentModels: DocumentModelModule<any>[] = [
  AccountTransactions,
  Accounts,
  BillingStatement,
  ExpenseReport,
  Invoice,
  OperationalHubProfile,
  ResourceInstance,
  ResourceTemplate,
  ServiceOffering,
  ServiceSubscriptions,
  SnapshotReport,
  SubscriptionInstance,
];
