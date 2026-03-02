import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { AccountsPHState } from "@powerhousedao/contributor-billing/document-models/accounts";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "@powerhousedao/contributor-billing/document-models/accounts";

/** Document model module for the Accounts document type */
export const Accounts: DocumentModelModule<AccountsPHState> = {
  version: 1,
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
