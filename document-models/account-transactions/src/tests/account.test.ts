/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import { z, type SetAccountInput } from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/account/creators.js";
import type { AccountTransactionsDocument } from "../../gen/types.js";

describe("Account Operations", () => {
  let document: AccountTransactionsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle setAccount operation", () => {
    const input: SetAccountInput = generateMock(z.SetAccountInputSchema());

    const updatedDocument = reducer(document, creators.setAccount(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_ACCOUNT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
