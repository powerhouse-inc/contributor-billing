import type { DocumentModelModule } from "document-model";
import { Accounts } from "./accounts/module.js";
import { AccountTransactions } from "./account-transactions/module.js";
import { BillingStatement } from "./billing-statement/module.js";
import { ExpenseReport } from "./expense-report/module.js";
import { Invoice } from "./invoice/module.js";
import { SnapshotReport } from "./snapshot-report/module.js";
import { ServiceSubscriptions } from "./service-subscriptions/module.js";
import { ServiceOffering } from "./service-offering/module.js";

export const documentModels: DocumentModelModule<any>[] = [
  AccountTransactions,
  Accounts,
  BillingStatement,
  ExpenseReport,
  Invoice,
  ServiceOffering,
  ServiceSubscriptions,
  SnapshotReport,
];
