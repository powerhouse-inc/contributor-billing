import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { OperationalHubProfilePHState } from "@powerhousedao/contributor-billing/document-models/operational-hub-profile";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "@powerhousedao/contributor-billing/document-models/operational-hub-profile";

/** Document model module for the OperationalHubProfile document type */
export const OperationalHubProfile: DocumentModelModule<OperationalHubProfilePHState> =
  {
    version: 1,
    reducer,
    actions,
    utils,
    documentModel: createState(defaultBaseState(), documentModel),
  };
