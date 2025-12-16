/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import {
  reducer,
  utils,
  isInvoiceDocument,
  cancel,
  CancelInputSchema,
  issue,
  IssueInputSchema,
  reset,
  ResetInputSchema,
  reject,
  RejectInputSchema,
  accept,
  AcceptInputSchema,
} from "@powerhousedao/contributor-billing/document-models/invoice";

describe("Transitions Operations", () => {
  it("should handle cancel operation", () => {
    const document = utils.createDocument();
    const input = generateMock(CancelInputSchema());

    const updatedDocument = reducer(document, cancel(input));

    expect(isInvoiceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("CANCEL");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle issue operation", () => {
    const document = utils.createDocument();
    const input = generateMock(IssueInputSchema());

    const updatedDocument = reducer(document, issue(input));

    expect(isInvoiceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("ISSUE");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle reset operation", () => {
    const document = utils.createDocument();
    const input = generateMock(ResetInputSchema());

    const updatedDocument = reducer(document, reset(input));

    expect(isInvoiceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("RESET");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle reject operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RejectInputSchema());

    const updatedDocument = reducer(document, reject(input));

    expect(isInvoiceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("REJECT");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle accept operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AcceptInputSchema());

    const updatedDocument = reducer(document, accept(input));

    expect(isInvoiceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("ACCEPT");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
