import { createAction } from "document-model/core";
import {
  CancelInputSchema,
  IssueInputSchema,
  ResetInputSchema,
  RejectInputSchema,
  AcceptInputSchema,
  ReinstateInputSchema,
  SchedulePaymentInputSchema,
  ReapprovePaymentInputSchema,
  RegisterPaymentTxInputSchema,
  ReportPaymentIssueInputSchema,
  ConfirmPaymentInputSchema,
  ClosePaymentInputSchema,
} from "../schema/zod.js";
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
import type {
  CancelAction,
  IssueAction,
  ResetAction,
  RejectAction,
  AcceptAction,
  ReinstateAction,
  SchedulePaymentAction,
  ReapprovePaymentAction,
  RegisterPaymentTxAction,
  ReportPaymentIssueAction,
  ConfirmPaymentAction,
  ClosePaymentAction,
} from "./actions.js";

export const cancel = (input: CancelInput) =>
  createAction<CancelAction>(
    "CANCEL",
    { ...input },
    undefined,
    CancelInputSchema,
    "global",
  );

export const issue = (input: IssueInput) =>
  createAction<IssueAction>(
    "ISSUE",
    { ...input },
    undefined,
    IssueInputSchema,
    "global",
  );

export const reset = (input: ResetInput) =>
  createAction<ResetAction>(
    "RESET",
    { ...input },
    undefined,
    ResetInputSchema,
    "global",
  );

export const reject = (input: RejectInput) =>
  createAction<RejectAction>(
    "REJECT",
    { ...input },
    undefined,
    RejectInputSchema,
    "global",
  );

export const accept = (input: AcceptInput) =>
  createAction<AcceptAction>(
    "ACCEPT",
    { ...input },
    undefined,
    AcceptInputSchema,
    "global",
  );

export const reinstate = (input: ReinstateInput) =>
  createAction<ReinstateAction>(
    "REINSTATE",
    { ...input },
    undefined,
    ReinstateInputSchema,
    "global",
  );

export const schedulePayment = (input: SchedulePaymentInput) =>
  createAction<SchedulePaymentAction>(
    "SCHEDULE_PAYMENT",
    { ...input },
    undefined,
    SchedulePaymentInputSchema,
    "global",
  );

export const reapprovePayment = (input: ReapprovePaymentInput) =>
  createAction<ReapprovePaymentAction>(
    "REAPPROVE_PAYMENT",
    { ...input },
    undefined,
    ReapprovePaymentInputSchema,
    "global",
  );

export const registerPaymentTx = (input: RegisterPaymentTxInput) =>
  createAction<RegisterPaymentTxAction>(
    "REGISTER_PAYMENT_TX",
    { ...input },
    undefined,
    RegisterPaymentTxInputSchema,
    "global",
  );

export const reportPaymentIssue = (input: ReportPaymentIssueInput) =>
  createAction<ReportPaymentIssueAction>(
    "REPORT_PAYMENT_ISSUE",
    { ...input },
    undefined,
    ReportPaymentIssueInputSchema,
    "global",
  );

export const confirmPayment = (input: ConfirmPaymentInput) =>
  createAction<ConfirmPaymentAction>(
    "CONFIRM_PAYMENT",
    { ...input },
    undefined,
    ConfirmPaymentInputSchema,
    "global",
  );

export const closePayment = (input: ClosePaymentInput) =>
  createAction<ClosePaymentAction>(
    "CLOSE_PAYMENT",
    { ...input },
    undefined,
    ClosePaymentInputSchema,
    "global",
  );
