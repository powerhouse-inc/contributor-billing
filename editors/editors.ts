import type { EditorModule } from "document-model";
import { AccountsEditor } from "./accounts-editor/module.js";
import { AccountTransactionsEditor } from "./account-transactions-editor/module.js";
import { BillingStatement } from "./billing-statement/module.js";
import { ContributorBilling } from "./contributor-billing/module.js";
import { ExpenseReport } from "./expense-report/module.js";
import { Integrations } from "./integrations/module.js";
import { Invoice } from "./invoice/module.js";
import { SnapshotReportEditor } from "./snapshot-report-editor/module.js";

export const editors: EditorModule[] = [
  AccountsEditor,
  AccountTransactionsEditor,
  BillingStatement,
  ContributorBilling,
  ExpenseReport,
  Integrations,
  Invoice,
  SnapshotReportEditor,
];
