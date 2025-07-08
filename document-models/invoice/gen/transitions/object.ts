import { BaseDocumentClass } from "document-model";
import {
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
  type InvoiceState,
  type InvoiceLocalState,
} from "../types.js";
import {
  cancel,
  issue,
  reset,
  reject,
  accept,
  reinstate,
  schedulePayment,
  reapprovePayment,
  registerPaymentTx,
  reportPaymentIssue,
  confirmPayment,
  cancelPayment,
} from "./creators.js";
import { type InvoiceAction } from "../actions.js";

export default class Invoice_Transitions extends BaseDocumentClass<
  InvoiceState,
  InvoiceLocalState,
  InvoiceAction
> {
  public cancel(input: CancelInput) {
    return this.dispatch(cancel(input));
  }

  public issue(input: IssueInput) {
    return this.dispatch(issue(input));
  }

  public reset(input: ResetInput) {
    return this.dispatch(reset(input));
  }

  public reject(input: RejectInput) {
    return this.dispatch(reject(input));
  }

  public accept(input: AcceptInput) {
    return this.dispatch(accept(input));
  }

  public reinstate(input: ReinstateInput) {
    return this.dispatch(reinstate(input));
  }

  public schedulePayment(input: SchedulePaymentInput) {
    return this.dispatch(schedulePayment(input));
  }

  public reapprovePayment(input: ReapprovePaymentInput) {
    return this.dispatch(reapprovePayment(input));
  }

  public registerPaymentTx(input: RegisterPaymentTxInput) {
    return this.dispatch(registerPaymentTx(input));
  }

  public reportPaymentIssue(input: ReportPaymentIssueInput) {
    return this.dispatch(reportPaymentIssue(input));
  }

  public confirmPayment(input: ConfirmPaymentInput) {
    return this.dispatch(confirmPayment(input));
  }

  public cancelPayment(input: CancelPaymentInput) {
    return this.dispatch(cancelPayment(input));
  }
}
