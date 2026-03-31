import type { DocumentModelModule } from "document-model";
import { AccountTransactions as AccountTransactionsV1 } from "./account-transactions/v1/module.js";
import { Accounts as AccountsV1 } from "./accounts/v1/module.js";
import { BillingStatement as BillingStatementV1 } from "./billing-statement/v1/module.js";
import { ExpenseReport as ExpenseReportV1 } from "./expense-report/v1/module.js";
import { Invoice as InvoiceV1 } from "./invoice/v1/module.js";
import { OperationalHubProfile as OperationalHubProfileV1 } from "./operational-hub-profile/v1/module.js";
import { SnapshotReport as SnapshotReportV1 } from "./snapshot-report/v1/module.js";

export const documentModels: DocumentModelModule<any>[] = [
  AccountTransactionsV1,
  AccountsV1,
  BillingStatementV1,
  ExpenseReportV1,
  InvoiceV1,
  OperationalHubProfileV1,
  SnapshotReportV1,
];
