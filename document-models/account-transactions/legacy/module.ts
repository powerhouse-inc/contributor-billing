import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { AccountTransactionsPHState } from "@powerhousedao/contributor-billing/document-models/account-transactions";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "@powerhousedao/contributor-billing/document-models/account-transactions";

/** Document model module for the AccountTransactions document type */
export const AccountTransactions: DocumentModelModule<AccountTransactionsPHState> =
  {
    version: 1,
    reducer,
    actions,
    utils,
    documentModel: createState(defaultBaseState(), documentModel),
  };
