import { type SignalDispatch } from "document-model";
import type {
  AcceptAction,
  CancelAction,
  ClosePaymentAction,
  ConfirmPaymentAction,
  IssueAction,
  ReapprovePaymentAction,
  RegisterPaymentTxAction,
  ReinstateAction,
  RejectAction,
  ReportPaymentIssueAction,
  ResetAction,
  SchedulePaymentAction,
} from "./actions.js";
import type { InvoiceState } from "../types.js";

export interface InvoiceTransitionsOperations {
  acceptOperation: (
    state: InvoiceState,
    action: AcceptAction,
    dispatch?: SignalDispatch,
  ) => void;
  cancelOperation: (
    state: InvoiceState,
    action: CancelAction,
    dispatch?: SignalDispatch,
  ) => void;
  closePaymentOperation: (
    state: InvoiceState,
    action: ClosePaymentAction,
    dispatch?: SignalDispatch,
  ) => void;
  confirmPaymentOperation: (
    state: InvoiceState,
    action: ConfirmPaymentAction,
    dispatch?: SignalDispatch,
  ) => void;
  issueOperation: (
    state: InvoiceState,
    action: IssueAction,
    dispatch?: SignalDispatch,
  ) => void;
  reapprovePaymentOperation: (
    state: InvoiceState,
    action: ReapprovePaymentAction,
    dispatch?: SignalDispatch,
  ) => void;
  registerPaymentTxOperation: (
    state: InvoiceState,
    action: RegisterPaymentTxAction,
    dispatch?: SignalDispatch,
  ) => void;
  reinstateOperation: (
    state: InvoiceState,
    action: ReinstateAction,
    dispatch?: SignalDispatch,
  ) => void;
  rejectOperation: (
    state: InvoiceState,
    action: RejectAction,
    dispatch?: SignalDispatch,
  ) => void;
  reportPaymentIssueOperation: (
    state: InvoiceState,
    action: ReportPaymentIssueAction,
    dispatch?: SignalDispatch,
  ) => void;
  resetOperation: (
    state: InvoiceState,
    action: ResetAction,
    dispatch?: SignalDispatch,
  ) => void;
  schedulePaymentOperation: (
    state: InvoiceState,
    action: SchedulePaymentAction,
    dispatch?: SignalDispatch,
  ) => void;
}
