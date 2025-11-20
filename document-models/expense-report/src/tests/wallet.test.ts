/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import * as utils from "../../gen/utils.js";
import { type AddWalletInput, AddWalletInputSchema } from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/wallet/creators.js";
import type { ExpenseReportDocument } from "../../gen/types.js";

describe("Wallet Operations", () => {
  let document: ExpenseReportDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle addWallet operation", () => {
    const input: AddWalletInput = generateMock(AddWalletInputSchema());

    const updatedDocument = reducer(document, creators.addWallet(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("ADD_WALLET");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
