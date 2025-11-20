/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from "@powerhousedao/codegen";
import * as utils from "../../gen/utils.js";
import {
  type EditInvoiceInput,
  type EditStatusInput,
  EditInvoiceInputSchema,
  EditStatusInputSchema,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/general/creators.js";
import type { InvoiceDocument } from "../../gen/types.js";

describe("General Operations", () => {
  let document: InvoiceDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle editInvoice operation", () => {
    const input: EditInvoiceInput = generateMock(EditInvoiceInputSchema());

    const updatedDocument = reducer(document, creators.editInvoice(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("EDIT_INVOICE");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle editStatus operation", () => {
    const input: EditStatusInput = generateMock(EditStatusInputSchema());

    const updatedDocument = reducer(document, creators.editStatus(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("EDIT_STATUS");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle editPaymentData operation", () => {
    const invoice = utils.createDocument();
    const paymentDate = new Date().toISOString();
    const updatedDocument = reducer(invoice, creators.editPaymentData({ paymentDate: paymentDate, txnRef: "0x123", confirmed: true, id: "123" }));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("EDIT_PAYMENT_DATA");
    expect((updatedDocument.operations.global[0] as any).input).toEqual({ paymentDate: paymentDate, txnRef: "0x123", confirmed: true, id: "123" });
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle setExportedData operation", () => {
    
    const input = {
      timestamp: '2025-01-01T00:00:00Z',
      exportedLineItems: [['1', '2', '3'], ['4', '5', '6']]
    }

    const updatedDocument = reducer(document, creators.setExportedData(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("SET_EXPORTED_DATA");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
