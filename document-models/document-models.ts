import type { DocumentModelModule } from "document-model";
import { BillingStatement } from "./billing-statement/module.js";
import { ExpenseReport } from "./expense-report/module.js";
import { Integrations } from "./integrations/module.js";
import { Invoice } from "./invoice/module.js";

export const documentModels: DocumentModelModule<any>[] = [
  BillingStatement,
  ExpenseReport,
  Integrations,
  Invoice,
];
