import { type Action } from "document-model";
import type {
  CancelInput,
  IssueInput,
  ResetInput,
  RejectInput,
  AcceptInput,
  ReinstateInput,
  SchedulePaymentInput,
  ReapprovePaymentInput,
  RegisterPaymentTxInput,
  ReportPaymentIssueInput,
  ConfirmPaymentInput,
  ClosePaymentInput,
} from "../types.js";

export type CancelAction = Action & { type: "CANCEL"; input: CancelInput };
export type IssueAction = Action & { type: "ISSUE"; input: IssueInput };
export type ResetAction = Action & { type: "RESET"; input: ResetInput };
export type RejectAction = Action & { type: "REJECT"; input: RejectInput };
export type AcceptAction = Action & { type: "ACCEPT"; input: AcceptInput };
export type ReinstateAction = Action & {
  type: "REINSTATE";
  input: ReinstateInput;
};
export type SchedulePaymentAction = Action & {
  type: "SCHEDULE_PAYMENT";
  input: SchedulePaymentInput;
};
export type ReapprovePaymentAction = Action & {
  type: "REAPPROVE_PAYMENT";
  input: ReapprovePaymentInput;
};
export type RegisterPaymentTxAction = Action & {
  type: "REGISTER_PAYMENT_TX";
  input: RegisterPaymentTxInput;
};
export type ReportPaymentIssueAction = Action & {
  type: "REPORT_PAYMENT_ISSUE";
  input: ReportPaymentIssueInput;
};
export type ConfirmPaymentAction = Action & {
  type: "CONFIRM_PAYMENT";
  input: ConfirmPaymentInput;
};
export type ClosePaymentAction = Action & {
  type: "CLOSE_PAYMENT";
  input: ClosePaymentInput;
};

export type InvoiceTransitionsAction =
  | CancelAction
  | IssueAction
  | ResetAction
  | RejectAction
  | AcceptAction
  | ReinstateAction
  | SchedulePaymentAction
  | ReapprovePaymentAction
  | RegisterPaymentTxAction
  | ReportPaymentIssueAction
  | ConfirmPaymentAction
  | ClosePaymentAction;
