import type { EditorModule } from "document-model";
import { BillingStatement } from "./billing-statement/module.js";
import { ContributorBilling } from "./contributor-billing/module.js";
import { ExpenseReport } from "./expense-report/module.js";
import { Integrations } from "./integrations/module.js";
import { Invoice } from "./invoice/module.js";

export const editors: EditorModule[] = [
  BillingStatement,
  ContributorBilling,
  ExpenseReport,
  Integrations,
  Invoice,
];
