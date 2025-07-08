/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
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
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/transitions/creators.js";
import type { InvoiceDocument } from "../../gen/types.js";

describe("Transitions Operations", () => {
  let document: InvoiceDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle cancel operation", () => {
    const input: CancelInput = generateMock(z.CancelInputSchema());

    const updatedDocument = reducer(document, creators.cancel(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("CANCEL");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle issue operation", () => {
    const input: IssueInput = generateMock(z.IssueInputSchema());

    const updatedDocument = reducer(document, creators.issue(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("ISSUE");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle reset operation", () => {
    const input: ResetInput = generateMock(z.ResetInputSchema());

    const updatedDocument = reducer(document, creators.reset(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("RESET");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle reject operation", () => {
    const input: RejectInput = generateMock(z.RejectInputSchema());

    const updatedDocument = reducer(document, creators.reject(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("REJECT");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle accept operation", () => {
    const input: AcceptInput = generateMock(z.AcceptInputSchema());

    const updatedDocument = reducer(document, creators.accept(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("ACCEPT");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle reinstate operation", () => {
    const input: ReinstateInput = generateMock(z.ReinstateInputSchema());

    const updatedDocument = reducer(document, creators.reinstate(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("REINSTATE");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle schedulePayment operation", () => {
    const input: SchedulePaymentInput = generateMock(
      z.SchedulePaymentInputSchema(),
    );

    const updatedDocument = reducer(document, creators.schedulePayment(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("SCHEDULE_PAYMENT");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle reapprovePayment operation", () => {
    const input: ReapprovePaymentInput = generateMock(
      z.ReapprovePaymentInputSchema(),
    );

    const updatedDocument = reducer(document, creators.reapprovePayment(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("REAPPROVE_PAYMENT");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle registerPaymentTx operation", () => {
    const input: RegisterPaymentTxInput = generateMock(
      z.RegisterPaymentTxInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.registerPaymentTx(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe(
      "REGISTER_PAYMENT_TX",
    );
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle reportPaymentIssue operation", () => {
    const input: ReportPaymentIssueInput = generateMock(
      z.ReportPaymentIssueInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.reportPaymentIssue(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe(
      "REPORT_PAYMENT_ISSUE",
    );
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle confirmPayment operation", () => {
    const input: ConfirmPaymentInput = generateMock(
      z.ConfirmPaymentInputSchema(),
    );

    const updatedDocument = reducer(document, creators.confirmPayment(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("CONFIRM_PAYMENT");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle cancelPayment operation", () => {
    const input: CancelPaymentInput = generateMock(
      z.CancelPaymentInputSchema(),
    );

    const updatedDocument = reducer(document, creators.cancelPayment(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("CANCEL_PAYMENT");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
