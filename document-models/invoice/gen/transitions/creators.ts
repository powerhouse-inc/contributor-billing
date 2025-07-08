import { createAction } from "document-model";
import {
  z,
  type CancelInput,
  type IssueInput,
  type ResetInput,
  type RejectInput,
  type AcceptInput,
  type ReinstateInput,
  type SchedulePaymentInput,
  type ReapprovePaymentInput,
  type RegisterPaymentTxInput,
  type ReportPaymentIssueInput,
  type ConfirmPaymentInput,
  type CancelPaymentInput,
} from "../types.js";
import {
  type CancelAction,
  type IssueAction,
  type ResetAction,
  type RejectAction,
  type AcceptAction,
  type ReinstateAction,
  type SchedulePaymentAction,
  type ReapprovePaymentAction,
  type RegisterPaymentTxAction,
  type ReportPaymentIssueAction,
  type ConfirmPaymentAction,
  type CancelPaymentAction,
} from "./actions.js";

export const cancel = (input: CancelInput) =>
  createAction<CancelAction>(
    "CANCEL",
    { ...input },
    undefined,
    z.CancelInputSchema,
    "global",
  );

export const issue = (input: IssueInput) =>
  createAction<IssueAction>(
    "ISSUE",
    { ...input },
    undefined,
    z.IssueInputSchema,
    "global",
  );

export const reset = (input: ResetInput) =>
  createAction<ResetAction>(
    "RESET",
    { ...input },
    undefined,
    z.ResetInputSchema,
    "global",
  );

export const reject = (input: RejectInput) =>
  createAction<RejectAction>(
    "REJECT",
    { ...input },
    undefined,
    z.RejectInputSchema,
    "global",
  );

export const accept = (input: AcceptInput) =>
  createAction<AcceptAction>(
    "ACCEPT",
    { ...input },
    undefined,
    z.AcceptInputSchema,
    "global",
  );

export const reinstate = (input: ReinstateInput) =>
  createAction<ReinstateAction>(
    "REINSTATE",
    { ...input },
    undefined,
    z.ReinstateInputSchema,
    "global",
  );

export const schedulePayment = (input: SchedulePaymentInput) =>
  createAction<SchedulePaymentAction>(
    "SCHEDULE_PAYMENT",
    { ...input },
    undefined,
    z.SchedulePaymentInputSchema,
    "global",
  );

export const reapprovePayment = (input: ReapprovePaymentInput) =>
  createAction<ReapprovePaymentAction>(
    "REAPPROVE_PAYMENT",
    { ...input },
    undefined,
    z.ReapprovePaymentInputSchema,
    "global",
  );

export const registerPaymentTx = (input: RegisterPaymentTxInput) =>
  createAction<RegisterPaymentTxAction>(
    "REGISTER_PAYMENT_TX",
    { ...input },
    undefined,
    z.RegisterPaymentTxInputSchema,
    "global",
  );

export const reportPaymentIssue = (input: ReportPaymentIssueInput) =>
  createAction<ReportPaymentIssueAction>(
    "REPORT_PAYMENT_ISSUE",
    { ...input },
    undefined,
    z.ReportPaymentIssueInputSchema,
    "global",
  );

export const confirmPayment = (input: ConfirmPaymentInput) =>
  createAction<ConfirmPaymentAction>(
    "CONFIRM_PAYMENT",
    { ...input },
    undefined,
    z.ConfirmPaymentInputSchema,
    "global",
  );

export const cancelPayment = (input: CancelPaymentInput) =>
  createAction<CancelPaymentAction>(
    "CANCEL_PAYMENT",
    { ...input },
    undefined,
    z.CancelPaymentInputSchema,
    "global",
  );
