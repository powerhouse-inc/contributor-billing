/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import {
  z,
  type AddTransactionInput,
  type UpdateTransactionInput,
  type DeleteTransactionInput,
  type UpdateTransactionPeriodInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/transactions/creators.js";
import type { AccountTransactionsDocument } from "../../gen/types.js";

describe("Transactions Operations", () => {
  let document: AccountTransactionsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle addTransaction operation", () => {
    const input: AddTransactionInput = generateMock(
      z.AddTransactionInputSchema(),
    );

    const updatedDocument = reducer(document, creators.addTransaction(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_TRANSACTION",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle updateTransaction operation", () => {
    const input: UpdateTransactionInput = generateMock(
      z.UpdateTransactionInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.updateTransaction(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_TRANSACTION",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle deleteTransaction operation", () => {
    const input: DeleteTransactionInput = generateMock(
      z.DeleteTransactionInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.deleteTransaction(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "DELETE_TRANSACTION",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle updateTransactionPeriod operation", () => {
    const input: UpdateTransactionPeriodInput = generateMock(
      z.UpdateTransactionPeriodInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.updateTransactionPeriod(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_TRANSACTION_PERIOD",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
