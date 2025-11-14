import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { BillingStatementPHState } from "@powerhousedao/contributor-billing/document-models/billing-statement";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "@powerhousedao/contributor-billing/document-models/billing-statement";

/** Document model module for the Todo List document type */
export const BillingStatement: DocumentModelModule<BillingStatementPHState> = {
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
