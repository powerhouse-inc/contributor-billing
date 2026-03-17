import { PHDocumentController } from "document-model/core";
import { BillingStatement } from "../module.js";
import type {
  BillingStatementAction,
  BillingStatementPHState,
} from "./types.js";

export const BillingStatementController = PHDocumentController.forDocumentModel<
  BillingStatementPHState,
  BillingStatementAction
>(BillingStatement);
