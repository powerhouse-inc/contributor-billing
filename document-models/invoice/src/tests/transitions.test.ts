/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import * as utils from "../../gen/utils.js";
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
  type ClosePaymentInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/transitions/creators.js";
import type { InvoiceDocument } from "../../gen/types.js";

describe("Transitions Operations", () => {
  let document: InvoiceDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  describe("DRAFT status transitions", () => {
    beforeEach(() => {
      // Ensure document starts in DRAFT status
      document.state.global.status = "DRAFT";
    });

    it("should handle DRAFT -> CANCELLED transition", () => {
      const input: CancelInput = {
        _placeholder: "cancel_placeholder"
      };

      const updatedDocument = reducer(document, creators.cancel(input));

      expect(updatedDocument.state.global.status).toBe("CANCELLED");
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("CANCEL");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });

    it("should handle DRAFT -> ISSUED transition", () => {
      const input: IssueInput = {
        invoiceNo: "INV-2024-001",
        dateIssued: "2024-01-15"
      };

      const updatedDocument = reducer(document, creators.issue(input));

      expect(updatedDocument.state.global.status).toBe("ISSUED");
      expect(updatedDocument.state.global.invoiceNo).toBe("INV-2024-001");
      expect(updatedDocument.state.global.dateIssued).toBe("2024-01-15");
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("ISSUE");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });
  });

  describe("CANCELLED status transitions", () => {
    beforeEach(() => {
      document.state.global.status = "CANCELLED";
    });

    it("should handle CANCELLED -> DRAFT transition", () => {
      const input: ResetInput = {
        _placeholder: "reset_placeholder"
      };

      const updatedDocument = reducer(document, creators.reset(input));

      expect(updatedDocument.state.global.status).toBe("DRAFT");
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("RESET");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });
  });

  describe("ISSUED status transitions", () => {
    beforeEach(() => {
      document.state.global.status = "ISSUED";
      document.state.global.invoiceNo = "INV-2024-001";
      document.state.global.dateIssued = "2024-01-15";
    });


    it("should handle ISSUED -> REJECTED transition", () => {
      const input: RejectInput = {
        id: "rejection-1",
        reason: "Incorrect pricing information",
        final: false
      };

      const updatedDocument = reducer(document, creators.reject(input));


      expect(updatedDocument.state.global.status).toBe("REJECTED");
      expect(updatedDocument.state.global.rejections).toHaveLength(1);
      expect(updatedDocument.state.global.rejections[0].reason).toBe("Incorrect pricing information");
      expect(updatedDocument.state.global.rejections[0].final).toBe(false);
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("REJECT");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });

    it("should handle ISSUED -> ACCEPTED transition", () => {
      const input: AcceptInput = {
        payAfter: "2024-02-15T00:00:00Z"
      };

      const updatedDocument = reducer(document, creators.accept(input));

      expect(updatedDocument.state.global.status).toBe("ACCEPTED");
      expect(updatedDocument.state.global.payAfter).toBe("2024-02-15T00:00:00Z");
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("ACCEPT");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });
  });

  describe("REJECTED status transitions", () => {
    beforeEach(() => {
      document.state.global.status = "REJECTED";
      document.state.global.rejections = [{
        id: "rejection-1",
        reason: "Incorrect pricing",
        final: false
      }];
    });

    it("should handle REJECTED -> ISSUED transition", () => {
      const input: ReinstateInput = {
        _placeholder: "reinstate_placeholder"
      };

      const updatedDocument = reducer(document, creators.reinstate(input));

      expect(updatedDocument.state.global.status).toBe("ISSUED");
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("REINSTATE");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });

    it("should not allow REJECTED -> ISSUED transition when final rejection exists", () => {
      document.state.global.rejections = [{
        id: "rejection-1",
        reason: "Final rejection",
        final: true
      }];

      const input: ReinstateInput = {
        _placeholder: "reinstate_placeholder"
      };

      const updatedDocument = reducer(document, creators.reinstate(input));

      expect(updatedDocument.operations.global[0].error).toBe("Cannot reinstate an invoice that has been rejected");
    });
  });

  describe("ACCEPTED status transitions", () => {
    beforeEach(() => {
      document.state.global.status = "ACCEPTED";
    });

    it("should handle ACCEPTED -> PAYMENTSCHEDULED transition", () => {
      const input: SchedulePaymentInput = {
        id: "payment-1",
        processorRef: "stripe_pi_123456"
      };

      const updatedDocument = reducer(document, creators.schedulePayment(input));

      expect(updatedDocument.state.global.status).toBe("PAYMENTSCHEDULED");
      expect(updatedDocument.state.global.payments).toHaveLength(1);
      expect(updatedDocument.state.global.payments[0].id).toBe("payment-1");
      expect(updatedDocument.state.global.payments[0].processorRef).toBe("stripe_pi_123456");
      expect(updatedDocument.state.global.payments[0].confirmed).toBe(false);
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("SCHEDULE_PAYMENT");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });

    it("should handle ACCEPTED -> PAYMENTCLOSED transition", () => {
      const input: ClosePaymentInput = {
        closureReason: "CANCELLED"
      };

      const updatedDocument = reducer(document, creators.closePayment(input));

      expect(updatedDocument.state.global.status).toBe("PAYMENTCLOSED");
      expect(updatedDocument.state.global.closureReason).toBe("CANCELLED");
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("CLOSE_PAYMENT");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });
  });

  describe("PAYMENTSCHEDULED status transitions", () => {
    beforeEach(() => {
      document.state.global.status = "PAYMENTSCHEDULED";
      document.state.global.payments = [{
        id: "payment-1",
        processorRef: "stripe_pi_123456",
        paymentDate: "",
        txnRef: "",
        confirmed: false,
        issue: "",
        amount: 0
      }];
    });

    it("should handle PAYMENTSCHEDULED -> PAYMENTSENT transition", () => {
      const input: RegisterPaymentTxInput = {
        id: "payment-1",
        timestamp: "2024-01-20T10:30:00Z",
        txRef: "txn_789012"
      };

      const updatedDocument = reducer(document, creators.registerPaymentTx(input));

      expect(updatedDocument.state.global.status).toBe("PAYMENTSENT");
      expect(updatedDocument.state.global.payments[0].txnRef).toBe("txn_789012");
      expect(updatedDocument.state.global.payments[0].paymentDate).toBe("2024-01-20T10:30:00Z");
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("REGISTER_PAYMENT_TX");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });

    it("should handle PAYMENTSCHEDULED -> PAYMENTISSUE transition", () => {
      const input: ReportPaymentIssueInput = {
        id: "payment-1",
        issue: "Payment processor timeout"
      };

      const updatedDocument = reducer(document, creators.reportPaymentIssue(input));

      expect(updatedDocument.state.global.status).toBe("PAYMENTISSUE");
      expect(updatedDocument.state.global.payments[0].issue).toBe("Payment processor timeout");
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("REPORT_PAYMENT_ISSUE");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });

    it("should handle PAYMENTSCHEDULED -> PAYMENTCLOSED transition", () => {
      const input: ClosePaymentInput = {
        closureReason: "CANCELLED"
      };

      const updatedDocument = reducer(document, creators.closePayment(input));

      expect(updatedDocument.state.global.status).toBe("PAYMENTCLOSED");
      expect(updatedDocument.state.global.closureReason).toBe("CANCELLED");
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("CLOSE_PAYMENT");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });
  });

  describe("PAYMENTSENT status transitions", () => {
    beforeEach(() => {
      document.state.global.status = "PAYMENTSENT";
      document.state.global.payments = [{
        id: "payment-1",
        processorRef: "stripe_pi_123456",
        paymentDate: "2024-01-20T10:30:00Z",
        txnRef: "txn_789012",
        confirmed: false,
        issue: "",
        amount: 0
      }];
    });

    it("should handle PAYMENTSENT -> PAYMENTISSUE transition", () => {
      const input: ReportPaymentIssueInput = {
        id: "payment-1",
        issue: "Transaction failed"
      };

      const updatedDocument = reducer(document, creators.reportPaymentIssue(input));

      expect(updatedDocument.state.global.status).toBe("PAYMENTISSUE");
      expect(updatedDocument.state.global.payments[0].issue).toBe("Transaction failed");
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("REPORT_PAYMENT_ISSUE");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });

    it("should handle PAYMENTSENT -> PAYMENTRECEIVED transition", () => {
      const input: ConfirmPaymentInput = {
        id: "payment-1",
        amount: 1500.00
      };

      const updatedDocument = reducer(document, creators.confirmPayment(input));

      expect(updatedDocument.state.global.status).toBe("PAYMENTRECEIVED");
      expect(updatedDocument.state.global.payments[0].confirmed).toBe(true);
      expect(updatedDocument.state.global.payments[0].amount).toBe(1500.00);
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("CONFIRM_PAYMENT");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });
  });

  describe("PAYMENTISSUE status transitions", () => {
    beforeEach(() => {
      document.state.global.status = "PAYMENTISSUE";
      document.state.global.payments = [{
        id: "payment-1",
        processorRef: "stripe_pi_123456",
        paymentDate: "",
        txnRef: "",
        confirmed: false,
        issue: "Payment processor timeout",
        amount: 0
      }];
    });

    it("should handle PAYMENTISSUE -> ACCEPTED transition", () => {
      const input: ReapprovePaymentInput = {
        _placeholder: "reapprove_placeholder"
      };

      const updatedDocument = reducer(document, creators.reapprovePayment(input));

      expect(updatedDocument.state.global.status).toBe("ACCEPTED");
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("REAPPROVE_PAYMENT");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });

    it("should handle PAYMENTISSUE -> PAYMENTCLOSED transition", () => {
      const input: ClosePaymentInput = {
        closureReason: "CANCELLED"
      };

      const updatedDocument = reducer(document, creators.closePayment(input));

      expect(updatedDocument.state.global.status).toBe("PAYMENTCLOSED");
      expect(updatedDocument.state.global.closureReason).toBe("CANCELLED");
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("CLOSE_PAYMENT");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });
  });

  describe("PAYMENTRECEIVED status transitions", () => {
    beforeEach(() => {
      document.state.global.status = "PAYMENTRECEIVED";
      document.state.global.payments = [{
        id: "payment-1",
        processorRef: "stripe_pi_123456",
        paymentDate: "2024-01-20T10:30:00Z",
        txnRef: "txn_789012",
        confirmed: true,
        issue: "",
        amount: 1500.00
      }];
    });

    it("should handle PAYMENTRECEIVED -> PAYMENTISSUE transition", () => {
      const input: ReportPaymentIssueInput = {
        id: "payment-1",
        issue: "Payment amount discrepancy"
      };

      const updatedDocument = reducer(document, creators.reportPaymentIssue(input));

      expect(updatedDocument.state.global.status).toBe("PAYMENTISSUE");
      expect(updatedDocument.state.global.payments[0].issue).toBe("Payment amount discrepancy");
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("REPORT_PAYMENT_ISSUE");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });
  });

  describe("PAYMENTCLOSED status transitions", () => {
    beforeEach(() => {
      document.state.global.status = "PAYMENTCLOSED";
      document.state.global.closureReason = "CANCELLED";
    });

    it("should handle PAYMENTCLOSED -> ACCEPTED transition", () => {
      const input: ReapprovePaymentInput = {
        _placeholder: "reapprove_placeholder"
      };

      const updatedDocument = reducer(document, creators.reapprovePayment(input));

      expect(updatedDocument.state.global.status).toBe("ACCEPTED");
      expect(updatedDocument.operations.global).toHaveLength(1);
      expect((updatedDocument.operations.global[0] as any).type).toBe("REAPPROVE_PAYMENT");
      expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    });
  });

  describe("Error cases", () => {
    it("should throw error for invalid DRAFT -> ACCEPTED transition", () => {
      document.state.global.status = "DRAFT";
      const input: AcceptInput = {
        payAfter: "2024-02-15T00:00:00Z"
      };

      const updatedDocument = reducer(document, creators.accept(input));

      expect(updatedDocument.operations.global[0].error).toBe("Invalid transition from DRAFT to ACCEPTED");
    });

    it("should throw error for invalid ISSUED -> PAYMENTSCHEDULED transition", () => {
      document.state.global.status = "ISSUED";
      const input: SchedulePaymentInput = {
        id: "payment-1",
        processorRef: "stripe_pi_123456"
      };

      const updatedDocument = reducer(document, creators.schedulePayment(input));

      expect(updatedDocument.operations.global[0].error).toBe("Invalid transition from ISSUED to PAYMENTSCHEDULED");
    });

    it("should throw error for missing required fields in issue operation", () => {
      document.state.global.status = "DRAFT";
      const input: IssueInput = {
        invoiceNo: "",
        dateIssued: ""
      };

      const updatedDocument = reducer(document, creators.issue(input));

      expect(updatedDocument.operations.global[0].error).toBe("Invoice number and date issued are required");
    });

    it("should throw error for missing required fields in reject operation", () => {
      document.state.global.status = "ISSUED";
      const input: RejectInput = {
        id: "",
        reason: "",
        final: false
      };

      const updatedDocument = reducer(document, creators.reject(input));

      expect(updatedDocument.operations.global[0].error).toBe("Reason, ID and final are required");
    });

    it("should throw error for missing required fields in schedulePayment operation", () => {
      document.state.global.status = "ACCEPTED";
      const input: SchedulePaymentInput = {
        id: "",
        processorRef: ""
      };

      const updatedDocument = reducer(document, creators.schedulePayment(input));

      expect(updatedDocument.operations.global[0].error).toBe("ID and processorRef are required");
    });

    it("should throw error when payment not found in registerPaymentTx operation", () => {
      document.state.global.status = "PAYMENTSCHEDULED";
      document.state.global.payments = [{
        id: "payment-1",
        processorRef: "stripe_pi_123456",
        paymentDate: "",
        txnRef: "",
        confirmed: false,
        issue: "",
        amount: 0
      }];
      const input: RegisterPaymentTxInput = {
        id: "non-existent-payment",
        timestamp: "2024-01-20T10:30:00Z",
        txRef: "txn_789012"
      };

      const updatedDocument = reducer(document, creators.registerPaymentTx(input));

      expect(updatedDocument.operations.global[0].error).toBe("Payment not found");
    });

    it("should throw schema validation error for invalid datetime in registerPaymentTx operation", () => {
      document.state.global.status = "PAYMENTSCHEDULED";
      document.state.global.payments = [{
        id: "payment-1",
        processorRef: "stripe_pi_123456",
        paymentDate: "",
        txnRef: "",
        confirmed: false,
        issue: "",
        amount: 0
      }];
      
      // This should fail at the schema level due to invalid datetime format
      expect(() => {
        const input = {
          id: "payment-1",
          timestamp: "invalid-datetime",
          txRef: "txn_789012"
        };
        reducer(document, creators.registerPaymentTx(input as RegisterPaymentTxInput));
      }).toThrow();
    });

    it("should throw error for missing required fields in reportPaymentIssue operation", () => {
      document.state.global.status = "PAYMENTSCHEDULED";
      document.state.global.payments = [{
        id: "payment-1",
        processorRef: "stripe_pi_123456",
        paymentDate: "",
        txnRef: "",
        confirmed: false,
        issue: "",
        amount: 0
      }];
      const input: ReportPaymentIssueInput = {
        id: "",
        issue: ""
      };

      const updatedDocument = reducer(document, creators.reportPaymentIssue(input));

      expect(updatedDocument.operations.global[0].error).toBe("ID and issue are required");
    });

    it("should throw error for missing required fields in confirmPayment operation", () => {
      document.state.global.status = "PAYMENTSENT";
      document.state.global.payments = [{
        id: "payment-1",
        processorRef: "stripe_pi_123456",
        paymentDate: "2024-01-20T10:30:00Z",
        txnRef: "txn_789012",
        confirmed: false,
        issue: "",
        amount: 0
      }];
      const input: ConfirmPaymentInput = {
        id: "",
        amount: 0
      };

      const updatedDocument = reducer(document, creators.confirmPayment(input));

      expect(updatedDocument.operations.global[0].error).toBe("ID and amount are required");
    });

    it("should throw error for missing required fields in closePayment operation", () => {
      document.state.global.status = "ACCEPTED";
      const input: ClosePaymentInput = {
        closureReason: undefined
      };

      const updatedDocument = reducer(document, creators.closePayment(input));

      expect(updatedDocument.operations.global[0].error).toBe("Closure reason is required");
    });

    it("should throw error when payment not found in registerPaymentTx", () => {
      document.state.global.status = "PAYMENTSCHEDULED";
      document.state.global.payments = [{
        id: "payment-1",
        processorRef: "stripe_pi_123456",
        paymentDate: "",
        txnRef: "",
        confirmed: false,
        issue: "",
        amount: 0
      }];
      const input: RegisterPaymentTxInput = {
        id: "non-existent-payment",
        timestamp: "2024-01-20T10:30:00Z",
        txRef: "txn_789012"
      };

      const updatedDocument = reducer(document, creators.registerPaymentTx(input));

      expect(updatedDocument.operations.global[0].error).toBe("Payment not found");
    });

    it("should throw error when payment not found in reportPaymentIssue", () => {
      document.state.global.status = "PAYMENTSCHEDULED";
      document.state.global.payments = [{
        id: "payment-1",
        processorRef: "stripe_pi_123456",
        paymentDate: "",
        txnRef: "",
        confirmed: false,
        issue: "",
        amount: 0
      }];
      const input: ReportPaymentIssueInput = {
        id: "non-existent-payment",
        issue: "Payment issue"
      };

      const updatedDocument = reducer(document, creators.reportPaymentIssue(input));

      expect(updatedDocument.operations.global[0].error).toBe("Payment not found");
    });

    it("should throw error when payment not found in confirmPayment", () => {
      document.state.global.status = "PAYMENTSENT";
      document.state.global.payments = [{
        id: "payment-1",
        processorRef: "stripe_pi_123456",
        paymentDate: "2024-01-20T10:30:00Z",
        txnRef: "txn_789012",
        confirmed: false,
        issue: "",
        amount: 0
      }];
      const input: ConfirmPaymentInput = {
        id: "non-existent-payment",
        amount: 1500.00
      };

      const updatedDocument = reducer(document, creators.confirmPayment(input));

      expect(updatedDocument.operations.global[0].error).toBe("Payment not found");
    });
  });
});
