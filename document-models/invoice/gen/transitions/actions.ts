import { type BaseAction } from "document-model";
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
  CancelPaymentInput,
} from "../types.js";

export type CancelAction = BaseAction<"CANCEL", CancelInput, "global">;
export type IssueAction = BaseAction<"ISSUE", IssueInput, "global">;
export type ResetAction = BaseAction<"RESET", ResetInput, "global">;
export type RejectAction = BaseAction<"REJECT", RejectInput, "global">;
export type AcceptAction = BaseAction<"ACCEPT", AcceptInput, "global">;
export type ReinstateAction = BaseAction<"REINSTATE", ReinstateInput, "global">;
export type SchedulePaymentAction = BaseAction<
  "SCHEDULE_PAYMENT",
  SchedulePaymentInput,
  "global"
>;
export type ReapprovePaymentAction = BaseAction<
  "REAPPROVE_PAYMENT",
  ReapprovePaymentInput,
  "global"
>;
export type RegisterPaymentTxAction = BaseAction<
  "REGISTER_PAYMENT_TX",
  RegisterPaymentTxInput,
  "global"
>;
export type ReportPaymentIssueAction = BaseAction<
  "REPORT_PAYMENT_ISSUE",
  ReportPaymentIssueInput,
  "global"
>;
export type ConfirmPaymentAction = BaseAction<
  "CONFIRM_PAYMENT",
  ConfirmPaymentInput,
  "global"
>;
export type CancelPaymentAction = BaseAction<
  "CANCEL_PAYMENT",
  CancelPaymentInput,
  "global"
>;

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
  | CancelPaymentAction;
