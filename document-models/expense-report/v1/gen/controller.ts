import { PHDocumentController } from "document-model/core";
import { ExpenseReport } from "../module.js";
import type { ExpenseReportAction, ExpenseReportPHState } from "./types.js";

export const ExpenseReportController = PHDocumentController.forDocumentModel<
  ExpenseReportPHState,
  ExpenseReportAction
>(ExpenseReport);
