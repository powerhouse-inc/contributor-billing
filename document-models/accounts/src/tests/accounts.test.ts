/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import { z, type AddAccountInput } from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/accounts/creators.js";
import type { AccountsDocument } from "../../gen/types.js";

describe("Accounts Operations", () => {
  let document: AccountsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle addAccount operation", () => {
    const input: AddAccountInput = generateMock(z.AddAccountInputSchema());

    const updatedDocument = reducer(document, creators.addAccount(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_ACCOUNT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
