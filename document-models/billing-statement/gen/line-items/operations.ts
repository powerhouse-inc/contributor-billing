import { type SignalDispatch } from "document-model";
import {
  type AddLineItemAction,
  type EditLineItemAction,
  type DeleteLineItemAction,
} from "./actions.js";
import { type BillingStatementState } from "../types.js";

export interface BillingStatementLineItemsOperations {
  addLineItemOperation: (
    state: BillingStatementState,
    action: AddLineItemAction,
    dispatch?: SignalDispatch,
  ) => void;
  editLineItemOperation: (
    state: BillingStatementState,
    action: EditLineItemAction,
    dispatch?: SignalDispatch,
  ) => void;
  deleteLineItemOperation: (
    state: BillingStatementState,
    action: DeleteLineItemAction,
    dispatch?: SignalDispatch,
  ) => void;
}
