import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { IntegrationsPHState } from "@powerhousedao/contributor-billing/document-models/integrations";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "@powerhousedao/contributor-billing/document-models/integrations";

/** Document model module for the Todo List document type */
export const Integrations: DocumentModelModule<IntegrationsPHState> = {
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
