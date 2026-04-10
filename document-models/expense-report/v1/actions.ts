import { baseActions } from "document-model";
import { expenseReportWalletActions } from "./gen/creators.js";

/** Actions for the ExpenseReport document model */

export const actions = { ...baseActions, ...expenseReportWalletActions };
