/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from "@powerhousedao/codegen";
import * as utils from "../../gen/utils.js";
import {
  type AddLineItemInput,
  type EditLineItemInput,
  type DeleteLineItemInput,
  AddLineItemInputSchema,
  EditLineItemInputSchema,
  DeleteLineItemInputSchema,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/items/creators.js";
import type { InvoiceDocument } from "../../gen/types.js";

describe("Items Operations", () => {
  let document: InvoiceDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle addLineItem operation", () => {
    const input: AddLineItemInput = generateMock(AddLineItemInputSchema());

    const updatedDocument = reducer(document, creators.addLineItem(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("ADD_LINE_ITEM");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle editLineItem operation", () => {
    const input: EditLineItemInput = generateMock(EditLineItemInputSchema());

    const updatedDocument = reducer(document, creators.editLineItem(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("EDIT_LINE_ITEM");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle deleteLineItem operation", () => {
    const input: DeleteLineItemInput = generateMock(
      DeleteLineItemInputSchema(),
    );

    const updatedDocument = reducer(document, creators.deleteLineItem(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("DELETE_LINE_ITEM");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
