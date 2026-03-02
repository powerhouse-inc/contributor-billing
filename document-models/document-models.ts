import type { DocumentModelModule } from "document-model";
import { AccountTransactions } from "./account-transactions/legacy/module.js";
import { AccountTransactions as AccountTransactionsV1 } from "./account-transactions/v1/module.js";
import { Accounts } from "./accounts/legacy/module.js";
import { Accounts as AccountsV1 } from "./accounts/v1/module.js";
import { BillingStatement } from "./billing-statement/legacy/module.js";
import { BillingStatement as BillingStatementV1 } from "./billing-statement/v1/module.js";
import { ExpenseReport } from "./expense-report/legacy/module.js";
import { ExpenseReport as ExpenseReportV1 } from "./expense-report/v1/module.js";
import { Invoice } from "./invoice/legacy/module.js";
import { Invoice as InvoiceV1 } from "./invoice/v1/module.js";
import { OperationalHubProfile } from "./operational-hub-profile/legacy/module.js";
import { OperationalHubProfile as OperationalHubProfileV1 } from "./operational-hub-profile/v1/module.js";
import { SnapshotReport } from "./snapshot-report/legacy/module.js";
import { SnapshotReport as SnapshotReportV1 } from "./snapshot-report/v1/module.js";

export const documentModels: DocumentModelModule<any>[] = [
  AccountTransactions,
  AccountTransactionsV1,
  Accounts,
  AccountsV1,
  BillingStatement,
  BillingStatementV1,
  ExpenseReport,
  ExpenseReportV1,
  Invoice,
  InvoiceV1,
  OperationalHubProfile,
  OperationalHubProfileV1,
  SnapshotReport,
  SnapshotReportV1,
];
