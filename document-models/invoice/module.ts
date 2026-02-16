import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { InvoicePHState } from "@powerhousedao/contributor-billing/document-models/invoice";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "@powerhousedao/contributor-billing/document-models/invoice";

/** Document model module for the Invoice document type */
export const Invoice: DocumentModelModule<InvoicePHState> = {
  version: 1,
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
