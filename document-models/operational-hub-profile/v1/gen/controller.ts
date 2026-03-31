import { PHDocumentController } from "document-model/core";
import { OperationalHubProfile } from "../module.js";
import type {
  OperationalHubProfileAction,
  OperationalHubProfilePHState,
} from "./types.js";

export const OperationalHubProfileController =
  PHDocumentController.forDocumentModel<
    OperationalHubProfilePHState,
    OperationalHubProfileAction
  >(OperationalHubProfile);
