import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { ExpenseReportPHState } from "@powerhousedao/contributor-billing/document-models/expense-report";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "@powerhousedao/contributor-billing/document-models/expense-report";

/** Document model module for the Todo List document type */
export const ExpenseReport: DocumentModelModule<ExpenseReportPHState> = {
  version: 1,
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
