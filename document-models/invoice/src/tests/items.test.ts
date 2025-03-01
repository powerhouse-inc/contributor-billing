/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from "@powerhousedao/codegen";
import { utils as documentModelUtils } from "document-model/document";

import utils from "../../gen/utils";
import {
  z,
  AddLineItemInput,
  EditLineItemInput,
  DeleteLineItemInput,
} from "../../gen/schema";
import { reducer } from "../../gen/reducer";
import * as creators from "../../gen/items/creators";
import { InvoiceDocument } from "../../gen/types";

describe("Items Operations", () => {
  let document: InvoiceDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle addLineItem operation", () => {
    // generate a random id
    // const id = documentModelUtils.hashKey();

    const input: AddLineItemInput = generateMock(z.AddLineItemInputSchema());

    const updatedDocument = reducer(document, creators.addLineItem(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("ADD_LINE_ITEM");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle editLineItem operation", () => {
    // generate a random id
    // const id = documentModelUtils.hashKey();

    const input: EditLineItemInput = generateMock(z.EditLineItemInputSchema());

    const updatedDocument = reducer(document, creators.editLineItem(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("EDIT_LINE_ITEM");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle deleteLineItem operation", () => {
    // generate a random id
    // const id = documentModelUtils.hashKey();

    const input: DeleteLineItemInput = generateMock(
      z.DeleteLineItemInputSchema(),
    );

    const updatedDocument = reducer(document, creators.deleteLineItem(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("DELETE_LINE_ITEM");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
