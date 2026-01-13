/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import {
  z,
  type AddBudgetInput,
  type UpdateBudgetInput,
  type DeleteBudgetInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/budgets/creators.js";
import type { AccountTransactionsDocument } from "../../gen/types.js";

describe("Budgets Operations", () => {
  let document: AccountTransactionsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle addBudget operation", () => {
    const input: AddBudgetInput = generateMock(z.AddBudgetInputSchema());

    const updatedDocument = reducer(document, creators.addBudget(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("ADD_BUDGET");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle updateBudget operation", () => {
    const input: UpdateBudgetInput = generateMock(z.UpdateBudgetInputSchema());

    const updatedDocument = reducer(document, creators.updateBudget(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_BUDGET",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle deleteBudget operation", () => {
    const input: DeleteBudgetInput = generateMock(z.DeleteBudgetInputSchema());

    const updatedDocument = reducer(document, creators.deleteBudget(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "DELETE_BUDGET",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
