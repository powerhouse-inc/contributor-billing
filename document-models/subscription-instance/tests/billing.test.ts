import { generateMock } from "@powerhousedao/codegen";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isSubscriptionInstanceDocument,
  createInvoice,
  updateInvoiceStatus,
  addInvoiceLineItem,
  removeInvoiceLineItem,
  setInvoiceTax,
  recordInvoicePayment,
  sendInvoice,
  cancelInvoice,
  markInvoiceOverdue,
  refundInvoice,
  CreateInvoiceInputSchema,
  UpdateInvoiceStatusInputSchema,
  AddInvoiceLineItemInputSchema,
  RemoveInvoiceLineItemInputSchema,
  SetInvoiceTaxInputSchema,
  RecordInvoicePaymentInputSchema,
  SendInvoiceInputSchema,
  CancelInvoiceInputSchema,
  MarkInvoiceOverdueInputSchema,
  RefundInvoiceInputSchema,
} from "@powerhousedao/contributor-billing/document-models/subscription-instance";

// Note: setInvoicePaymentUrl has been removed from the document model

describe("BillingOperations", () => {
  it("should handle createInvoice operation", () => {
    const document = utils.createDocument();
    const input = generateMock(CreateInvoiceInputSchema());

    const updatedDocument = reducer(document, createInvoice(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "CREATE_INVOICE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle updateInvoiceStatus operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdateInvoiceStatusInputSchema());

    const updatedDocument = reducer(document, updateInvoiceStatus(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_INVOICE_STATUS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle addInvoiceLineItem operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AddInvoiceLineItemInputSchema());

    const updatedDocument = reducer(document, addInvoiceLineItem(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_INVOICE_LINE_ITEM",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle removeInvoiceLineItem operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RemoveInvoiceLineItemInputSchema());

    const updatedDocument = reducer(document, removeInvoiceLineItem(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REMOVE_INVOICE_LINE_ITEM",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle setInvoiceTax operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetInvoiceTaxInputSchema());

    const updatedDocument = reducer(document, setInvoiceTax(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_INVOICE_TAX",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle recordInvoicePayment operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RecordInvoicePaymentInputSchema());

    const updatedDocument = reducer(document, recordInvoicePayment(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "RECORD_INVOICE_PAYMENT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle sendInvoice operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SendInvoiceInputSchema());

    const updatedDocument = reducer(document, sendInvoice(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SEND_INVOICE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle cancelInvoice operation", () => {
    const document = utils.createDocument();
    const input = generateMock(CancelInvoiceInputSchema());

    const updatedDocument = reducer(document, cancelInvoice(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "CANCEL_INVOICE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle markInvoiceOverdue operation", () => {
    const document = utils.createDocument();
    const input = generateMock(MarkInvoiceOverdueInputSchema());

    const updatedDocument = reducer(document, markInvoiceOverdue(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "MARK_INVOICE_OVERDUE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle refundInvoice operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RefundInvoiceInputSchema());

    const updatedDocument = reducer(document, refundInvoice(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REFUND_INVOICE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  // Note: setInvoicePaymentUrl test removed - operation no longer exists
});
